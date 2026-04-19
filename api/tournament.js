import { requireAuth } from "./_auth.js";
import fetch from "node-fetch";
import https from "https";

const ORBIT = process.env.ORBIT_URL || "https://api.projectorbitfn.xyz:8080";
const TOKEN  = process.env.ORBIT_ADMIN_TOKEN || "";
const h = () => ({ "Content-Type": "application/json", "X-Orbit-Admin": TOKEN });
const agent = new https.Agent({ rejectUnauthorized: false });

export default async function handler(req, res) {
  if (!requireAuth(req, res)) return;

  if (req.method === "GET") {
    try {
      const r = await fetch(`${ORBIT}/api/v1/events/Fortnite/download/World`, { agent });
      return res.json(await r.json());
    } catch (e) { return res.status(502).json({ error: e.message }); }
  }
  if (req.method === "POST") {
    const { name, description, start, end, prize, playlist } = req.body || {};
    if (!name || !start || !end)
      return res.status(400).json({ error: "name, start, and end are required" });
    try {
      const r = await fetch(`${ORBIT}/dashboard/tournament/start`, {
        method: "POST", headers: h(),
        body: JSON.stringify({ name, description, start, end, prize, playlist }), agent,
      });
      if (!r.ok) throw new Error("Orbit " + r.status);
      return res.json({ ok: true });
    } catch (e) { return res.status(502).json({ error: e.message }); }
  }
  if (req.method === "DELETE") {
    try {
      const r = await fetch(`${ORBIT}/dashboard/tournament/end`, {
        method: "POST", headers: h(), agent,
      });
      if (!r.ok) throw new Error("Orbit " + r.status);
      return res.json({ ok: true });
    } catch (e) { return res.status(502).json({ error: e.message }); }
  }
  res.status(405).end();
}
