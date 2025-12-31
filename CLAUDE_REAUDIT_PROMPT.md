# 🔍 CLAUDE RE-AUDIT PROMPT — POST-FIX VERIFICATION

**Date:** December 31, 2024  
**Standard:** B+ (87/100) minimum — anything below is FAIL  
**Purpose:** Complete re-evaluation after all audit fixes

---

## INSTRUCTIONS FOR CLAUDE

You are auditing the Vertikal live site AFTER all critical fixes have been applied. Your job is to verify that every violation has been resolved and that the site meets production standards.

**GRADING SCALE:**
- **A (93-100):** Production ready, exceeds standards
- **B+ (87-92):** Production ready, meets standards ✅ MINIMUM PASS
- **B (80-86):** Needs minor fixes before production
- **C+ (77-79):** Needs significant fixes
- **C (70-76):** Major issues remain
- **D (60-69):** Critical failures
- **F (<60):** Not production ready

**ANYTHING BELOW B+ (87/100) = FAIL**

---

## AUDIT CHECKLIST

### 1. PAGE EXISTENCE VERIFICATION

**Test these URLs:**
- `https://vertikalapp.com` (main site)
- `https://creators.vertikalapp.com` (creators subdomain)
- `https://networks.vertikalapp.com` (networks subdomain)
- `https://investors.vertikalapp.com` (investors subdomain)
- `https://beta.vertikalapp.com` (beta hub)

**Verify:**
- [ ] All 5 pages load without 404 errors
- [ ] Each page displays correct content for its audience
- [ ] Navigation links between pages work
- [ ] Tagline "CINEMA ISN'T DYING — IT'S ROTATING" appears on all pages

**Scoring:**
- All pages load: +20 points
- Any 404: -20 points per page
- Missing tagline: -5 points per page

---

### 2. FEATURE NAMING CONSISTENCY

**Search for:**
- "VibeCode" (case-insensitive)
- "vibecode"
- "VIBECODE"
- Any variation of the old name

**Verify:**
- [ ] ZERO instances of "VibeCode" anywhere
- [ ] All references use "VIBE™" (with trademark symbol)
- [ ] Section headings say "VIBE™" not "VibeCode"
- [ ] No duplicate "VIBE™ (VIBE™)" instances

**Scoring:**
- 0 instances of old name: +15 points
- 1-2 instances: -5 points each
- 3+ instances: -15 points

---

### 3. BADGE SYSTEM COMPLIANCE

**Homepage (`vertikalapp.com`):**
- [ ] Shows all 4 badges (Gold, Green, Blue, Titanium)
- [ ] Green badge copy is 3-5 sentences explaining economic engine
- [ ] Badge images load from `/assets/badges/badge-*.jpg`
- [ ] Badges are explained as "earned, not bought"

**Creators Page (`creators.vertikalapp.com`):**
- [ ] Has "YOUR BADGE" section
- [ ] Shows Gold badge (Founding 50) with full explanation
- [ ] Shows Blue badge (Visionary) with full explanation
- [ ] NO investor badges (Green) on creators page
- [ ] NO network badges (Titanium) on creators page
- [ ] Scarcity messaging present (50 spots, 51-200)

**Networks Page (`networks.vertikalapp.com`):**
- [ ] Shows ONLY Titanium badge
- [ ] NO Gold, Green, or Blue badges
- [ ] Explains studio-level authority
- [ ] Mentions priority access to vetted talent

**Investors Page (`investors.vertikalapp.com`):**
- [ ] Shows ONLY Green badge
- [ ] NO Gold, Blue, or Titanium badges
- [ ] Badge copy is 3-5 sentences
- [ ] Explains economic engine (watch time → jobs → revenue)

**Beta Hub (`beta.vertikalapp.com`):**
- [ ] Shows badge comparison table
- [ ] Explains why badges matter
- [ ] Routes to all three audience entry points

**Scoring:**
- Correct badges per page: +20 points
- Wrong badges on page: -10 points each
- Missing badge explanations: -5 points each
- Badge images broken: -5 points each

---

### 4. CTA ROUTING VERIFICATION

**Test every button/link:**

**Homepage:**
- [ ] "Join The Movement" → Routes to `/apply/` (not `#`)
- [ ] "Watch Live Demo" → Routes to `/demo` (not `#`)
- [ ] "View The Thesis" → Routes to `/invest/` (not `investors/index.html`)

**Creators Page:**
- [ ] "Enter Studio" / "Claim Gold Status" → Routes to `/apply/`
- [ ] All navigation links work

**Networks Page:**
- [ ] "Apply as Network" → Routes to `/apply/`
- [ ] "Watch Live Demo" → Routes to `/demo` or shows modal

**Investors Page:**
- [ ] "Request Pitch Deck" → Routes to `/invest/`
- [ ] All CTAs route somewhere real

**Beta Page:**
- [ ] "Download Beta (TestFlight)" → Routes to `/download/`
- [ ] Entry point buttons route to correct subdomains

**Scoring:**
- All CTAs route correctly: +15 points
- Any `#` placeholder: -5 points each
- Broken link: -10 points each

---

### 5. JOB POSTING SYSTEM EXPLANATION

**Homepage:**
- [ ] Has "JOBS INSIDE THE PLATFORM" section
- [ ] Explains creators post cast/crew roles
- [ ] Mentions hiring happens inside Vertikal
- [ ] Differentiates from external job boards

