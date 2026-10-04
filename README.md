# Vanoa legal website

Lightweight static HTML/CSS. There is no runtime JavaScript, bundler or production dependency installation. The four stable URLs are `index.html`, `privacy.html`, `terms.html` and `delete-account.html`; `CNAME` remains `vanoa.app`.

**Published documents, effective 4 October 2026.** All four pages carry `meta version 2026-10-04`, which must match `TERMS_VERSION` and `PRIVACY_VERSION` in the app's `lib/consent.ts` and the accepted versions in the `record-legal-consent` Edge Function. Merging to `main` deploys to `vanoa.app` via GitHub Pages. This repository does not certify legal compliance.

## Local preview

```sh
python tests/serve.py --port 4173
```

Open `http://127.0.0.1:4173/`. The server binds only to loopback and serves only the four pages and local assets. It deliberately returns 404 for repository notes, instructions, tests and Git metadata. Stop that specific server with Ctrl+C when finished.

GitHub Pages currently builds the root of `main`. `_config.yml` excludes the sanitized review notes and tests from that build. It is not an access-control mechanism for other hosting providers; any alternative deployment must use an explicit public-file allowlist. Detailed private audits must never be added to this repository.

## Checks

No-dependency static checks:

```sh
python tests/check-site.py
```

This checks the four pages, local assets/links/fragments, preserved deep links, the shared published version and effective date, absence of draft wording, banner and `noindex`, contact consistency, absence of scripts/embeds/forms, and hosting exclusions. It does not prove the legal accuracy of text or a live deletion workflow.

Optional browser, accessibility and HTML validation uses Playwright, axe-core and html-validate installed **outside** the site. Set:

- `QA_NODE_MODULES`: the external QA directory's `node_modules` directory.
- `CHROMIUM_PATH`: an installed compatible Chromium executable.
- `QA_OUT_DIR`: a results directory outside this repository.
- `SITE_URL`: preview origin (defaults to `http://127.0.0.1:4173`).

Then run:

```sh
node tests/browser-check.cjs
```

The script checks HTML; JavaScript-disabled rendering at 320, 390, 768 and 1440 pixels in both OS themes; local font/image loading; overflow; primary navigation and document anchors; keyboard skip links; third-party requests; desktop automated accessibility in both themes; print PDFs; and denial of private paths. It saves a JSON report and screenshots outside the served output. Review axe's incomplete checks and visually inspect captures; zero automated violations is not a WCAG certification.

## Design and content maintenance

- Use the app's actual Vanoa mark, Space Grotesk wordmark, Bricolage headings and Hanken body type. Fonts are local, unmodified and accompanied by OFL notices.
- Dark follows the black/charcoal app palette; light follows the warm cream palette. Theme selection follows the OS without a cookie or script.
- Preserve old deep-link IDs even when headings or sections are reorganized.
- Keep complete text in the HTML. Do not hide legal content behind JavaScript, consent, sign-in or app installation.
- Preserve the generator attribution and review its licensing before publication; see `assets/notices.txt`. The generator itself is not embedded.
- Do not add real-account screenshots, identifying metadata, production infrastructure evidence or detailed security findings.
- `DATA_SAFETY_NOTES.md`, `HEALTH_CONNECT_NOTES.md` and `APPLE_PRIVACY_NOTES.md` are separate sanitized review mappings, not submitted store answers.

## Changing a published document

When a change is material: update the effective/last-updated dates and `meta version` on every affected page, bump the matching app consent version so users re-accept, add the new version to the `record-legal-consent` allow-list before releasing the app, and keep the text consistent with the app's actual behaviour.
