console.log("Background Service Worker Running");

chrome.runtime.onInstalled.addListener(() => {
    console.log("FOCUS Installed");
    chrome.alarms.create("analyticsUpdate", {
        periodInMinutes: 30
    });
    console.log("30-minute analytics alarm created");
});

// Load analytics files
importScripts(
    "src/analytics/productivity.js",
    "src/analytics/burnout.js",
    "src/analytics/confidence.js",
    "src/analytics/dailyAnalyticsEngine.js"
);

// Trigger daily analytics from popup or custom messages
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "RUN_DAILY_ANALYTICS") {
        console.log("RUN_DAILY_ANALYTICS message received");
        runDailyAnalytics();
        if (sendResponse) {
            sendResponse({ status: "ok" });
        }
    }
});

// Trigger daily analytics on alarm
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "analyticsUpdate") {
        console.log("Running scheduled daily analytics...");
        runDailyAnalytics();
    }
});