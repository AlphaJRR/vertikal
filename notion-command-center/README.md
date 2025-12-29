# Notion Corporate Command Center — Automated Setup

**Joshua Roberts Ent.** — Corporate Command Center Creator

---

## 🚀 QUICK START (RUN IT)

### Prerequisites
- Node.js 18+ installed
- Notion account
- Access to create pages in Notion workspace

### Step 1: Create Notion Integration

1. Go to: https://www.notion.so/my-integrations
2. Click **"+ New integration"**
3. Name it: `Joshua Roberts Command Center`
4. Select workspace: Your workspace
5. Capabilities: Enable **"Read content"**, **"Update content"**, **"Insert content"**
6. Click **"Submit"**
7. Copy the **"Internal Integration Token"** (starts with `secret_`)

### Step 2: Get Parent Page ID

1. Open the Notion page where you want the Command Center
2. Click **"..."** menu → **"Copy link"**
3. Extract the page ID from URL:
   ```
   https://www.notion.so/workspace/abc123def456
                                    ^^^^^^^^^^^^
                                    This is your PARENT_PAGE_ID
   ```

### Step 3: Share Page with Integration

1. Open the parent page
2. Click **"..."** menu → **"Add connections"**
3. Search for: `Joshua Roberts Command Center`
4. Click to add

### Step 4: Install & Run

```bash
# Navigate to directory
cd notion-command-center

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your values:
# NOTION_TOKEN=secret_your_token_here
# PARENT_PAGE_ID=your_page_id_here

# Run script
npm start
```

### Expected Output

```
🚀 Starting Notion Command Center creation...

📄 Creating Hub page...
✅ Hub page created: abc123...

📊 Creating Revenue Gauge database...
✅ Revenue Gauge database created: def456...

📋 Creating The 2026 Reaping database...
✅ The 2026 Reaping database created: ghi789...

🎬 Creating DaVinci Mastery Tracker database...
✅ DaVinci Mastery Tracker database created: jkl012...

🌱 Seeding Revenue Gauge (12 months)...
✅ Revenue Gauge seeded: 12 months

🌱 Seeding The 2026 Reaping (7 tasks)...
✅ The 2026 Reaping seeded: 7 tasks

🌱 Seeding DaVinci Mastery Tracker (13 modules)...
✅ DaVinci Mastery Tracker seeded: 13 modules

✅ ✅ ✅ COMMAND CENTER CREATED SUCCESSFULLY ✅ ✅ ✅
```

---

## 📊 NO CODE OPTION (CSV Import)

If you prefer manual import, use the CSV files below.

### Import Instructions

1. **Create databases manually** in Notion with the exact property names
2. **Import CSV files** using Notion's import feature:
   - Click **"..."** menu → **"Import"** → **"CSV"**
   - Select the CSV file
   - Map columns to properties
   - Click **"Import"**

### CSV Files

See `csv-imports/` directory for:
- `revenue_gauge_2026.csv`
- `davinci_mastery.csv`
- `2026_reaping_seed.csv`

---

## ⚠️ WHAT CANNOT BE AUTOMATED

The Notion API has limitations. These must be done manually:

### 1. Callout Colors
- **Cannot:** Set callout background colors via API
- **Manual:** Select callout → Change color in UI

### 2. Cover Images
- **Cannot:** Set page cover images via API
- **Manual:** Click cover area → Upload image

### 3. Two-Column Layout
- **Cannot:** Create column layouts via API
- **Manual:** Use `/column` command or drag blocks

### 4. Database Views
- **Cannot:** Create calendar/board/timeline views via API
- **Manual:** 
  - Click **"+"** next to views
  - Select view type (Calendar, Board, Timeline)
  - Configure filters/sorts

### 5. Database Templates
- **Cannot:** Create database templates via API
- **Manual:** 
  - Click **"..."** in database → **"Templates"**
  - Create template with default values

### 6. Recurring Events
- **Cannot:** Create recurring date patterns via API
- **Workaround:** Duplicate rows manually or use formulas

---

## 🔧 TROUBLESHOOTING

### Error: "object_not_found"
- **Cause:** Parent page ID incorrect or integration doesn't have access
- **Fix:** Verify PARENT_PAGE_ID and share page with integration

### Error: "unauthorized"
- **Cause:** Integration token invalid or expired
- **Fix:** Regenerate token in integration settings

### Error: "validation_error"
- **Cause:** Property names don't match exactly
- **Fix:** Check property names are exact (case-sensitive)

### Error: "rate_limited"
- **Cause:** Too many API calls too quickly
- **Fix:** Script includes delays, but wait 1 minute and retry

---

## 📁 FILES

- `create-command-center.js` - Main automation script
- `.env.example` - Environment variable template
- `package.json` - Dependencies
- `README.md` - This file
- `csv-imports/` - CSV files for manual import

---

**Status:** Production-ready  
**Last Updated:** December 15, 2024

