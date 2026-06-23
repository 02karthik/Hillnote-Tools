# Hillnote Tools

The open source for **Hillnote's tool catalog** — a collection of small,
**single-file, self-contained** web tools that the Hillnote app can install into
a workspace with verified integrity.

This repo holds **only the source**: the tool files, the catalog metadata
(`tools.json`), and the **public** verification key. It does not build, sign, or
host anything. The signed, downloadable catalog is produced elsewhere.

## How it fits together

```
  hillnote-tools  ──clone──▶  Hillnote website backend  ──serves──▶  Hillnote app
  (this repo)                 (trusted publisher)                    (consumer)
  tools + tools.json          builds + SIGNS catalog.json            verifies signature
  + public-key.json           hosts /tools + bundle downloads        installs into workspace
```

- **This repo** is the single source of truth. Merging a PR to `main` is all a
  contributor does.
- The **Hillnote website backend** clones `main`, zips each tool, hashes it,
  assembles `catalog.json`, and **signs** it with a private key that lives only
  in that backend's environment (never in this repo). It serves the `/tools`
  storefront and the bundle downloads.
- The **Hillnote app** pins the public key from `keys/public-key.json`, fetches
  the signed catalog, verifies the signature, then trusts each tool by its
  `bundle.sha256` before installing it.

So a merged tool appears in the app after the next catalog build — **no app
release, and no signing key in this repo.**

## Repo layout

```
.
├── tools.json                  # source of truth: each tool's metadata + versions
├── <tool>/index.html           # one folder per tool (single, self-contained file)
├── screenshots/<tool>.webp     # 800×500 card image per tool (1:1 by name)
├── keys/
│   └── public-key.json         # PUBLIC verify key (committed; pinned by the app)
├── templates/tool-template/    # starter to copy when adding a tool
├── scripts/validate.mjs        # structural validation (CI gate; no key)
├── takescreenshot.js           # render a tool → screenshots/<tool>.webp
└── .github/workflows/validate.yml   # runs validate.mjs on every PR (no signing, no deploy)
```

## Adding or updating a tool

See **[CONTRIBUTING.md](./CONTRIBUTING.md)**. In short: copy
`templates/tool-template/` to `your-tool/`, add `screenshots/your-tool.webp`,
register it in `tools.json` and bump `catalogVersion`, run `npm run validate`,
and open a PR. Tools must be a single file and work fully offline — the app runs
them under a strict CSP, so nothing remote will load.

## Commands

| Command | What it does |
| --- | --- |
| `npm run validate` | Structural checks on `tools.json` + folders + screenshots (the CI gate). Pure Node, no deps. |
| `npm run screenshot <slug>` | Render `<slug>/index.html` → `screenshots/<slug>.webp` (needs `npm install`). |

There is intentionally **no build/sign/publish command here** — that all happens
in the Hillnote website backend.

## Keys

Signing uses an **ECDSA P-256** keypair. Only the **public** half lives here:

| Key | Where it lives | Committed? |
| --- | --- | --- |
| **Public (verify)** | `keys/public-key.json` | **Yes** — pinned by the app as its trust anchor |
| **Private (sign)** | Hillnote website backend env (`CATALOG_SIGNING_KEY`) | **No** — never in this repo |

The validation workflow and `npm run validate` both refuse any committed `*.pem`
/ `*.key` file, so a private key can't be merged by accident.

> **Key rotation is disruptive.** Changing the keypair invalidates every
> previously published signature and requires shipping an app build that pins the
> new public key. Do it only deliberately, and update `keys/public-key.json` and
> the backend's signing key in lockstep.
