console.log("FOCUS Loaded");

function getProblemTitle() {

    const titleElement =
        document.querySelector('div.text-title-large a');

    if (titleElement) {

        const title = titleElement.innerText.trim();

        console.log("Problem Title:", title);

        chrome.storage.local.set({
            problemTitle: title
        });
    }
}

function getDifficulty() {
    const difficultyElement =
        document.querySelector('[class*="text-difficulty"]');

    if (difficultyElement) {
        const difficulty =
            difficultyElement.innerText;

        console.log("Difficulty:", difficulty);

        chrome.storage.local.set({
            difficulty
        });
    }
}

setTimeout(() => {
    getProblemTitle();
    getDifficulty();
}, 3000);

let activeTime = 0;
let lastActivity = Date.now();
let idleTime = 0;

function updateActivity() {
    lastActivity = Date.now();
}

document.addEventListener("mousemove", updateActivity);
document.addEventListener("keydown", updateActivity);
document.addEventListener("click", updateActivity);
document.addEventListener("scroll", updateActivity);

setInterval(() => {

    const now = Date.now();

    if (now - lastActivity < 5000) {

        activeTime++;

        //console.log("Active:", activeTime);

    } else {

        idleTime++;

        // console.log("Idle:", idleTime);
    }

    chrome.storage.local.set({
        activeTime,
        idleTime
    });

}, 1000);

