"""View handlers for the Review Analyzer API."""
from pyramid.view import view_config
from pyramid.response import Response
import json
from pydantic import ValidationError

from .models import Review
from .schemas import (
    AnalyzeReviewRequest,
    AnalyzeReviewResponse,
    ReviewListResponse,
    HealthCheckResponse
)
from .services.sentiment import analyze_sentiment
from .services.gemini import extract_key_points


@view_config(route_name='health', renderer='json', request_method='GET')
def health_check(request):
    """Health check endpoint."""
    return {
        'status': 'ok',
        'message': 'Review Analyzer API is running'
    }


@view_config(route_name='analyze_review', renderer='json', request_method='POST')
def analyze_review(request):
    """
    Analyze a product review.
    
    Performs sentiment analysis and extracts key points.
    """
    try:
        # Parse request body
        try:
            body = request.json_body
        except Exception:
            return Response(
                json.dumps({'error': 'Invalid JSON in request body'}),
                status=400,
                content_type='application/json'
            )
        
        # Validate request using Pydantic
        try:
            review_request = AnalyzeReviewRequest(**body)
        except ValidationError as e:
            return Response(
                json.dumps({'error': 'Validation error', 'details': e.errors()}),
                status=400,
                content_type='application/json'
            )
        
        review_text = review_request.review_text
        
        # Step 1: Analyze sentiment using Hugging Face
        sentiment_result = analyze_sentiment(review_text)
        sentiment = sentiment_result['sentiment']
        sentiment_score = sentiment_result['score']
        
        # Step 2: Extract key points using Gemini
        key_points = extract_key_points(review_text)
        
        # Step 3: Save to database
        review = Review(
            review_text=review_text,
            sentiment=sentiment,
            sentiment_score=sentiment_score,
            key_points=key_points
        )
        
        request.dbsession.add(review)
        request.dbsession.commit()
        request.dbsession.refresh(review)
        
        # Return response
        response_data = review.to_dict()
        return response_data
    
    except Exception as e:
        # Rollback on error
        request.dbsession.rollback()
        print(f"Error in analyze_review: {e}")
        return Response(
            json.dumps({'error': 'Internal server error', 'message': str(e)}),
            status=500,
            content_type='application/json'
        )


@view_config(route_name='get_reviews', renderer='json', request_method='GET')
def get_reviews(request):
    """
    Get all reviews with pagination.
    
    Query parameters:
    - page: Page number (default: 1)
    - limit: Items per page (default: 10, max: 100)
    """
    try:
        # Get pagination parameters
        page = int(request.params.get('page', 1))
        limit = int(request.params.get('limit', 10))
        
        # Validate parameters
        if page < 1:
            page = 1
        if limit < 1:
            limit = 10
        if limit > 100:
            limit = 100
        
        # Calculate offset
        offset = (page - 1) * limit
        
        # Query database
        query = request.dbsession.query(Review).order_by(Review.created_at.desc())
        total = query.count()
        reviews = query.offset(offset).limit(limit).all()
        
        # Convert to dict
        reviews_data = [review.to_dict() for review in reviews]
        
        return {
            'reviews': reviews_data,
            'total': total,
            'page': page,
            'limit': limit
        }
    
    except ValueError as e:
        return Response(
            json.dumps({'error': 'Invalid pagination parameters'}),
            status=400,
            content_type='application/json'
        )
    except Exception as e:
        print(f"Error in get_reviews: {e}")
        return Response(
            json.dumps({'error': 'Internal server error', 'message': str(e)}),
            status=500,
            content_type='application/json'
        )
