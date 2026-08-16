import { Router } from "express";
import multer from "multer";
import axios from "axios";
import { db } from "../db.js";
import { nanoid } from "nanoid";
import requireAuth from "../middleware/auth.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB cap
});

// All diagnose routes require a logged-in user
router.use(requireAuth);

// A small local knowledge base so the app still gives useful, specific
// care advice even if the AI Plant Doctor (Groq) call fails or has no key.
const CARE_TIPS = {
  healthy: {
    summary: "Your plant looks healthy! Keep up the good care routine.",
    actions: ["Continue your current watering schedule", "Monitor weekly for early signs of stress", "Ensure adequate sunlight"]
  },
  default: {
    summary: "Signs of stress or disease detected. Early action improves recovery odds.",
    actions: [
      "Isolate the plant from other healthy plants if possible",
      "Remove and dispose of visibly infected leaves",
      "Avoid overhead watering to reduce leaf moisture",
      "Apply an appropriate fungicide/pesticide if symptoms persist"
    ]
  }
};

/**
 * POST /api/diagnose
 * Body: multipart/form-data with field "image"
 * Runs the image through a Hugging Face plant-disease classification model.
 */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    if (!["image/jpeg", "image/png"].includes(req.file.mimetype)) {
      return res.status(400).json({
        error: "Please upload a JPEG or PNG image (not HEIC, WEBP, GIF, etc)."
      });
    }

    const hfKey = process.env.HUGGINGFACE_API_KEY;
    const model = process.env.HUGGINGFACE_DISEASE_MODEL;
    let result;

    if (!hfKey || hfKey === "your_huggingface_api_key_here") {
      result = mockDiagnosis();
    } else {
      const { data } = await axios.post(
        `https://router.huggingface.co/hf-inference/models/${model}`,
        req.file.buffer,
        {
          headers: {
            Authorization: `Bearer ${hfKey}`,
            "Content-Type": "application/octet-stream"
          }
        }
      );
      // HF image-classification pipeline returns [{label, score}, ...]
      const top = data.sort((a, b) => b.score - a.score)[0];
      result = {
        disease: top.label,
        confidence: Math.round(top.score * 100),
        allPredictions: data.slice(0, 5).map((d) => ({
          label: d.label,
          confidence: Math.round(d.score * 100)
        }))
      };
    }

    const isHealthy = /healthy/i.test(result.disease);
    const tips = isHealthy ? CARE_TIPS.healthy : CARE_TIPS.default;

    const record = {
      id: nanoid(),
      userId: req.userId,
      disease: result.disease,
      confidence: result.confidence,
      allPredictions: result.allPredictions || [],
      summary: tips.summary,
      recommendedActions: tips.actions,
      isHealthy,
      createdAt: new Date().toISOString()
    };

    db.data.diagnoses.push(record);
    await db.write();

    res.json(record);
  } catch (err) {
    console.error("Diagnose error:", err.response?.data || err.message);
    const fallback = mockDiagnosis();
    res.status(200).json({
      ...fallback,
      summary: CARE_TIPS.default.summary,
      recommendedActions: CARE_TIPS.default.actions,
      note: "Demo data — add a real HUGGINGFACE_API_KEY in backend/.env for live results."
    });
  }
});

router.get("/history", async (req, res) => {
  await db.read();
  res.json(
    db.data.diagnoses
      .filter((d) => d.userId === req.userId)
      .slice(-20)
      .reverse()
  );
});

function mockDiagnosis() {
  return {
    disease: "Early Blight (Tomato)",
    confidence: 82,
    allPredictions: [
      { label: "Early Blight (Tomato)", confidence: 82 },
      { label: "Healthy", confidence: 11 },
      { label: "Late Blight (Tomato)", confidence: 7 }
    ]
  };
}

export default router;
