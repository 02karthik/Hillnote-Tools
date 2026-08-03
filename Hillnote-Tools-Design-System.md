---
version: alpha
name: Hillnote-Tools-Design-System
description: The design language for Hillnote's tools surface — a heavy near-black display sans (Manrope at weight 800–900, 64–126 px) paired with a vivid azure brand accent, cool mist-tinted surface neutrals, and rounded white cards on a soft cool-grey canvas; the whole system reads more like a calm editorial knowledge workspace than a developer tool. Dual-scheme — `colors` and `colors-dark` carry the same key set, so every token keeps its role and only its value flips at the `prefers-color-scheme` boundary.

colors:
  primary: "#4d63ff"
  primary-text: "#3b50e0"
  primary-on-ink: "#8b9bff"
  on-primary: "#ffffff"
  primary-active: "#6f82ff"
  primary-neutral: "#b9c4ff"
  primary-pale: "#e6ebff"
  ink: "#111318"
  ink-deep: "#0f1b3d"
  body: "#454852"
  mute: "#868a93"
  canvas: "#ffffff"
  canvas-soft: "#eef0f4"
  line: "#dfe3ec"
  positive: "#22a559"
  positive-deep: "#0c5230"
  positive-pale: "#e2f5ea"
  warning: "#f5b62a"
  warning-deep: "#9a5b00"
  warning-content: "#4a3a1c"
  warning-pale: "#fdf1d8"
  negative: "#e0453f"
  negative-deep: "#b02a2a"
  negative-darkest: "#8f0f16"
  negative-bg: "#2e0a0a"
  negative-pale: "#fbe3e2"
  accent-orange: "#ff9e6b"
  accent-cyan: "#38c9d6"

# Dark mode. Same key set as `colors` — every token keeps its ROLE, only its
# value flips. `canvas` is always the card, `canvas-soft` is always the page,
# `ink` is always the highest-emphasis text. A consumer swaps the whole map at
# the `prefers-color-scheme: dark` boundary and needs no other changes.
colors-dark:
  primary: "#8b9bff"
  primary-text: "#8b9bff"
  primary-on-ink: "#3b50e0"
  on-primary: "#111318"
  primary-active: "#a8b4ff"
  primary-neutral: "#4d63ff"
  primary-pale: "#232842"
  ink: "#eceff5"
  ink-deep: "#c9d3ff"
  body: "#a9b0bf"
  mute: "#7d8494"
  canvas: "#20242e"
  canvas-soft: "#14161b"
  line: "#2f333d"
  positive: "#3ddc84"
  positive-deep: "#86efac"
  positive-pale: "#14301f"
  warning: "#fbbf24"
  warning-deep: "#fcd34d"
  warning-content: "#fde68a"
  warning-pale: "#33280d"
  negative: "#ff6b63"
  negative-deep: "#ff9490"
  negative-darkest: "#ffc4c1"
  negative-bg: "#2e0a0a"
  negative-pale: "#3a1412"
  accent-orange: "#ff9e6b"
  accent-cyan: "#38c9d6"

typography:
  display-mega:
    fontFamily: Manrope, Inter, system-ui, -apple-system, sans-serif
    fontSize: 126px
    fontWeight: 900
    lineHeight: 107.1px
  display-xxl:
    fontFamily: Manrope, Inter, system-ui, sans-serif
    fontSize: 96px
    fontWeight: 900
    lineHeight: 81.6px
  display-xl:
    fontFamily: Manrope, Inter, system-ui, sans-serif
    fontSize: 64px
    fontWeight: 900
    lineHeight: 54.4px
  display-lg:
    fontFamily: Manrope, Inter, system-ui, sans-serif
    fontSize: 47px
    fontWeight: 400
    lineHeight: 70.5px
    letterSpacing: -0.108px
  display-md:
    fontFamily: Manrope, Inter, system-ui, sans-serif
    fontSize: 40px
    fontWeight: 900
    lineHeight: 34px
  display-sm:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 32px
    fontWeight: 600
    lineHeight: 38.4px
    letterSpacing: -0.96px
  display-xs:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 24px
    fontWeight: 600
    lineHeight: 31.2px
    letterSpacing: -0.48px
  body-lg:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 20px
    fontWeight: 400
    lineHeight: 30px
  body-md:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
  body-md-strong:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 16px
    fontWeight: 600
    lineHeight: 24px
  body-sm:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  body-sm-strong:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 14px
    fontWeight: 600
    lineHeight: 20px
  caption:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
  button-md:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 16px
    fontWeight: 600
    lineHeight: 24px

