import { requireAuth } from "./_auth.js";

const ORBIT = process.env.ORBIT_URL || "http://163.245.220.75:8080";
const TOKEN  = process.env.ORBIT_ADMIN_TOKEN || "";
const h = () => ({ "Content-Type": "application/json", "X-Orbit-Admin": TOKEN });

export default async function handler(req, res) {
  if (!requireAuth(req, res)) return;

  if (req.method === "GET") {
    try {
      const r = await fetch(`${ORBIT}/fortnite/api/storefront/v2/catalog`);
      return res.json(await r.json());
    } catch (e) { return res.status(502).json({ error: e.message }); }
  }
  if (req.method === "POST") {
    try {
      const r = await fetch(`${ORBIT}/dashboard/shop/save`, {
        method: "POST", headers: h(), body: JSON.stringify(req.body),
      });
      if (!r.ok) throw new Error("Orbit " + r.status);
      return res.json({ ok: true });
    } catch (e) { return res.status(502).json({ error: e.message }); }
  }
  if (req.method === "PUT") {
    try {
      const r = await fetch(`${ORBIT}/dashboard/shop/refresh`, {
        method: "POST", headers: h(),
      });
      if (!r.ok) throw new Error("Orbit " + r.status);
      return res.json({ ok: true });
    } catch (e) { return res.status(502).json({ error: e.message }); }
  }
  res.status(405).end();
}
