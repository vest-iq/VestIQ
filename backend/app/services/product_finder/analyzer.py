import json
import os
import time
from io import BytesIO

from PIL import Image

from google import genai
from google.genai import types

from app.schemas.product_finder import (
    ClothingAnalysis,
    CVFeatures,
)

from app.services.product_finder.cv_features import (
    extract_cv_features,
)


_client = None

GEMINI_MODEL = "gemini-3.6-flash"

MAX_RETRIES = 2


def get_gemini_client():
    global _client

    if _client is None:
        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise RuntimeError(
                "GEMINI_API_KEY is not configured."
            )

        _client = genai.Client(
            api_key=api_key
        )

    return _client


def detect_mime_type(
    image_bytes: bytes,
) -> str:

    try:
        with Image.open(
            BytesIO(image_bytes)
        ) as image:

            image_format = image.format

        mime_types = {
            "JPEG": "image/jpeg",
            "PNG": "image/png",
            "WEBP": "image/webp",
        }

        return mime_types.get(
            image_format,
            "image/jpeg",
        )

    except Exception:
        return "image/jpeg"


def build_gemini_prompt(
    cv_features: dict,
) -> str:

    return f"""
You are a clothing product identification assistant.

Analyze the clothing item shown in the image.

Computer vision measured these supporting features:

{json.dumps(cv_features, indent=2)}

Use these measurements only as supporting evidence.

IMPORTANT:
- Visually inspect the actual clothing item.
- Do NOT blindly copy the CV color if the image contradicts it.
- Identify the actual garment type.
- Identify the most visually obvious color.
- Identify visible pattern.
- Estimate material only when visually reasonable.
- Estimate fit only when visually supported.
- Do not invent a brand.
- Do not invent an exact product name.
- Do not invent information that is not visible.

Return ONLY valid JSON.

The JSON must contain exactly these fields:

{{
    "category": "string",
    "sub_category": "string or null",
    "color": "string or null",
    "pattern": "string or null",
    "material": "string or null",
    "fit": "string or null",
    "gender": "string or null",
    "style": "string or null",
    "visual_features": ["string"],
    "search_terms": ["string"]
}}

Create 3 to 5 useful ecommerce search terms.

Search terms should describe the visible garment.

Do not include URLs.

Example search terms:

[
    "orange bomber jacket",
    "rust orange zip jacket",
    "orange casual bomber jacket"
]
"""


def clean_json_response(text: str) -> str:
    """
    Remove accidental markdown fences if Gemini
    returns ```json ... ``` despite the prompt.
    """

    text = text.strip()

    if text.startswith("```json"):
        text = text[7:]

    elif text.startswith("```"):
        text = text[3:]

    if text.endswith("```"):
        text = text[:-3]

    return text.strip()


def analyze_with_gemini(
    image_bytes: bytes,
    cv_features: dict,
) -> ClothingAnalysis:

    client = get_gemini_client()

    mime_type = detect_mime_type(
        image_bytes
    )

    prompt = build_gemini_prompt(
        cv_features
    )

    last_error = None

    for attempt in range(
        MAX_RETRIES + 1
    ):

        try:

            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=[
                    types.Part.from_bytes(
                        data=image_bytes,
                        mime_type=mime_type,
                    ),
                    prompt,
                ],
            )

            if not response.text:
                raise RuntimeError(
                    "Gemini returned an empty response."
                )

            raw_json = clean_json_response(
                response.text
            )

            data = json.loads(
                raw_json
            )

            analysis = ClothingAnalysis.model_validate(
                data
            )

            analysis.cv_features = (
                CVFeatures.model_validate(
                    cv_features
                )
            )

            return analysis

        except Exception as exc:
            print(
                f"\n[GEMINI ATTEMPT {attempt + 1} FAILED]"
            )
            print(
                f"Error type: {type(exc).__name__}"
            )
            print(
                f"Error: {exc}"
            )

            last_error = exc

            error_text = str(exc).upper()

            # Do not retry quota/rate-limit failures.
            if (
                "429" in error_text
                or "RESOURCE_EXHAUSTED" in error_text
                or "QUOTA" in error_text
            ):
                print(
                    "[GEMINI QUOTA EXHAUSTED - "
                    "SKIPPING RETRIES]"
                )
                break

            if attempt < MAX_RETRIES:
                time.sleep(2 ** attempt)
            else:
                break

    raise RuntimeError(
        "Gemini analysis failed after retries."
    ) from last_error


def build_cv_fallback(
    cv_features: dict,
) -> ClothingAnalysis:

    color = (
        cv_features.get(
            "dominant_color"
        )
        or "fashion"
    )

    search_terms = [
        f"{color} clothing",
        f"{color} fashion",
        f"{color} outfit",
    ]

    return ClothingAnalysis(
        category="clothing",
        color=color,

        visual_features=[
            "Detected using computer vision",
            f"Dominant color: {color}",
            (
                f"Brightness: "
                f"{cv_features.get('brightness')}"
            ),
            (
                f"Edge density: "
                f"{cv_features.get('edge_density')}"
            ),
        ],

        search_terms=search_terms,

        cv_features=CVFeatures.model_validate(
            cv_features
        ),
    )


def analyze_clothing(
    image_bytes: bytes,
) -> ClothingAnalysis:

    cv_features = extract_cv_features(
        image_bytes
    )

    try:

        return analyze_with_gemini(
            image_bytes,
            cv_features,
        )

    except Exception as exc:

        print(
            "\n[GEMINI ANALYSIS FAILED]"
        )

        print(
            f"Error type: {type(exc).__name__}"
        )

        print(
            f"Error: {exc}"
        )

        print(
            "[USING CV FALLBACK]\n"
        )

        return build_cv_fallback(
            cv_features
        )