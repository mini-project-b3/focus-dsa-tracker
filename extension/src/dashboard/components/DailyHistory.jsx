function DailyHistory() {
  const history = [
    {
      date: "31 May",
      productivity: "82%",
      confidence: "76%",
    },
    {
      date: "30 May",
      productivity: "75%",
      confidence: "80%",
    },
    {
      date: "29 May",
      productivity: "68%",
      confidence: "71%",
    },
  ];

  return (
    <div className="card">
      <h3>📅 Daily History</h3>

      <table className="history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Productivity</th>
            <th>Confidence</th>
          </tr>
        </thead>

        <tbody>
          {history.map((item, index) => (
            <tr key={index}>
              <td>{item.date}</td>
              <td>{item.productivity}</td>
              <td>{item.confidence}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DailyHistory;