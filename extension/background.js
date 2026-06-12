console.log("Background Service Worker Running");


chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

    if (msg.type === "RUN_DAILY_ANALYTICS") {

        runDailyAnalytics(); // now globally available

        sendResponse({ status: "ok" });
    }
});


let tabSwitchCount = 0;

chrome.runtime.onInstalled.addListener(() => {
    console.log("FOCUS Installed");
});

chrome.tabs.onActivated.addListener(() => {

    tabSwitchCount++;

    chrome.storage.local.set({
        tabSwitchCount
    });

    console.log(
        "Tab Switches:",
        tabSwitchCount
    );
});
console.log("Background running");

// load analytics files
importScripts(
    "src/analytics/productivity.js",
    "src/analytics/burnout.js",
    "src/analytics/confidence.js",
    "src/analytics/dailyAnalyticsEngine.js"
);

// trigger from popup or console
chrome.runtime.onMessage.addListener((msg) => {

    if (msg.type === "RUN_DAILY_ANALYTICS") {
        runDailyAnalytics();
    }
});

chrome.runtime.onInstalled.addListener(() => {

    chrome.alarms.create("analyticsUpdate", {
        periodInMinutes: 30
    });

    console.log("30-minute analytics alarm created");
});

chrome.alarms.onAlarm.addListener((alarm) => {

    if (alarm.name === "analyticsUpdate") {

        console.log("Running analytics...");

        runDailyAnalytics();
    }
});