rounded:
  none: 0px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 48px

components:
  nav-bar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-strong}"
    padding: "{spacing.md} {spacing.xl}"
  nav-link:
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-strong}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.md} {spacing.xl}"
  button-secondary:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.md} {spacing.xl}"
  button-tertiary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.md} {spacing.xl}"
  button-icon-circular:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "{spacing.sm}"
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.line}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md} {spacing.lg}"
  card-content:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  card-feature-sage:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  card-feature-green:
    backgroundColor: "{colors.primary-pale}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  card-feature-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.primary-on-ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  hero-band:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.display-mega}"
    padding: "{spacing.3xl} {spacing.xl}"
  hero-band-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.primary-on-ink}"
    typography: "{typography.display-mega}"
    padding: "{spacing.3xl} {spacing.xl}"
  content-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-md}"
    padding: "{spacing.3xl} {spacing.xl}"
  capture-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.line}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  badge-positive:
    backgroundColor: "{colors.primary-pale}"
    textColor: "{colors.positive-deep}"
    typography: "{typography.body-sm-strong}"
    rounded: "{rounded.pill}"
    padding: "{spacing.xs} {spacing.md}"
  badge-negative:
    backgroundColor: "{colors.negative-pale}"
    textColor: "{colors.negative-deep}"
    typography: "{typography.body-sm-strong}"
    rounded: "{rounded.pill}"
    padding: "{spacing.xs} {spacing.md}"
  footer:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas-soft}"
    typography: "{typography.body-sm}"
    padding: "{spacing.3xl} {spacing.xl}"

  # ─── Examples (illustrative) — auto-derived; resolve any TO_FILL markers below ───
  ex-pricing-tier:
    description: "Default Pricing tier card. Re-uses feature-card chrome with brand canvas-soft surface."
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    borderColor: "{colors.mute}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  ex-pricing-tier-featured:
    description: "Featured/highlighted tier — polarity-flipped surface (dark fill + light text in light mode, light fill + dark text in dark mode)."
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  ex-product-selector:
    description: "What's Included summary card — re-purposed for SaaS / B2B verticals (NOT a literal product gallery)."
    backgroundColor: "{colors.canvas-soft}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  ex-cart-drawer:
    description: "Subscription summary — re-purposed for SaaS / B2B (line items per add-on, not literal cart)."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
    item-divider: "{colors.canvas-soft}"
  ex-app-shell-row:
    description: "Sidebar nav row inside the App Shell example. Active state uses brand primary as the indicator."
    backgroundColor: "{colors.canvas}"
    activeIndicator: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md} {spacing.lg}"
  ex-data-table-cell:
    description: "Default data-table th + td chrome. Header uses mono-caps eyebrow typography; body uses body-sm."
    headerBackground: "{colors.canvas-soft}"
    headerTypography: "{typography.caption}"
    bodyTypography: "{typography.body-sm}"
    cellPadding: "{spacing.md} {spacing.lg}"
    rowBorder: "{colors.canvas-soft}"
  ex-auth-form-card:
    description: "Sign-in / sign-up card. Re-uses feature-card chrome with text-input primitives inside."
    backgroundColor: "{colors.canvas-soft}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  ex-modal-card:
    description: "Modal dialog surface — same chrome as feature-card with elevated shadow."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  ex-empty-state-card:
    description: "Empty-state illustration frame."
    backgroundColor: "{colors.canvas-soft}"
    rounded: "{rounded.xl}"
    padding: "{spacing.3xl}"
    captionTypography: "{typography.body-md}"
  ex-toast:
    description: "Toast notification surface — feature-card shape + medium shadow."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.xl}"
    padding: "{spacing.md} {spacing.lg}"
    typography: "{typography.body-sm}"

---


## Overview

