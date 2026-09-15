from pathlib import Path
from PIL import Image


SUPPORTED_FORMATS = {".jpg", ".jpeg", ".png", ".webp"}


def load_image(image_path: str) -> Image.Image:
    path = Path(image_path)

    if not path.exists():
        raise FileNotFoundError(f"Image not found: {image_path}")

    if not path.is_file():
        raise ValueError(f"Path is not a file: {image_path}")

    if path.suffix.lower() not in SUPPORTED_FORMATS:
        raise ValueError(
            f"Unsupported image format: {path.suffix}. "
            f"Supported formats: {', '.join(sorted(SUPPORTED_FORMATS))}"
        )

    try:
        image = Image.open(path)
        image.load()
        image = image.convert("RGB")
    except Exception as error:
        raise ValueError(
            f"Unable to read image: {image_path}"
        ) from error

    return image