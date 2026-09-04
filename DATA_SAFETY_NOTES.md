# Data Safety Notes — for filling in the Google Play Console

**Written:** July 22, 2026. **Updated:** September 4, 2026. This file summarises, in plain language, what the published
legal documents (privacy.html, terms.html, delete-account.html) declare — so you can fill
in the Play Console **Data Safety form** from this page without re-reading the legal text.
The form's answers must match these documents; if you change one, change the other.

---

## 1. What data the app collects

| Data type | Examples | Linked to the user's identity? | Used for tracking? |
|---|---|---|---|
| Account info | Email address, password, profile photo, bio | Yes | No |
| Health & fitness logs | Sleep, nutrition, steps, water, workouts, weight, medicine, custom foods, custom routines | Yes | No |
| Photos | Profile photo, progress photos, food/meal photos, barcode scans (via camera or storage permission) | Yes | No |
| AI coach messages | Text the user types to the AI coach, and the AI's replies | Yes | No |
| Device/app identifiers | Push notification token (needed to deliver notifications via Expo) | Yes | No |
| Food catalogue contributions (opt-in) | Food name, portion sizes, nutrition values created by user | Yes (linked to account until review, then de-identified; deleted upon account deletion) | No |
| Search quality telemetry (opt-in) | Unmatched search queries and occurrence counts (k-anonymity thresholded; scrambled fingerprints below threshold; no account ID, date, time, or order) | No | No |

- **Nothing is used for tracking or advertising.** No ads, no ad networks, no data sold. Answer "No" to all tracking questions.
- **No financial or payment data is collected. See section 5 — this matters.**

## 2. Third parties that receive data, and why

Exactly three. No more.

| Who | What they get | Why |
|---|---|---|
| **Supabase** | All account and health data (servers in Mumbai, India) | It is the app's backend: database, sign-in, and file storage |
| **OpenRouter** | The user's AI coach messages (input and output) | It processes the AI coach conversations |
| **Expo** | Push notification token | It delivers push notifications |

## 3. Encryption in transit

Supabase, OpenRouter, and Expo are all HTTPS-only services, and the legal site itself is
served over HTTPS by GitHub Pages — so declare **data is encrypted in transit**.
One caveat: final confirmation that the app itself only ever talks to these services over
HTTPS belongs to the app-repo review session (prompt 20), since the app's code is not in
this repository.

## 4. Account deletion

- Users can delete in-app: **Profile → Privacy and Data**.
- Public web URL for the Play Console's deletion field: **https://vanoa.app/delete-account.html**
- Promise made on that page: deletion completed **within 30 days** of an email request to
  support@vanoa.app; deleted data may persist in database backups for up to **30 days** more.

## 5. Financial data: NONE at launch — declare none

The paywall is on hold. There are **no purchases, no subscriptions, no payment processing**
in the launch version. In the Data Safety form, declare **no financial data collected**.

The legal documents were deliberately written to match this (Option B, chosen 2026-07-22):
the payment sections still exist but are explicitly worded as **future-conditional**
("Vanoa does not currently offer purchases… if purchases are introduced in the future…"),
and the privacy policy's US-rights table says **NO** for "Commercial information".

## 6. ⚠️ REVISIT THIS FILE WHEN…

1. **The paywall ships.** You must then: declare financial/purchase data in the Data Safety
   form; flip the "Commercial information" row in privacy.html back to YES; change the
   conditional payment wording in both privacy.html (Payment Data, sharing section) and
   terms.html (sections 5 and 6) to active wording; and add RevenueCat/Google Play Billing
   back as active processors here in section 2.
2. **Sentry is added** (crash reporting — planned but not installed). That introduces a new
   data type (crash diagnostics) and a new third party (Sentry) that must be added to the
   privacy policy, the Data Safety form, and section 2 of this file.
3. **Any new third-party service** starts receiving user data. The rule: the privacy policy,
   the in-app data-sharing copy, the Data Safety form, and this file must always name the
   same set of processors — no more, no fewer.
