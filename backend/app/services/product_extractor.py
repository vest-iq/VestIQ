import json
import re
from typing import Any
from urllib.parse import urljoin, urlparse

import httpx
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

from app.schemas.product_data import (
    ProductData,
    ProductExtraction,
)


USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/153.0.0.0 Safari/537.36"
)

REQUEST_TIMEOUT = 20.0


# ============================================================
# HTTP
# ============================================================

def fetch_product_page(url: str) -> str:
    """
    Fetch a product page using a normal HTTP request.

    Raises:
        httpx.HTTPStatusError:
            If the website returns an HTTP error such as 403.
        httpx.RequestError:
            If the request itself fails.
    """

    headers = {
        "User-Agent": USER_AGENT,
        "Accept": (
            "text/html,application/xhtml+xml,"
            "application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"
        ),
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
    }

    with httpx.Client(
        headers=headers,
        timeout=REQUEST_TIMEOUT,
        follow_redirects=True,
    ) as client:

        response = client.get(url)

        response.raise_for_status()

        return response.text

def fetch_product_page_with_browser(url: str) -> str:
    """
    Fetch a product page using a real Chromium browser.

    Used as a fallback when normal HTTP requests are blocked
    or the page requires JavaScript rendering.
    """

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True
        )

        page = browser.new_page(
            user_agent=USER_AGENT,
            viewport={
                "width": 1366,
                "height": 768,
            },
        )

        try:
            page.goto(
                url,
                wait_until="domcontentloaded",
                timeout=30000,
            )

            # Allow JavaScript-rendered product data to load.
            page.wait_for_timeout(2000)

            return page.content()

        finally:
            browser.close()

# ============================================================
# BASIC HELPERS
# ============================================================

def clean_text(value: Any) -> str | None:
    """
    Clean a string by removing unnecessary whitespace.
    """

    if value is None:
        return None

    if not isinstance(value, str):
        return None

    value = re.sub(
        r"\s+",
        " ",
        value,
    ).strip()

    return value or None


def absolute_url(
    base_url: str,
    value: Any,
) -> str | None:
    """
    Convert a relative URL into an absolute URL.
    """

    if not isinstance(value, str):
        return None

    value = value.strip()

    if not value:
        return None

    return urljoin(
        base_url,
        value,
    )


def parse_float(
    value: Any,
) -> float | None:
    """
    Extract a numeric value from common price formats.

    Examples:
        1149
        "₹1,149"
        "1,149.00"
    """

    if value is None:
        return None

    if isinstance(value, (int, float)):
        return float(value)

    if not isinstance(value, str):
        return None

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


# ============================================================
# JSON-LD
# ============================================================

def extract_json_ld(
    html: str,
) -> list[Any]:
    """
    Extract JSON-LD blocks from HTML.

    Many ecommerce websites expose product information
    through Schema.org JSON-LD.
    """

    soup = BeautifulSoup(
        html,
        "html.parser",
    )

    results: list[Any] = []

    scripts = soup.find_all(
        "script",
        attrs={
            "type": "application/ld+json"
        },
    )

    for script in scripts:

        raw = (
            script.string
            or script.get_text()
        )

        if not raw:
            continue

        raw = raw.strip()

        try:

            data = json.loads(
                raw
            )

        except json.JSONDecodeError:

            # Ignore malformed JSON-LD.
            continue

        if isinstance(data, list):

            results.extend(
                data
            )

        else:

            results.append(
                data
            )

    return results


# ============================================================
# SCHEMA.ORG
# ============================================================

def flatten_json_ld(
    data: Any,
) -> list[dict[str, Any]]:
    """
    Flatten JSON-LD structures.

    Handles:

        Product
        ProductGroup
        @graph
        nested lists
    """

    flattened: list[dict[str, Any]] = []

    if isinstance(data, dict):

        flattened.append(
            data
        )

        graph = data.get(
            "@graph"
        )

        if isinstance(graph, list):

            for item in graph:

                flattened.extend(
                    flatten_json_ld(
                        item
                    )
                )

    elif isinstance(data, list):

        for item in data:

            flattened.extend(
                flatten_json_ld(
                    item
                )
            )

    return flattened


