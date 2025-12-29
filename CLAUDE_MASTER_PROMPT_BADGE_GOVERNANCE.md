# 🎯 CLAUDE MASTER PROMPT — FOUNDING 50 BADGE GOVERNANCE

**Copy everything below this line into Claude's master prompt:**

---

## 🏆 FOUNDING 50 BADGE — GOVERNANCE RULES (MANDATORY)

### **OFFICIAL BADGE IDENTIFIER**

**Asset Name:** `VERTIKAL_BADGE_CREATOR_FOUNDING50_GOLD_TITANIUM`

This is the **only approved Founding 50 badge**. All references must use this identifier.

---

### **APPROVED SURFACES (WHERE BADGE MAY APPEAR)**

The Founding 50 badge may appear **only** on:

- ✅ Creator dashboard
- ✅ Creator public profile
- ✅ Internal creator listings
- ✅ Official Vertikal-issued merchandise
- ✅ Official Vertikal-issued certificates or cards

---

### **PROHIBITED USAGE (WHERE BADGE MAY NOT APPEAR)**

The badge may **never** be used:

- ❌ As the Vertikal brand logo
- ❌ In headers or navigation
- ❌ On marketing hero sections
- ❌ On investor or network materials
- ❌ In paid ads without Founder approval
- ❌ On third-party merchandise
- ❌ As a favicon or app icon

**Critical:** If badge text appears in headers/navigation, remove it immediately.

---

### **VISUAL RULES (MANDATORY)**

- **Badge color:** Gold Titanium only (`#FFD700`)
- **No recoloring:** Never modify badge colors
- **No gradients added:** Badge must use solid Gold Titanium
- **No text embedded inside badge:** Text must be overlaid externally
- **Numbers must be overlaid externally:** Format: "Founding 50 · #01 – #50"
- **Minimum digital size:** 24px
- **Clear space:** ½ badge height on all sides

---

### **NUMBERING SYSTEM (REQUIRED)**

Each Founding 50 badge must display a unique number:

- **Format:** `Founding 50 · #01` through `Founding 50 · #50`
- **Assignment:** Automatic, chronological, immutable
- **Never reused:** Numbers are permanent once assigned
- **Database field:** `profiles.founding50Number` (1-50, unique, immutable)

**Implementation:**
```typescript
// Display logic
{isFounding50 && (
  <View style={styles.badge}>
    <Text style={styles.badgeText}>
      FOUNDING 50 · #{String(founding50Number).padStart(2, '0')}
    </Text>
  </View>
)}
```

---

### **DIGITAL VS PHYSICAL**

**Digital Use:**
- SVG or PNG only
- Retina-safe exports required
- Use official identifier: `VERTIKAL_BADGE_CREATOR_FOUNDING50_GOLD_TITANIUM`

**Physical Use:**
- Vector files only (AI / EPS)
- Foil or metallic finishes allowed
- No screen-print gradients

---

### **ELIGIBILITY REQUIREMENTS**

Badge is awarded **only** to:

- The first 50 creators who:
  - Successfully onboard to Vertikal
  - Complete identity verification
  - Upload at least one approved film
  - Refer **four (4)** additional creators who complete onboarding

Badge status is **permanent once unlocked**.

---

### **GOVERNANCE ENFORCEMENT**

- The Founding 50 badge is governed exclusively by Vertikal
- Unauthorized usage may result in badge revocation
- No modifications permitted without Founder approval
- Badge governance overrides all marketing preferences

**Default-to-Safe Rule:** If any uncertainty exists regarding badge usage, the default action is **NON-DEPLOYMENT** until explicit Founder approval is granted.

---

## 🎨 LOGO COMPLIANCE RULES (MANDATORY)

### **LOGO COLORS**

- **Main Logo:** Purple-blue gradient (`var(--vertikal-blue)` to `var(--vertikal-purple)`)
- **Investor Logo:** Black (`var(--vertikal-black)`)
- **Gold:** **ONLY** for Founding 50 badges, **NEVER** for logos

**Critical:** Gold (`#FFD700`, `#D4AF37`) must **never** be used in logo CSS. Gold is exclusively for badges.

---

### **LOGO ASSET PATHS**

**Canonical Logo Assets:**
1. **Main Logo:** Inline SVG in HTML files (purple-blue gradient)
2. **Investor Logo:** Inline SVG (black)
3. **Founding 50 Badge:** `VERTIKAL_BADGE_CREATOR_FOUNDING50_GOLD_TITANIUM.png` (badge only, not logo)

**Never use:** Gold logos, hardcoded gold in logo CSS, or gold gradients for logos.

---

## ✅ VERIFICATION CHECKLIST

**Before deploying any badge or logo changes:**

- [ ] Badge appears only on approved surfaces (profile, dashboard, listings)
- [ ] Badge NOT in headers/navigation
- [ ] Badge NOT in marketing hero sections
- [ ] Badge uses Gold Titanium color (`#FFD700`) only
- [ ] No recoloring or gradients added to badge
- [ ] Logo uses purple-blue gradient (not gold)
- [ ] Gold ONLY used for badges (never logos)
- [ ] Official badge identifier used (`VERTIKAL_BADGE_CREATOR_FOUNDING50_GOLD_TITANIUM`)
- [ ] Numbering system implemented (if applicable)

---

**Priority:** P0 — Governance violations block launch  
**Status:** Mandatory compliance required

