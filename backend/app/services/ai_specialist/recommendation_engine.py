from typing import Dict, Any


def generate_categorized_recommendations(
    style_profile: Dict[str, Any],
    clothing_profile: Dict[str, Any],
    clothing_rules: Dict[str, Any],
    max_per_category: int = 3,
):
    """
    Generate deterministic clothing recommendations using:

    - detected clothing category
    - user's style profile
    - category-specific styling rules

    The engine does not generate recommendations for
    unsupported clothing categories.
    """

    category = clothing_profile["primary_category"]

    # Safe fallback for unsupported categories
    if category not in clothing_rules:
        return {
            "clothing_category": category,
            "recommendations": {},
        }

    rules = clothing_rules[category]

    result = {
        "clothing_category": category,
        "recommendations": {
            "pairing": [],
            "footwear": [],
            "accessories": [],
            "layering": [],
        },
    }

    scores = {
        "pairing": {},
        "footwear": {},
        "accessories": {},
        "layering": {},
    }

    sources = {
        "pairing": {},
        "footwear": {},
        "accessories": {},
        "layering": {},
    }

    # General category rules
    for recommendation_type in scores:
        for item in rules.get(recommendation_type, []):
            scores[recommendation_type][item] = (
                scores[recommendation_type].get(item, 0.0) + 0.15
            )

            sources[recommendation_type].setdefault(
                item, []
            ).append("general")

    # Style-specific rules
    for style_info in style_profile.get("styles", []):
        style = style_info["style"]
        weight = style_info["weight"]

        style_rules = rules.get("styles", {}).get(style, {})

        for recommendation_type in scores:
            for item in style_rules.get(recommendation_type, []):
                scores[recommendation_type][item] = (
                    scores[recommendation_type].get(item, 0.0)
                    + weight
                )

                sources[recommendation_type].setdefault(
                    item, []
                ).append(style)

    # Rank recommendations
    for recommendation_type in scores:
        ranked = sorted(
            scores[recommendation_type].items(),
            key=lambda x: x[1],
            reverse=True,
        )

        for item, _score in ranked[:max_per_category]:
            result["recommendations"][recommendation_type].append(
                {
                    "item": item,
                    "supported_by": sources[
                        recommendation_type
                    ][item],
                }
            )

    return result