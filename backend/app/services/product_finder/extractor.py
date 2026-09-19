import json
import re
from typing import Any
from urllib.parse import urljoin, urlparse

from bs4 import BeautifulSoup

from app.schemas.product_finder import ProductResult


# =========================================================
# TEXT
# =========================================================

def clean_text(
    value: Any,
) -> str | None:

    if value is None:
        return None

    text = str(value)

    text = re.sub(
        r"\s+",
        " ",
        text,
    )

    text = text.strip()

    return text if text else None


# =========================================================
# PRICE
# =========================================================

def parse_price(
    value: Any,
) -> float | None:

    if value is None:
        return None

    text = str(value).strip()

    # Remove currency symbols.
    text = (
        text
        .replace("₹", "")
        .replace("$", "")
        .replace("€", "")
        .replace("£", "")
        .replace("¥", "")
    )

    # Remove common thousand separators.
    text = text.replace(",", "")

    # Find first numeric value.
    match = re.search(
        r"\d+(?:\.\d+)?",
        text,
    )

    if not match:
        return None

    try:
        return float(
            match.group()
        )

    except ValueError:
        return None


# =========================================================
# INTEGER
# =========================================================

def parse_integer(
    value: Any,
) -> int | None:

    if value is None:
        return None

    text = str(value)

    text = text.replace(
        ",",
        "",
    )

    match = re.search(
        r"\d+",
        text,
    )

    if not match:
        return None

    try:
        return int(
            match.group()
        )

    except ValueError:
        return None


# =========================================================
# BRAND
# =========================================================

def extract_brand(
    value: Any,
) -> str | None:

    if isinstance(
        value,
        dict,
    ):

        return clean_text(
            value.get("name")
        )

    return clean_text(
        value
    )


# =========================================================
# IMAGE
# =========================================================

def normalize_image_url(
    image: Any,
    product_url: str,
) -> str | None:

    if isinstance(
        image,
        list,
    ):

        for item in image:

            result = normalize_image_url(
                item,
                product_url,
            )

            if result:
                return result

        return None

    if isinstance(
        image,
        dict,
    ):

        image = (
            image.get("url")
            or image.get("contentUrl")
        )

    if not image:
        return None

    return urljoin(
        product_url,
        str(image),
    )


# =========================================================
# JSON-LD
# =========================================================

def load_json_ld(
    soup: BeautifulSoup,
) -> tuple[list[Any], int]:

    objects = []

    scripts = soup.find_all(
        "script",
        attrs={
            "type": "application/ld+json"
        },
    )

    total_scripts = len(
        scripts
    )

    for script in scripts:

        raw = (
            script.string
            or script.get_text()
        )

        if not raw:
            continue

        raw = raw.strip()

        if not raw:
            continue

        try:

            data = json.loads(
                raw
            )

            objects.append(
                data
            )

        except (
            json.JSONDecodeError,
            TypeError,
        ):

            continue

    return (
        objects,
        total_scripts,
    )


def type_contains(
    value: Any,
    target: str,
) -> bool:

    if isinstance(
        value,
        str,
    ):

        return (
            value.lower()
            == target.lower()
        )

    if isinstance(
        value,
        list,
    ):

        return any(
            isinstance(
                item,
                str,
            )
            and item.lower()
            == target.lower()
            for item in value
        )

    return False


def find_product_objects(
    data: Any,
) -> list[dict]:

    products = []

    if isinstance(
        data,
        list,
    ):

        for item in data:

            products.extend(
                find_product_objects(
                    item
                )
            )

        return products

    if not isinstance(
        data,
        dict,
    ):

        return products

    item_type = data.get(
        "@type"
    )

    if type_contains(
        item_type,
        "Product",
    ):

        products.append(
            data
        )

    # ProductGroup variants.
    if type_contains(
        item_type,
        "ProductGroup",
    ):

        variants = data.get(
            "hasVariant"
        )

        if isinstance(
            variants,
            list,
        ):

            for variant in variants:

                products.extend(
                    find_product_objects(
                        variant
                    )
                )

    # @graph.
    graph = data.get(
        "@graph"
    )

    if graph:

        products.extend(
            find_product_objects(
                graph
            )
        )

    return products


# =========================================================
# OFFERS
# =========================================================

def get_offer_data(
    offers: Any,
) -> dict:

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

        return {}

    if isinstance(
        offers,
        dict,
    ):

        return offers

    return {}


