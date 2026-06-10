// Get Problem ID from URL

export function getProblemId() {

    const path =
        window.location.pathname;

    const match =
        path.match(
            /\/problems\/([^/]+)\//
        );

    return match
        ? match[1]
        : null;
}

// Get Problem Title

export function getProblemTitle() {

    const titleElement =
        document.querySelector(
            "div.text-title-large a"
        );

    return titleElement
        ? titleElement.innerText.trim()
        : null;
}

// Get Problem Difficulty

export function getProblemDifficulty() {

    const difficultyElement =
        document.querySelector(
            '[class*="text-difficulty"]'
        );

    return difficultyElement
        ? difficultyElement.innerText.trim()
        : null;
}

// Get Problem Statement

export function getProblemStatement() {

    const statementElement =
        document.querySelector(
            '[data-track-load="description_content"]'
        );

    return statementElement
        ? statementElement.innerText.trim()
        : null;
}