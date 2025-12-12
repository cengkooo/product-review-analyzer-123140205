import { useState } from 'react';
import PropTypes from 'prop-types';

const ReviewForm = ({ onSubmit, isLoading }) => {
  const [reviewText, setReviewText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!reviewText.trim()) {
      setError('Please enter a review');
      return;
    }
    
    if (reviewText.trim().length < 10) {
      setError('Review must be at least 10 characters long');
      return;
    }
    
    if (reviewText.trim().length > 5000) {
      setError('Review must be less than 5000 characters');
      return;
    }
    
    setError('');
    onSubmit(reviewText.trim());
  };

  const handleChange = (e) => {
    setReviewText(e.target.value);
    if (error) setError('');
  };

  return (
    <div className="card fade-in">
      <h2 style={{ marginBottom: 'var(--spacing-md)', color: 'var(--text-primary)' }}>
        📝 Analyze Product Review
      </h2>
      
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="review-text" className="form-label">
            Enter your product review
          </label>
          <textarea
            id="review-text"
            className="form-textarea"
            value={reviewText}
            onChange={handleChange}
            placeholder="Share your experience with this product... (minimum 10 characters)"
            disabled={isLoading}
          />
          <div style={{ 
            marginTop: 'var(--spacing-xs)', 
            color: 'var(--text-muted)', 
            fontSize: '0.9rem' 
          }}>
            {reviewText.length} / 5000 characters
          </div>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={isLoading || !reviewText.trim()}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Analyzing...
            </>
          ) : (
            <>
              🔍 Analyze Review
            </>
          )}
        </button>
      </form>
    </div>
  );
};

ReviewForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
};

ReviewForm.defaultProps = {
  isLoading: false
};

export default ReviewForm;
