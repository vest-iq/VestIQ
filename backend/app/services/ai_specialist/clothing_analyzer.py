from __future__ import annotations

from pathlib import Path
from typing import Any

import torch
from PIL import Image

from app.services.ai_specialist.fashionclip_service import (
    fashionclip_service,
)


# This vocabulary MUST stay aligned with styling_rules.json.
CLOTHING_CATEGORIES = [
    "dress",
    "jacket",
    "shirt",
    "t-shirt",
    "jeans",
]


class ClothingAnalyzer:
    """
    Zero-shot clothing category analyzer using FashionCLIP.

    This is not a trained clothing classifier.

    FashionCLIP has two relevant embedding spaces:

    1. Vision pooler output:
       768-D

       Used by the compatibility model.

    2. Projected shared CLIP space:
       512-D

       Used here for image-text similarity.

    The two spaces must not be mixed.
    """

    def __init__(
        self,
        fashionclip_service,
    ) -> None:
        self.fashionclip = fashionclip_service

        self.categories = CLOTHING_CATEGORIES

        self.text_prompts = [
            f"a photo of a {category}"
            for category in self.categories
        ]

        self._text_features: torch.Tensor | None = None

    def _get_text_features(self) -> torch.Tensor:
        """
        Generate and cache normalized FashionCLIP text embeddings.
        """

        if self._text_features is not None:
            return self._text_features

        processor = self.fashionclip.processor
        model = self.fashionclip.model
        device = self.fashionclip.device

        inputs = processor(
            text=self.text_prompts,
            return_tensors="pt",
            padding=True,
            truncation=True,
        )

        inputs = {
            key: value.to(device)
            for key, value in inputs.items()
        }

        with torch.inference_mode():
            text_output = model.text_model(
                **inputs
            )

            text_features = model.text_projection(
                text_output.pooler_output
            )

            text_features = text_features / text_features.norm(
                dim=-1,
                keepdim=True,
            )

        self._text_features = text_features

        return self._text_features

    def analyze(
        self,
        image: str | Path | Image.Image,
    ) -> dict[str, Any]:
        """
        Classify a clothing image using zero-shot FashionCLIP.

        Image and text are compared in FashionCLIP's shared
        projected embedding space.

        Returns:
            {
                "primary_category": "...",
                "confidence": float,
                "candidates": [...],
                "method": "fashionclip_zero_shot"
            }
        """

        # ------------------------------------------------------
        # Load image
        # ------------------------------------------------------

        pil_image = self.fashionclip._load_image(image)

        processor = self.fashionclip.processor
        model = self.fashionclip.model
        device = self.fashionclip.device

        # ------------------------------------------------------
        # Image → shared 512-D CLIP space
        # ------------------------------------------------------

        image_inputs = processor(
            images=pil_image,
            return_tensors="pt",
        )

        image_inputs = {
            key: value.to(device)
            for key, value in image_inputs.items()
        }

        with torch.inference_mode():
            vision_output = model.vision_model(
                **image_inputs
            )

            image_features = model.visual_projection(
                vision_output.pooler_output
            )

            image_features = image_features / image_features.norm(
                dim=-1,
                keepdim=True,
            )

        # ------------------------------------------------------
        # Text → shared 512-D CLIP space
        # ------------------------------------------------------

        text_features = self._get_text_features()

        # ------------------------------------------------------
        # Image ↔ text similarity
        # ------------------------------------------------------

        similarity = torch.matmul(
            text_features,
            image_features[0],
        )

        # This softmax is only used to create a ranking
        # distribution. It is NOT a calibrated probability.
        probabilities = torch.softmax(
            similarity * 10.0,
            dim=0,
        )

        ranked_indices = torch.argsort(
            probabilities,
            descending=True,
        )

        top_index = int(ranked_indices[0])

        candidates = []

        for index_tensor in ranked_indices:
            index = int(index_tensor)

            candidates.append(
                {
                    "category": self.categories[index],
                    "score": float(similarity[index]),
                }
            )

        return {
            "primary_category": self.categories[top_index],
            "confidence": float(probabilities[top_index]),
            "candidates": candidates,
            "method": "fashionclip_zero_shot",
        }


clothing_analyzer = ClothingAnalyzer(
    fashionclip_service=fashionclip_service,
)