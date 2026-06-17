function WeeklySummary() {
  const stats = [
    {
      title: "Study Time",
      value: "32 hrs",
      icon: "⏱",
    },
    {
      title: "Problems Solved",
      value: "48",
      icon: "🧩",
    },
    {
      title: "Avg Productivity",
      value: "78%",
      icon: "📈",
    },
    {
      title: "Avg Confidence",
      value: "74%",
      icon: "🎯",
    },
  ];

  return (
    <div className="card">
      <h3>📊 Weekly Summary</h3>

      <div className="weekly-grid">
        {stats.map((item, index) => (
          <div key={index} className="summary-card">
            <h4>
              {item.icon} {item.title}
            </h4>

            <p>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeeklySummary;