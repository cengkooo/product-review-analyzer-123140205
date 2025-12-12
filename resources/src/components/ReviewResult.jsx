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
      <h2 style={{ marginBottom: 'var(--spacing-md)', color: '#1a0f08', fontWeight: '900', textShadow: '1px 1px 2px rgba(255,255,255,0.5)' }}>
        📊 Analysis Results
      </h2>
      
      {/* Sentiment Section */}
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h3 style={{ 
          fontSize: '1.1rem', 
          marginBottom: 'var(--spacing-sm)', 
          color: '#2C1810',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '1px'
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
            color: '#2C1810', 
            fontWeight: '700',
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
          color: '#2C1810',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          Key Points
        </h3>
        {result.key_points && result.key_points.length > 0 ? (
          <ul className="key-points">
            {result.key_points.map((point, index) => (
              <li key={index} className="key-point-item">
                <span style={{ color: 'var(--naruto-orange)', marginRight: 'var(--spacing-xs)', fontWeight: '900' }}>
                  ▸
                </span>
                {point}
              </li>
            ))}
          </ul>
        ) : (
          <div style={{ 
            padding: 'var(--spacing-md)', 
            background: 'rgba(255, 182, 39, 0.2)', 
            borderRadius: 'var(--radius-md)',
            color: '#4A2C1A',
            textAlign: 'center',
            fontWeight: '600',
            border: '2px dashed var(--naruto-orange)'
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
          color: '#2C1810',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          Original Review
        </h3>
        <div style={{ 
          padding: 'var(--spacing-md)', 
          background: 'rgba(255, 255, 255, 0.6)', 
          borderRadius: 'var(--radius-md)',
          color: '#1a0f08',
          lineHeight: '1.6',
          fontWeight: '500',
          fontStyle: 'italic',
          border: '2px solid var(--border-scroll)'
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
