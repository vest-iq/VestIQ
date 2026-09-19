from fastapi import APIRouter, Depends

from app.services.dependencies import (
    get_valid_image,
)

from app.services.product_finder import (
    analyze_clothing,
    build_search_queries,
    clean_products,
    discover_products,
    extract_product,
    fetch_page,
    validate_products,
)


router = APIRouter(
    prefix="/product-finder",
    tags=["Product Finder"],
)


@router.post("/search")
async def find_products(
    image_bytes: bytes = Depends(
        get_valid_image
    ),
):

    # =====================================================
    # 1. IMAGE → CLOTHING ANALYSIS
    # =====================================================

    analysis = analyze_clothing(
        image_bytes
    )

    # =====================================================
    # 2. ANALYSIS → SEARCH QUERIES
    # =====================================================

    search_queries = (
        build_search_queries(
            analysis
        )
    )

    # =====================================================
    # 3. SEARCH → REAL URLS
    # =====================================================

    discovered_urls = (
        discover_products(
            search_queries,
            results_per_query=5,
            max_total_results=20,
        )
    )

    # =====================================================
    # 4. FETCH + EXTRACT
    # =====================================================

    products = []

    scrape_results = []

    extraction_results = []

    for url in discovered_urls:

        html, metadata = fetch_page(
            url
        )

        scrape_results.append(
            metadata
        )

        if not html:

            extraction_results.append(
                {
                    "url": url,
                    "extracted": False,
                    "reason": metadata.get(
                        "error"
                    ),
                    "diagnostics": None,
                }
            )

            continue

        product, diagnostics = (
            extract_product(
                html,
                url,
            )
        )

        if product:

            products.append(
                product
            )

            extraction_results.append(
                {
                    "url": url,
                    "extracted": True,
                    "reason": None,
                    "diagnostics": diagnostics,
                }
            )

        else:

            extraction_results.append(
                {
                    "url": url,
                    "extracted": False,
                    "reason": (
                        "No product data "
                        "could be extracted"
                    ),
                    "diagnostics": diagnostics,
                }
            )

    # =====================================================
    # 5. VALIDATION
    # =====================================================

    products = validate_products(
        products
    )

    # =====================================================
    # 6. CLEAN + DEDUPLICATE
    # =====================================================

    products = clean_products(
        products
    )

    successful_scrapes = sum(
        1
        for result in scrape_results
        if result.get("success")
    )

    successful_extractions = sum(
        1
        for result in extraction_results
        if result.get("extracted")
    )

    return {
        "analysis": analysis.model_dump(),

        "search_queries": search_queries,

        "discovered_urls": len(
            discovered_urls
        ),

        "pages_fetched": successful_scrapes,

        "pages_with_products": (
            successful_extractions
        ),

        "products_found": len(
            products
        ),

        "products": [
            product.model_dump()
            for product in products
        ],

        # Diagnostics are temporary.
        # We will remove/reduce them later.
        "scrape_diagnostics": (
            extraction_results
        ),
    }