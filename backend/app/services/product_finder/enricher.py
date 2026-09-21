from typing import List

from app.schemas.product_data import ProductData, ProductExtraction
from app.schemas.product_finder import ProductResult

from app.services.product_finder.extractor import (
    extract_product,
)


def enrich_products(
    products: List[ProductResult],
) -> List[ProductData]:
    """
    Enrich Lens product results by visiting each product URL.

    If one product fails, the remaining products continue.
    """

    enriched_products: List[ProductData] = []

    for product in products:

        try:
            enriched = extract_product(
                product.product_url
            )

            # If the retailer did not provide a name,
            # keep the name discovered by Google Lens.
            if not enriched.name:
                enriched.name = product.name

            # Always keep the original Lens URL.
            enriched.product_url = product.product_url

            # Keep Lens image if the retailer has no image.
            if not enriched.image_url:
                enriched.image_url = product.image_url

            # Keep Lens source if extraction did not provide one.
            if not enriched.source:
                enriched.source = product.source

            enriched_products.append(
                enriched
            )

        except Exception as exc:

            print(
                f"[PRODUCT ENRICHMENT FAILED] "
                f"{product.product_url}"
            )

            print(
                f"Error type: {type(exc).__name__}"
            )

            print(
                f"Error: {exc}"
            )

            # Keep the Lens result even when enrichment fails.
            enriched_products.append(
                ProductData(
                    name=product.name,
                    product_url=product.product_url,
                    source=product.source,
                    image_url=product.image_url,
                    extraction=ProductExtraction(
                        methods_used=["google_lens"],
                        confidence=0.0,
                        warnings=[
                            "Product page enrichment failed."
                        ],
                    ),
                )
            )

    return enriched_products