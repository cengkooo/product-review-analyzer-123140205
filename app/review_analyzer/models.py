"""Database models for the review analyzer."""
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, JSON
from sqlalchemy.sql import func
from .db import Base


class Review(Base):
    """Model for storing product reviews and their analysis."""
    
    __tablename__ = 'reviews'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    review_text = Column(Text, nullable=False)
    sentiment = Column(String(20), nullable=False)  # positive, neutral, negative
    sentiment_score = Column(Float, nullable=False)  # confidence score 0-1
    key_points = Column(JSON, nullable=True)  # list of key points from Gemini
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    def __repr__(self):
        return f"<Review(id={self.id}, sentiment='{self.sentiment}', score={self.sentiment_score})>"
    
    def to_dict(self):
        """Convert model to dictionary for JSON serialization."""
        return {
            'id': self.id,
            'review_text': self.review_text,
            'sentiment': self.sentiment,
            'sentiment_score': round(self.sentiment_score, 4),
            'key_points': self.key_points or [],
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