Hillnote — the markdown-native knowledge workspace — wears its identity in a single signature pairing: a vivid azure `{colors.primary}` (`#4d63ff`) used as the CTA pill and brand accent, set against a soft cool-grey canvas `{colors.canvas-soft}` (`#eef0f4`) that runs across the hero band, and a near-black ink `{colors.ink}` (`#111318`) with a faint cool cast. The surface reads more like a calm editorial magazine than a developer tool — generous whitespace, large rounded cards, and an unusually heavy display sans set at weight 900 carrying every hero headline.

Display typography is the second decisive voice. The `Manrope` family carries hero displays at weight 900 in scales from 64 px up to 126 px on the largest hero. The system pairs Manrope 900 with Inter at weight 600 for sub-displays — the contrast between the chunky geometric face and Inter's neutrality creates a particular hierarchy: Manrope for the brand moment, Inter for everything else.

Cards are universally pill-rounded — `{rounded.xl}` 24 px is the signature card radius. Buttons take the same 24 px pill-rectangle shape. The system never uses sharp corners on UI elements; the visual softness is part of the friendly, approachable voice.

The system is dual-scheme. Everything above describes light mode; `colors-dark` carries the same tokens for dark, where the mist canvas becomes a cool near-black `#14161b` and cards lift to `#20242e`. Surface contrast still carries elevation, and the azure lifts to `#8b9bff` so it survives a dark ground. See [Dark Mode](#dark-mode).

**Key Characteristics:**
- A single azure CTA accent `{colors.primary}` (`#4d63ff`) — the universal primary action color. No second accent.
- Two-face display typography — Manrope (open-source, weight 900, hero scale) + Inter (weight 600, sub-display scale). The contrast is the typographic story.
- `{rounded.xl}` 24 px is the canonical card and button radius. Generous, friendly.
- Cool mist canvas `{colors.canvas-soft}` (`#eef0f4`) is the hero surface; white `{colors.canvas}` is reserved for cards within the canvas band.
- Dual-scheme by OS preference — `colors` / `colors-dark` share one key set, so consumers swap the map and nothing else. No in-product theme toggle.
- A full semantic palette: positive green family, warning amber family, negative red family — each documented with content / hover / active variants for in-product use.
- Capture card on the hero — the signature interactive component, hosting a paste/drop input that turns any source into clean Markdown.

## Colors

### Brand & Accent
- **Hillnote Azure** (`{colors.primary}` — `#4d63ff`): The universal CTA color. Every primary button, every primary action pill, the logo accent.
- **Azure Text** (`{colors.primary-text}` — `#3b50e0`): The same azure darkened for *small text* on light surfaces — eyebrows, links, inline accents. `{colors.primary}` itself only clears 4.05:1 on the mist canvas, which fails AA below 18.66 px. Use `{colors.primary}` for fills, `{colors.primary-text}` for type. This is not a second accent — it is the same hue at an accessible tier.
- **Azure on Ink** (`{colors.primary-on-ink}` — `#8b9bff`): The azure for text sitting on an `{colors.ink}` band — the `card-feature-dark` / `hero-band-dark` moment. It is the *inverse* of `{colors.primary-text}`: because `{colors.ink}` flips polarity with the scheme, the azure on top of it has to flip the opposite way. Light `#8b9bff` on a near-black band, dark `#3b50e0` on a near-white one. Using plain `{colors.primary}` here reads 4.02:1 in light and collapses to 2.22:1 in dark.
- **Azure Active** (`{colors.primary-active}` — `#6f82ff`): The lighter azure for active / hover state.
- **Azure Neutral** (`{colors.primary-neutral}` — `#b9c4ff`): A mid-saturation azure used as a neutral active fill.
- **Azure Pale** (`{colors.primary-pale}` — `#e6ebff`): The lightest azure for soft surface tints / badge backgrounds.

### Surface
- **Canvas** (`{colors.canvas}` — `#ffffff`): Pure white for card interiors.
- **Canvas Soft** (`{colors.canvas-soft}` — `#eef0f4`): The cool mist-tinted page background. Defining mood of the system.
- **Line** (`{colors.line}` — `#dfe3ec`): The hairline rule — input borders, card dividers, table row separators. A cool grey one step off the mist canvas, never full `{colors.ink}` except on the tertiary outline button.

### Text
- **Ink** (`{colors.ink}` — `#111318`): Near-black with a faint cool cast — the default text and headings color.
- **Ink Deep** (`{colors.ink-deep}` — `#0f1b3d`): A deep navy ink used on accent-tinted surfaces.
- **Body** (`{colors.body}` — `#454852`): Secondary body text.
- **Mute** (`{colors.mute}` — `#868a93`): Lowest-priority text — captions, placeholder, fine print.

### Semantic
- **Positive** (`{colors.positive}` — `#22a559`): Success indicator.
- **Positive Deep** (`{colors.positive-deep}` — `#0c5230`): Pressed positive state, and text on positive tints.
- **Positive Pale** (`{colors.positive-pale}` — `#e2f5ea`): Soft green tint for success surfaces.
- **Warning** (`{colors.warning}` — `#f5b62a`): Caution indicator. Amber clears only 1.81:1 on white — treat it as a *fill or icon*, never as text.
- **Warning Deep** (`{colors.warning-deep}` — `#9a5b00`): Pressed warning, and the readable amber for text on white.
- **Warning Content** (`{colors.warning-content}` — `#4a3a1c`): Text on warning surfaces.
- **Warning Pale** (`{colors.warning-pale}` — `#fdf1d8`): Soft amber tint for caution surfaces.
- **Negative** (`{colors.negative}` — `#e0453f`): Destructive / error red. 4.12:1 on white — a fill and icon colour; use `{colors.negative-deep}` for error *text*.
- **Negative Deep** (`{colors.negative-deep}` — `#b02a2a`): Pressed destructive, and the readable red for text.
- **Negative Darkest** (`{colors.negative-darkest}` — `#8f0f16`): Highest-emphasis destructive text.
- **Negative Bg** (`{colors.negative-bg}` — `#2e0a0a`): Dark maroon for destructive callout backgrounds. Already dark — unchanged across both schemes.
- **Negative Pale** (`{colors.negative-pale}` — `#fbe3e2`): Soft red tint for error surfaces.

### Brand Accent — Tertiary
- **Accent Orange** (`{colors.accent-orange}` — `#ff9e6b`): Warm coral used inside illustrative content / pricing cards.
- **Accent Cyan** (`{colors.accent-cyan}` — `#38c9d6`): Bright teal used as a tertiary illustration accent.

Both tertiary accents are mid-lightness and legible on either scheme, so they carry the same value in `colors-dark`.

## Dark Mode

The system is dual-scheme. `colors` is the light palette; `colors-dark` is its counterpart, carrying **the same key set**. Every token keeps its role and only its value flips, so a consumer swaps the whole map at the scheme boundary and changes nothing else:

- `{colors.canvas}` is *always the card*. `{colors.canvas-soft}` is *always the page.*
- `{colors.ink}` is *always the highest-emphasis text*, `{colors.body}` secondary, `{colors.mute}` lowest.
- `{colors.primary}` is *always the CTA fill*, `{colors.on-primary}` *always the label on top of it.*

### The polarity model

Dark mode is **not an inversion** of the light palette. Three rules define it:

1. **The page is the darkest surface; cards sit above it.** Light mode runs mist page → white card. Dark mode runs `#14161b` page → `#20242e` card. The direction of the lift is preserved, so surface contrast still carries elevation and no shadows are needed.
2. **Never pure black.** The dark canvas keeps the same faint cool cast as `{colors.ink}`. Pure `#000` reads harsh and destroys the card lift.
3. **The CTA flips polarity.** In light mode the pill is azure with a near-white label. In dark mode it becomes *light azure with a near-black label* — `primary` lifts to `#8b9bff` and `on-primary` becomes `#111318`. A saturated `#4d63ff` fill on a near-black page reads muddy and puts the label below AA. The lifted azure doubles as the accent-text colour, which is why `primary-text` and `primary` converge in dark mode.

### Implementation contract

Scheme follows the OS via `prefers-color-scheme` — there is no in-product theme toggle. Declare `color-scheme` so native form controls, scrollbars and spell-check underlines follow along:

```css
:root {
  color-scheme: light dark;
  --canvas: #ffffff;  --canvas-soft: #eef0f4;  --line: #dfe3ec;
  --ink: #111318;     --body: #454852;         --mute: #868a93;
  --primary: #4d63ff; --primary-text: #3b50e0; --on-primary: #f4f6ff;
}

@media (prefers-color-scheme: dark) {
  :root {
    --canvas: #20242e;  --canvas-soft: #14161b;  --line: #2f333d;
    --ink: #eceff5;     --body: #a9b0bf;         --mute: #7d8494;
    --primary: #8b9bff; --primary-text: #8b9bff; --on-primary: #111318;
  }
}
```

Consume every colour through a token. A hard-coded `#fff` or `rgba(0,0,0,.3)` is the single most common way a surface fails to flip — including `box-shadow`, `border`, SVG `fill`/`stroke`, and any colour set from JavaScript.

### Contrast & accessibility

Measured WCAG 2.1 ratios for the pairings that carry text. Body copy targets 4.5:1; non-text indicators and `{colors.mute}` fine print target 3:1.

| Pairing | Light | Dark |
|---|---|---|
| `ink` on `canvas` | 18.58:1 | 13.47:1 |
| `ink` on `canvas-soft` | 16.29:1 | 15.71:1 |
| `body` on `canvas` | 9.12:1 | 7.13:1 |
| `mute` on `canvas` | 3.46:1 | 4.14:1 |
| `primary-text` on `canvas-soft` | 5.40:1 | 7.09:1 |
| `primary-text` on `canvas` | 6.16:1 | 6.08:1 |
| `on-primary` on `primary` (CTA label) | 4.62:1 | 7.28:1 |
| `positive-deep` on `positive-pale` | 8.16:1 | 10.16:1 |
| `positive-deep` on `primary-pale` (badge) | 7.81:1 | 10.29:1 |
| `warning-content` on `warning-pale` | 9.80:1 | 11.63:1 |
| `negative-deep` on `negative-pale` | 5.35:1 | 7.67:1 |
| `canvas` vs `canvas-soft` (elevation) | 1.14:1 | 1.17:1 |

**Resolved.** The light CTA label was `#f4f6ff` on `{colors.primary}`, which measured 4.29:1 and fell just short of AA for a 16 px label. `{colors.on-primary}` is now pure `#ffffff`, taking it to 4.62:1 — visually indistinguishable, and it leaves the brand fill `{colors.primary}` untouched. (Darkening the fill to `#4459f0` would have reached 4.95:1 but shifts the brand hue, so it was rejected.)

**Remaining gap.** `{colors.mute}` is a deliberate 3:1 fine-print token and clears that comfortably on every surface in both schemes. It does not reach the stricter 4.5:1 body-text bar: 3.46:1 on `{colors.canvas}` and 3.03:1 on `{colors.canvas-soft}` in light, 4.14:1 and 4.83:1 in dark. Strict WCAG AA grants no exemption for small or low-priority text, so `{colors.mute}` set below 18.66 px is technically non-conforming — most visibly in light mode. Closing it would mean roughly `#686c77` in light and `#8a91a1` in dark, at the cost of visibly heavier fine print throughout. The 3:1 target is retained as an explicit, informed trade-off rather than an oversight.

## Typography

### Font Family
Two faces ladder the system:
1. **Manrope** — an open-source geometric sans with an unusually heavy weight 900 used for all hero displays. The face is the system's typographic signature. Always at weight 900 on the marketing surface, never lighter.
2. **Inter** — used for sub-displays (weight 600), all body, and form labels. Loaded with `font-feature-settings: "calt"` for contextual alternates.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-mega}` | 126px | 900 | 107.1px | 0 | Hero stencil at maximum scale. |
| `{typography.display-xxl}` | 96px | 900 | 81.6px | 0 | Sub-hero scale. |
| `{typography.display-xl}` | 64px | 900 | 54.4px | 0 | Standard hero headline. |
| `{typography.display-lg}` | 47px | 400 | 70.5px | -0.108px | Lighter sub-display. |
| `{typography.display-md}` | 40px | 900 | 34px | 0 | Section / card headlines. |
| `{typography.display-sm}` | 32px | 600 | 38.4px | -0.96px | Inter-rendered section headings. |
| `{typography.display-xs}` | 24px | 600 | 31.2px | -0.48px | Sub-section displays. |
| `{typography.body-lg}` | 20px | 400 | 30px | 0 | Lead paragraphs. |
| `{typography.body-md}` | 16px | 400 | 24px | 0 | Default body. |
| `{typography.body-md-strong}` | 16px | 600 | 24px | 0 | Bold inline body. |
| `{typography.body-sm}` | 14px | 400 | 20px | 0 | Secondary body. |
| `{typography.body-sm-strong}` | 14px | 600 | 20px | 0 | Bold caption / nav-link. |
| `{typography.caption}` | 12px | 400 | 16px | 0 | Fine print. |
| `{typography.button-md}` | 16px | 600 | 24px | 0 | Button label. |

### Principles
- **Weight 900 for hero, weight 600 for everything else.** The display ceiling is full-black weight; everything below is semibold.
- **Manrope for the brand voice, Inter for utility.** Strict role separation.

### Note on Fonts
Both faces are open-source (OFL), so the system carries no proprietary font dependency.
- **Display** — *Manrope* at weight 800 / 900 provides the geometric heaviness. *Inter* at weight 900 or *Geist* weight 800 are passable alternates if Manrope is unavailable.
- **Sub-display + body** — *Inter* is the system's utility face.

## Layout

### Spacing System
- **Base unit**: 4 px.
- **Tokens**: `{spacing.xxs}` 2 px · `{spacing.xs}` 4 px · `{spacing.sm}` 8 px · `{spacing.md}` 12 px · `{spacing.lg}` 16 px · `{spacing.xl}` 24 px · `{spacing.2xl}` 32 px · `{spacing.3xl}` 48 px.
- **Section padding**: bands use `{spacing.3xl}` 48 px top/bottom on desktop.
- **Card interior**: cards at `{spacing.xl}` 24 px.

### Grid & Container
- Marketing container centres at ~1200 px.
- Hero: split layout (headline left, capture card right) at desktop; stacked at mobile.
- Feature grids: 2-up / 3-up at desktop.

### Responsive Strategy

#### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 768px | Hero stacks; capture card full-width below headline; grids 1-up. |
| Tablet | 768–1023px | Grids 2-up. |
| Desktop | ≥ 1024px | Hero split; full grids. |

#### Touch Targets
Buttons render ~48 px tall (12 vertical padding + 24 line). WCAG AAA at all widths.

#### Image Behavior
Photography is sparse; the system prefers illustrative SVGs and product mockups inside cards. Small source-type icons (link, note, image, audio) appear inside capture rows.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Level 0 — Flat | No shadow, no border. | Default. |
| Level 1 — Hairline | 1 px solid `{colors.line}` border; `{colors.ink}` for the tertiary outline button only. | Form inputs, dividers, outline buttons. |
| Level 2 — Soft Card | Implicit Level 0 `{colors.canvas}` card sitting on `{colors.canvas-soft}` — the surface contrast IS the elevation. | Cards on the hero band. |

The system uses surface contrast (`{colors.canvas-soft}` page vs `{colors.canvas}` cards) as the primary elevation cue, and this is scheme-independent: the card is lighter than the page in light mode and *also* lighter than the page in dark mode. The lift never inverts.

Because elevation is carried by surface rather than shadow, the model needs no dark-mode special case — which is the main reason drop shadows stay out of the system. A shadow tuned for a white page disappears against `#14161b`; a surface lift does not. Where a shadow is genuinely required (modals, toasts), tint it from `{colors.ink}` rather than pure black so it flips with the scheme.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Full-bleed bands. |
| `{rounded.sm}` | 8px | Inline pills, small badges. |
| `{rounded.md}` | 12px | Form inputs, smaller chrome. |
| `{rounded.lg}` | 16px | Mid-size cards. |
| `{rounded.xl}` | 24px | The system's canonical button + card radius. |
| `{rounded.pill}` | 9999px | Status pills and full-radius accents. |
| `{rounded.full}` | 9999px | Circular icon containers. |

