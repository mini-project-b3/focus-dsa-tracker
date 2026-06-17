import "./Popup.css";
import useSessionData from "../hooks/useSessionData";

function Popup() {
  const session = useSessionData();

  return (
    <div className="popup">
      <h2>🤖 FOCUS</h2>

      <div className="popup-card">
        <h4>Current Problem</h4>
        <p>{session.problem}</p>
      </div>

      <div className="popup-card">
        <h4>Productivity Score</h4>
        <p>{session.productivity}%</p>
      </div>

      <div className="popup-card">
        <h4>Difficulty</h4>
        <p>{session.difficulty}</p>
      </div>

      <div className="popup-card">
        <h4>Focus Time</h4>
        <p>{session.focusTime} min</p>
      </div>

      <div className="popup-card">
        <h4>Tab Switches</h4>
        <p>{session.tabSwitches}</p>
      </div>

      <div className="popup-card">
        <h4>AI Hint</h4>
        <p>{session.hint}</p>
      </div>

      <button className="dashboard-btn">
        View Dashboard
      </button>
    </div>
  );
}

export default Popup;