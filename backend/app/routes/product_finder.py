from fastapi import APIRouter, Depends, HTTPException

from app.services.dependencies import get_valid_image
from app.services.product_finder import (
    clean_products,
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
    Search the internet for visually similar products
    using Google Lens through SerpApi.
    """

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
            "\n[PRODUCT FINDER ERROR]"
        )
        print(
            f"Type: {type(exc).__name__}"
        )
        print(
            f"Error: {exc}"
        )

        raise HTTPException(
            status_code=502,
            detail=(
                "Visual product search "
                "is temporarily unavailable."
            ),
        )

    products = validate_products(
        products
    )

    products = clean_products(
        products
    )

    return {
        "provider": diagnostics.get(
            "provider"
        ),
        "cached": diagnostics.get(
            "cached",
            False,
        ),
        "products_found": len(products),
        "products": [
            product.model_dump()
            for product in products
        ],
        "diagnostics": diagnostics,
    }