## Components

### Buttons

**`button-primary`** — the azure CTA pill.
- Background `{colors.primary}`, text `{colors.on-primary}`, label `{typography.button-md}`, padding `{spacing.md} {spacing.xl}`, shape `{rounded.xl}` 24 px.

**`button-secondary`** — the mist-tinted secondary.
- Background `{colors.canvas-soft}`, text `{colors.ink}`, same typography / padding / shape.

**`button-tertiary`** — the white outline tertiary.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.ink}` border, same typography / padding / shape.

**`button-icon-circular`** — the circular icon button.
- Background `{colors.canvas}`, ink icon, shape `{rounded.full}`.

### Cards & Containers

**`card-content`** — the default white card.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.xl}`, shape `{rounded.xl}`. No border, sits on mist canvas.

**`card-feature-sage`** — the mist-tinted feature card.
- Background `{colors.canvas-soft}`, text `{colors.ink}`, padding `{spacing.xl}`, shape `{rounded.xl}`.

**`card-feature-green`** — the soft-azure feature card.
- Background `{colors.primary-pale}`, text `{colors.ink}`, padding `{spacing.xl}`, shape `{rounded.xl}`.

**`card-feature-dark`** — the polarity-flipped card with azure text.
- Background `{colors.ink}`, text `{colors.primary-on-ink}`, padding `{spacing.xl}`, shape `{rounded.xl}`. Used for promotional moments. "Dark" names the *polarity*, not a fixed colour: because the surface is `{colors.ink}`, this card is near-black inside a light page and near-white inside a dark one. It always opposes the page it sits on. 7.28:1 light / 5.35:1 dark.

