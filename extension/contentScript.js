console.log("FOCUS Loaded");

// =====================================
// GLOBAL VARIABLES
// =====================================

let currentProblemId = null;

let lastActivity = Date.now();

// =====================================
// GET PROBLEM ID
// =====================================

function getProblemId() {

    const match =
        window.location.pathname.match(
            /\/problems\/([^/]+)\//
        );

    return match
        ? match[1]
        : null;
}

// =====================================
// GET PROBLEM TITLE
// =====================================

function getProblemTitle() {

    const titleElement =
        document.querySelector(
            "div.text-title-large a"
        );

    return titleElement
        ? titleElement.innerText.trim()
        : null;
}

// =====================================
// GET PROBLEM DIFFICULTY
// =====================================

function getDifficulty() {

    const difficultyElement =
        document.querySelector(
            '[class*="text-difficulty"]'
        );

    return difficultyElement
        ? difficultyElement.innerText.trim()
        : null;
}

// =====================================
// GET PROBLEM STATEMENT
// =====================================

function getProblemStatement() {

    const statementElement =
        document.querySelector(
            '[data-track-load="description_content"]'
        );

    return statementElement
        ? statementElement.innerText.trim()
        : "";
}

// =====================================
// CREATE OR LOAD SESSION
// =====================================

async function createOrLoadSession() {

    const problemId =
        getProblemId();

    if (!problemId) {
        return;
    }

    const result =
        await chrome.storage.local.get(
            "sessions"
        );

    const sessions =
        result.sessions || {};

    let session =
        sessions[problemId];

    if (!session) {

        session = {

            problemId,

            title:
                getProblemTitle(),

            difficulty:
                getDifficulty(),

            problemStatement:
                getProblemStatement(),

            activeTime: 0,

            focusTime: 0,

            idleTime: 0,

            tabSwitchCount: 0,

            submissionCount: 0,

            startTime:
                new Date().toISOString(),

            lastVisited:
                new Date().toISOString(),

        };

        sessions[problemId] =
            session;

        await chrome.storage.local.set({
            sessions
        });

        console.log(
            "New Session Created",
            session
        );

    } else {

        session.lastVisited =
            new Date().toISOString();

        sessions[problemId] =
            session;

        await chrome.storage.local.set({
            sessions
        });

        console.log(
            "Existing Session Loaded",
            session
        );
    }
}

// =====================================
// DETECT PROBLEM CHANGE
// =====================================
let previousProblemId = null;

async function checkProblemChange() {

    const problemId =
        getProblemId();

    if (!problemId) {
        return;
    }

    if (
        previousProblemId !==
        problemId
    ) {

        previousProblemId =
            problemId;

        currentProblemId =
            problemId;

        lastActivity =
            Date.now();

        await createOrLoadSession();

        console.log(
            "Loaded:",
            problemId
        );
    }
}

// =====================================
// USER ACTIVITY TRACKING
// =====================================

function updateActivity() {

    lastActivity =
        Date.now();
}

document.addEventListener(
    "mousemove",
    updateActivity
);

document.addEventListener(
    "keydown",
    updateActivity
);

document.addEventListener(
    "click",
    updateActivity
);

document.addEventListener(
    "scroll",
    updateActivity
);

// =====================================
// UPDATE SESSION TIMERS
// =====================================

async function updateSessionTimers() {

    if (!currentProblemId) {
        return;
    }

    const result =
        await chrome.storage.local.get(
            "sessions"
        );

    const sessions =
        result.sessions || {};

    const session =
        sessions[currentProblemId];

    if (!session) {
        return;
    }

    const now =
        Date.now();

    const pageVisible =
        document.visibilityState ===
        "visible";

    if (!pageVisible) {

        session.idleTime++;

    }

    else if (
        now - lastActivity < 5000
    ) {

        session.activeTime++;

    }

    else {

        session.focusTime++;
    }

    sessions[currentProblemId] =
        session;

    await chrome.storage.local.set({
        sessions
    });
}

// =====================================
// TAB SWITCH TRACKING
// =====================================

document.addEventListener(
    "visibilitychange",
    async () => {

        if (
            document.visibilityState ===
            "hidden"
        ) {

            console.log("Tab Switched - Problem Hidden");

            if (!currentProblemId) {
                return;
            }

            const result =
                await chrome.storage.local.get(
                    "sessions"
                );

            const sessions =
                result.sessions || {};

            const session =
                sessions[currentProblemId];

            if (!session) {
                return;
            }

            session.tabSwitchCount++;

            sessions[currentProblemId] =
                session;

            await chrome.storage.local.set({
                sessions
            });
        }
    }
);

// =====================================
// INITIALIZATION
// =====================================

setTimeout(() => {

    checkProblemChange();

}, 3000);

// =====================================
// CHECK URL CHANGES
// =====================================

setInterval(() => {

    checkProblemChange();

}, 1000);

// =====================================
// UPDATE TIMERS
// =====================================

setInterval(() => {

    updateSessionTimers();

}, 1000);