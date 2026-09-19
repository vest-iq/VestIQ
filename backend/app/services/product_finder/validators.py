from urllib.parse import urlparse

from app.schemas.product_finder import ProductResult


def validate_product(
    product: ProductResult,
) -> bool:

    # Product name is mandatory.
    if not product.name:
        return False

    # Real product URL is mandatory.
    if not product.product_url:
        return False

    parsed = urlparse(
        product.product_url
    )

    if parsed.scheme not in {
        "http",
        "https",
    }:
        return False

    if not parsed.netloc:
        return False

    # Reject obvious non-product pages.
    name = product.name.lower()

    blocked_title_patterns = [
        "search results",
        "search -",
        "category",
        "categories",
        "404",
        "page not found",
        "login",
        "sign in",
        "register",
    ]

    for pattern in blocked_title_patterns:

        if pattern in name:
            return False

    # Rating should be sensible.
    if product.rating is not None:

        if not (
            0 <= product.rating <= 5
        ):
            return False

    # Review count cannot be negative.
    if product.review_count is not None:

        if product.review_count < 0:
            return False

    # Price cannot be negative.
    if product.price is not None:

        if product.price < 0:
            return False

    return True


def validate_products(
    products: list[ProductResult],
) -> list[ProductResult]:

    valid_products = []

    for product in products:

        if validate_product(
            product
        ):

            valid_products.append(
                product
            )

    return valid_products