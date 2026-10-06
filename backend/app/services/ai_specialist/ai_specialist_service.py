from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from PIL import Image

from app.services.ai_specialist.clothing_analyzer import (
    clothing_analyzer,
)
from app.services.ai_specialist.compatibility_service import (
    compatibility_service,
)
from app.services.ai_specialist.fashionclip_service import (
    fashionclip_service,
)
from app.services.ai_specialist.recommendation_engine import (
    generate_categorized_recommendations,
)

from app.services.ai_specialist.vlm_explainer import (
    generate_explanation,
)


RULES_PATH = (
    Path(__file__).resolve().parent
    / "styling_rules.json"
)


class AISpecialistService:
    """
    Production orchestration layer for the AI Specialist.

    Pipeline:

        User image
             +
        Clothing image
             ↓
        FashionCLIP embeddings
             ↓
        Compatibility model
             ↓
        Clothing category analyzer
             ↓
        Styling rules
             ↓
        Recommendation engine
    """

    def __init__(self) -> None:
        self.fashionclip = fashionclip_service
        self.compatibility = compatibility_service
        self.clothing_analyzer = clothing_analyzer

        self.clothing_rules = self._load_styling_rules()

    def _load_styling_rules(self) -> dict[str, Any]:
        """Load styling rules from JSON."""

        if not RULES_PATH.exists():
            raise FileNotFoundError(
                f"Styling rules file not found: {RULES_PATH}"
            )

        with RULES_PATH.open(
            "r",
            encoding="utf-8",
        ) as file:
            rules = json.load(file)

        if not isinstance(rules, dict):
            raise ValueError(
                "styling_rules.json must contain a JSON object."
            )

        return rules

    def _build_style_profile(self) -> dict[str, Any]:
        """
        Placeholder for future person-aware style analysis.
        """

        return {
            "styles": [],
            "source": "structured_pipeline",
        }

    def _build_clothing_profile(
        self,
        clothing_image: str | Path | Image.Image,
    ) -> dict[str, Any]:
        """
        Analyze the clothing image using FashionCLIP.
        """

        analysis = self.clothing_analyzer.analyze(
            clothing_image
        )

        return {
            "primary_category": analysis["primary_category"],
            "confidence": analysis["confidence"],
            "candidates": analysis["candidates"],
            "method": analysis["method"],
        }

    def analyze(
        self,
        user_image: str | Path | Image.Image,
        clothing_image: str | Path | Image.Image,
    ) -> dict[str, Any]:
        """Run the complete AI Specialist pipeline."""

        # --------------------------------------------------
        # 1. Generate FashionCLIP embeddings
        # --------------------------------------------------

        user_embedding = self.fashionclip.get_embedding(
            user_image
        )

        clothing_embedding = self.fashionclip.get_embedding(
            clothing_image
        )

        # --------------------------------------------------
        # 2. Compatibility analysis
        # --------------------------------------------------

        compatibility_result = self.compatibility.predict(
            [
                user_embedding.numpy(),
                clothing_embedding.numpy(),
            ]
        )

        compatibility_result["interpretation"] = (
            "compatibility_signal"
        )

        # --------------------------------------------------
        # 3. Style profile
        # --------------------------------------------------

        style_profile = self._build_style_profile()

        # --------------------------------------------------
        # 4. Clothing category
        # --------------------------------------------------

        clothing_profile = self._build_clothing_profile(
            clothing_image
        )

        # --------------------------------------------------
        # 5. Recommendations
        # --------------------------------------------------

        recommendation_result = (
            generate_categorized_recommendations(
                style_profile=style_profile,
                clothing_profile=clothing_profile,
                clothing_rules=self.clothing_rules,
            )
        )
        
        explanation = generate_explanation(
            compatibility=str(
                compatibility_result["prediction"]
            ),
            clothing_category=clothing_profile["primary_category"],
            style_profile=style_profile,
            recommendations=recommendation_result[
                "recommendations"
            ],
        )

        # --------------------------------------------------
        # 6. Final response
        # --------------------------------------------------

        return {
            "compatibility": compatibility_result,

            "style_profile": style_profile,

            "clothing_profile": clothing_profile,

            "recommendations": recommendation_result,
            
            "explanation": explanation,

            "metadata": {
                "embedding_dimension": 768,
                "compatibility_feature_dimension": (
                    compatibility_result[
                        "feature_dimension"
                    ]
                ),
                "num_items": compatibility_result[
                    "num_items"
                ],
            },
        }


ai_specialist_service = AISpecialistService()