function ScoreCard({ title, value }) {

  const getColor = (value) => {
    if (value === "Low") return "#22c55e";
    if (value === "Medium") return "#facc15";
    if (value === "High") return "#ef4444";

    return "#ffffff";
  };

  return (
    <div className="card">
      <h3>{title}</h3>

      <p
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          color: getColor(value),
        }}
      >
        {value}
      </p>
    </div>
  );
}

export default ScoreCard;