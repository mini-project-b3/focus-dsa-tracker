const { generateHint } = require("../services/geminiService");

const getHint = async (req, res) => {
  try {
    const { problemTitle } = req.body;

    const hint = await generateHint(problemTitle);

    res.json({ hint });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to generate hint",
    });
  }
};

module.exports = { getHint };