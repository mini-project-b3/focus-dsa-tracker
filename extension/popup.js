chrome.storage.local.get(
  [
    "problemTitle",
    "difficulty",
    "activeTime",
    "idleTime",
    "tabSwitchCount"
  ],
  (result) => {

    document.getElementById("problem")
      .innerText =
      result.problemTitle || "No Problem";

    document.getElementById("difficulty")
      .innerText =
      result.difficulty || "";

    document.getElementById("active")
      .innerText =
      "Active Time: " +
      (result.activeTime || 0);

    document.getElementById("idle")
      .innerText =
      "Idle Time: " +
      (result.idleTime || 0);

    document.getElementById("tabs")
      .innerText =
      "Tab Switches: " +
      (result.tabSwitchCount || 0);
  }
);