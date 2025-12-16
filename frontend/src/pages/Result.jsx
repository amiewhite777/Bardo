import './Result.css';

export default function Result({ result, onRestart }) {
  if (!result) {
    return <div>Loading results...</div>;
  }

  return (
    <div className="result-container">
      <div className="result-header">
        <h1>Your Result</h1>
        <p className="confidence">Confidence: {result.confidence}%</p>
      </div>

      <div className="result-card main-result">
        <h2>Your Form</h2>
        <div className="form-name">{result.form}</div>
        <div className="realm-info">
          <span className="realm-label">Realm:</span>
          <span className="realm-value">{result.realm}</span>
        </div>
        <div className="subcategory-info">
          <span className="subcategory-label">Subcategory:</span>
          <span className="subcategory-value">{result.subcategory}</span>
        </div>
      </div>

      <div className="result-card scores">
        <h3>Realm Scores</h3>
        <div className="scores-grid">
          {Object.entries(result.realmScores).map(([realm, score]) => (
            <div key={realm} className="score-item">
              <span className="score-realm">{realm}</span>
              <div className="score-bar-container">
                <div 
                  className="score-bar" 
                  style={{ width: `${(score / 100) * 100}%` }}
                ></div>
              </div>
              <span className="score-value">{score.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>

      {result.shadowFlags && result.shadowFlags.length > 0 && (
        <div className="result-card shadow-flags">
          <h3>Shadow Patterns Detected</h3>
          <div className="flags-container">
            {result.shadowFlags.map((flag, index) => (
              <span key={index} className="shadow-flag">
                {flag.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
          <p className="shadow-info">
            These patterns indicate areas where your self-perception may differ
            from your behavioral patterns.
          </p>
        </div>
      )}

      <div className="result-card additional-info">
        <h3>Consistency & Balance</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Response Consistency</span>
            <span className="info-value">{result.consistency}%</span>
          </div>
          <div className="info-item">
            <span className="info-label">Shadow Gap</span>
            <span className="info-value">{result.shadowGap.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      <button className="restart-button" onClick={onRestart}>
        Take Again
      </button>
    </div>
  );
}
