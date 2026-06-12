let stats = {
  activeTime: 0,
  displayTime: 0,
  idleTime: 0,
  tabSwitches: 0
};
chrome.storage.local.get("stats", (data) => {
    if (!data.stats) {
        chrome.storage.local.set({
            stats: {
                activeTime: 0,
                displayTime: 0,
                idleTime: 0,
                tabSwitches: 0,
                submissionCount: 0
            }
        });
    }
});

let isIdle = false;
let isWindowActive = true;
let lastTime = Date.now();

// 🔥 idle detection
chrome.idle.setDetectionInterval(15);

chrome.idle.onStateChanged.addListener((state) => {
  isIdle = (state === "idle" || state === "locked");
});

// 🔥 track tab switching
chrome.tabs.onActivated.addListener(() => {
  stats.tabSwitches++;
});

// 🔥 main timer loop
setInterval(() => {
  const now = Date.now();
  const diff = (now - lastTime) / 1000;
  lastTime = now;

  stats.displayTime += diff;

  if (isIdle) {
    stats.idleTime += diff;
  } else {
    stats.activeTime += diff;
  }

  chrome.storage.local.set({ stats });

  console.log("Updated stats:", stats);
}, 1000);