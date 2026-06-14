import "./dashboard.css";

import useSessionData from "../hooks/useSessionData";
import AILearningAssistant from "./components/AILearningAssistant";
import ConfidenceAnalytics from "./components/ConfidenceAnalytics";
import BurnoutInsights from "./components/BurnoutInsights";
import WeeklySummary from "./components/WeeklySummary";
import Sidebar from "./components/Sidebar";
import DailyHistory from "./components/DailyHistory";
import ScoreCard from "./components/ScoreCard";
import ConfidenceMeter from "./components/ConfidenceMeter";
import BurnoutAlert from "./components/BurnoutAlert";
import ProductivityChart from "./components/ProductivityChart";


function Dashboard() {
  const session = useSessionData();

  return (
    <div className="layout">
      <Sidebar />

      <div className="main-content">
        <div className="dashboard">
          <h1>🧠 FOCUS Smart DSA Study Tracker</h1>

          <p className="subtitle">
            Track your coding productivity and focus analytics
          </p>

          <div className="score-container">
            <ScoreCard
              title="⚡ Productivity"
              value={`${session.productivity}%`}
            />

            <ScoreCard
              title="🔥 Burnout Risk"
              value={session.burnout}
            />

            <ScoreCard
              title="🎯 Confidence"
              value={`${session.confidence}%`}
            />
          </div>

          <ProductivityChart />
          <WeeklySummary />
          <BurnoutInsights />
          <ConfidenceAnalytics />

          <ConfidenceMeter
            score={session.confidence}
          />

          <BurnoutAlert />
          <AILearningAssistant />
          <DailyHistory />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;