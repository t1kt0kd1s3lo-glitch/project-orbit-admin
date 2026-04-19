import cookie from "cookie";
export default function handler(req, res) {
  res.setHeader("Set-Cookie", cookie.serialize("orbit_session", "", {
    httpOnly: true, secure: true, sameSite: "lax", maxAge: 0, path: "/",
  }));
  res.json({ ok: true });
}
