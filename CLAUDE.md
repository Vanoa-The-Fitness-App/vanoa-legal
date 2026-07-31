# CLAUDE.md

This file provides guidance to Claude Code and Cowork when working with code in this repository.

## Project

**vanoa-legal** — the legal/support micro-site for the Vanoa fitness app (`cynricantao/fitness-app`), hosted at **vanoa.app** (see `CNAME`). Static HTML, no build step: `index.html` (landing links), `privacy.html`, `terms.html`, `delete-account.html`. Reached from a 3-checkbox consent gate at signup in the main app, and from the app's account-deletion flow.

Edit legal copy here, not in the app repo — the app's legal-doc screens were removed in favor of linking out to this site.

## Session rules (standing directives from the user, Cynric)

- **Never commit** — produce the changes and hand them back for review; the user commits after checking them over.
- **Never commit secrets** — there's no `.env` in this repo today, but if any credentials, tokens, or infrastructure identifiers ever show up in a diff, strip them out and flag it rather than committing.
