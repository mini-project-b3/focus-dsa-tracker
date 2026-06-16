function calculateConfidence(session) {

    let difficultyBonus = 0;

    switch (session.difficulty) {
        case "Easy":
            difficultyBonus = 5;
            break;
        case "Medium":
            difficultyBonus = 10;
            break;
        case "Hard":
            difficultyBonus = 20;
            break;
        default:
            difficultyBonus = 0;
    }

    let confidence =
        100 -
        (session.submissionCount * 5) +
        difficultyBonus;

    return Math.max(0, Math.min(100, Math.round(confidence)));
}

self.calculateConfidence = calculateConfidence;