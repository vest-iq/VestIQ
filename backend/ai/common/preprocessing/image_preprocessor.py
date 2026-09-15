from PIL import Image


MAX_SIZE = 1024


def preprocess_image(image: Image.Image) -> Image.Image:
    if not isinstance(image, Image.Image):
        raise TypeError("Expected a PIL Image.")

    image = image.convert("RGB")

    image.thumbnail(
        (MAX_SIZE, MAX_SIZE),
        Image.Resampling.LANCZOS
    )

    return image