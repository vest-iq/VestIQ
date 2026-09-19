from typing import List, Optional

from pydantic import BaseModel, Field


class CVFeatures(BaseModel):
    dominant_color: Optional[str] = None
    brightness: Optional[float] = None
    saturation: Optional[float] = None
    edge_density: Optional[float] = None
    aspect_ratio: Optional[float] = None


class ClothingAnalysis(BaseModel):
    category: str = "clothing"
    sub_category: Optional[str] = None
    color: Optional[str] = None
    pattern: Optional[str] = None
    material: Optional[str] = None
    fit: Optional[str] = None
    gender: Optional[str] = None
    style: Optional[str] = None

    visual_features: List[str] = Field(
        default_factory=list
    )

    search_terms: List[str] = Field(
        default_factory=list
    )

    cv_features: Optional[CVFeatures] = None


class ProductResult(BaseModel):
    name: str
    product_url: str

    brand: Optional[str] = None
    price: Optional[float] = None
    currency: Optional[str] = None

    rating: Optional[float] = None
    review_count: Optional[int] = None

    image_url: Optional[str] = None
    source: Optional[str] = None