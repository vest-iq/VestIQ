from urllib.parse import (
    parse_qsl,
    urlencode,
    urlparse,
    urlunparse,
)

from app.schemas.product_finder import (
    ProductResult,
)


TRACKING_PARAMETERS = {
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "fbclid",
    "gclid",
    "msclkid",
    "ref",
    "ref_",
}


def normalize_url(
    url: str,
) -> str:

    parsed = urlparse(
        url
    )

    query_params = []

    for key, value in parse_qsl(
        parsed.query,
        keep_blank_values=True,
    ):

        if key.lower() in TRACKING_PARAMETERS:
            continue

        query_params.append(
            (
                key,
                value,
            )
        )

    return urlunparse(
        (
            parsed.scheme.lower(),
            parsed.netloc.lower(),
            parsed.path.rstrip("/"),
            "",
            urlencode(
                query_params
            ),
            "",
        )
    )


def clean_products(
    products: list[ProductResult],
) -> list[ProductResult]:

    cleaned = []

    seen_urls = set()

    for product in products:

        normalized_url = normalize_url(
            product.product_url
        )

        if normalized_url in seen_urls:
            continue

        seen_urls.add(
            normalized_url
        )

        product.product_url = (
            normalized_url
        )

        product.source = urlparse(
            normalized_url
        ).netloc

        cleaned.append(
            product
        )

    return cleaned