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
- look reasonable in the catalog's **800×500** preview frame.

> Multi-file bundles are supported by the installer but not used today — keep it
> to one file unless a maintainer asks otherwise.

## Add a tool — step by step

1. **Copy the template** into a new folder named with your tool's slug
   (lowercase-kebab, e.g. `unit-converter`):

   ```bash
   cp -r templates/tool-template unit-converter
   ```

   Edit `unit-converter/index.html` — title, accent color, and the actual tool.

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
     "color": "#6366f1",               // #rrggbb — used for the card accent
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

Edit its `index.html` → regenerate its screenshot → increment **that tool's**
`version` → bump `catalogVersion` → open a PR.

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
