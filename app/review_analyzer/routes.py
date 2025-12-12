"""Route configuration for the Review Analyzer API."""


def includeme(config):
    """
    Configure routes for the application.
    
    This is called by Pyramid when including this module.
    """
    # Health check endpoint
    config.add_route('health', '/api/health')
    
    # Review analysis endpoint
    config.add_route('analyze_review', '/api/analyze-review')
    
    # Get all reviews endpoint
    config.add_route('get_reviews', '/api/reviews')
