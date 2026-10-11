import hashlib
import json
import os
from pathlib import Path
from typing import Any

import serpapi

from app.schemas.product_finder import ProductResult


CACHE_DIR = Path("data/product_finder_cache")
CACHE_DIR.mkdir(parents=True, exist_ok=True)

MAX_RESULTS = 12


def get_serpapi_key() -> str:
    key = os.getenv("SERPAPI_KEY")

    if not key:
        raise RuntimeError(
            "SERPAPI_KEY is not configured."
        )

    return key


def get_image_hash(image_bytes: bytes) -> str:
    return hashlib.sha256(image_bytes).hexdigest()


def get_cache_path(image_hash: str) -> Path:
    return CACHE_DIR / f"{image_hash}.json"


def load_cached_results(
    image_hash: str,
) -> list[ProductResult] | None:

    cache_path = get_cache_path(image_hash)

    if not cache_path.exists():
        return None

    try:
        with cache_path.open(
            "r",
            encoding="utf-8",
        ) as file:
            data = json.load(file)

        return [
            ProductResult.model_validate(item)
            for item in data
        ]

    except Exception:
        return None


def save_cached_results(
    image_hash: str,
    products: list[ProductResult],
) -> None:

    cache_path = get_cache_path(image_hash)

    data = [
        product.model_dump()
        for product in products
    ]

    with cache_path.open(
        "w",
        encoding="utf-8",
    ) as file:
        json.dump(
            data,
            file,
            ensure_ascii=False,
            indent=2,
        )


def compress_image_for_serpapi(
    image_bytes: bytes,
) -> bytes:

    from io import BytesIO

    from PIL import Image

    image = Image.open(
        BytesIO(image_bytes)
    )

    if image.mode != "RGB":
        image = image.convert("RGB")

    max_dimension = 1200

    if max(image.size) > max_dimension:
        image.thumbnail(
            (max_dimension, max_dimension),
            Image.Resampling.LANCZOS,
        )

    quality_levels = [
        85,
        75,
        65,
        55,
        45,
        35,
    ]

    for quality in quality_levels:

        output = BytesIO()

        image.save(
            output,
            format="JPEG",
            quality=quality,
            optimize=True,
        )

        compressed = output.getvalue()

        if len(compressed) <= 480_000:
            return compressed

    raise ValueError(
        "Unable to compress image below "
        "SerpApi's 500 KB upload limit."
    )


def upload_image_to_serpapi(
    image_bytes: bytes,
) -> str:

    from io import BytesIO

    api_key = get_serpapi_key()

    compressed_image = (
        compress_image_for_serpapi(
            image_bytes
        )
    )

    client = serpapi.Client(
        api_key=api_key,
        timeout=30,
    )

    image_file = BytesIO(
        compressed_image
    )

    upload = client.upload_image(
        image_file
    )

    image_id = upload.get(
        "image_id"
    )

    if not image_id:
        error = upload.get("error")

        if error:
            raise RuntimeError(
                f"SerpApi image upload failed: {error}"
            )

        raise RuntimeError(
            "SerpApi did not return an image_id."
        )

    return image_id


def search_google_lens(
    image_id: str,
) -> dict[str, Any]:

    api_key = get_serpapi_key()

    client = serpapi.Client(
        api_key=api_key,
        timeout=30,
    )

    results = client.search(
        {
            "engine": "google_lens",
            "image_id": image_id,
            "type": "visual_matches",
            "hl": "en",
            "country": "in",
            "safe": "active",
        }
    )

    results = dict(results)

    print("\n========== SERPAPI GOOGLE LENS RESPONSE ==========")
    print(json.dumps(results, indent=2, ensure_ascii=False))
    print("==================================================\n")

    return results


def parse_price(
    value: Any,
) -> float | None:

    if value is None:
        return None

    if isinstance(value, dict):

        extracted = value.get(
            "extracted_value"
        )

        if extracted is not None:
            try:
                return float(extracted)
            except (
                TypeError,
                ValueError,
            ):
                pass

        value = value.get("value")

    if isinstance(value, (int, float)):
        return float(value)

    if not isinstance(value, str):
        return None

    import re

    cleaned = value.replace(
        ",",
        "",
    )

    match = re.search(
        r"\d+(?:\.\d+)?",
        cleaned,
    )

    if not match:
        return None

    try:
        return float(
            match.group()
        )
    except ValueError:
        return None


def parse_currency(
    value: Any,
) -> str | None:

    if not isinstance(value, dict):
        return None

    currency = value.get(
        "currency"
    )

    if not currency:
        return None

    currency = str(
        currency
    ).strip()

    currency_map = {
        "₹": "INR",
        "$": "USD",
        "€": "EUR",
        "£": "GBP",
    }

    return currency_map.get(
        currency,
        currency,
    )


def parse_rating(
    value: Any,
) -> float | None:

    if value is None:
        return None

    try:
        rating = float(value)

        if 0 <= rating <= 5:
            return rating

    except (
        TypeError,
        ValueError,
    ):
        pass

    return None


def parse_review_count(
    value: Any,
) -> int | None:

    if value is None:
        return None

    try:
        return int(value)

    except (
        TypeError,
        ValueError,
    ):
        pass

    return None


def convert_visual_match(
    match: dict[str, Any],
) -> ProductResult | None:

    name = match.get(
        "title"
    )

    product_url = match.get(
        "link"
    )

    if not name or not product_url:
        return None

    price_data = match.get(
        "price"
    )

    price = parse_price(
        price_data
    )

    currency = parse_currency(
        price_data
    )

    rating = parse_rating(
        match.get("rating")
    )

    review_count = parse_review_count(
        match.get("reviews")
    )

    image_url = (
        match.get("thumbnail")
        or match.get("image")
    )

    source = match.get(
        "source"
    )

    return ProductResult(
        name=name.strip(),
        product_url=product_url,
        brand=None,
        price=price,
        currency=currency,
        rating=rating,
        review_count=review_count,
        image_url=image_url,
        source=source,
    )


def convert_lens_results(
    results: dict[str, Any],
) -> list[ProductResult]:

    matches = results.get(
        "visual_matches",
        [],
    )

    products = []

    for match in matches:

        if not isinstance(
            match,
            dict,
        ):
            continue

        product = (
            convert_visual_match(
                match
            )
        )

        if product:
            products.append(
                product
            )

    return products[
        :MAX_RESULTS
    ]


def search_products_visually(
    image_bytes: bytes,
) -> tuple[
    list[ProductResult],
    dict[str, Any],
]:

    image_hash = (
        get_image_hash(
            image_bytes
        )
    )

    cached = (
        load_cached_results(
            image_hash
        )
    )

    if cached is not None:

        return cached, {
            "provider": (
                "serpapi_google_lens"
            ),
            "cached": True,
            "image_hash": image_hash,
            "results": len(cached),
        }

    image_id = (
        upload_image_to_serpapi(
            image_bytes
        )
    )

    lens_results = (
        search_google_lens(
            image_id
        )
    )

    if lens_results.get(
        "error"
    ):
        raise RuntimeError(
            lens_results["error"]
        )

    products = (
        convert_lens_results(
            lens_results
        )
    )

    save_cached_results(
        image_hash,
        products,
    )

    search_metadata = (
        lens_results.get(
            "search_metadata",
            {},
        )
    )

    return products, {
        "provider": (
            "serpapi_google_lens"
        ),
        "cached": False,
        "image_hash": image_hash,
        "results": len(products),
        "lens_status": (
            search_metadata.get(
                "status"
            )
        ),
        "search_id": (
            search_metadata.get(
                "id"
            )
        ),
    }