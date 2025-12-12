import { useState, useEffect } from 'react';
import { getReviews } from '../api/client';

const ReviewHistory = ({ refreshTrigger }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 5;

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    
    const result = await getReviews(page, limit);
    
    if (result.success) {
      setReviews(result.data.reviews);
      setTotal(result.data.total);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, [page, refreshTrigger]);

  const getSentimentColor = (sentiment) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return 'sentiment-positive';
      case 'negative':
        return 'sentiment-negative';
      case 'neutral':
        return 'sentiment-neutral';
      default:
        return 'sentiment-neutral';
    }
  };

  const getSentimentEmoji = (sentiment) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return '😊';
      case 'negative':
        return '😞';
      case 'neutral':
        return '😐';
      default:
        return '🤔';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const totalPages = Math.ceil(total / limit);

  if (loading && reviews.length === 0) {
    return (
      <div className="card">
        <div style={{ textAlign: 'center', padding: 'var(--spacing-lg)', color: '#4A2C1A' }}>
          <span className="spinner" style={{ width: '40px', height: '40px', borderWidth: '4px' }}></span>
          <p style={{ marginTop: 'var(--spacing-md)', fontWeight: '600' }}>Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="error-message">
          Failed to load reviews: {error}
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="card">
        <div style={{ 
          textAlign: 'center', 
          padding: 'var(--spacing-xl)', 
          color: '#4A2C1A',
          fontWeight: '600'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>📭</div>
          <p>No reviews yet. Analyze your first review above!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card fade-in">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 'var(--spacing-md)' 
      }}>
        <h2 style={{ color: '#1a0f08', fontWeight: '900', textShadow: '1px 1px 2px rgba(255,255,255,0.5)' }}>
          📚 Review History
        </h2>
        <span style={{ color: '#4A2C1A', fontSize: '0.9rem', fontWeight: '600' }}>
          {total} total review{total !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        {reviews.map((review) => (
          <div 
            key={review.id} 
            style={{
              padding: 'var(--spacing-md)',
              background: 'rgba(255, 255, 255, 0.5)',
              borderRadius: 'var(--radius-md)',
              border: '2px solid var(--border-scroll)',
              transition: 'transform 0.2s, box-shadow 0.2s, background 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(4px)';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(255, 107, 53, 0.3)';
              e.currentTarget.style.background = 'rgba(255, 182, 39, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
            }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              marginBottom: 'var(--spacing-sm)'
            }}>
              <span className={`sentiment-badge ${getSentimentColor(review.sentiment)}`}>
                {getSentimentEmoji(review.sentiment)} {review.sentiment}
              </span>
              <span style={{ color: '#4A2C1A', fontSize: '0.85rem', fontWeight: '500' }}>
                {formatDate(review.created_at)}
              </span>
            </div>
            
            <p style={{ 
              color: '#1a0f08', 
              marginBottom: 'var(--spacing-sm)',
              lineHeight: '1.5',
              fontWeight: '500'
            }}>
              "{truncateText(review.review_text)}"
            </p>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--spacing-sm)',
              fontSize: '0.9rem',
              color: '#2C1810',
              fontWeight: '600'
            }}>
              <span>Confidence: {(review.sentiment_score * 100).toFixed(1)}%</span>
              {review.key_points && review.key_points.length > 0 && (
                <>
                  <span>•</span>
                  <span>{review.key_points.length} key point{review.key_points.length !== 1 ? 's' : ''}</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          gap: 'var(--spacing-sm)',
          marginTop: 'var(--spacing-lg)'
        }}>
          <button
            className="btn btn-secondary"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
          >
            ← Previous
          </button>
          
          <span style={{ color: '#2C1810', fontWeight: '700' }}>
            Page {page} of {totalPages}
          </span>
          
          <button
            className="btn btn-secondary"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewHistory;