# =========================================================
# SCHEMA PRODUCT
# =========================================================

def build_product_from_schema(
    product: dict,
    product_url: str,
) -> ProductResult | None:

    name = clean_text(
        product.get("name")
    )

    if not name:
        return None

    offers = get_offer_data(
        product.get(
            "offers"
        )
    )

    # Standard Offer.
    price = (
        offers.get("price")
        or offers.get("lowPrice")
    )

    currency = (
        offers.get(
            "priceCurrency"
        )
        or product.get(
            "priceCurrency"
        )
    )

    # Rating.
    aggregate_rating = (
        product.get(
            "aggregateRating"
        )
    )

    if not isinstance(
        aggregate_rating,
        dict,
    ):

        aggregate_rating = {}

    rating = parse_price(
        aggregate_rating.get(
            "ratingValue"
        )
    )

    review_count = parse_integer(
        aggregate_rating.get(
            "reviewCount"
        )
        or aggregate_rating.get(
            "ratingCount"
        )
    )

    image_url = normalize_image_url(
        product.get(
            "image"
        ),
        product_url,
    )

    brand = extract_brand(
        product.get(
            "brand"
        )
    )

    return ProductResult(
        name=name,
        product_url=product_url,
        brand=brand,
        price=parse_price(
            price
        ),
        currency=clean_text(
            currency
        ),
        rating=rating,
        review_count=review_count,
        image_url=image_url,
        source=urlparse(
            product_url
        ).netloc,
    )


# =========================================================
# META
# =========================================================

def get_meta_content(
    soup: BeautifulSoup,
    attribute: str,
    value: str,
) -> str | None:

    tag = soup.find(
        "meta",
        attrs={
            attribute: value
        },
    )

    if not tag:
        return None

    return clean_text(
        tag.get("content")
    )


def extract_meta_value(
    soup: BeautifulSoup,
    names: list[str],
) -> str | None:

    for name in names:

        value = get_meta_content(
            soup,
            "name",
            name,
        )

        if value:
            return value

        value = get_meta_content(
            soup,
            "property",
            name,
        )

        if value:
            return value

    return None


# =========================================================
# HTML SELECTORS
# =========================================================

def selector_text(
    soup: BeautifulSoup,
    selectors: list[str],
) -> str | None:

    for selector in selectors:

        try:

            elements = soup.select(
                selector
            )

        except Exception:
            continue

        for element in elements:

            text = clean_text(
                element.get_text(
                    " ",
                    strip=True,
                )
            )

            if text:
                return text

            for attr in (
                "content",
                "data-price",
                "data-value",
                "aria-label",
            ):

                value = element.get(
                    attr
                )

                if value:

                    value = clean_text(
                        value
                    )

                    if value:
                        return value

    return None


PRICE_SELECTORS = [
    '[itemprop="price"]',
    '[data-price]',
    '[class*="price"]',
    '[class*="Price"]',
]

RATING_SELECTORS = [
    '[itemprop="ratingValue"]',
    '[class*="rating"]',
    '[class*="Rating"]',
    '[aria-label*="rating"]',
    '[aria-label*="Rated"]',
]

REVIEW_SELECTORS = [
    '[itemprop="reviewCount"]',
    '[class*="review-count"]',
    '[class*="reviewCount"]',
    '[class*="reviews"]',
    '[class*="Reviews"]',
]


def extract_html_price(
    soup: BeautifulSoup,
) -> float | None:

    value = selector_text(
        soup,
        PRICE_SELECTORS,
    )

    return parse_price(
        value
    )


def extract_html_rating(
    soup: BeautifulSoup,
) -> float | None:

    value = selector_text(
        soup,
        RATING_SELECTORS,
    )

    if not value:
        return None

    # First try "4.5".
    number = parse_price(
        value
    )

    if (
        number is not None
        and 0 <= number <= 5
    ):

        return number

    # Then patterns such as:
    # "Rated 4.5 out of 5"
    # "4.5/5"
    match = re.search(
        r"([0-5](?:\.\d+)?)"
        r"\s*(?:out of|/)\s*5",
        value,
        re.IGNORECASE,
    )

    if match:

        try:

            return float(
                match.group(1)
            )

        except ValueError:
            pass

    return None


def extract_html_review_count(
    soup: BeautifulSoup,
) -> int | None:

    value = selector_text(
        soup,
        REVIEW_SELECTORS,
    )

    return parse_integer(
        value
    )


# =========================================================
# META PRODUCT
# =========================================================

