import { getData, saveData }
from "./storageService";

export async function getSessions() {

    return (
        await getData("sessions")
    ) || {};
}

export async function getSession(problemId) {

    const sessions =
        await getSessions();

    return sessions[problemId];
}

export async function saveSession(
    problemId,
    session
) {

    const sessions =
        await getSessions();

    sessions[problemId] =
        session;

    await saveData(
        "sessions",
        sessions
    );
}