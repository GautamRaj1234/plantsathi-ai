import jwt from "jsonwebtoken";

/**
 * Verifies the "Authorization: Bearer <token>" header on protected routes
 * and attaches the decoded user id to req.userId.
 */
export default function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Not authenticated. Please log in." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret-change-me");
    req.userId = payload.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Session expired or invalid. Please log in again." });
  }
}