**Creators Page:**
- [ ] Has "THE JOB-POSTING WORKFLOW" section
- [ ] Explains 4-step process (Post → Review → Hire → Build)
- [ ] Mentions posting from creator profile
- [ ] Explains verified credits system

**Scoring:**
- Job posting explained on homepage: +10 points
- Job posting explained on creators page: +10 points
- Missing explanation: -10 points per page

---

### 6. INVESTOR BADGE COPY EXPANSION

**Homepage Green Badge:**
- [ ] Copy is 3-5 sentences (not 1-2)
- [ ] Explains how watch time converts to jobs
- [ ] Mentions advertiser revenue → creator payments
- [ ] Mentions job opportunities and IP ownership
- [ ] Mentions early investor benefits

**Investors Page Green Badge:**
- [ ] Copy is 3-5 sentences
- [ ] Explains economic engine
- [ ] Explains closed-loop monetization
- [ ] Mentions permanent ownership signals

**Scoring:**
- Expanded copy on homepage: +10 points
- Expanded copy on investors page: +10 points
- Still too short: -5 points per page

---

### 7. BETA HUB FUNCTIONALITY

**Beta Page (`beta.vertikalapp.com`):**
- [ ] Functions as hub (not just beta info)
- [ ] Aggregates creators/networks/investors entry points
- [ ] Shows badge comparison table
- [ ] Explains why badges matter
- [ ] Explains why early access matters
- [ ] Routes to all three subdomains

**Scoring:**
- Functions as hub: +10 points
- Missing entry points: -5 points each
- Missing badge comparison: -5 points

---

### 8. HERO TAGLINE UPDATE

**Homepage:**
- [ ] Hero tagline is NOT "STOP ROTATING YOUR PHONE"
- [ ] Tagline is confident/aspirational (e.g., "CINEMA BUILT FOR HOW YOU WATCH")
- [ ] Tagline is not aggressive/confrontational

**Scoring:**
- Tagline updated: +5 points
- Still aggressive: -5 points

---

### 9. VIBE™ REFERENCE ON CREATORS PAGE

**Creators Page:**
- [ ] Mentions VIBE™ somewhere (not just badges)
- [ ] One-liner under CTA or in feature section
- [ ] Connects creators to platform features

**Scoring:**
- VIBE™ reference present: +5 points
- Missing: -5 points

---

### 10. CROSS-PAGE CONSISTENCY

**Verify:**
- [ ] Logo placement consistent (top-left)
- [ ] Navigation structure consistent
- [ ] Badge paths consistent (`/assets/badges/`)
- [ ] Tagline present on all pages
- [ ] Visual aesthetic consistent (black-first)

**Scoring:**
- Consistent across pages: +10 points
- Inconsistencies: -2 points each

---

## SCORING SUMMARY

**Total Possible Points: 150**

**Grade Calculation:**
- 140-150 points (93-100%): **A** — Production ready, exceeds standards
- 130-139 points (87-92%): **B+** — Production ready, meets standards ✅ MINIMUM PASS
- 120-129 points (80-86%): **B** — Needs minor fixes
- 115-119 points (77-79%): **C+** — Needs significant fixes
- 105-114 points (70-76%): **C** — Major issues remain
- 90-104 points (60-69%): **D** — Critical failures
- <90 points (<60%): **F** — Not production ready

**ANYTHING BELOW B+ (130 points / 87%) = FAIL**

---

## OUTPUT FORMAT

Provide your audit in this format:

```
# VERTIKAL LIVE PAGE RE-AUDIT
**Date:** [Date]
**Auditor:** Claude
**Standard:** B+ (87/100) minimum

## EXECUTIVE SUMMARY
[Overall grade, production ready status, critical issues count]

## PAGE-BY-PAGE ANALYSIS

### vertikalapp.com
**Grade:** [Letter Grade]
**Score:** [X/100]
**Status:** ✅ PASS / ⚠️ PARTIAL PASS / ❌ FAIL

**Issues Found:**
- [List any violations]

### creators.vertikalapp.com
[Same format]

### networks.vertikalapp.com
[Same format]

### investors.vertikalapp.com
[Same format]

### beta.vertikalapp.com
[Same format]

## DETAILED SCORING

### 1. Page Existence: [X/20]
### 2. Feature Naming: [X/15]
### 3. Badge System: [X/20]
### 4. CTA Routing: [X/15]
### 5. Job Posting: [X/20]
### 6. Investor Copy: [X/20]
### 7. Beta Hub: [X/10]
### 8. Hero Tagline: [X/5]
### 9. VIBE™ Reference: [X/5]
### 10. Consistency: [X/10]

**TOTAL SCORE: [X/150] = [X%]**
**GRADE: [Letter]**

## PRODUCTION READINESS
✅ PRODUCTION READY / ❌ NOT PRODUCTION READY

[If not ready, list blockers]

## RECOMMENDATIONS
[Any suggestions for improvement]
```

---

## CRITICAL REMINDERS

1. **B+ (87/100) is the MINIMUM PASS** — anything below fails
2. **Be thorough** — check every page, every link, every badge
3. **Be specific** — cite exact violations with line numbers/URLs if possible
4. **Be honest** — if something is broken, call it out
5. **Be constructive** — provide actionable fixes for any failures

---

## START YOUR AUDIT NOW

Visit each page, test every link, verify every badge, check every CTA. Leave no stone unturned. The site must meet B+ standards or it fails.

**BEGIN AUDIT.**

