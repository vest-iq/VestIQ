from pathlib import Path

from ai.common.preprocessing.image_loader import load_image
from ai.common.preprocessing.image_preprocessor import preprocess_image
from ai.common.preprocessing.quality import check_image_quality


BASE_DIR = Path(__file__).resolve().parent
IMAGE_PATH = BASE_DIR / "sample_person.jpg"


def main():
    print("=" * 50)
    print("StyleMirror - CF-1 Image Infrastructure Test")
    print("=" * 50)

    print("\n[1] Loading image...")

    image = load_image(str(IMAGE_PATH))

    print(f"Original size: {image.size}")
    print(f"Image mode: {image.mode}")

    print("\n[2] Preprocessing image...")

    processed_image = preprocess_image(image)

    print(f"Processed size: {processed_image.size}")
    print(f"Processed mode: {processed_image.mode}")

    print("\n[3] Checking image quality...")

    quality = check_image_quality(processed_image)

    print(f"Width: {quality['width']}")
    print(f"Height: {quality['height']}")
    print(f"Usable: {quality['is_usable']}")
    print(f"Warnings: {quality['warnings']}")

    print("\n" + "=" * 50)

    if quality["is_usable"]:
        print("CF-1 TEST PASSED")
    else:
        print("CF-1 TEST FAILED")

    print("=" * 50)


if __name__ == "__main__":
    main()