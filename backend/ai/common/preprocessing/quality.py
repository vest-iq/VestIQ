from PIL import Image


MIN_WIDTH = 256
MIN_HEIGHT = 256


def check_image_quality(image: Image.Image) -> dict:
    if not isinstance(image, Image.Image):
        raise TypeError("Expected a PIL Image.")

    width, height = image.size

    warnings = []

    if width < MIN_WIDTH or height < MIN_HEIGHT:
        warnings.append(
            f"Image resolution is low. "
            f"Minimum recommended size is "
            f"{MIN_WIDTH}x{MIN_HEIGHT}."
        )

    if width <= 0 or height <= 0:
        warnings.append("Invalid image dimensions.")

    return {
        "width": width,
        "height": height,
        "is_usable": len(warnings) == 0,
        "warnings": warnings,
    }