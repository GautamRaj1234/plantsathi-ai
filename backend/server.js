import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import identifyRoute from "./routes/identify.js";
import diagnoseRoute from "./routes/diagnose.js";
import chatRoute from "./routes/chat.js";
import weatherRoute from "./routes/weather.js";
import gardenRoute from "./routes/garden.js";
import authRoute from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok", service: "PlantSathi AI backend" }));

app.use("/api/identify", identifyRoute);   // plant identification (PlantNet)
app.use("/api/diagnose", diagnoseRoute);   // disease detection (Hugging Face ResNet)
app.use("/api/chat", chatRoute);           // AI Plant Doctor (Groq LLM)
app.use("/api/weather", weatherRoute);     // weather-based care tips
app.use("/api/garden", gardenRoute);       // My Garden CRUD
app.use("/api/auth", authRoute);           // user authentication (signup/login)

app.listen(PORT, () => {
  console.log(`🌱 PlantSathi AI backend running on http://localhost:${PORT}`);
});
