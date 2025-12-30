# 🔒 DEPLOY KILL-SWITCH CHECKLIST

**MANDATORY:** This checklist MUST be completed before ANY deployment goes live.

**RULE:** If ANY answer is "NO" → **DEPLOY IS BLOCKED**

---

## ✅ PRE-DEPLOY VALIDATION GATE

### **1️⃣ CREATORS PAGE** (`creators.vertikalapp.com`)

#### Badge Check:
- [ ] **ONLY** Gold badge visible (Founding 50)
- [ ] **ONLY** Blue badge visible (Verified Creators)
- [ ] **NO** Green badge visible
- [ ] **NO** Titanium badge visible
- [ ] **NO** generic Vertikal branding (must use creators logo or fallback)

#### Content Check:
- [ ] "BUILD FRANCHISES. NOT JUST FOLLOWERS." hero present
- [ ] V Badge System section exists with explanation
- [ ] Badge explanation includes founding tiers
- [ ] Monetization section present (short-series economics)
- [ ] Black ownership language present
- [ ] Founding 50 signup form present
- [ ] **NO** generic Vertikal homepage copy

#### Depth Check:
- [ ] Content is presentation-depth (not landing-page thin)
- [ ] Each section has substantive explanation
- [ ] No placeholder text or "coming soon" language

**STATUS:** ✅ PASS / ❌ FAIL

---

### **2️⃣ INVESTORS PAGE** (`investors.vertikalapp.com`)

#### Badge Check:
- [ ] **ONLY** Green badge visible (Investors)
- [ ] **NO** Gold badge visible
- [ ] **NO** Blue badge visible
- [ ] **NO** Titanium badge visible
- [ ] Core Vertikal logo (NOT investor badge logo)

#### Content Check:
- [ ] "PRE-SEED • $500K TARGET" headline present
- [ ] "THE VERTICAL HOLLYWOOD" subhead present
- [ ] Three tier cards present:
  - [ ] FOUNDING PARTICIPANT: $1,000 – $4,999
  - [ ] STRATEGIC PARTICIPANT: $5,000 – $24,999
  - [ ] LEAD PARTICIPANT: $25,000+
- [ ] Badge explanation ≤ 340 characters
- [ ] Exclusivity language present
- [ ] Pre-launch language present
- [ ] Magic link signup form present

#### Depth Check:
- [ ] Content is presentation-depth (not landing-page thin)
- [ ] Investment thesis is substantive
- [ ] No placeholder text

**STATUS:** ✅ PASS / ❌ FAIL

---

### **3️⃣ NETWORKS PAGE** (`networks.vertikalapp.com`)

#### Badge Check:
- [ ] **ONLY** Titanium badge visible (Networks)
- [ ] **NO** Gold badge visible
- [ ] **NO** Green badge visible
- [ ] **NO** Blue badge visible
- [ ] Core Vertikal logo

#### Content Check:
- [ ] "THE FOUNDING 50 NETWORKS" headline present
- [ ] Network application form present
- [ ] Clear "why networks join" value proposition
- [ ] Pipeline language present
- [ ] Leverage language present
- [ ] Studio-grade IP engine positioning

#### Depth Check:
- [ ] Content is presentation-depth (not landing-page thin)
- [ ] Value proposition is substantive
- [ ] No placeholder text

**STATUS:** ✅ PASS / ❌ FAIL

---

## 🚨 KILL-SWITCH DECISION

**ALL THREE PAGES MUST PASS:**

- [ ] Creators: ✅ PASS
- [ ] Investors: ✅ PASS
- [ ] Networks: ✅ PASS

**IF ANY FAIL:** 
- ❌ **DEPLOY BLOCKED**
- Fix issues
- Re-run validation
- **DO NOT PROCEED** until all pass

**IF ALL PASS:**
- ✅ **DEPLOY APPROVED**
- Proceed with deployment

---

## 📋 VERIFICATION PROCESS

### Step 1: Generate Content
- Use master prompt verbatim
- No modifications
- No "helpful" additions

### Step 2: Self-Audit
- Check each page against checklist above
- Answer YES/NO for each item
- Document any failures

### Step 3: External Verification (Optional)
- Paste output to verifier
- Receive PASS/FAIL
- Fix if FAIL

### Step 4: Deploy
- Only if all checks pass
- Deploy via GitHub Actions or manual upload
- Verify deployment shows "MANY files" (NOT 1)

---

## 🔍 POST-DEPLOY VERIFICATION

After deployment completes:

1. **Open incognito window**
2. **Test each URL:**
   - https://creators.vertikalapp.com
   - https://investors.vertikalapp.com
   - https://networks.vertikalapp.com

3. **Verify:**
   - Correct badges visible
   - Correct content present
   - No generic homepage copy
   - All sections render fully

4. **If any fail:**
   - Rollback immediately
   - Fix issues
   - Re-deploy after validation

---

## ⚠️ COMMON FAILURE MODES

### Failure Mode 1: Skipping Validation
- **Symptom:** Deploying without running checklist
- **Prevention:** Make checklist mandatory
- **Consequence:** Deploy blocked until checklist complete

### Failure Mode 2: Layout-First Implementation
- **Symptom:** Content blocks deferred, placeholder text
- **Prevention:** Content must be complete before layout
- **Consequence:** Deploy blocked until content complete

### Failure Mode 3: Post-Generation Alteration
- **Symptom:** Content changed after generation
- **Prevention:** Lock content after validation passes
- **Consequence:** Re-validate if content altered

---

## 📝 VALIDATION LOG

**Date:** _______________

**Validator:** _______________

**Creators Status:** ✅ PASS / ❌ FAIL

**Investors Status:** ✅ PASS / ❌ FAIL

**Networks Status:** ✅ PASS / ❌ FAIL

**Overall Status:** ✅ APPROVED / ❌ BLOCKED

**Notes:** _______________

---

**END OF CHECKLIST**

