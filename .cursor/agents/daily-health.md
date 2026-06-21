# AVA Daily Health Check Subagent
# Trigger: "morning check" | "daily check" | "health check" | "status check" | "what's broken"
# Place at: .cursor/agents/daily-health.md

## ROLE
You are the AVA Platform Health Agent. Run automatically at session start or on trigger.
Diagnose the full platform state in under 2 minutes and report to Joshua.

## TRIGGER PHRASES
- "morning check"
- "daily check"
- "health check"
- "what's the status"
- "what's broken"
- "platform status"

## EXECUTION SEQUENCE

### 1 — Repo integrity
```bash
cd /Users/alphavisualartists/Vertikal-App

# Canonical entry point
ENTRY=$(cat package.json | grep '"main"' | tr -d ' ",:')
echo "Entry: $ENTRY"
[ "$ENTRY" = "mainexpo-router/entry" ] && echo "✅ Entry correct" || echo "🚫 WRONG ENTRY POINT"

# Dead path check
[ -d "artifacts/ava-mobile" ] && echo "🚫 DEAD PATH: artifacts/ava-mobile exists" || echo "✅ artifacts/ava-mobile gone"
[ -f "App.tsx" ] && echo "🚫 DEAD PATH: App.tsx exists" || echo "✅ App.tsx gone"
[ -d "src" ] && echo "⚠️ src/ still exists" || echo "✅ src/ gone"

# EAS project ID
echo "EAS project: $(cat eas.json | grep projectId)"
# Expected: 39911e65-82a6-47ca-af2b-3769a15817df

# Git status
echo ""
echo "=== GIT STATUS ==="
git status --short
git log --oneline -5
```

### 2 — Lesson curriculum check
```bash
# Confirm curriculum is wired
grep -l "toolkitCurriculum" app/ components/ --include="*.tsx" -r | head -5
LESSON_COUNT=$(grep -c "id:" data/toolkitCurriculum.ts 2>/dev/null || echo "0")
echo "Lessons in curriculum: $LESSON_COUNT"
[ "$LESSON_COUNT" -ge 108 ] && echo "✅ 108+ lessons" || echo "🚫 Curriculum incomplete: $LESSON_COUNT lessons"

# HTML slides
SLIDE_COUNT=$(ls assets/creators-toolkit/slides/**/*.html 2>/dev/null | wc -l)
echo "HTML slides: $SLIDE_COUNT (expect 48)"
```

### 3 — TypeScript health
```bash
npx tsc --noEmit 2>&1 | tail -5
[ $? -eq 0 ] && echo "✅ TypeScript clean" || echo "🚫 TypeScript errors — fix before next deploy"
```

### 4 — Live URL checks
```bash
AVA=$(curl -s -o /dev/null -w "%{http_code}" https://alphavisualartists.com)
SHOP=$(curl -s -o /dev/null -w "%{http_code}" https://shop.alphavisualartists.com)
VERTIKAL=$(curl -s -o /dev/null -w "%{http_code}" https://vertikalapp.com)
echo "alphavisualartists.com: $AVA"
echo "shop.alphavisualartists.com: $SHOP"  
echo "vertikalapp.com: $VERTIKAL"
[ "$AVA" = "200" ] && echo "✅ AVA website live" || echo "🚫 AVA website DOWN"
[ "$VERTIKAL" = "200" ] && echo "✅ Vertikal live" || echo "🚫 Vertikal DOWN"
```

### 5 — Uncommitted changes check
```bash
UNCOMMITTED=$(git status --short | wc -l)
if [ "$UNCOMMITTED" -gt 0 ]; then
  echo "⚠️ $UNCOMMITTED uncommitted files — commit before starting work"
  git status --short
else
  echo "✅ Working tree clean"
fi
```

## REPORT FORMAT
```
═══════════════════════════════════════
AVA DAILY HEALTH REPORT — [DATE]
═══════════════════════════════════════
MOBILE APP
  Entry point:     ✅/🚫
  Dead paths:      ✅/🚫
  EAS project:     39911e65 ✅/🚫
  Lessons:         108 ✅/🚫
  HTML slides:     48 ✅/🚫
  TypeScript:      ✅/🚫

LIVE URLS
  AVA website:     ✅/🚫
  Shop:            ✅/🚫
  Vertikal:        ✅/🚫

GIT
  Uncommitted:     [n] files
  Last commit:     [message]

TODAY'S BLOCKERS
  [list any 🚫 items above]

RECOMMENDED FIRST ACTION
  [one sentence]
═══════════════════════════════════════
```
