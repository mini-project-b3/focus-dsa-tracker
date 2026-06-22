const express = require("express");
const cors = require("cors");
require("dotenv").config();
const hintRoute = require("./routes/hintRoute");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/hints", hintRoute);
app.get("/test", (req, res) => {
  res.send("Backend Working");
});
app.get("/demo", async (req, res) => {
  try {
    const { generateHint } = require("./services/geminiService");

    const hint = await generateHint("Two Sum");

    res.send(hint);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});
app.get("/", (req, res) => {
  res.send("FOCUS AI Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});