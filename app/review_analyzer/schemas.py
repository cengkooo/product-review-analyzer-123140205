"""Pydantic schemas for request/response validation."""
from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from datetime import datetime


class AnalyzeReviewRequest(BaseModel):
    """Request schema for analyzing a review."""
    
    review_text: str = Field(
        ...,
        min_length=10,
        max_length=5000,
        description="The product review text to analyze"
    )
    
    @field_validator('review_text')
    @classmethod
    def validate_review_text(cls, v):
        """Validate review text is not just whitespace."""
        if not v or not v.strip():
            raise ValueError('Review text cannot be empty or just whitespace')
        return v.strip()


class AnalyzeReviewResponse(BaseModel):
    """Response schema for review analysis."""
    
    id: int
    review_text: str
    sentiment: str  # positive, neutral, negative
    sentiment_score: float  # confidence 0-1
    key_points: List[str]
    created_at: str  # ISO format datetime
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "review_text": "This product is amazing!",
                "sentiment": "positive",
                "sentiment_score": 0.9876,
                "key_points": [
                    "Excellent product quality",
                    "Highly satisfied with purchase"
                ],
                "created_at": "2025-12-12T19:30:00+07:00"
            }
        }


class ReviewListItem(BaseModel):
    """Schema for a single review in the list."""
    
    id: int
    review_text: str
    sentiment: str
    sentiment_score: float
    key_points: List[str]
    created_at: str


class ReviewListResponse(BaseModel):
    """Response schema for list of reviews."""
    
    reviews: List[ReviewListItem]
    total: int
    page: int = 1
    limit: int = 10
    
    class Config:
        json_schema_extra = {
            "example": {
                "reviews": [
                    {
                        "id": 1,
                        "review_text": "Great product!",
                        "sentiment": "positive",
                        "sentiment_score": 0.95,
                        "key_points": ["High quality", "Fast shipping"],
                        "created_at": "2025-12-12T19:30:00+07:00"
                    }
                ],
                "total": 1,
                "page": 1,
                "limit": 10
            }
        }


class HealthCheckResponse(BaseModel):
    """Response schema for health check."""
    
    status: str
    message: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "status": "ok",
                "message": "Review Analyzer API is running"
            }
        }
