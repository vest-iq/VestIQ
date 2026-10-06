import os
from typing import Any, Dict

from dotenv import load_dotenv

load_dotenv()

from groq import Groq


MODEL_NAME = "qwen/qwen3.8-27b"


def build_explanation_prompt(
    compatibility: str,
    clothing_category: str,
    style_profile: Dict[str, Any],
    recommendations: Dict[str, Any],
) -> str:
    """
    Build a controlled prompt for the VLM.

    The VLM explains structured StyleMirror results.
    It does not make independent fashion decisions.
    """

    styles = [
        item["style"]
        for item in style_profile.get("styles", [])
    ]

    footwear = [
        item["item"]
        for item in recommendations.get("footwear", [])
    ]

    accessories = [
        item["item"]
        for item in recommendations.get("accessories", [])
    ]

    layering = [
        item["item"]
        for item in recommendations.get("layering", [])
    ]

    pairing = [
        item["item"]
        for item in recommendations.get("pairing", [])
    ]

    return f"""
You are the explanation assistant for StyleMirror, an AI fashion assistant.

Your job is to explain the structured results produced by StyleMirror.

IMPORTANT RULES:
- Do not invent recommendations.
- Only mention clothing items explicitly provided below.
- Do not change the compatibility assessment.
- Do not claim exact probabilities or measurements.
- Do not make comments about the user's body, attractiveness, health, or worth.
- Keep the explanation concise and practical.
- Explain why the provided recommendations fit the detected style.
- If a recommendation category is empty, do not invent items for it.

STRUCTURED ANALYSIS:

Clothing category:
{clothing_category}

Compatibility:
{compatibility}

Detected style signals:
{", ".join(styles) if styles else "None"}

Pairing recommendations:
{", ".join(pairing) if pairing else "None"}

Footwear recommendations:
{", ".join(footwear) if footwear else "None"}

Accessory recommendations:
{", ".join(accessories) if accessories else "None"}

Layering recommendations:
{", ".join(layering) if layering else "None"}

Write a short, natural explanation for the user.
""".strip()


def create_groq_client() -> Groq:
    """Create the Groq client using the environment API key."""

    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        raise RuntimeError(
            "GROQ_API_KEY is not configured."
        )

    return Groq(api_key=api_key)


def generate_explanation(
    compatibility: str,
    clothing_category: str,
    style_profile: Dict[str, Any],
    recommendations: Dict[str, Any],
) -> str:
    """
    Generate the final natural-language explanation using Groq.
    """

    prompt = build_explanation_prompt(
        compatibility=compatibility,
        clothing_category=clothing_category,
        style_profile=style_profile,
        recommendations=recommendations,
    )

    client = create_groq_client()

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are StyleMirror's explanation assistant. "
                    "Follow the provided structured analysis exactly."
                ),
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        temperature=0.3,
        max_completion_tokens=200,
    )

    return response.choices[0].message.content.strip()


def prepare_vlm_input(
    compatibility: str,
    clothing_category: str,
    style_profile: Dict[str, Any],
    recommendations: Dict[str, Any],
) -> Dict[str, Any]:
    """
    Prepare structured data for the VLM layer.
    """

    prompt = build_explanation_prompt(
        compatibility=compatibility,
        clothing_category=clothing_category,
        style_profile=style_profile,
        recommendations=recommendations,
    )

    return {
        "prompt": prompt,
        "metadata": {
            "clothing_category": clothing_category,
            "compatibility": compatibility,
            "style_profile": style_profile,
            "recommendations": recommendations,
        },
    }