**`capture-card`** — the system's signature interactive widget.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.line}` border, padding `{spacing.xl}`, shape `{rounded.xl}`. Hosts a paste/drop input that turns any source (link, note, clipboard) into clean Markdown.

### Inputs & Forms

**`text-input`** — the canonical text input.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.line}` border, body in `{typography.body-md}`, padding `{spacing.md} {spacing.lg}`, shape `{rounded.md}`. Focus takes a `{colors.primary}` border plus a 3 px `{colors.primary-pale}` ring.

### Navigation

**`nav-bar`** — the sticky top nav.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.md} {spacing.xl}`.

**`nav-link`** — link items inside nav.
- Text `{colors.ink}`, set in `{typography.body-sm-strong}`.

**`footer`** — the dark footer band.
- Background `{colors.ink}`, text `{colors.canvas-soft}`, padding `{spacing.3xl} {spacing.xl}`. Body in `{typography.body-sm}`.

### Signature Components

**`hero-band`** — the mist-canvas hero band.
- Background `{colors.canvas-soft}`, text `{colors.ink}`, padding `{spacing.3xl} {spacing.xl}`. Headline in `{typography.display-mega}` (Manrope weight 900).

**`hero-band-dark`** — the polarity-flipped hero.
- Background `{colors.ink}`, text `{colors.primary-on-ink}`, same padding / scale. Azure headline on near-black in light mode; the same band inverts to azure-on-near-white in dark. Same polarity caveat as `card-feature-dark`.

