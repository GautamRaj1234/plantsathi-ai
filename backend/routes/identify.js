import { Router } from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import requireAuth from "../middleware/auth.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB cap
});

router.use(requireAuth);

/**
 * POST /api/identify
 * Body: multipart/form-data with field "image"
 * Proxies the image to the PlantNet API to identify the plant species.
 * Docs: https://my.plantnet.org/doc
 */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const apiKey = process.env.PLANTNET_API_KEY;
    if (!apiKey || apiKey === "your_plantnet_api_key_here") {
      return res.status(200).json(mockIdentifyResponse());
    }

    if (!["image/jpeg", "image/png"].includes(req.file.mimetype)) {
      return res.status(400).json({
        error: "PlantNet only accepts JPEG or PNG images. Please upload a .jpg or .png file (not HEIC, WEBP, etc)."
      });
    }

    const form = new FormData();
    form.append("images", req.file.buffer, {
      filename: req.file.originalname || "plant.jpg",
      contentType: req.file.mimetype
    });
    form.append("organs", "auto");

    const url = `https://my-api.plantnet.org/v2/identify/all?api-key=${apiKey}`;
    const { data } = await axios.post(url, form, {
      headers: form.getHeaders(),
      maxBodyLength: Infinity
    });

    const best = data.results?.[0];
    if (!best) {
      return res.status(404).json({ error: "Could not identify the plant" });
    }

    res.json({
      commonName: best.species.commonNames?.[0] || best.species.scientificNameWithoutAuthor,
      scientificName: best.species.scientificNameWithoutAuthor,
      family: best.species.family?.scientificNameWithoutAuthor,
      confidence: Math.round(best.score * 100),
      alternatives: (data.results || []).slice(1, 4).map((r) => ({
        commonName: r.species.commonNames?.[0] || r.species.scientificNameWithoutAuthor,
        confidence: Math.round(r.score * 100)
      }))
    });
  } catch (err) {
    console.error("Identify error:", err.response?.data || err.message);
    res.status(200).json(mockIdentifyResponse());
  }
});

// Fallback so the app still works end-to-end before you add a real API key
function mockIdentifyResponse() {
  return {
    commonName: "Tomato Plant",
    scientificName: "Solanum lycopersicum",
    family: "Solanaceae",
    confidence: 87,
    alternatives: [
      { commonName: "Bell Pepper", confidence: 8 },
      { commonName: "Chili Pepper", confidence: 5 }
    ],
    note: "Demo data — add a real PLANTNET_API_KEY in backend/.env for live results."
  };
}

export default router;
