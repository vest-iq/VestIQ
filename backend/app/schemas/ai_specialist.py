from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


class AICompatibilityResponse(BaseModel):
    prediction: int
    score: float
    feature_dimension: int
    num_items: int
    interpretation: str


class AIClothingCandidate(BaseModel):
    category: str
    score: float


class AIClothingProfileResponse(BaseModel):
    primary_category: str
    confidence: float
    candidates: list[AIClothingCandidate]
    method: str


class AIRecommendationItem(BaseModel):
    item: str
    supported_by: list[str]


class AIRecommendationsResponse(BaseModel):
    pairing: list[AIRecommendationItem]
    footwear: list[AIRecommendationItem]
    accessories: list[AIRecommendationItem]
    layering: list[AIRecommendationItem]


class AIRecommendationsContainer(BaseModel):
    clothing_category: str
    recommendations: AIRecommendationsResponse


class AIStyleProfileResponse(BaseModel):
    styles: list[dict[str, Any]]
    source: str


class AISpecialistMetadataResponse(BaseModel):
    embedding_dimension: int
    compatibility_feature_dimension: int
    num_items: int


class AISpecialistResponse(BaseModel):
    compatibility: AICompatibilityResponse
    style_profile: AIStyleProfileResponse
    clothing_profile: AIClothingProfileResponse
    recommendations: AIRecommendationsContainer
    explanation: str
    metadata: AISpecialistMetadataResponse