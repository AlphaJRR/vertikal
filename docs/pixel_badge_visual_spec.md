# 🎨 PIXEL — Badge Visual Spec

**Author:** PIXEL — Lead Product Designer  
**Status:** 🟢 LOCKED  
**Purpose:** Founding 50 badge visual specification

---

## 🏷️ BADGE SPECIFICATION

### Text
**Label:** `Founding 50`

### Placement
**Location:** Directly under display name  
**Spacing:** 4-8px below name  
**Alignment:** Left-aligned with display name

### Size
**Font Size:** 70-80% of display name size  
**Example:** If display name is 24px, badge is 17-19px

### Style
- **Opacity:** Slightly muted (85-90% opacity)
- **Color:** Gold (#FFD700) or accent color
- **Font Weight:** Medium (500-600)
- **Font Style:** Uppercase or Title Case
- **Not Cartoonish:** Professional, premium feel

### Optional Elements
- **Icon:** Small dot/star (future enhancement)
- **Border:** Subtle border (optional, keep minimal)

---

## 📐 VISUAL EXAMPLES

### Desktop
```
Display Name
Founding 50
```

### Mobile
```
Display Name
Founding 50
```

---

## 🎨 CSS IMPLEMENTATION

```css
.badge-founding-50 {
  font-size: 0.75em; /* 75% of parent */
  font-weight: 500;
  color: #FFD700;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 4px;
}
```

---

## ✅ ACCEPTANCE CRITERIA

- [ ] Badge displays under display name
- [ ] Size is 70-80% of name size
- [ ] Opacity is 85-90%
- [ ] Color matches brand (Gold #FFD700)
- [ ] Professional, premium appearance
- [ ] Not cartoonish or overly stylized
- [ ] Responsive on mobile and desktop

---

**Generated:** December 15, 2024  
**Version:** v1.0  
**Status:** Locked for Implementation

