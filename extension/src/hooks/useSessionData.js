import { useEffect, useState } from "react";

function useSessionData() {
  const [session, setSession] = useState({
    problem: "Two Sum",
    difficulty: "Easy",
    focusTime: 12,
    activeTime: 20,
    idleTime: 2,
    tabSwitches: 4,
    submissionCount: 0,
    productivity: 82,
    confidence: 76,
    burnout: "Low",
    hint: "Think about storing previously seen values in a HashMap.",
  });

  useEffect(() => {
    if (
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.local
    ) {
      chrome.storage.local.get("currentSession", (result) => {
        if (result.currentSession) {
          setSession(result.currentSession);
        }
      });
    }
  }, []);

  return session;
}

export default useSessionData;