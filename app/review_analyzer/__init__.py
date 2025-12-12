"""Main Pyramid application initialization."""
from pyramid.config import Configurator
from dotenv import load_dotenv
import os


def add_cors_headers(event):
    """Add CORS headers to all responses."""
    response = event.response
    response.headers.update({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '3600',
    })


def main(global_config, **settings):
    """
    This function returns a Pyramid WSGI application.
    """
    # Load environment variables
    load_dotenv()
    
    # Create Pyramid configurator
    config = Configurator(settings=settings)
    
    # Add CORS support
    config.add_subscriber(add_cors_headers, 'pyramid.events.NewResponse')
    
    # Include database configuration
    config.include('.db')
    
    # Include routes
    config.include('.routes')
    
    # Scan for view decorators
    config.scan('.views')
    
    # Create database tables
    from .db import Base, engine
    from .models import Review  # Import models to register them
    Base.metadata.create_all(engine)
    print("Database tables created successfully!")
    
    return config.make_wsgi_app()
