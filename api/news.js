import { requireAuth } from "./_auth.js";
import { request } from "https";

export default async function handler(req, res) {
  if (!requireAuth(req, res)) return;
  if (req.method !== "POST") return res.status(405).end();

  const orbitReq = request(`${process.env.ORBIT_URL}/dashboard/news/push`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Orbit-Admin": process.env.ORBIT_ADMIN_TOKEN },
    rejectUnauthorized: false
  }, (orbitRes) => res.status(orbitRes.statusCode).json({ ok: orbitRes.statusCode < 400 }));

  orbitReq.write(JSON.stringify(req.body));
  orbitReq.end();
}
