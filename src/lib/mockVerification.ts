import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const CODES_FILE = path.join(DATA_DIR, "verification_codes.json");
const FOUNDING_FILE = path.join(DATA_DIR, "founding50.json");

type CodeRecord = { used: boolean; creator_id: string | null };

function readJson<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

function writeJson(filePath: string, data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export function checkCode(code: string): { ok: boolean; reason?: string; record?: CodeRecord } {
  const codes = readJson<Record<string, CodeRecord>>(CODES_FILE);
  const record = codes[code];
  if (!record) return { ok: false, reason: "invalid" };
  if (record.used) return { ok: false, reason: "used", record };
  return { ok: true, record };
}

export function activateCode(code: string, creatorId: string) {
  const codes = readJson<Record<string, CodeRecord>>(CODES_FILE);
  if (!codes[code]) throw new Error("invalid code");
  if (codes[code].used) throw new Error("code already used");
  codes[code].used = true;
  codes[code].creator_id = creatorId;
  writeJson(CODES_FILE, codes);

  // Update founding50.json: add or update creator entry with founding flag
  const founding = readJson<any[]>(FOUNDING_FILE);
  const existing = founding.find((c) => c.id === creatorId);
  if (existing) {
    existing.founding50 = true;
    existing.kyc_status = "verified";
  } else {
    founding.push({
      id: creatorId,
      name: "",
      handle: creatorId,
      bio: "",
      tags: [],
      profile_picture: null,
      followers_count: 0,
      created_at: new Date().toISOString(),
      kyc_status: "verified",
      payout_account_id: null,
      location: null,
      verified_badge: true,
      founding50: true
    });
  }
  writeJson(FOUNDING_FILE, founding);
}
