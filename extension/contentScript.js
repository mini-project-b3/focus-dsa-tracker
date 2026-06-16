console.log("FOCUS Loaded");

// =====================================
// GLOBAL VARIABLES & INTERVALS
// =====================================

let currentProblemId = null;
let lastActivity = Date.now();
let lastTimerRun = Date.now();
let lastSubmissionTime = 0;
let previousProblemId = null;
let submissionObserver = null;

let urlCheckInterval = null;
let timerInterval = null;

// Helper to check extension validity and clean up if invalidated
function isContextValid() {
    if (!chrome.runtime || !chrome.runtime.id) {
        cleanupIntervals();
        return false;
    }
    return true;
}

function cleanupIntervals() {
    console.log("FOCUS: Context invalidated or cleanup requested. Cleaning up intervals and observers...");
    if (urlCheckInterval) clearInterval(urlCheckInterval);
    if (timerInterval) clearInterval(timerInterval);
    if (submissionObserver) {
        submissionObserver.disconnect();
        submissionObserver = null;
    }
}

// Helper for local date string: YYYY-MM-DD
function getLocalDateString() {
    return new Date().toLocaleDateString('en-CA');
}

// =====================================
// GET PROBLEM ID
// =====================================

function getProblemId() {
    const match = window.location.pathname.match(
        /\/problems\/([^/]+)\//
    );
    return match ? match[1] : null;
}

// =====================================
// GET PROBLEM TITLE
// =====================================

function getProblemTitle() {
    const selectors = [
        "div.text-title-large a",
        "div.text-title-large",
        "[data-cy='question-title']",
        "div[class*='text-title-large']"
    ];
    for (const selector of selectors) {
        const titleElement = document.querySelector(selector);
        if (titleElement) {
            const text = titleElement.innerText.trim();
            if (text) return text;
        }
    }
    return null;
}

// =====================================
// GET PROBLEM DIFFICULTY
// =====================================

function getDifficulty() {
    const selectors = [
        '[class*="text-difficulty"]',
        'div.text-easy',
        'div.text-medium',
        'div.text-hard',
        '[data-difficulty]'
    ];
    for (const selector of selectors) {
        const difficultyElement = document.querySelector(selector);
        if (difficultyElement) {
            const text = difficultyElement.innerText.trim();
            if (text) return text;
        }
    }
    return null;
}

// =====================================
// GET PROBLEM STATEMENT
// =====================================

function getProblemStatement() {
    const selectors = [
        '[data-track-load="description_content"]',
        'div.question-content',
        '[class*="question-content"]'
    ];
    for (const selector of selectors) {
        const statementElement = document.querySelector(selector);
        if (statementElement) {
            const text = statementElement.innerText.trim();
            if (text) return text;
        }
    }
    return "";
}

// =====================================
// CREATE OR LOAD SESSION
// =====================================

async function createOrLoadSession() {
    if (!isContextValid()) return;

    const problemId = getProblemId();
    if (!problemId) return;

    try {
        const result = await chrome.storage.local.get("sessions");
        const sessions = result.sessions || {};

        let session = sessions[problemId];
        const today = getLocalDateString();

        if (!session) {
            session = {
                problemId,
                title: getProblemTitle(),
                difficulty: getDifficulty(),
                problemStatement: getProblemStatement(),

                activeTime: 0,
                focusTime: 0,
                idleTime: 0,
                tabSwitchCount: 0,
                submissionCount: 0,
                solved: false,
                lastSubmissionStatus: null,

                startTime: new Date().toISOString(),
                lastVisited: new Date().toISOString(),
                createdDate: today,
            };

            sessions[problemId] = session;
            await chrome.storage.local.set({ sessions });
            console.log("New Session Created", session);
        } else {
            session.lastVisited = new Date().toISOString();
            // Update title, difficulty, statement if they were missing or updated
            if (!session.title) session.title = getProblemTitle();
            if (!session.difficulty) session.difficulty = getDifficulty();
            if (!session.problemStatement) session.problemStatement = getProblemStatement();

            sessions[problemId] = session;
            await chrome.storage.local.set({ sessions });
            console.log("Existing Session Loaded", session);
        }
    } catch (e) {
        if (e.message.includes("Extension context invalidated")) {
            cleanupIntervals();
        } else {
            console.error("Error creating/loading session:", e);
        }
    }
}

