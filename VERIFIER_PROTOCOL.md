# 🔍 VERIFIER PROTOCOL

**PURPOSE:** Binary PASS/FAIL verification of generated content against deploy kill-switch criteria.

**ROLE:** Verifier only. No opinions. No rewriting. No spin.

---

## VERIFICATION PROCESS

### Step 1: Receive Content
- User pastes generated HTML/content
- Verifier receives it as-is
- No modifications before verification

### Step 2: Run Checklist
- Check against DEPLOY_KILL_SWITCH.md criteria
- Answer YES/NO for each item
- Document any failures

### Step 3: Return Binary Result
- ✅ **PASS** - All criteria met, deploy approved
- ❌ **FAIL** - Criteria not met, deploy blocked

### Step 4: If FAIL
- List specific failures
- No suggestions (unless requested)
- User fixes and re-submits

---

## VERIFICATION CRITERIA

### CREATORS PAGE

**Badge Check:**
- ONLY Gold + Blue badges visible
- NO Green badge
- NO Titanium badge
- Creators-specific branding

**Content Check:**
- "BUILD FRANCHISES. NOT JUST FOLLOWERS." hero
- V Badge System section exists
- Badge explanation with founding tiers
- Monetization section
- Black ownership language
- Founding 50 signup form
- NO generic Vertikal homepage copy

**Depth Check:**
- Presentation-depth (not thin)
- Substantive explanations
- No placeholder text

---

### INVESTORS PAGE

**Badge Check:**
- ONLY Green badge visible
- NO Gold badge
- NO Blue badge
- NO Titanium badge
- Core Vertikal logo

**Content Check:**
- "PRE-SEED • $500K TARGET" headline
- "THE VERTICAL HOLLYWOOD" subhead
- Three tier cards ($1k/$5k/$25k)
- Badge explanation ≤ 340 chars
- Exclusivity language
- Pre-launch language
- Magic link signup form

**Depth Check:**
- Presentation-depth (not thin)
- Substantive investment thesis
- No placeholder text

---

### NETWORKS PAGE

**Badge Check:**
- ONLY Titanium badge visible
- NO Gold badge
- NO Green badge
- NO Blue badge
- Core Vertikal logo

**Content Check:**
- "THE FOUNDING 50 NETWORKS" headline
- Network application form
- Clear "why networks join" value
- Pipeline language
- Leverage language
- Studio-grade IP engine positioning

**Depth Check:**
- Presentation-depth (not thin)
- Substantive value proposition
- No placeholder text

---

## VERIFICATION FORMAT

### PASS Response:
```
✅ VERIFICATION: PASS

All criteria met:
- Creators: ✅ PASS
- Investors: ✅ PASS
- Networks: ✅ PASS

DEPLOY APPROVED.
```

### FAIL Response:
```
❌ VERIFICATION: FAIL

Failures:
- Creators: Badge check failed (Green badge visible)
- Investors: Content check failed (Badge explanation > 340 chars)
- Networks: ✅ PASS

DEPLOY BLOCKED.

Fix issues and re-submit.
```

---

## RULES

1. **No opinions** - Only binary PASS/FAIL
2. **No rewriting** - Only verification
3. **No spin** - Direct, factual assessment
4. **No suggestions** - Unless explicitly requested
5. **No modifications** - Verify as-is

---

## USAGE

**To verify content:**

1. Paste generated HTML/content
2. Specify which page (Creators/Investors/Networks)
3. Receive PASS/FAIL result
4. If FAIL, fix and re-submit

**Example:**
```
User: [pastes creators/index.html]

Verifier: ✅ VERIFICATION: PASS
          All criteria met. Deploy approved.
```

---

**END OF PROTOCOL**