**`content-band`** — the white content band that follows hero.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.3xl} {spacing.xl}`. Section headline in `{typography.display-md}`.

**`badge-positive`** — the positive status pill.
- Background `{colors.primary-pale}`, text `{colors.positive-deep}`, body in `{typography.body-sm-strong}`, padding `{spacing.xs} {spacing.md}`, shape `{rounded.pill}`.

**`badge-negative`** — the negative status pill.
- Background `{colors.negative-pale}`, text `{colors.negative-deep}`, body in `{typography.body-sm-strong}`, padding `{spacing.xs} {spacing.md}`, shape `{rounded.pill}`. Mirrors `badge-positive`'s tint-plus-deep-text pattern, so it flips cleanly: 5.35:1 light / 7.67:1 dark. It previously paired `{colors.negative-bg}` with `{colors.on-primary}`, which measured 1.03:1 in dark — `negative-bg` is a scheme-stable dark surface, so a flipping text token cannot sit on it. Reserve `{colors.negative-bg}` for full destructive callouts with an explicitly light text colour.

### Examples (illustrative)

> Auto-derived kit-mirror demonstration surfaces (`scripts/derive-examples-block.mjs`). Each `ex-*` entry references brand-native primitives so downstream consumers (`/preview-design`, `/generate-kit`) re-skin the same 10 surfaces consistently. `TO_FILL` markers indicate missing primitives — resolve in the LLM judgment pass.

**`ex-pricing-tier`** — Default Pricing tier card. Re-uses feature-card chrome with brand canvas-soft surface.
- Properties: `backgroundColor`, `textColor`, `borderColor`, `rounded`, `padding`

**`ex-pricing-tier-featured`** — Featured/highlighted tier — polarity-flipped surface (dark fill + light text in light mode, light fill + dark text in dark mode).
- Properties: `backgroundColor`, `textColor`, `rounded`, `padding`

**`ex-product-selector`** — What's Included summary card — re-purposed for SaaS / B2B verticals (NOT a literal product gallery).
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-cart-drawer`** — Subscription summary — re-purposed for SaaS / B2B (line items per add-on, not literal cart).
- Properties: `backgroundColor`, `rounded`, `padding`, `item-divider`

