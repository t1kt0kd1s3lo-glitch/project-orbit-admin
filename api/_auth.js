import jwt from "jsonwebtoken";
import cookie from "cookie";
const SECRET = process.env.JWT_SECRET || "changeme";
export function requireAuth(req, res) {
  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies.orbit_session;
  if (!token) { res.status(401).json({ error: "Unauthorized" }); return false; }
  try { jwt.verify(token, SECRET); return true; }
  catch { res.status(401).json({ error: "Unauthorized" }); return false; }
}
