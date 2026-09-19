import cv2
import numpy as np


def classify_color(
    hue: float,
    saturation: float,
    value: float,
) -> str:

    # Very dark pixels
    if value < 45:
        return "black"

    # Low saturation means the pixel is effectively
    # gray/white rather than a reliable color.
    if saturation < 35:

        if value >= 220:
            return "white"

        if value >= 160:
            return "light gray"

        if value >= 90:
            return "gray"

        return "dark gray"

    # Red
    if hue < 8 or hue >= 170:

        if value < 100:
            return "dark red"

        return "red"

    # Orange
    if hue < 20:

        if value < 120:
            return "dark orange"

        return "orange"

    # Yellow
    if hue < 35:
        return "yellow"

    # Green
    if hue < 85:
        return "green"

    # Cyan
    if hue < 100:
        return "cyan"

    # Blue
    if hue < 130:
        return "blue"

    # Purple
    if hue < 155:
        return "purple"

    # Pink / magenta
    return "pink"


def get_relevant_region(
    image: np.ndarray,
) -> np.ndarray:

    height, width = image.shape[:2]

    x1 = int(width * 0.15)
    x2 = int(width * 0.85)

    y1 = int(height * 0.15)
    y2 = int(height * 0.85)

    return image[y1:y2, x1:x2]


def extract_dominant_color(
    image: np.ndarray,
) -> str:

    region = get_relevant_region(image)

    hsv = cv2.cvtColor(
        region,
        cv2.COLOR_BGR2HSV,
    )

    hue = hsv[:, :, 0]
    saturation = hsv[:, :, 1]
    value = hsv[:, :, 2]

    # ------------------------------------------------
    # IMPORTANT:
    # Only pixels with meaningful saturation are
    # allowed to determine a color.
    # ------------------------------------------------

    color_mask = (
        (saturation >= 45)
        & (value >= 45)
    )

    valid_hues = hue[color_mask]
    valid_saturation = saturation[color_mask]
    valid_value = value[color_mask]

    # No reliable colored pixels.
    if len(valid_hues) == 0:

        median_value = float(
            np.median(value)
        )

        median_saturation = float(
            np.median(saturation)
        )

        if median_saturation < 35:

            if median_value >= 220:
                return "white"

            if median_value >= 160:
                return "light gray"

            if median_value >= 90:
                return "gray"

            return "dark gray"

        return "unknown"

    # ------------------------------------------------
    # Build hue histogram.
    # Saturation is used as the weight so strongly
    # colored pixels have more influence.
    # ------------------------------------------------

    histogram = np.zeros(
        180,
        dtype=np.float64,
    )

    for h, s, v in zip(
        valid_hues,
        valid_saturation,
        valid_value,
    ):

        weight = float(s) / 255.0

        histogram[int(h)] += weight

    dominant_hue = int(
        np.argmax(histogram)
    )

    # ------------------------------------------------
    # Find pixels close to dominant hue.
    # ------------------------------------------------

    hue_distance = np.abs(
        valid_hues.astype(np.int16)
        - dominant_hue
    )

    nearby = hue_distance <= 8

    if np.any(nearby):

        representative_saturation = float(
            np.median(
                valid_saturation[nearby]
            )
        )

        representative_value = float(
            np.median(
                valid_value[nearby]
            )
        )

    else:

        representative_saturation = float(
            np.median(valid_saturation)
        )

        representative_value = float(
            np.median(valid_value)
        )

    # Final safety check.
    # Never classify a low-saturation region
    # using its hue.
    if representative_saturation < 35:

        if representative_value >= 220:
            return "white"

        if representative_value >= 160:
            return "light gray"

        if representative_value >= 90:
            return "gray"

        return "dark gray"

    return classify_color(
        dominant_hue,
        representative_saturation,
        representative_value,
    )


def calculate_edge_density(
    image: np.ndarray,
) -> float:

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY,
    )

    edges = cv2.Canny(
        gray,
        100,
        200,
    )

    return float(
        np.count_nonzero(edges)
        / edges.size
    )


def extract_cv_features(
    image_bytes: bytes,
) -> dict:

    image_array = np.frombuffer(
        image_bytes,
        dtype=np.uint8,
    )

    image = cv2.imdecode(
        image_array,
        cv2.IMREAD_COLOR,
    )

    if image is None:
        raise ValueError(
            "Could not decode image with OpenCV."
        )

    height, width = image.shape[:2]

    aspect_ratio = (
        round(width / height, 3)
        if height
        else None
    )

    hsv = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2HSV,
    )

    brightness = float(
        np.median(hsv[:, :, 2])
    )

    saturation = float(
        np.median(hsv[:, :, 1])
    )

    dominant_color = (
        extract_dominant_color(image)
    )

    edge_density = (
        calculate_edge_density(image)
    )

    return {
        "dominant_color": dominant_color,
        "brightness": round(
            brightness,
            2,
        ),
        "saturation": round(
            saturation,
            2,
        ),
        "edge_density": round(
            edge_density,
            4,
        ),
        "aspect_ratio": aspect_ratio,
    }