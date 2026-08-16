import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { db } from "../db.js";
import requireAuth from "../middleware/auth.js";

const router = Router();
const TOKEN_EXPIRY = "7d"; 
function signToken(userId) { 
  const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me"; 
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY }); 
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

/**
 * POST /api/auth/signup
 * Body: { name, email, password }
 */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are all required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }

    await db.read();
    const existing = db.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(409).json({ error: "An account with that email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
      id: nanoid(),
      name,
      email: email.toLowerCase(),
      passwordHash,
      createdAt: new Date().toISOString()
    };

    db.data.users.push(user);
    await db.write();

    const token = signToken(user.id);
    res.status(201).json({ token, user: publicUser(user) });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ error: "Something went wrong creating your account." });
  }
});

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    await db.read();
    const user = db.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = signToken(user.id);
    res.json({ token, user: publicUser(user) });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Something went wrong logging you in." });
  }
});

/**
 * GET /api/auth/me
 * Returns the currently logged-in user (used to restore session on page load)
 */
router.get("/me", requireAuth, async (req, res) => {
  await db.read();
  const user = db.data.users.find((u) => u.id === req.userId);
  if (!user) return res.status(404).json({ error: "User not found." });
  res.json({ user: publicUser(user) });
});

export default router;
