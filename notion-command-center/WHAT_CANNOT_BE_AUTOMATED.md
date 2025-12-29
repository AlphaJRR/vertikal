# ⚠️ What Cannot Be Automated in Notion

**Joshua Roberts Ent. — Command Center Limitations**

---

## 🚫 NOTION API LIMITATIONS

The Notion API can create pages, databases, and rows, but **cannot** reliably set up:

### 1. Callout Colors
- **Cannot:** Set callout background colors via API
- **Manual Fix:** 
  1. Select the callout block
  2. Click color picker in toolbar
  3. Choose background color

### 2. Cover Images
- **Cannot:** Set page cover images via API
- **Manual Fix:**
  1. Click cover area at top of page
  2. Upload image or select from Unsplash
  3. Adjust position if needed

### 3. Two-Column Layout
- **Cannot:** Create column layouts via API
- **Manual Fix:**
  1. Type `/column` command
  2. Or drag blocks side-by-side to create columns

### 4. Database Views
- **Cannot:** Create calendar/board/timeline views via API
- **Manual Fix:**
  1. Click **"+"** next to existing views
  2. Select view type:
     - **Calendar** - For date-based views
     - **Board** - For kanban-style (Status column)
     - **Timeline** - For Gantt-style (Timeline column)
     - **Table** - Default view
  3. Configure filters/sorts as needed

**Recommended Views:**
- **Revenue Gauge:** Calendar view (group by Month)
- **The 2026 Reaping:** Board view (group by Status), Timeline view (group by Timeline)
- **DaVinci Mastery:** Table view (filter by Mastered checkbox)

### 5. Database Templates
- **Cannot:** Create database templates via API
- **Manual Fix:**
  1. Click **"..."** in database header
  2. Select **"Templates"**
  3. Click **"New template"**
  4. Set default values for properties
  5. Name template (e.g., "New Revenue Month")

**Useful Templates:**
- **Revenue Gauge:** Template with Target=21000 pre-filled
- **The 2026 Reaping:** Template with Status=Backlog pre-filled
- **DaVinci Mastery:** Template with Mastered=false pre-filled

### 6. Recurring Events
- **Cannot:** Create recurring date patterns via API
- **Workaround Options:**
  1. **Duplicate rows:** Create one row, duplicate for each occurrence
  2. **Formula-based:** Use date formulas to calculate next occurrence
  3. **Manual:** Create rows manually for each occurrence

**Example:** For "BTB — Feb High Impact Production Sessions (Tue/Thu 7–9:30)"
- Create separate rows for each Tuesday/Thursday in February
- Or use a single row with date range (Feb 1-28) and note the schedule

---

## ✅ WHAT WAS AUTOMATED

### Successfully Created:
- ✅ Hub page with title and mission callout
- ✅ 3 databases with exact properties
- ✅ All property types (date, number, select, formula, checkbox, rich_text, url)
- ✅ Formula properties (Variance, Progress %, Progress Bar)
- ✅ Select options with colors
- ✅ 12 months seeded in Revenue Gauge
- ✅ 7 tasks seeded in The 2026 Reaping
- ✅ 13 modules seeded in DaVinci Mastery

### Properties Created:
- ✅ Revenue Gauge: Month, Revenue, Target, Variance, Progress %, Progress Bar
- ✅ The 2026 Reaping: Name, Business, Priority, Owner, Timeline, Status, Deliverable Link
- ✅ DaVinci Mastery: Module, Duration, Mastered, Notes, Date Completed

---

## 🎨 RECOMMENDED MANUAL ENHANCEMENTS

After running the automation, enhance manually:

1. **Add Cover Image**
   - Upload company logo or branded image

2. **Create Database Views**
   - Revenue Gauge: Calendar view grouped by Month
   - The 2026 Reaping: Board view grouped by Status, Timeline view
   - DaVinci Mastery: Filtered view showing "Not Mastered" (Mastered = false)

3. **Add Database Templates**
   - Quick-add templates with pre-filled defaults

4. **Style Callouts**
   - Change callout colors to match brand

5. **Add Icons**
   - Add emoji/icons to database titles for visual distinction

---

**Status:** Complete  
**Last Updated:** December 15, 2024

