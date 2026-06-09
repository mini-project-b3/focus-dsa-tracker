console.log("FOCUS Loaded");

// ======================================
// GLOBAL VARIABLES
// ======================================

let currentProblemTitle = "";

let codingTime = 0;
let focusTime = 0;
let idleTime = 0;

let lastActivity = Date.now();

// ======================================
// SAVE CURRENT SESSION
// ======================================

async function saveCurrentSession() {

    const data =
        await chrome.storage.local.get(null);

    const session = {
        title: data.problemTitle,
        difficulty: data.difficulty,

        codingTime: data.codingTime || 0,
        focusTime: data.focusTime || 0,
        idleTime: data.idleTime || 0,

        tabSwitchCount: data.tabSwitchCount || 0,

        date: new Date().toISOString()
    };

    const result =
        await chrome.storage.local.get("sessions");

    const sessions =
        result.sessions || [];

    sessions.push(session);

    await chrome.storage.local.set({
        sessions
    });

    console.log("Session Saved:", session);
}

// ======================================
// RESET TRACKING VARIABLES
// ======================================

function resetTimers() {

    codingTime = 0;
    focusTime = 0;
    idleTime = 0;

    lastActivity = Date.now();

    console.log("Timers Reset");
}

// ======================================
// EXTRACT PROBLEM TITLE
// ======================================

function getProblemTitle() {

    const titleElement =
        document.querySelector(
            "div.text-title-large a"
        );

    if (titleElement) {

        const title =
            titleElement.innerText.trim();

        chrome.storage.local.set({
            problemTitle: title
        });

        return title;
    }

    return null;
}

// ======================================
// EXTRACT DIFFICULTY
// ======================================

function getDifficulty() {

    const difficultyElement =
        document.querySelector(
            '[class*="text-difficulty"]'
        );

    if (difficultyElement) {

        const difficulty =
            difficultyElement.innerText.trim();

        chrome.storage.local.set({
            difficulty
        });

        return difficulty;
    }

    return null;
}

// ======================================
// INITIAL PROBLEM LOAD
// ======================================

setTimeout(() => {

    const title =
        getProblemTitle();

    getDifficulty();

    if (title) {

        currentProblemTitle =
            title;

        console.log(
            "Current Problem:",
            currentProblemTitle
        );
    }

}, 3000);

// ======================================
// DETECT USER ACTIVITY
// ======================================

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

// ======================================
// TRACK CODING / FOCUS / IDLE TIME
// ======================================

setInterval(() => {

    const now =
        Date.now();

    const pageVisible =
        document.visibilityState === "visible";

    if (!pageVisible) {

        idleTime++;
    }

    else if (
        now - lastActivity < 5000
    ) {

        codingTime++;
    }

    else {

        focusTime++;
    }

    chrome.storage.local.set({

        codingTime,
        focusTime,
        idleTime

    });

}, 1000);

// ======================================
// DETECT PROBLEM CHANGE
// ======================================

async function checkProblemChange() {

    const titleElement =
        document.querySelector(
            "div.text-title-large a"
        );

    if (!titleElement) {
        return;
    }

    const newTitle =
        titleElement.innerText.trim();

    if (currentProblemTitle === "") {

        currentProblemTitle =
            newTitle;

        return;
    }

    if (
        newTitle !== currentProblemTitle
    ) {

        console.log(
            "Problem Changed:",
            currentProblemTitle,
            "->",
            newTitle
        );

        await saveCurrentSession();

        resetTimers();

        currentProblemTitle =
            newTitle;

        chrome.storage.local.set({
            problemTitle: newTitle
        });

        getDifficulty();
    }
}

// ======================================
// WATCH FOR DOM CHANGES
// ======================================

const observer =
    new MutationObserver(() => {

        checkProblemChange();
    });

observer.observe(
    document.body,
    {
        childList: true,
        subtree: true
    }
);

// ======================================
// SAVE SESSION WHEN PAGE CLOSES
// ======================================

window.addEventListener(
    "beforeunload",
    () => {

        saveCurrentSession();
    }
);

// ======================================
// MANUAL TESTING HELPERS
// ======================================

window.saveFocusSession =
    saveCurrentSession;

window.resetFocusTimers =
    resetTimers;