def get_schema_type(
    item: dict[str, Any],
) -> list[str]:
    """
    Return Schema.org @type values as a list.
    """

    value = item.get(
        "@type"
    )

    if isinstance(
        value,
        str,
    ):
        return [value]

    if isinstance(
        value,
        list,
    ):
        return [
            str(item_type)
            for item_type in value
            if isinstance(
                item_type,
                str,
            )
        ]

    return []


def find_product_objects(
    json_ld: list[Any],
) -> list[dict[str, Any]]:
    """
    Find Product and ProductGroup objects
    inside JSON-LD data.
    """

    products: list[
        dict[str, Any]
    ] = []

    for block in json_ld:

        for item in flatten_json_ld(
            block
        ):

            types = get_schema_type(
                item
            )

            if (
                "Product" in types
                or "ProductGroup" in types
            ):

                products.append(
                    item
                )

    return products


# ============================================================
# BRAND
# ============================================================

def extract_brand(
    value: Any,
) -> str | None:
    """
    Extract brand name from either:

        "Nike"

    or:

        {
            "name": "Nike"
        }
    """

    if isinstance(
        value,
        str,
    ):

        return clean_text(
            value
        )

    if isinstance(
        value,
        dict,
    ):

        return clean_text(
            value.get(
                "name"
            )
        )

    return None


# ============================================================
# IMAGE
# ============================================================

def extract_image(
    value: Any,
    base_url: str,
) -> str | None:
    """
    Extract the first usable product image URL.
    """

    if isinstance(
        value,
        str,
    ):

        return absolute_url(
            base_url,
            value,
        )

    if isinstance(
        value,
        list,
    ):

        for item in value:

            image = extract_image(
                item,
                base_url,
            )

            if image:
                return image

    if isinstance(
        value,
        dict,
    ):

        for key in (
            "url",
            "contentUrl",
        ):

            image = value.get(
                key
            )

            if isinstance(
                image,
                str,
            ):

                return absolute_url(
                    base_url,
                    image,
                )

    return None


# ============================================================
# OFFERS / PRICE
# ============================================================

def extract_offer(
    offers: Any,
) -> dict[str, Any] | None:
    """
    Extract the first Offer object.
    """

    if isinstance(
        offers,
        dict,
    ):

        return offers

    if isinstance(
        offers,
        list,
    ):

        for offer in offers:

            if isinstance(
                offer,
                dict,
            ):

                return offer

    return None


def extract_price(
    product: dict[str, Any],
) -> tuple[
    float | None,
    str | None,
    str | None,
]:
    """
    Extract:

        price
        currency
        availability
    """

    offers = extract_offer(
        product.get(
            "offers"
        )
    )

    if not offers:

        return (
            None,
            None,
            None,
        )

    price = parse_float(
        offers.get(
            "price"
        )
        or offers.get(
            "lowPrice"
        )
    )

    currency = clean_text(
        offers.get(
            "priceCurrency"
        )
    )

    availability = clean_text(
        offers.get(
            "availability"
        )
    )

    if availability:

        availability = availability.rsplit(
            "/",
            1,
        )[-1]

    return (
        price,
        currency,
        availability,
    )


# ============================================================
# PRODUCT EXTRACTION
# ============================================================