// =====================================
// DETECT PROBLEM CHANGE
// =====================================

async function checkProblemChange() {
    if (!isContextValid()) return;

    const problemId = getProblemId();
    if (!problemId) return;

    if (previousProblemId !== problemId) {
        previousProblemId = problemId;
        currentProblemId = problemId;
        lastActivity = Date.now();
        lastTimerRun = Date.now(); // reset timer timestamp for context accuracy

        await createOrLoadSession();
        console.log("Loaded:", problemId);
    }
}

// =====================================
// USER ACTIVITY TRACKING
// =====================================

function updateActivity() {
    lastActivity = Date.now();
}

document.addEventListener("mousemove", updateActivity);
document.addEventListener("keydown", updateActivity);
document.addEventListener("click", updateActivity);
document.addEventListener("scroll", updateActivity);

// =====================================
// UPDATE SESSION TIMERS
// =====================================

async function updateSessionTimers() {
    if (!isContextValid()) return;
    if (!currentProblemId) return;

    const now = Date.now();
    const elapsedSeconds = Math.round((now - lastTimerRun) / 1000);
    lastTimerRun = now;

    if (elapsedSeconds <= 0) return;

    try {
        const result = await chrome.storage.local.get("sessions");
        const sessions = result.sessions || {};

        const session = sessions[currentProblemId];
        if (!session) return;

        const pageVisible = document.visibilityState === "visible";

        if (!pageVisible) {
            session.idleTime += elapsedSeconds;
        } else if (now - lastActivity < 5000) {
            session.activeTime += elapsedSeconds;
        } else {
            session.focusTime += elapsedSeconds;
        }

        sessions[currentProblemId] = session;
        await chrome.storage.local.set({ sessions });
    } catch (e) {
        if (e.message.includes("Extension context invalidated")) {
            cleanupIntervals();
        } else {
            console.error("Error updating session timers:", e);
        }
    }
}

// =====================================
// TAB SWITCH TRACKING
// =====================================

document.addEventListener("visibilitychange", async () => {
    if (!isContextValid()) return;

    if (document.visibilityState === "hidden") {
        console.log("Tab Switched - Problem Hidden");

        if (!currentProblemId) return;

        try {
            const result = await chrome.storage.local.get("sessions");
            const sessions = result.sessions || {};

            const session = sessions[currentProblemId];
            if (!session) return;

            session.tabSwitchCount++;

            sessions[currentProblemId] = session;
            await chrome.storage.local.set({ sessions });
        } catch (e) {
            if (e.message.includes("Extension context invalidated")) {
                cleanupIntervals();
            } else {
                console.error("Error recording tab switch:", e);
            }
        }
    } else {
        // Tab became visible again: reset timer base to now to prevent double-counting transition time
        lastTimerRun = Date.now();
        lastActivity = Date.now();
    }
});

// =====================================
// SUBMISSION DETECTION & OBSERVATION
// =====================================

async function registerSubmissionAttempt() {
    if (!isContextValid()) return;
    if (!currentProblemId) return;

    const now = Date.now();
    // Debounce to prevent multiple fires within 5 seconds
    if (now - lastSubmissionTime < 5000) return;
    lastSubmissionTime = now;

    try {
        const result = await chrome.storage.local.get("sessions");
        const sessions = result.sessions || {};

        const session = sessions[currentProblemId];
        if (!session) return;

        session.submissionCount = (session.submissionCount || 0) + 1;
        sessions[currentProblemId] = session;
        await chrome.storage.local.set({ sessions });

        console.log("Submission registered. Total submissions:", session.submissionCount);

        // Start checking DOM for submission result
        observeSubmissionResult();
    } catch (e) {
        if (e.message.includes("Extension context invalidated")) {
            cleanupIntervals();
        } else {
            console.error("Error registering submission attempt:", e);
        }
    }
}