def extract_from_meta(
    soup: BeautifulSoup,
    product_url: str,
) -> ProductResult | None:

    name = extract_meta_value(
        soup,
        [
            "og:title",
            "twitter:title",
        ],
    )

    if not name:

        title = soup.find(
            "title"
        )

        if title:

            name = clean_text(
                title.get_text()
            )

    if not name:
        return None

    image = extract_meta_value(
        soup,
        [
            "og:image",
            "twitter:image",
        ],
    )

    if image:

        image = urljoin(
            product_url,
            image,
        )

    price = extract_meta_value(
        soup,
        [
            "product:price:amount",
            "og:price:amount",
        ],
    )

    currency = extract_meta_value(
        soup,
        [
            "product:price:currency",
            "og:price:currency",
        ],
    )

    rating = extract_meta_value(
        soup,
        [
            "rating",
            "product:rating",
        ],
    )

    review_count = extract_meta_value(
        soup,
        [
            "reviewCount",
            "review_count",
            "product:review_count",
        ],
    )

    return ProductResult(
        name=name,
        product_url=product_url,
        price=parse_price(
            price
        ),
        currency=clean_text(
            currency
        ),
        rating=parse_price(
            rating
        ),
        review_count=parse_integer(
            review_count
        ),
        image_url=image,
        source=urlparse(
            product_url
        ).netloc,
    )


# =========================================================
# MAIN EXTRACTOR
# =========================================================

def extract_product(
    html: str,
    product_url: str,
) -> tuple[
    ProductResult | None,
    dict,
]:

    soup = BeautifulSoup(
        html,
        "html.parser",
    )

    diagnostics = {
        "json_ld_blocks": 0,
        "json_ld_products": 0,
        "og_title": False,
        "og_image": False,
        "meta_price": False,
        "meta_currency": False,
        "html_price": False,
        "html_rating": False,
        "html_review_count": False,
        "extraction_method": None,
    }

    # -----------------------------------------------------
    # JSON-LD
    # -----------------------------------------------------

    json_objects, block_count = (
        load_json_ld(soup)
    )

    diagnostics[
        "json_ld_blocks"
    ] = block_count

    all_products = []

    for data in json_objects:

        all_products.extend(
            find_product_objects(
                data
            )
        )

    diagnostics[
        "json_ld_products"
    ] = len(
        all_products
    )

    for product_data in all_products:

        product = (
            build_product_from_schema(
                product_data,
                product_url,
            )
        )

        if product:

            diagnostics[
                "extraction_method"
            ] = "json-ld"

            return (
                product,
                diagnostics,
            )

    # -----------------------------------------------------
    # META / OPENGRAPH
    # -----------------------------------------------------

    og_title = extract_meta_value(
        soup,
        [
            "og:title",
            "twitter:title",
        ],
    )

    og_image = extract_meta_value(
        soup,
        [
            "og:image",
            "twitter:image",
        ],
    )

    diagnostics[
        "og_title"
    ] = bool(og_title)

    diagnostics[
        "og_image"
    ] = bool(og_image)

    meta_price = extract_meta_value(
        soup,
        [
            "product:price:amount",
            "og:price:amount",
        ],
    )

    meta_currency = extract_meta_value(
        soup,
        [
            "product:price:currency",
            "og:price:currency",
        ],
    )

    diagnostics[
        "meta_price"
    ] = bool(meta_price)

    diagnostics[
        "meta_currency"
    ] = bool(meta_currency)

    meta_product = extract_from_meta(
        soup,
        product_url,
    )

    if meta_product:

        # Fill missing fields from HTML.
        if meta_product.price is None:

            meta_product.price = (
                extract_html_price(
                    soup
                )
            )

            diagnostics[
                "html_price"
            ] = (
                meta_product.price
                is not None
            )

        if meta_product.rating is None:

            meta_product.rating = (
                extract_html_rating(
                    soup
                )
            )

            diagnostics[
                "html_rating"
            ] = (
                meta_product.rating
                is not None
            )

        if (
            meta_product.review_count
            is None
        ):

            meta_product.review_count = (
                extract_html_review_count(
                    soup
                )
            )

            diagnostics[
                "html_review_count"
            ] = (
                meta_product.review_count
                is not None
            )

        diagnostics[
            "extraction_method"
        ] = "metadata"

        return (
            meta_product,
            diagnostics,
        )

    return (
        None,
        diagnostics,
    )