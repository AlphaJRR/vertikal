# 📑 Content Banking Protocol (Founding 50 Seeding)

**JIM — System Integrity Architect — reporting in**

Status: 🟢 **EXECUTING**. This protocol locks GEMI (Data) and CURSOR (Creator Ops) into a coordinated sprint to seed the first 50 videos into Supabase, ensuring the app is rich on Day 1.

---

## 🎯 Purpose

To preload the database with curated creator content so the app launches with cinematic density, avoiding the "empty feed" problem.

---

## 🟩 GEMI — CTO of Data & Logic

**Responsibilities:**
- ✅ Define Supabase schema for `Show` and `Episode` tables (locked in v1.0.0)
- ✅ Prepare CSV ingestion pipeline for bulk upload
- ✅ Validate metadata integrity (creator_id, title, description, tags, created_at)
- ✅ Run "Concierge Seeding" script to inject the first 50 entries

**Deliverables:**
- ✅ `scripts/seed_videos.csv` — Template with 10 sample entries
- ✅ `scripts/concierge-seed.ts` — Batch insertion script

**Immediate Tasks:**
1. ✅ Export schema from Prisma → confirmed `Show` and `Episode` models match production
2. ⏳ Expand `seed_videos.csv` to 50 entries (CURSOR's task)
3. ⏳ Install CSV parser dependency
4. ⏳ Run seeding script
5. ⏳ Verify row count = 50, no null fields

---

## 🟪 CURSOR — Chief Creator Officer

**Responsibilities:**
- Select the 50 seed videos (Founding 50 creators)
- Ensure metadata reflects exclusivity:
  - `founding_50 = true` flag
  - Concierge upload flow (manual ingestion)
- Audit "Empty State" → confirm seeded videos appear immediately for first user

**Immediate Tasks:**
1. ⏳ Curate 50 videos from trusted creators
2. ⏳ Draft metadata (title, description, tags)
3. ⏳ Populate `seed_videos.csv` with all 50 entries
4. ⏳ Verify playback in production app

**CSV Format:**
```csv
show_id,creator_id,title,description,genre,tags,cover_image,trailer_url,is_premium,episode_title,episode_description,video_url,thumbnail_url,duration_seconds,founding_50
```

---

## 🟨 COPILOT — Frontend Engineer

**Responsibilities:**
- Confirm seeded videos render in the Show Detail Page and Feed
- Ensure comments, likes, and profiles link correctly
- Test DAU scaling with seeded content

**Immediate Tasks:**
1. ⏳ Run local build with seeded DB
2. ⏳ Verify video player loads seeded content
3. ⏳ Confirm comment seeding ("Daunt Effect") populates correctly

---

## ⚡ Execution Protocol

### Step 1: Install Dependencies

```bash
cd backend
npm install csv-parse
npm install --save-dev @types/csv-parse
```

### Step 2: Expand CSV (CURSOR's Task)

Edit `scripts/seed_videos.csv` and add 40 more entries (currently has 10 samples).

**Required Fields:**
- `show_id`: Unique identifier (show001-show050)
- `creator_id`: Username of creator (must match existing Profile)
- `title`: Show title
- `description`: Show description
- `genre`: Genre (Drama, Docu, Sci-Fi, etc.)
- `tags`: Comma-separated tags
- `cover_image`: URL to cover image
- `trailer_url`: Optional trailer URL
- `is_premium`: "true" or "false"
- `episode_title`: First episode title
- `episode_description`: First episode description
- `video_url`: Video file URL
- `thumbnail_url`: Thumbnail image URL
- `duration_seconds`: Video duration in seconds
- `founding_50`: "true" for Founding 50 content

### Step 3: Run Seeding Script

```bash
cd /Users/alphavisualartists/Vertikal-App
npx tsx scripts/concierge-seed.ts
```

**What the script does:**
1. Reads `seed_videos.csv`
2. Validates creator profiles exist (creates placeholder if missing)
3. Creates Shows with Season 1 and Episode 1
4. Sets `isFounding50 = true` on creator profiles
5. Verifies row counts

### Step 4: Verify Database

```bash
npx prisma studio
```

**Check:**
- `Show` table: Should have 50 rows
- `Episode` table: Should have 50 rows
- `Profile` table: Should have 50+ profiles with `isFounding50 = true`

---

## ⚠️ Rules of Execution

1. **No feature creep.** Only seed content.
2. **Audit before release.** GEMI validates DB, CURSOR validates creator metadata, COPILOT validates frontend.
3. **JIM enforces compliance.** No shortcuts — all 50 must be present and functional.

---

## 📊 Success Criteria

- ✅ 50 Shows created
- ✅ 50 Episodes created (one per show)
- ✅ All creator profiles have `isFounding50 = true`
- ✅ All videos have valid URLs (cover_image, video_url, thumbnail_url)
- ✅ No null required fields
- ✅ Frontend renders seeded content correctly

---

## 🔍 Troubleshooting

### "Creator profile not found"
**Solution:** Script will create placeholder profiles automatically. Update passwords later.

### "CSV parsing error"
**Solution:** Ensure CSV has no empty rows and all fields are quoted if they contain commas.

### "Prisma connection error"
**Solution:** Verify `DATABASE_URL` is set in `.env` file.

### "Duplicate key error"
**Solution:** Clear existing seed data or use unique `show_id` values.

---

## 📝 Files Created

- ✅ `scripts/seed_videos.csv` — CSV template (10 sample entries)
- ✅ `scripts/concierge-seed.ts` — TypeScript seeding script
- ✅ `CONTENT_BANKING_PROTOCOL.md` — This documentation

---

**Status:** 🟢 Ready for CURSOR to populate CSV → GEMI to execute seeding → COPILOT to verify frontend.

**Last Updated:** December 13, 2024

