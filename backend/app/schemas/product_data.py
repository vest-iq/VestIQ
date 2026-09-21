from typing import Optional

from pydantic import BaseModel, Field


class ProductExtraction(BaseModel):
    methods_used: list[str] = Field(
        default_factory=list
    )

    confidence: float = 0.0

    warnings: list[str] = Field(
        default_factory=list
    )


class ProductData(BaseModel):
    # ---------------------------------------------------------
    # Identity
    # ---------------------------------------------------------
    name: Optional[str] = None
    brand: Optional[str] = None
    category: Optional[str] = None
    product_url: str
    source: Optional[str] = None

    # ---------------------------------------------------------
    # Commerce
    # ---------------------------------------------------------
    price: Optional[float] = None
    currency: Optional[str] = None
    availability: Optional[str] = None

    # ---------------------------------------------------------
    # Visual / clothing information
    # ---------------------------------------------------------
    image_url: Optional[str] = None
    color: Optional[str] = None
    pattern: Optional[str] = None
    material: Optional[str] = None
    fit: Optional[str] = None

    # ---------------------------------------------------------
    # Description
    # ---------------------------------------------------------
    description: Optional[str] = None

    # ---------------------------------------------------------
    # Extraction diagnostics
    # ---------------------------------------------------------
    extraction: ProductExtraction = Field(
        default_factory=ProductExtraction
    )