function observeSubmissionResult() {
    if (!isContextValid()) return;

    if (submissionObserver) {
        submissionObserver.disconnect();
        submissionObserver = null;
    }

    console.log("Observing DOM for submission result...");

    const targetNode = document.body;
    const config = { childList: true, subtree: true };
    let checkCount = 0;
    const maxChecks = 150; // Check for up to 30 seconds (every ~200ms)

    submissionObserver = new MutationObserver((mutationsList, observer) => {
        checkCount++;
        if (checkCount > maxChecks) {
            observer.disconnect();
            submissionObserver = null;
            console.log("Stopped observing submission results (timeout)");
            return;
        }

        // Look for common LeetCode result texts in the DOM
        const textElements = document.querySelectorAll('span, div, p');
        for (const el of textElements) {
            const text = el.innerText.trim();
            if (text === "Accepted") {
                console.log("Submission result: ACCEPTED");
                updateSubmissionResult(true, "Accepted");
                observer.disconnect();
                submissionObserver = null;
                return;
            } else if (
                text === "Wrong Answer" ||
                text === "Time Limit Exceeded" ||
                text === "Runtime Error" ||
                text === "Compile Error" ||
                text === "Memory Limit Exceeded" ||
                text === "Output Limit Exceeded"
            ) {
                console.log("Submission result: FAILED (" + text + ")");
                updateSubmissionResult(false, text);
                observer.disconnect();
                submissionObserver = null;
                return;
            }
        }
    });

    submissionObserver.observe(targetNode, config);
}

async function updateSubmissionResult(isSolved, status) {
    if (!isContextValid()) return;
    if (!currentProblemId) return;

    try {
        const result = await chrome.storage.local.get("sessions");
        const sessions = result.sessions || {};

        const session = sessions[currentProblemId];
        if (!session) return;

        session.solved = isSolved;
        session.lastSubmissionStatus = status;

        sessions[currentProblemId] = session;
        await chrome.storage.local.set({ sessions });
        console.log("Session solve status updated to", status);
    } catch (e) {
        if (e.message.includes("Extension context invalidated")) {
            cleanupIntervals();
        } else {
            console.error("Error updating submission result:", e);
        }
    }
}

// Listen for Submit button clicks
document.addEventListener("click", async (event) => {
    if (!isContextValid()) return;

    const button = event.target.closest("button");
    if (button) {
        const text = button.innerText.trim().toLowerCase();
        const hasSubmitAttr = button.getAttribute("data-cy") === "submit-code-btn";
        if (hasSubmitAttr || text === "submit") {
            console.log("Submit button click detected");
            await registerSubmissionAttempt();
        }
    }
});

// Listen for Ctrl+Enter or Cmd+Enter inside the code editor
document.addEventListener("keydown", async (event) => {
    if (!isContextValid()) return;

    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        const isEditor = event.target.closest(".monaco-editor") || event.target.closest(".editor");
        if (isEditor) {
            console.log("Submit keyboard shortcut detected");
            await registerSubmissionAttempt();
        }
    }
});

// =====================================
// INITIALIZATION & LOOPS
// =====================================

// Check for problem change on startup after a delay
setTimeout(() => {
    if (isContextValid()) {
        checkProblemChange();
    }
}, 2000);

// URL Check Loop (detect dynamically loaded page changes)
urlCheckInterval = setInterval(() => {
    if (isContextValid()) {
        checkProblemChange();
    }
}, 1000);

// Timer Loop
timerInterval = setInterval(() => {
    if (isContextValid()) {
        updateSessionTimers();
    }
}, 1000);
