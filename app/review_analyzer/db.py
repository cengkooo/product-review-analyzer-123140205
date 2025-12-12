"""Database configuration and session management."""
import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get database URL from environment
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/reviewdb')

# Create SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,  # Verify connections before using
    echo=False  # Set to True for SQL query logging
)

# Create session factory
session_factory = sessionmaker(bind=engine)
Session = scoped_session(session_factory)

# Base class for all models
Base = declarative_base()


def get_session_factory(settings):
    """Get session factory for Pyramid integration."""
    return session_factory


def get_engine(settings):
    """Get engine for Pyramid integration."""
    return engine


def includeme(config):
    """
    Initialize the database for a Pyramid app.
    
    Activate this setup using ``config.include('review_analyzer.db')``.
    """
    # Add a request method to get a database session
    config.add_request_method(
        lambda request: Session(),
        'dbsession',
        reify=True
    )
    
    # Register a finished callback to close the session
    config.add_finished_callback(lambda request: request.dbsession.close())
