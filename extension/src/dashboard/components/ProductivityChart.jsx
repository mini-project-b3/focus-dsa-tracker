import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { day: "Mon", score: 60 },
  { day: "Tue", score: 70 },
  { day: "Wed", score: 75 },
  { day: "Thu", score: 68 },
  { day: "Fri", score: 82 },
  { day: "Sat", score: 85 },
  { day: "Sun", score: 78 },
];

function ProductivityChart() {
  return (
    <div className="card">
      <h3>📈 Productivity Trend</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="score"
            stroke="#f85a0e"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ProductivityChart;