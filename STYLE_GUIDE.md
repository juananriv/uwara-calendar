# Rotaract Uwara Kik' — Style Guide

Use this as a reference to replicate the same look and feel in presentations, documents, or other projects.

---

## Font

**Outfit** (Google Fonts)
- Weights used: 300 · 400 · 500 · 600 · 700 · 800
- Smoothing: antialiased
- Fallback: system-ui, sans-serif

---

## Colors

| Name | Hex | Use |
|------|-----|-----|
| **Cranberry** | `#d41367` | Primary brand color — accents, CTAs, active states |
| Cranberry Tint | `#fce7ef` | Pill / badge backgrounds on cranberry items |
| Cranberry Wash | `#fdf3f7` | Subtle section backgrounds, hover states |
| **Ink 1000** | `#0e0a14` | Headings, titles — darkest text |
| Ink 700 | `#3d3445` | Body text, descriptions |
| Ink 600 | `#5a505f` | Secondary body text, meta info |
| Ink 500 | `#7a7280` | Muted text, labels, icons |
| Ink 400 | `#9c95a3` | Placeholders, inactive tabs, timestamps |
| Ink 200 | `#e3dfe6` | Dividers, borders |
| Ink 100 | `#f1eef3` | Card borders, subtle separators |
| Ink 50 | `#f7f5f8` | Chip backgrounds, subtle fills |
| Ink 25 | `#fbfafc` | Page / content area background |
| **Paper** | `#ffffff` | Card surfaces, modals |
| **Blue** | `#1a6fa8` | Secondary accent (sessions / info items) |
| Blue Tint | `#e8f4fd` | Blue pill backgrounds |
| Blue Border | `#b8d8f0` | Blue pill borders |

---

## Text Sizes & Styles

| Role | Size | Weight | Color | Notes |
|------|------|--------|-------|-------|
| Display / Hero title | 26 px | 800 | Ink 1000 | Letter-spacing −0.03em, line-height 1.0 |
| Section heading (month) | 22 px | 800 | Ink 1000 | Letter-spacing −0.03em |
| Card title (large) | 15 px | 800 | Ink 1000 | Letter-spacing −0.025em |
| Card title (normal) | 14 px | 700 | Ink 1000 | Letter-spacing −0.02em |
| Body / description | 13 px | 400 | Ink 700 | Line-height 1.6 |
| Small body | 12 px | 400 | Ink 600 | Line-height 1.55 |
| Meta / timestamp | 11 px | 500 | Ink 500 | — |
| Tab label | 10–11 px | 700 | Ink 400 → Cranberry (active) | — |
| Eyebrow / overline | 9–10 px | 800 | Cranberry or Ink 500 | UPPERCASE, letter-spacing 0.18–0.22em |
| Stat number | 18 px | 700 | Cranberry | Letter-spacing −0.03em |
| Brand name | 13 px | 700 | Ink 1000 | Letter-spacing −0.02em |
| Brand tagline | 9 px | 600 | Ink 500 | UPPERCASE, letter-spacing 0.18em |

---

## Spacing & Layout

- Base card padding: **12–14 px**
- Section padding: **16 px horizontal**
- Gap between cards: **8 px**
- Border radius — cards: **14 px**, small chips: **999 px** (pill), detail panels: **18 px**, icon boxes: **8–10 px**

---

## Shadows & Borders

- Card border: `1px solid var(--ink-100)` — very subtle
- Accent left border on reminders: `3px solid cranberry`
- Active card on open: `border-color rgba(212,19,103,0.3)` + cranberry-wash background
- No drop shadows — separation is done with background color contrast and thin borders

---

## Interaction States

| Element | Default | Active / Selected |
|---------|---------|-------------------|
| Tabs | Ink 400 text, no underline | Cranberry text + 2px cranberry underline |
| Sub-tabs | Same as tabs | Same as tabs |
| Cards (tap) | Normal | `transform: scale(0.98)` |
| Acta cards | White background | Cranberry-wash background + cranberry border |
| Dots (carousel) | 6 px circle, Ink 200 | 18 px pill, Cranberry |
| Panels (slide-in) | `translateX(100%)` | `translateX(0)`, transition 320 ms ease |

---

## Transitions

- Tab / subtab color: `140 ms` — instant feel
- Card press scale: `140 ms`
- Carousel slide: `500 ms cubic-bezier(.22, .61, .36, 1)` — natural deceleration
- Detail panel slide: `320 ms cubic-bezier(.22, .61, .36, 1)`
- Carousel dot expand: `300 ms`

---

## Badges & Pills

- **Type pill**: 9 px · weight 800 · UPPERCASE · letter-spacing 0.14em · border-radius 999 px
  - Session (blue): blue-tint bg, blue text, blue-border border
  - Event / Project (cranberry): cranberry-tint bg, cranberry text
  - Guest / neutral: ink-50 bg, ink-600 text, ink-200 border
- **Eyebrow overline**: 9–10 px · weight 800 · cranberry or ink-500 · UPPERCASE · wide letter-spacing
- **Deadline chip**: 10 px · weight 700 · cranberry text · cranberry-wash bg · pill shape

---

## Images

- Carousel aspect ratio: **16:9**, border-radius 14 px
- Project cover: fixed height ~90 px, full-width, no border-radius on the image itself (parent clips)
- Flyer / lightbox: **9:16** portrait, border-radius 12 px
- Overlaid badges on images: semi-transparent white (`rgba(255,255,255,0.18)`) pill, white text, 9 px / weight 700

---

## Brand Logo

- Circle 30×30 px, cranberry background
- White initials inside, 10 px / weight 800
- Sits next to brand name + tagline in a horizontal row

---

## Presentation Quick-Reference

> **Primary brand color:** `#d41367`
> **Dark text:** `#0e0a14`
> **Body text:** `#3d3445`
> **Subtle background:** `#fbfafc`
> **Card surface:** `#ffffff`
> **Font:** Outfit (Google Fonts), weights 400–800
> **Style keywords:** clean, minimal, tight letter-spacing on headings, pill shapes, cranberry as the only vivid accent
