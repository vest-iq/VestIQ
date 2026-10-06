from __future__ import annotations

from pathlib import Path
from typing import Union

import torch
from PIL import Image
from transformers import AutoModel, AutoProcessor


MODEL_NAME = "patrickjohncyh/fashion-clip"
EMBEDDING_DIM = 768


class FashionCLIPService:
    """
    Production inference service for FashionCLIP.

    Responsibilities:
    - Load FashionCLIP once.
    - Accept an image path or PIL Image.
    - Generate a 768-dimensional image embedding.

    The returned embedding is the raw FashionCLIP image embedding.
    Normalization is intentionally left to downstream feature-building
    code because the production compatibility model performs its own
    normalization.
    """

    def __init__(
        self,
        model_name: str = MODEL_NAME,
        device: str | None = None,
    ) -> None:
        self.model_name = model_name

        if device is None:
            device = "cuda" if torch.cuda.is_available() else "cpu"

        self.device = torch.device(device)

        self.processor = AutoProcessor.from_pretrained(
            self.model_name
        )

        self.model = AutoModel.from_pretrained(
            self.model_name
        )

        self.model.to(self.device)
        self.model.eval()

    def _load_image(
        self,
        image: Union[str, Path, Image.Image],
    ) -> Image.Image:
        """
        Load and validate an image.

        Supports:
        - file path
        - pathlib.Path
        - PIL Image
        """

        if isinstance(image, Image.Image):
            return image.convert("RGB")

        image_path = Path(image)

        if not image_path.exists():
            raise FileNotFoundError(
                f"Image not found: {image_path}"
            )

        if not image_path.is_file():
            raise ValueError(
                f"Image path is not a file: {image_path}"
            )

        try:
            with Image.open(image_path) as img:
                return img.convert("RGB")
        except Exception as exc:
            raise ValueError(
                f"Unable to load image: {image_path}"
            ) from exc

    @torch.inference_mode()
    def get_embedding(
        self,
        image: Union[str, Path, Image.Image],
    ) -> torch.Tensor:
        """
        Generate a FashionCLIP image embedding.

        Returns:
            torch.Tensor:
                Shape: [768]
                dtype: torch.float32
                device: CPU
        """

        pil_image = self._load_image(image)

        inputs = self.processor(
            images=pil_image,
            return_tensors="pt",
        )

        inputs = {
            key: value.to(self.device)
            for key, value in inputs.items()
        }

        vision_output = self.model.vision_model(
            **inputs
        )

        image_features = vision_output.pooler_output

        if image_features.ndim != 2:
            raise RuntimeError(
                "Unexpected FashionCLIP output shape: "
                f"{tuple(image_features.shape)}"
            )

        if image_features.shape[-1] != EMBEDDING_DIM:
            raise RuntimeError(
                "Unexpected FashionCLIP embedding dimension: "
                f"{image_features.shape[-1]}. "
                f"Expected {EMBEDDING_DIM}."
            )

        embedding = image_features[0].float().cpu()

        if not torch.isfinite(embedding).all():
            raise RuntimeError(
                "FashionCLIP produced NaN or infinite values."
            )

        return embedding

    def get_embedding_list(
        self,
        image: Union[str, Path, Image.Image],
    ) -> list[float]:
        """
        Convenience method for API/JSON usage.

        Returns:
            List containing 768 float values.
        """

        embedding = self.get_embedding(image)

        return embedding.tolist()


# Singleton instance for backend usage.
# The model is loaded only when this module is imported.
fashionclip_service = FashionCLIPService()