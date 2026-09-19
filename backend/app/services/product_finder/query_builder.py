from app.schemas.product_finder import (
    ClothingAnalysis,
)


def build_search_queries(
    analysis: ClothingAnalysis,
) -> list[str]:

    queries = []

    # =====================================================
    # PRIMARY SEMANTIC QUERY
    # =====================================================

    semantic_parts = [
        analysis.color,
        analysis.sub_category,
        analysis.pattern,
        analysis.material,
        analysis.fit,
    ]

    semantic_parts = [
        part.strip()
        for part in semantic_parts
        if part and part.strip()
    ]

    if semantic_parts:

        queries.append(
            " ".join(
                semantic_parts
            )
        )

    # =====================================================
    # GARMENT + COLOR
    # =====================================================

    if (
        analysis.color
        and analysis.sub_category
    ):

        queries.append(
            f"{analysis.color} "
            f"{analysis.sub_category}"
        )

    # =====================================================
    # STYLE + GARMENT
    # =====================================================

    if (
        analysis.style
        and analysis.sub_category
    ):

        queries.append(
            f"{analysis.style} "
            f"{analysis.sub_category}"
        )

    # =====================================================
    # GEMINI SEARCH TERMS
    # =====================================================

    queries.extend(
        analysis.search_terms
    )

    # =====================================================
    # CLEAN DUPLICATES
    # =====================================================

    unique_queries = []

    seen = set()

    for query in queries:

        if not query:
            continue

        query = " ".join(
            query.split()
        ).strip()

        normalized = (
            query.lower()
        )

        if (
            normalized
            and normalized not in seen
        ):

            seen.add(
                normalized
            )

            unique_queries.append(
                query
            )

    return unique_queries[:5]