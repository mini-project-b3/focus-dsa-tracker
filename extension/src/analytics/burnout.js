function detectBurnout(session) {

    let burnout = 0;

    const continuousStudyTime =
        session.activeTime + session.focusTime;

    const LIMIT = 120;

    if (continuousStudyTime > LIMIT) burnout++;
    if (session.submissionCount > 5) burnout++;
    if (session.idleTime > 100) burnout++;

    return {
        burnoutScore: burnout,
        alert: burnout >= 2
    };
}

self.detectBurnout = detectBurnout;