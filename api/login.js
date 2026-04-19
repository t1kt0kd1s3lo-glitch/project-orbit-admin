import jwt from "jsonwebtoken";
import cookie from "cookie";

const SECRET = process.env.JWT_SECRET || "changeme";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Ly77mlsm1@";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { password } = req.body || {};
  if (password !== ADMIN_PASSWORD)
    return res.status(401).json({ error: "Invalid password" });

  const token = jwt.sign({ admin: true }, SECRET, { expiresIn: "12h" });
  res.setHeader("Set-Cookie", cookie.serialize("orbit_session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 12,
    path: "/",
  }));
  res.json({ ok: true });
}
