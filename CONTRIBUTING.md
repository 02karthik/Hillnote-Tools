# Contributing a tool

Hillnote Tools are small, **single-file, self-contained** web tools. The Hillnote
app downloads them with verified integrity and runs them inside a workspace, so
the bar is simple: **one HTML file that works completely offline.**

This repo is only the *source*. You do not sign or publish anything — when your
PR is merged, the Hillnote website backend clones `main`, builds + signs the
catalog, and the tool then appears in the app. There is no key in this repo and
no app release needed.

## The rules

A tool **must**:

- be a **single file** — `your-tool/index.html` with all CSS and JS inline;
- be **fully self-contained / offline** — no remote fonts, scripts, stylesheets,
  images, `fetch`, or `import`. The app runs tools under a strict Content
  Security Policy that blocks the network, so anything remote silently fails to
  load. Use system fonts and inline `data:` URIs for any assets;
- **not** include analytics, trackers, or any phone-home behavior;
- store any state in `localStorage` under a namespaced key (e.g. `my-tool:…`);
- follow [`Hillnote-Tools-Design-System.md`](./Hillnote-Tools-Design-System.md) —
  see [Design system](#design-system) below;
- **support light and dark mode** via `prefers-color-scheme`;
- look reasonable in the catalog's **800×500** preview frame.

> Multi-file bundles are supported by the installer but not used today — keep it
> to one file unless a maintainer asks otherwise.

### What CI enforces

`npm run validate` (and the PR check) **hard-fails** a tool that contains any
network egress or remote code — an absolute `http(s)://` URL, `fetch`,
`XMLHttpRequest`, `WebSocket`, `EventSource`, `navigator.sendBeacon`, or a dynamic
`import()` — **or any reference to the app's native JS bridge** (`HillnoteBridge`,
`webkit.messageHandlers`, `window.external`, `Android.*`). It also **flags for
human review** (non-blocking) `eval`, `new Function`, `document.write`,
string-argument `setTimeout`/`setInterval`, and `atob`/`unescape`/`String.fromCharCode`.
These scans are a first-pass filter and a review aid — the runtime CSP in the app
is the actual sandbox — so a reviewer still reads every tool's script.

## Design system

Every tool follows [`Hillnote-Tools-Design-System.md`](./Hillnote-Tools-Design-System.md).
The template already wires this up — copy it and you inherit all of it. The short
version:

| | |
| --- | --- |
| Accent | Hillnote azure `#4d63ff`. One accent only — don't introduce a second. |
| Surfaces | `--canvas-soft` page → `--canvas` cards. Surface contrast *is* the elevation; no drop shadows. |
| Type | Manrope weight 900 for the headline, Inter for everything else. Both are fallback stacks — no web fonts (the CSP blocks them). |
| Radius | `24px` for cards and buttons. |

### Two rules that are easy to get wrong

**1. Never hard-code a colour.** Every colour goes through a token — including
`box-shadow`, `border`, SVG `fill`/`stroke`, and anything assigned from
JavaScript. A literal `#fff` is the single most common reason a tool fails to
flip to dark. If you need a colour the tokens don't cover, add it to *both*
`:root` and the dark block rather than inlining it.

**2. `--primary` is a fill; `--primary-text` is for type.** Azure at `#4d63ff`
only reaches 4.05:1 on the page background, which fails WCAG AA below 18.66 px.
Use `--primary` for button fills and active states, `--primary-text` for
eyebrows, links, and any small azure text.

### Dark mode

Scheme follows the OS — there is no in-product toggle. Declare
`color-scheme: light dark` so native controls, scrollbars and form widgets come
along, then override the tokens:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --canvas: #20242e;  --canvas-soft: #14161b;  --line: #2f333d;
    --ink: #eceff5;     --body: #a9b0bf;         --mute: #7d8494;
    --primary: #8b9bff; --primary-text: #8b9bff; --on-primary: #111318;
  }
}
```

Dark is **not** an inversion. The page stays the darkest surface with cards
lifted above it, the canvas is never pure `#000`, and the CTA flips polarity —
light azure fill with a near-black label. See the Dark Mode section of the
design system for the reasoning.

Check both schemes before opening a PR: macOS System Settings → Appearance, or
Chrome DevTools → ⌘⇧P → *Emulate CSS prefers-color-scheme: dark*.

### Illustrative colour

The single-accent rule covers UI chrome. Genuinely illustrative content — a
game piece, chart series, a spinner's segments — may use other hues; prefer
`--accent-orange` / `--accent-cyan` or the semantic palette before inventing
one.

The per-tool `color` in `tools.json` is a separate thing again. It tints the
**gallery card in the app**, not the tool, so it is deliberately *not* azure for
most tools — a varied gallery is easier to scan. It does not need to relate to
anything inside your tool. Pick a hue that is not already close to another
entry; if nothing distinct is left, brand azure `#4d63ff` is a fine default and
several tools already use it.

## Add a tool — step by step

1. **Copy the template** into a new folder named with your tool's slug
   (lowercase-kebab, e.g. `unit-converter`):

   ```bash
   cp -r templates/tool-template unit-converter
   ```

   Edit `unit-converter/index.html` — title, eyebrow, and the actual tool. Keep
   the token block as-is; it is what makes light and dark mode work.

2. **Add a screenshot** at `screenshots/<slug>.webp` (one per tool, 1:1 by name).
   Generate it from your tool with the bundled helper:

   ```bash
   npm install            # one time — installs puppeteer-core for the screenshotter
   npm run screenshot unit-converter
   ```

   This renders `unit-converter/index.html` at 800×500 and writes
   `screenshots/unit-converter.webp`.

3. **Register it** in [`tools.json`](./tools.json): append an entry to `tools`
   and **bump the top-level `catalogVersion`** by 1.

   ```jsonc
   {
     "dir": "unit-converter",          // must equal the folder name (lowercase-kebab)
     "name": "Unit Converter",         // display name
     "description": "Convert between metric and imperial units.",  // one line
     "glyph": "📐",                    // a single emoji
     "color": "#6366f1",               // #rrggbb — tints the gallery card in the app,
                                       // NOT the tool's own accent (that is always azure)
     "version": 1                      // new tool = 1
   }
   ```

4. **Validate** before opening the PR:

   ```bash
   npm run validate
   ```

   It checks `tools.json`, your folder + entry file + screenshot, and that no
   private key snuck in. The same check runs in CI on your PR.

5. **Open a PR.** Fill in the checklist in the PR template.

### The two version fields

| Field | When to change it |
| --- | --- |
| `catalogVersion` (top-level) | Bump **every** time you change a tool (monotonic — rollback defense). |
| per-tool `version` | `1` for a new tool; increment **only when that tool's files change**. |

### Updating an existing tool

Edit its `index.html` → check it in **both light and dark** → regenerate its
screenshot → increment **that tool's** `version` → bump `catalogVersion` → open
a PR.

## Local commands

| Command | What it does |
| --- | --- |
| `npm run validate` | Structural checks on `tools.json` + folders + screenshots (the CI gate). |
| `npm run screenshot <slug>` | Render `<slug>/index.html` → `screenshots/<slug>.webp`. |

Both are the only things you run locally. Signing and publishing happen in the
Hillnote website backend, not here.

## Licensing

By contributing you agree your tool can be distributed as part of the Hillnote
tool catalog. Don't submit code you don't have the right to share.
