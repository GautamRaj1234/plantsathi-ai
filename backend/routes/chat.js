import { Router } from "express";
import axios from "axios";
import { db } from "../db.js";
import { nanoid } from "nanoid";
import requireAuth from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

const SYSTEM_PROMPT = `You are "PlantSathi AI Doctor", a friendly, knowledgeable plant-care expert.
You help farmers, gardeners, and plant enthusiasts diagnose issues and give clear,
practical, step-by-step advice on watering, sunlight, soil, pests, and disease treatment.
Keep answers concise (under 150 words) unless the user asks for more detail.
If given a plant name and/or disease context, tailor your advice to it.`;

/**
 * POST /api/chat
 * Body: { message: string, context?: { plant?: string, disease?: string }, history?: [{role, content}] }
 */
router.post("/", async (req, res) => {
  try {
    const { message, context = {}, history = [] } = req.body;
    if (!message) return res.status(400).json({ error: "message is required" });

    const groqKey = process.env.GROQ_API_KEY;
    let reply;

    if (!groqKey || groqKey === "your_groq_api_key_here") {
      reply = mockReply(message, context);
    } else {
      const contextNote = context.plant || context.disease
        ? `Context: plant = ${context.plant || "unknown"}, detected issue = ${context.disease || "none"}.`
        : "";

      const messages = [
        { role: "system", content: `${SYSTEM_PROMPT}\n${contextNote}` },
        ...history.slice(-8),
        { role: "user", content: message }
      ];

      const { data } = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
          messages,
          temperature: 0.6,
          max_tokens: 400
        },
        { headers: { Authorization: `Bearer ${groqKey}`, "Content-Type": "application/json" } }
      );

      reply = data.choices[0].message.content;
    }

    const record = { id: nanoid(), userId: req.userId, message, reply, createdAt: new Date().toISOString() };
    db.data.chats.push(record);
    await db.write();

    res.json({ reply });
  } catch (err) {
    console.error("Chat error:", err.response?.data || err.message);
    res.json({ reply: mockReply(req.body.message, req.body.context || {}), note: "Demo reply — add GROQ_API_KEY for live AI responses." });
  }
});

function mockReply(message, context) {
  const plant = context.plant ? ` for your ${context.plant}` : "";
  return `Here's some general guidance${plant}: water when the top inch of soil feels dry, ensure 6+ hours of indirect sunlight, and check the undersides of leaves weekly for pests. (This is a demo reply — add a real GROQ_API_KEY in backend/.env to get live AI-generated answers to "${message}".)`;
}

export default router;
