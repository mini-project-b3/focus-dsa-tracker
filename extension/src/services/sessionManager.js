import {
    getSession,
    saveSession
}
from "./sessionService";

export async function createOrLoadSession(
    problemData
) {

    let session =
        await getSession(
            problemData.problemId
        );

    if (!session) {

        session = {

            ...problemData,

            activeTime: 0,
            focusTime: 0,
            idleTime: 0,

            tabSwitchCount: 0,
            submissionCount: 0,

            startTime:
                new Date()
                .toISOString(),

            lastVisited:
                new Date()
                .toISOString(),

            totalVisits: 1
        };

    } else {

        session.lastVisited =
            new Date()
            .toISOString();

        session.totalVisits++;
    }

    await saveSession(
        problemData.problemId,
        session
    );

    return session;
}