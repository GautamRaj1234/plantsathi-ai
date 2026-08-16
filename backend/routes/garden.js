import { Router } from "express";
import { db } from "../db.js";
import { nanoid } from "nanoid";
import requireAuth from "../middleware/auth.js";

const router = Router();

// All garden routes require a logged-in user
router.use(requireAuth);

// GET only this user's saved plants
router.get("/", async (req, res) => {
  await db.read();
  res.json(db.data.plants.filter((p) => p.userId === req.userId));
});

// POST add a plant to "My Garden" for this user
router.post("/", async (req, res) => {
  const { name, species, notes, lastWatered } = req.body;
  if (!name) return res.status(400).json({ error: "name is required" });

  const plant = {
    id: nanoid(),
    userId: req.userId,
    name,
    species: species || "Unknown",
    notes: notes || "",
    lastWatered: lastWatered || new Date().toISOString(),
    healthLog: [],
    createdAt: new Date().toISOString()
  };

  db.data.plants.push(plant);
  await db.write();
  res.status(201).json(plant);
});

// PATCH update a plant — only if it belongs to this user
router.patch("/:id", async (req, res) => {
  await db.read();
  const plant = db.data.plants.find((p) => p.id === req.params.id && p.userId === req.userId);
  if (!plant) return res.status(404).json({ error: "Plant not found" });

  Object.assign(plant, req.body);
  await db.write();
  res.json(plant);
});

// DELETE remove a plant — only if it belongs to this user
router.delete("/:id", async (req, res) => {
  await db.read();
  const plant = db.data.plants.find((p) => p.id === req.params.id && p.userId === req.userId);
  if (!plant) return res.status(404).json({ error: "Plant not found" });

  db.data.plants = db.data.plants.filter((p) => p.id !== req.params.id);
  await db.write();
  res.status(204).end();
});

export default router;
