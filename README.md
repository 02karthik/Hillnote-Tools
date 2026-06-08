# Hillnote Tools

A collection of small, single-file web tools — plus a **signed catalog** so the
Hillnote app can download and install them with verified integrity.

This repo is two things at once:

- a **static site** (`index.html` + each tool folder), served for browser
  preview/download at <https://02karthik.github.io/Hillnote-Tools/>, and
- a **signed manifest** (`catalog.json` + `catalog.sig`) that the Hillnote app
  fetches, verifies against a pinned key, and installs into a workspace.

## Repo layout

```
.
├── tools.json                  # source of truth: each tool's metadata + versions
├── index.html                  # catalog web page (data-driven from tools.json)
├── <tool>/index.html           # one folder per tool (e.g. fav-quote-gen/)
├── screenshots/<tool>.webp     # card image per tool
├── keys/
│   ├── public-key.json         # PUBLIC verify key  (committed; embedded in the app)
│   └── ed25519-private.pem     # PRIVATE sign key    (gitignored — never commit)
├── scripts/
│   ├── keygen.mjs              # one-time keypair generation
│   ├── build-catalog.mjs       # zip + hash + assemble + sign  →  dist/
│   └── verify-catalog.mjs      # verify signature + bundle hashes (CI gate)
├── .github/workflows/publish-catalog.yml   # build → sign → deploy to Pages
└── dist/                       # generated build output (gitignored)
```

## Adding a tool

1. Create the tool folder with its entry file: `my-tool/index.html`.
2. Add a card image: `screenshots/my-tool.webp`.
3. Register it in `tools.json` and bump `catalogVersion`:

   ```jsonc
   {
     "catalogVersion": 2,          // bump on every publish
     "tools": [
       // …existing…
       {
         "dir": "my-tool",
         "name": "My Tool",
         "description": "What it does, in one line.",
         "glyph": "🛠️",
         "color": "#6366f1",
         "version": 1              // new tool starts at 1
       }
     ]
   }
   ```

4. *(Optional)* preview/validate locally: `npm run build && npm run verify`.
5. Commit and push to `main`. GitHub Actions zips, signs, and deploys automatically.

No manual zipping, hashing, signing, or editing `catalog.json` — and **no app
release**: the app fetches the freshly re-signed catalog at runtime, so the new
tool just appears.

### Updating an existing tool

Edit its files → increment **that tool's** `version` → bump `catalogVersion` → push.

### The two version fields

| Field | When to change it |
| --- | --- |
| `catalogVersion` (top-level) | Bump on **every** publish (monotonic; rollback defense). |
| per-tool `version` | `1` for a new tool; increment **only when that tool's files change**. |

## Commands

| Command | What it does |
| --- | --- |
| `npm run keygen` | Generate the Ed25519 keypair (run **once** — see [Keys](#keys)). |
| `npm run build` | Zip tools, hash, assemble + **sign** `catalog.json` → `dist/`. |
| `npm run verify` | Verify `dist/catalog.json`'s signature + every bundle hash. |

Pure Node (≥ 18), no dependencies.

## How publishing works (no CI machine needed)

Pushing to `main` triggers `.github/workflows/publish-catalog.yml`, which runs on
a **GitHub-hosted runner** — a throwaway VM on GitHub's infrastructure, so you
don't host or pay for any CI box:

1. **build** — `npm run build` (signs using the `CATALOG_SIGNING_KEY` secret), then
   uploads `dist/` as the Pages artifact.
2. **deploy** — publishes to GitHub Pages.

Prefer to keep the key off GitHub entirely? Run `npm run build` **locally** (the
private key never leaves your machine) and publish the `dist/` output yourself.

## Keys

Signing uses an **ECDSA P-256 keypair**:

| Key | File | Committed? | Used for |
| --- | --- | --- | --- |
| **Private (signing)** | `keys/ed25519-private.pem` | **No — gitignored** | Signing `catalog.json` |
| **Public (verifying)** | `keys/public-key.json` | Yes | Embedded in the app to verify |

The **private key** lives in two places:

- locally at `keys/ed25519-private.pem` (gitignored, never committed), and
- in CI as the GitHub Actions secret **`CATALOG_SIGNING_KEY`** (encrypted at rest,
  decrypted only inside the runner).

The **public key** (`keys/public-key.json`) is safe to commit and is what the
Hillnote app pins as its trust anchor.

> ⚠️ `npm run keygen --force` **rotates** the key: it invalidates every previously
> published signature and requires re-embedding the new public key in the app. Do
> it only deliberately.

## One-time setup (fresh clone / new maintainer)

```bash
npm run keygen                                    # only if no keypair exists yet
gh secret set CATALOG_SIGNING_KEY < keys/ed25519-private.pem
# then: repo Settings → Pages → Source → "GitHub Actions"
```

## App integration

The app embeds the pinned public key and fetches:

- catalog base — `https://02karthik.github.io/Hillnote-Tools/`
- `catalog.json` (signed) + `catalog.sig` (ECDSA P-256 / SHA-256 over the **exact bytes** of `catalog.json`)

It verifies the signature against the pinned key, then trusts each tool by its
`bundle.sha256`: download → hash-check → install into a workspace.

> The committed key is currently a **dev** key (`keyId: hillnote-dev-…`).
> Regenerate without the `-dev` marker before production.
