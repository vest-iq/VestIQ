from io import BytesIO

from fastapi import HTTPException, UploadFile
from PIL import Image, UnidentifiedImageError


MAX_IMAGE_SIZE = 10 * 1024 * 1024

ALLOWED_FORMATS = {
    "JPEG": "image/jpeg",
    "PNG": "image/png",
    "WEBP": "image/webp",
}

MIN_WIDTH = 100
MIN_HEIGHT = 100

MAX_WIDTH = 6000
MAX_HEIGHT = 6000


async def validate_image(
    file: UploadFile,
) -> bytes:

    if not file:
        raise HTTPException(
            status_code=400,
            detail="No image file was provided.",
        )

    if not file.content_type:

        raise HTTPException(
            status_code=400,
            detail="Could not determine the image type.",
        )

    if file.content_type not in ALLOWED_FORMATS.values():

        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported image format. "
                "Use JPG, PNG, or WEBP."
            ),
        )

    contents = await file.read()

    if not contents:

        raise HTTPException(
            status_code=400,
            detail="Uploaded image is empty.",
        )

    if len(contents) > MAX_IMAGE_SIZE:

        raise HTTPException(
            status_code=413,
            detail="Image size must not exceed 10 MB.",
        )

    try:

        image = Image.open(
            BytesIO(contents)
        )

        # Verify that the file is actually
        # a valid image.
        image.verify()

        # Reopen because verify() invalidates
        # the image object.
        image = Image.open(
            BytesIO(contents)
        )

    except (
        UnidentifiedImageError,
        OSError,
    ):

        raise HTTPException(
            status_code=400,
            detail=(
                "The uploaded file is "
                "not a valid image."
            ),
        )

    if image.format not in ALLOWED_FORMATS:

        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported image format. "
                "Use JPG, PNG, or WEBP."
            ),
        )

    width, height = image.size

    if (
        width < MIN_WIDTH
        or height < MIN_HEIGHT
    ):

        raise HTTPException(
            status_code=400,
            detail=(
                f"Image dimensions must be at least "
                f"{MIN_WIDTH}x{MIN_HEIGHT}px."
            ),
        )

    if (
        width > MAX_WIDTH
        or height > MAX_HEIGHT
    ):

        raise HTTPException(
            status_code=400,
            detail=(
                f"Image dimensions must not exceed "
                f"{MAX_WIDTH}x{MAX_HEIGHT}px."
            ),
        )

    return contents