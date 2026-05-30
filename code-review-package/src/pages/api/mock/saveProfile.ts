import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const FOUNDING_FILE = path.join(process.cwd(), "src", "data", "founding50.json");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const payload = req.body;
  const raw = fs.readFileSync(FOUNDING_FILE, "utf-8");
  const arr = JSON.parse(raw);
  const idx = arr.findIndex((c: any) => c.id === payload.id);
  if (idx >= 0) {
    arr[idx] = { ...arr[idx], ...payload };
  } else {
    arr.push({ ...payload, created_at: new Date().toISOString(), kyc_status: "verified", founding50: true });
  }
  fs.writeFileSync(FOUNDING_FILE, JSON.stringify(arr, null, 2), "utf-8");
  res.json({ ok: true });
}
