const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const generateHint = async (problemTitle) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `
Give only a conceptual hint for this DSA problem:

${problemTitle}

Rules:
- Do NOT give code.
- Do NOT give full solution.
- Give only a short conceptual hint.
`;

  const result = await model.generateContent(prompt);

  return result.response.text();
};

module.exports = { generateHint };