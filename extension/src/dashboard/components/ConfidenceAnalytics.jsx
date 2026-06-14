function ConfidenceAnalytics() {
  return (
    <div className="card">
      <h3>🎯 Confidence Analytics</h3>

      <div className="confidence-grid">

        <div className="confidence-box">
          <h4>Successful Attempts</h4>
          <p>38</p>
        </div>

        <div className="confidence-box">
          <h4>Retry Count</h4>
          <p>12</p>
        </div>

        <div className="confidence-box">
          <h4>Avg Solve Time</h4>
          <p>24 min</p>
        </div>

        <div className="confidence-box">
          <h4>Confidence Score</h4>
          <p>76%</p>
        </div>

      </div>
    </div>
  );
}

export default ConfidenceAnalytics;