import { useState } from 'react';
import ReviewForm from './components/ReviewForm';
import ReviewResult from './components/ReviewResult';
import ReviewHistory from './components/ReviewHistory';
import { analyzeReview } from './api/client';
import './index.css';

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAnalyzeReview = async (reviewText) => {
    setIsAnalyzing(true);
    setError(null);
    setCurrentResult(null);

    const result = await analyzeReview(reviewText);

    if (result.success) {
      setCurrentResult(result.data);
      // Trigger refresh of review history
      setRefreshTrigger(prev => prev + 1);
    } else {
      setError(result.error);
    }

    setIsAnalyzing(false);
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <h1>🔍 Product Review Analyzer</h1>
        <p>Analyze product reviews with AI-powered sentiment analysis and key insights</p>
      </header>

      {/* Main Content */}
      <div className="grid grid-2">
        {/* Left Column - Form */}
        <div>
          <ReviewForm onSubmit={handleAnalyzeReview} isLoading={isAnalyzing} />
          
          {/* Error Display */}
          {error && (
            <div className="card fade-in">
              <div className="error-message">
                <strong>Error:</strong> {error}
              </div>
            </div>
          )}
          
          {/* Result Display */}
          {currentResult && <ReviewResult result={currentResult} />}
        </div>

        {/* Right Column - History */}
        <div>
          <ReviewHistory refreshTrigger={refreshTrigger} />
        </div>
      </div>

      {/* Footer */}
      <footer style={{ 
        textAlign: 'center', 
        marginTop: 'var(--spacing-xl)', 
        padding: 'var(--spacing-lg)',
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--border)'
      }}>
        <p>Powered by Hugging Face Sentiment Analysis & Google Gemini AI</p>
      </footer>
    </div>
  );
}

export default App;
