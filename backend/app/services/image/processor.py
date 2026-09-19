from io import BytesIO

from PIL import Image, ImageOps


# Standard maximum processing dimensions
DEFAULT_MAX_WIDTH = 1536
DEFAULT_MAX_HEIGHT = 1536


def load_image(image_bytes: bytes) -> Image.Image:
    """
    Load raw image bytes into a PIL Image.
    """

    image = Image.open(BytesIO(image_bytes))

    # Correct orientation using EXIF metadata.
    image = ImageOps.exif_transpose(image)

    return image


def convert_to_rgb(image: Image.Image) -> Image.Image:
    """
    Convert an image to RGB.

    This gives all AI modules a consistent 3-channel image format.
    """

    if image.mode != "RGB":
        image = image.convert("RGB")

    return image


def resize_image(
    image: Image.Image,
    max_width: int = DEFAULT_MAX_WIDTH,
    max_height: int = DEFAULT_MAX_HEIGHT,
) -> Image.Image:
    """
    Resize an image while preserving its aspect ratio.
    """

    image = image.copy()

    image.thumbnail(
        (max_width, max_height),
        Image.Resampling.LANCZOS,
    )

    return image


def process_image(
    image_bytes: bytes,
    max_width: int = DEFAULT_MAX_WIDTH,
    max_height: int = DEFAULT_MAX_HEIGHT,
) -> Image.Image:
    """
    Complete image preprocessing pipeline.

    1. Load image
    2. Correct orientation
    3. Convert to RGB
    4. Resize while preserving aspect ratio
    """

    image = load_image(image_bytes)
    image = convert_to_rgb(image)
    image = resize_image(image, max_width, max_height)

    return image


def image_to_bytes(
    image: Image.Image,
    image_format: str = "JPEG",
    quality: int = 90,
) -> bytes:
    """
    Convert a PIL Image back into bytes.
    """

    buffer = BytesIO()

    image.save(
        buffer,
        format=image_format,
        quality=quality,
    )

    buffer.seek(0)

    return buffer.getvalue()