function formatTime(sec = 0) {
    sec = Math.floor(sec);

    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;

    return `${String(h).padStart(2,'0')}:${
        String(m).padStart(2,'0')}:${
        String(s).padStart(2,'0')}`;
}

// ===============================
// LOAD STATS
// ===============================

function loadStats() {
    chrome.storage.local.get("stats", (data) => {

        const stats = data.stats || {};

        document.getElementById("focusTime").textContent =
            formatTime(stats.activeTime || 0);

        document.getElementById("idleTime").textContent =
            formatTime(stats.idleTime || 0);

        document.getElementById("tabSwitches").textContent =
            stats.tabSwitches || 0;

        document.getElementById("submissions").textContent =
            stats.submissionCount || 0;

        // if you are using displayTime
        if (document.getElementById("displayTime")) {
            document.getElementById("displayTime").textContent =
                formatTime(stats.displayTime || 0);
        }
    });
}

// ===============================
// INIT + LIVE UPDATE
// ===============================

document.addEventListener("DOMContentLoaded", () => {
    loadStats();

    // 🔥 LIVE UPDATE every 1 second
    setInterval(loadStats, 1000);
});