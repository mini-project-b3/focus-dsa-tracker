function AILearningAssistant() {
  return (
    <div className="card">
      <h3>🤖 AI Learning Assistant</h3>

      <div className="ai-container">

        <div className="ai-item">
          <h4>Current Problem</h4>
          <p>Two Sum</p>
        </div>

        <div className="ai-item">
          <h4>Difficulty</h4>
          <p>Easy</p>
        </div>

        <div className="ai-item">
          <h4>Time Stuck</h4>
          <p>18 mins</p>
        </div>

        <div className="ai-item full-width">
          <h4>AI Hint</h4>

          <p>
            Think about storing previously seen
            numbers so you can quickly check
            whether the required complement exists.
          </p>
        </div>

      </div>
    </div>
  );
}

export default AILearningAssistant;