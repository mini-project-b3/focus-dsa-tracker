function calculateProductivity(session) {

    const totalTime =
        session.activeTime +
        session.focusTime +
        session.idleTime;

    if (totalTime === 0) return 0;

    const W = 1;
    const penalty = 1.7;

    const activeRatio = session.activeTime / totalTime;

    const productivity =
        (activeRatio * 100 * W) -
        (session.tabSwitchCount * penalty);

    return Math.max(0, Math.min(100, Math.round(productivity)));
}

// expose globally for background.js
self.calculateProductivity = calculateProductivity;