def extract_product_from_schema(
    product: dict[str, Any],
    product_url: str,
) -> ProductData:
    """
    Convert a Schema.org Product object
    into our ProductData model.
    """

    price, currency, availability = (
        extract_price(
            product
        )
    )

    brand = extract_brand(
        product.get(
            "brand"
        )
    )

    image_url = extract_image(
        product.get(
            "image"
        ),
        product_url,
    )

    name = clean_text(
        product.get(
            "name"
        )
    )

    category = clean_text(
        product.get(
            "category"
        )
    )

    color = clean_text(
        product.get(
            "color"
        )
    )

    material = clean_text(
        product.get(
            "material"
        )
    )

    pattern = clean_text(
        product.get(
            "pattern"
        )
    )

    fit = clean_text(
        product.get(
            "fit"
        )
    )

    description = clean_text(
        product.get(
            "description"
        )
    )

    hostname = urlparse(
        product_url
    ).netloc

    source = hostname.removeprefix(
        "www."
    )

    methods = [
        "json_ld",
        "schema_org",
    ]

    # --------------------------------------------------------
    # Confidence
    # --------------------------------------------------------

    confidence_fields = [
        name,
        brand,
        price,
        image_url,
    ]

    available_field_count = sum(
        value is not None
        for value in confidence_fields
    )

    confidence = (
        available_field_count
        / len(confidence_fields)
    )

    # --------------------------------------------------------
    # Warnings
    # --------------------------------------------------------

    warnings: list[str] = []

    if not name:

        warnings.append(
            "Product name was not found."
        )

    if not price:

        warnings.append(
            "Product price was not found."
        )

    if not image_url:

        warnings.append(
            "Product image was not found."
        )

    return ProductData(
        name=name,
        brand=brand,
        category=category,
        product_url=product_url,
        source=source,
        price=price,
        currency=currency,
        availability=availability,
        image_url=image_url,
        color=color,
        pattern=pattern,
        material=material,
        fit=fit,
        description=description,
        extraction=ProductExtraction(
            methods_used=methods,
            confidence=round(
                confidence,
                2,
            ),
            warnings=warnings,
        ),
    )


# ============================================================
# STATIC PRODUCT EXTRACTION
# ============================================================

def extract_product_data(
    html: str,
    product_url: str,
) -> ProductData:
    """
    Extract product information from static HTML.
    """

    json_ld = extract_json_ld(
        html
    )

    products = find_product_objects(
        json_ld
    )

    if products:

        # Prefer a normal Product object.
        product = next(
            (
                item
                for item in products
                if "Product"
                in get_schema_type(
                    item
                )
            ),
            products[0],
        )

        return extract_product_from_schema(
            product,
            product_url,
        )

    # --------------------------------------------------------
    # No structured product data
    # --------------------------------------------------------

    hostname = urlparse(
        product_url
    ).netloc

    source = hostname.removeprefix(
        "www."
    )

    return ProductData(
        product_url=product_url,
        source=source,
        extraction=ProductExtraction(
            methods_used=[],
            confidence=0.0,
            warnings=[
                "No Product or ProductGroup structured data found."
            ],
        ),
    )


# ============================================================
# PUBLIC API
# ============================================================

def extract_product(
    product_url: str,
) -> ProductData:
    """
    Fetch and extract product information.

    Strategy:

        1. Try normal HTTP request.
        2. If HTTP fails, use Playwright.
        3. If both fail, return a ProductData object
           containing a warning instead of crashing.
    """

    # ========================================================
    # STEP 1 — NORMAL HTTP
    # ========================================================

    try:
        html = fetch_product_page(
            product_url
        )

        product = extract_product_data(
            html,
            product_url,
        )

        # If structured data was found, use it.
        if product.extraction.confidence > 0:
            return product

        # HTTP worked, but no product data was found.
        # Try browser because the page may be JavaScript-rendered.

        print(
            f"[HTTP OK BUT NO PRODUCT DATA] "
            f"{product_url}"
        )

    except Exception as exc:

        print(
            f"[HTTP EXTRACTION FAILED] "
            f"{product_url}"
        )
        print(
            f"Error type: {type(exc).__name__}"
        )
        print(
            f"Error: {exc}"
        )

    # ========================================================
    # STEP 2 — PLAYWRIGHT
    # ========================================================

    try:
        html = fetch_product_page_with_browser(
            product_url
        )

        product = extract_product_data(
            html,
            product_url,
        )

        if product.extraction.confidence > 0:
            product.extraction.methods_used.append(
                "playwright"
            )

        return product

    except Exception as exc:

        print(
            f"[PLAYWRIGHT EXTRACTION FAILED] "
            f"{product_url}"
        )
        print(
            f"Error type: {type(exc).__name__}"
        )
        print(
            f"Error: {exc}"
        )

    # ========================================================
    # STEP 3 — COMPLETE FAILURE
    # ========================================================

    hostname = urlparse(
        product_url
    ).netloc

    source = hostname.removeprefix(
        "www."
    )

    return ProductData(
        product_url=product_url,
        source=source,
        extraction=ProductExtraction(
            methods_used=[],
            confidence=0.0,
            warnings=[
                "HTTP and browser extraction failed."
            ],
        ),
    )