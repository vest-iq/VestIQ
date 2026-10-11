from __future__ import annotations

from io import BytesIO
from fastapi import APIRouter, File, UploadFile, Request
from PIL import Image

from app.core.rate_limit import limiter
from app.schemas.ai_specialist import AISpecialistResponse
from app.services.ai_specialist.ai_specialist_service import (
    ai_specialist_service,
)
from app.services.image.validator import validate_image


router = APIRouter(
    prefix="/ai-specialist",
    tags=["AI Specialist"],
)


@router.post(
    "/analyze",
    response_model=AISpecialistResponse,
)
@limiter.limit("5/minute")
async def analyze_ai_specialist(
    request: Request,
    user_image: UploadFile = File(...),
    clothing_image: UploadFile = File(...),
) -> AISpecialistResponse:
    """
    Analyze whether a clothing item is compatible with
    the provided user image and generate styling recommendations.
    """

    # ------------------------------------------------------
    # Validate uploaded images
    # ------------------------------------------------------

    user_bytes = await validate_image(user_image)
    clothing_bytes = await validate_image(clothing_image)

    # ------------------------------------------------------
    # Convert validated bytes → PIL images
    # ------------------------------------------------------

    user_pil = Image.open(
        BytesIO(user_bytes)
    ).convert("RGB")

    clothing_pil = Image.open(
        BytesIO(clothing_bytes)
    ).convert("RGB")

    # ------------------------------------------------------
    # Run AI Specialist pipeline
    # ------------------------------------------------------

    result = ai_specialist_service.analyze(
        user_image=user_pil,
        clothing_image=clothing_pil,
    )

    # ------------------------------------------------------
    # Return validated response
    # ------------------------------------------------------

    return AISpecialistResponse(
        **result
    )