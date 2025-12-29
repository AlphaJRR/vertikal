# 🛡️ JIM — Compliance Dashboard Template

**Author:** JIM — CSO / System Integrity Architect  
**Status:** 🟢 READY FOR NOTION  
**Purpose:** Protocol compliance tracking

---

## 🗄️ COMPLIANCE SCOREBOARD DATABASE

### Properties
- **Agent** (Title) - Agent name
- **Division** (Select: Exec/Integrity/Tech/Data/Growth/Marketing/Ops/Product/Design)
- **This Week Objective** (Text) - Weekly goal
- **Last Deliverable** (Text) - Most recent output
- **Proof Link** (URL) - Link to deliverable
- **Checklist Attached?** (Checkbox) - Has checklist
- **Scope Creep?** (Select: No / Risk / Yes)
- **Security OK?** (Select: Pass / Needs Fix)
- **Quality OK?** (Select: Pass / Needs Fix)
- **Compliance Status** (Select: ✅ Pass / ⚠️ Warn / 🛑 Block)
- **Next Due** (Date) - Next deliverable date
- **Notes** (Text) - Additional notes

---

## 📋 COMPLIANCE RULES

### Rule 1: Missing Checklist
**Action:** 🛑 **BLOCK**
- If checklist is not attached, compliance status = BLOCK
- Agent cannot proceed until checklist provided

### Rule 2: Scope Creep
**Action:** 🛑 **BLOCK**
- Any redesign/scope change without JR approval = BLOCK
- Must get CEO approval before proceeding

### Rule 3: Missing Proof Links
**Action:** ⚠️ **WARN → BLOCK**
- Missing proof link = WARN
- If not fixed within 24h = BLOCK

---

## 📊 SAMPLE ENTRIES

### CURSOR (Tech)
- **Agent:** CURSOR
- **Division:** Tech
- **This Week Objective:** Video embeds + scroll fix
- **Last Deliverable:** Video sections added to landing page
- **Proof Link:** `docs/VIDEO_EMBED_SETUP.md`
- **Checklist Attached?** ✅ Yes
- **Scope Creep?** No
- **Security OK?** Pass
- **Quality OK?** Pass
- **Compliance Status:** ✅ Pass

---

**Generated:** December 15, 2024  
**Status:** Ready to Import into Notion

