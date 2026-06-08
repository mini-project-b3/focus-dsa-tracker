console.log("Background Service Worker Running");

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