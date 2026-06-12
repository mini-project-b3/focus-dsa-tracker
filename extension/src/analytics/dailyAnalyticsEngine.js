console.log("🔥 dailyAnalyticsEngine loaded");

function runDailyAnalytics() {

    console.log("🚀 runDailyAnalytics triggered");

    chrome.storage.local.get(["sessions"], (data) => {

        const today =
            new Date().toISOString().split("T")[0];

        const sessions =
            Object.values(data.sessions || {})
                .filter(
                    session =>
                        session.createdDate === today
                );

        if (sessions.length === 0) {
            console.log("No sessions found");
            return;
        }

        let totalProductivity = 0;
        let totalConfidence = 0;
        let burnoutSum = 0;

        sessions.forEach(session => {

            const productivity =
                calculateProductivity(session);

            const confidence =
                calculateConfidence(session);

            const burnout =
                detectBurnout(session);

            totalProductivity += productivity;
            totalConfidence += confidence;
            burnoutSum += burnout.burnoutScore;
        });

        const burnoutAlert =
            burnoutSum >= 2;

        const count =
            sessions.length;

        const dailyReport = {

            date: today,

            avgProductivity:
                Math.round(
                    totalProductivity / count
                ),

            avgConfidence:
                Math.round(
                    totalConfidence / count
                ),

            totalBurnout:
                burnoutSum,

            burnoutAlert,

            totalProblemsOpened:
                count
        };

        console.log(
            "🟢 DAILY REPORT:",
            dailyReport
        );

        chrome.storage.local.get(
            ["dailyReports"],
            (data) => {

                const dailyReports =
                    data.dailyReports || {};

                dailyReports[today] =
                    dailyReport;

                chrome.storage.local.set({
                    dailyReports
                });

                console.log(
                    "✅ Daily report saved for",
                    today
                );
            }
        );
    });
}

// expose for background.js
self.runDailyAnalytics =
    runDailyAnalytics;