**`ex-app-shell-row`** — Sidebar nav row inside the App Shell example. Active state uses brand primary as the indicator.
- Properties: `backgroundColor`, `activeIndicator`, `rounded`, `padding`

**`ex-data-table-cell`** — Default data-table th + td chrome. Header uses mono-caps eyebrow typography; body uses body-sm.
- Properties: `headerBackground`, `headerTypography`, `bodyTypography`, `cellPadding`, `rowBorder`

**`ex-auth-form-card`** — Sign-in / sign-up card. Re-uses feature-card chrome with text-input primitives inside.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-modal-card`** — Modal dialog surface — same chrome as feature-card with elevated shadow.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-empty-state-card`** — Empty-state illustration frame.
- Properties: `backgroundColor`, `rounded`, `padding`, `captionTypography`

**`ex-toast`** — Toast notification surface — feature-card shape + medium shadow.
- Properties: `backgroundColor`, `rounded`, `padding`, `typography`


## Do's and Don'ts

### Do
- Reserve `{colors.primary}` Hillnote azure for every primary CTA. The azure pill IS the system's conversion signature.
- Set hero headlines in `{typography.display-mega}` / `{typography.display-xl}` Manrope weight 900. Never lighter.
- Use `{rounded.xl}` 24 px for buttons and cards. The generous radius is the system's friendliness signature.
- Cycle page surfaces `{colors.canvas-soft}` → `{colors.canvas}` cards. Surface contrast carries elevation in both schemes.
- Use the full semantic palette (positive / warning / negative) for in-product status — never repurpose the azure CTA color as a success indicator since it IS the brand's primary action.
- Reach for `{colors.primary-text}` when azure is *type* and `{colors.primary}` when azure is a *fill*.
- Declare `color-scheme: light dark` so native controls, scrollbars and form widgets follow the scheme.

### Don't
- Don't introduce a second brand accent. Hillnote azure is the sole identity colour.
- Don't render the hero in weight 700 or lighter. The system's display weight is 900.
- Don't render CTAs as sharp rectangles. The 24 px pill geometry is non-negotiable.
- Don't pair the azure CTA with an azure background. Always sit the azure on neutral surfaces (canvas / ink).
- Don't swap the heavy display face for a thin geometric sans — the weight-900 Manrope display IS the system's voice.
- Don't hard-code a colour anywhere — including `box-shadow`, `border`, SVG `fill`/`stroke`, and colours assigned from JavaScript. A literal `#fff` is what breaks dark mode.
- Don't use `#000` as the dark canvas, and don't simply invert the light palette. Follow the polarity model above.
- Don't carry `{colors.primary}` `#4d63ff` into dark mode as a fill or as accent text — it goes muddy on a near-black page. That is what `colors-dark` is for.
- Don't set `{colors.warning}` or `{colors.negative}` as text on `{colors.canvas}` — they measure 1.81:1 and 4.12:1. Use the `-deep` variants for type.
