function ConfidenceMeter({ score }) {
  return (
    <div className="card">
      <h3>Confidence Score</h3>

      <progress
        value={score}
        max="100"
        style={{
          width: "100%",
          accentColor: "#f85a0e",
          height: "14px"
        }}
      />

      <p>{score}%</p>
    </div>
  );
}

export default ConfidenceMeter;