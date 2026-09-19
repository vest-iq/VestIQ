from fastapi import UploadFile

from app.services.image.validator import validate_image


async def get_valid_image(file: UploadFile) -> bytes:
    """
    FastAPI dependency for receiving a validated image.
    """

    return await validate_image(file)