from fastapi import APIRouter, Depends, HTTPException

from app.services.dependencies import get_valid_image
from app.services.product_finder import (
    clean_products,
    enrich_products,
    search_products_visually,
    validate_products,
)

router = APIRouter(
    prefix="/product-finder",
    tags=["Product Finder"],
)


@router.post("/search")
async def find_products(
    image_bytes: bytes = Depends(get_valid_image),
):
    """
    Product Finder pipeline:

        Image
          ↓
        Google Lens
          ↓
        Validate
          ↓
        Clothing filter
          ↓
        Product page enrichment
          ↓
        Final results
    """

    # ========================================================
    # STEP 1 — VISUAL SEARCH
    # ========================================================

    try:
        products, diagnostics = search_products_visually(
            image_bytes
        )

    except RuntimeError as exc:
        raise HTTPException(
            status_code=503,
            detail=str(exc),
        )

    except Exception as exc:
        print(
            f"[VISUAL SEARCH ERROR] "
            f"{type(exc).__name__}: {exc}"
        )

        raise HTTPException(
            status_code=502,
            detail=(
                "Visual product search is "
                "temporarily unavailable."
            ),
        )

    # ========================================================
    # STEP 2 — VALIDATE
    # ========================================================

    products = validate_products(
        products
    )

    # ========================================================
    # STEP 3 — CLOTHING FILTER
    # ========================================================

    products = clean_products(
        products
    )

    if not products:
        return {
            "provider": diagnostics.get(
                "provider"
            ),
            "cached": diagnostics.get(
                "cached",
                False,
            ),
            "products_found": 0,
            "products": [],
            "diagnostics": diagnostics,
        }

    # ========================================================
    # STEP 4 — PRODUCT PAGE ENRICHMENT
    # ========================================================

    enriched_products = enrich_products(
        products
    )

    # ========================================================
    # STEP 5 — RESPONSE
    # ========================================================

    return {
        "provider": diagnostics.get(
            "provider"
        ),
        "cached": diagnostics.get(
            "cached",
            False,
        ),
        "products_found": len(
            enriched_products
        ),
        "products": [
            product.model_dump()
            for product in enriched_products
        ],
        "diagnostics": diagnostics,
    }