import PropTypes from 'prop-types';

const ReviewResult = ({ result }) => {
  if (!result) return null;

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

  const formatScore = (score) => {
    return (score * 100).toFixed(1);
  };

  return (
    <div className="card fade-in">
      <h2 style={{ marginBottom: 'var(--spacing-md)', color: 'var(--text-primary)' }}>
        📊 Analysis Results
      </h2>
      
      {/* Sentiment Section */}
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h3 style={{ 
          fontSize: '1.1rem', 
          marginBottom: 'var(--spacing-sm)', 
          color: 'var(--text-secondary)' 
        }}>
          Sentiment
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
          <span className={`sentiment-badge ${getSentimentColor(result.sentiment)}`}>
            {getSentimentEmoji(result.sentiment)} {result.sentiment}
          </span>
          <div style={{ 
            flex: 1, 
            background: 'var(--bg-tertiary)', 
            borderRadius: 'var(--radius-lg)', 
            height: '12px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${formatScore(result.sentiment_score)}%`,
              height: '100%',
              background: result.sentiment === 'positive' 
                ? 'var(--success)' 
                : result.sentiment === 'negative' 
                ? 'var(--danger)' 
                : 'var(--warning)',
              transition: 'width 0.5s ease-out'
            }} />
          </div>
          <span style={{ 
            color: 'var(--text-secondary)', 
            fontWeight: '600',
            minWidth: '60px',
            textAlign: 'right'
          }}>
            {formatScore(result.sentiment_score)}%
          </span>
        </div>
      </div>
      
      {/* Key Points Section */}
      <div>
        <h3 style={{ 
          fontSize: '1.1rem', 
          marginBottom: 'var(--spacing-sm)', 
          color: 'var(--text-secondary)' 
        }}>
          Key Points
        </h3>
        {result.key_points && result.key_points.length > 0 ? (
          <ul className="key-points">
            {result.key_points.map((point, index) => (
              <li key={index} className="key-point-item">
                <span style={{ color: 'var(--primary)', marginRight: 'var(--spacing-xs)' }}>
                  ▸
                </span>
                {point}
              </li>
            ))}
          </ul>
        ) : (
          <div style={{ 
            padding: 'var(--spacing-md)', 
            background: 'var(--bg-tertiary)', 
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-muted)',
            textAlign: 'center'
          }}>
            ℹ️ No key points extracted (Gemini API may be unavailable)
          </div>
        )}
      </div>
      
      {/* Review Text */}
      <div style={{ marginTop: 'var(--spacing-lg)' }}>
        <h3 style={{ 
          fontSize: '1.1rem', 
          marginBottom: 'var(--spacing-sm)', 
          color: 'var(--text-secondary)' 
        }}>
          Original Review
        </h3>
        <div style={{ 
          padding: 'var(--spacing-md)', 
          background: 'var(--bg-tertiary)', 
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-primary)',
          lineHeight: '1.6'
        }}>
          "{result.review_text}"
        </div>
      </div>
    </div>
  );
};

ReviewResult.propTypes = {
  result: PropTypes.shape({
    id: PropTypes.number,
    review_text: PropTypes.string.isRequired,
    sentiment: PropTypes.string.isRequired,
    sentiment_score: PropTypes.number.isRequired,
    key_points: PropTypes.arrayOf(PropTypes.string),
    created_at: PropTypes.string
  })
};

export default ReviewResult;
