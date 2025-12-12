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
        <div style={{ textAlign: 'center', padding: 'var(--spacing-lg)', color: 'var(--text-muted)' }}>
          <span className="spinner" style={{ width: '40px', height: '40px', borderWidth: '4px' }}></span>
          <p style={{ marginTop: 'var(--spacing-md)' }}>Loading reviews...</p>
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
          color: 'var(--text-muted)' 
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
        <h2 style={{ color: 'var(--text-primary)' }}>
          📚 Review History
        </h2>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {total} total review{total !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        {reviews.map((review) => (
          <div 
            key={review.id} 
            style={{
              padding: 'var(--spacing-md)',
              background: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(4px)';
              e.currentTarget.style.boxShadow = '0 4px 8px var(--shadow)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.boxShadow = 'none';
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
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {formatDate(review.created_at)}
              </span>
            </div>
            
            <p style={{ 
              color: 'var(--text-primary)', 
              marginBottom: 'var(--spacing-sm)',
              lineHeight: '1.5'
            }}>
              "{truncateText(review.review_text)}"
            </p>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--spacing-sm)',
              fontSize: '0.9rem',
              color: 'var(--text-secondary)'
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
          
          <span style={{ color: 'var(--text-secondary)' }}>
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
