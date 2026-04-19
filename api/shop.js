import { requireAuth } from "./_auth.js";
import { request } from "https";

const ORBIT = process.env.ORBIT_URL || "https://api.projectorbitfn.xyz:8080";
const TOKEN = process.env.ORBIT_ADMIN_TOKEN || "";

function httpsRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = {
      hostname: u.hostname,
      port: u.port || 443,
      path: u.pathname + u.search,
      method: options.method || "GET",
      headers: options.headers || {},
      rejectUnauthorized: false,
    };
    const req = request(opts, (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => resolve({ status: res.statusCode, body: data, ok: res.statusCode < 400 }));
    });
    req.on("error", reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

export default async function handler(req, res) {
  if (!requireAuth(req, res)) return;

  if (req.method === "GET") {
    try {
      const r = await httpsRequest(`${ORBIT}/fortnite/api/storefront/v2/catalog`);
      return res.json(JSON.parse(r.body));
    } catch (e) { return res.status(502).json({ error: e.message }); }
  }
  if (req.method === "POST") {
    try {
      const r = await httpsRequest(`${ORBIT}/dashboard/shop/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Orbit-Admin": TOKEN },
        body: JSON.stringify(req.body),
      });
      if (!r.ok) throw new Error("Orbit " + r.status);
      return res.json({ ok: true });
    } catch (e) { return res.status(502).json({ error: e.message }); }
  }
  if (req.method === "PUT") {
    try {
      const r = await httpsRequest(`${ORBIT}/dashboard/shop/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Orbit-Admin": TOKEN },
      });
      if (!r.ok) throw new Error("Orbit " + r.status);
      return res.json({ ok: true });
    } catch (e) { return res.status(502).json({ error: e.message }); }
  }
  res.status(405).end();
}
