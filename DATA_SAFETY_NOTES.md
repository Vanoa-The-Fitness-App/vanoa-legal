# Data Safety Notes — for filling in the Google Play Console

**Written:** July 22, 2026. **Updated:** October 3, 2026 (policy rewrite after Play rejection).
This file summarises, in plain language, what the published legal documents (privacy.html,
terms.html, delete-account.html) declare, so you can fill in the Play Console **Data Safety form**
and **Health apps declaration** without re-reading the legal text.
The form's answers must match these documents; if you change one, change the other.

---

## 1. What data the app collects

| Data type (Play category) | Examples | Linked to user? | Optional? | Shared?* |
|---|---|---|---|---|
| Personal info: name, email, user IDs | Display name, email, account ID, Google sign-in profile | Yes | No (account) | No |
| Personal info: other | Date of birth, height, weight goal, bio, 18+ attestation | Yes | Partly | No |
| Health & fitness: health info, fitness info | Nutrition, workouts, water, sleep, steps, weight, supplements, fasting; Health Connect imports | Yes | Yes | No |
| Location: approximate | Coarse location rounded to ~1 km + city label (food-search ranking) | Yes | Yes | No |
| Financial info: purchase history | Vanoa Plus product, dates, store transaction IDs (no card data) | Yes | Yes | No |
| Photos | Profile photo (stored); food/label scanner photos (processed ephemerally, not stored) | Yes | Yes | No |
| App activity: other user-generated content | Opt-in food catalogue contributions | Yes, until de-identified for review | Yes | No |
| App activity: in-app search history | Opt-in unmatched-search telemetry (thresholded, no account ID/date) | No | Yes | No |

\* Under Play's definitions, transfers to service providers acting on our behalf are **not** "sharing".

- **No tracking, no ads, no advertising ID, no analytics SDK, no data sold.** Answer "No" to all tracking/advertising questions.
- **No push token.** Reminders and alarms are local notifications (Notifee/expo-notifications); the old Expo push-token row was removed.
- **No crash reporting / diagnostics** yet (Sentry not installed).

## 2. Service providers that receive data, and why

| Who | What they get | Why |
|---|---|---|
| **Supabase** | Account, profile, health logs, approximate location, profile photo, purchase status (servers in Mumbai, India) | Backend: database, sign-in, storage, functions |
| **OpenRouter** (+ routed model providers) | Food/label scanner photos only, ZDR endpoints only | AI scanning |
| **Google Play Billing** | The purchase | Payment and subscription management |
| **RevenueCat** | Account ID, store purchase records | Purchase validation and subscription status |
| **Cloudflare Turnstile** | IP, browser/device signals | Bot protection on sign-in and sensitive actions |
| **Expo (EAS Update)** | IP, platform, app version | App updates |
| **Open Food Facts** | Scanned barcode number, IP (not linked to account) | Product lookup |
| **Vercel** | Email sign-in link, IP | Hosts the web page that completes email sign-in links |
| **GitHub Pages** | IP of site visitors | Hosts vanoa.app |

The privacy policy (section 4), the in-app "Privacy and Data" processor list, the Data Safety
form and this table must always name the same set of processors.

## 3. Health Connect (Health apps declaration)

- Read: Steps, SleepSession, Weight, Hydration, Nutrition, ExerciseSession; optional HeartRate and
  RespiratoryRate (Sleep-screen overnight vitals, on-device only, not uploaded).
- Write: Steps, SleepSession, Weight, Hydration, Nutrition, ExerciseSession, ActiveCaloriesBurned.
- Purpose: in-app fitness tracking and sync. Imported records are stored in the user's Supabase logs.
- The policy has a dedicated **Health Connect** section (`privacy.html#healthconnect`) with the
  Limited Use statement. Each permission in the declaration needs a justification that matches it.

## 4. Encryption in transit

All providers above are HTTPS-only, and vanoa.app is served over HTTPS. Declare **data is encrypted in transit**.

## 5. Account deletion

- In-app: **Profile → Privacy and Data**.
- Web URL for the Play Console deletion field: **https://vanoa.app/delete-account.html**
- Promise: deletion within **30 days** of a request; backups expire within a further **30 days**.

## 6. ⚠️ REVISIT THIS FILE WHEN…

1. **Sentry or any analytics SDK is added**: new data type (diagnostics) and new processor.
2. **Any new third-party service** starts receiving user data.
3. **Health Connect permissions change** in `app.json` / `services/health/PermissionManager.ts`:
   update privacy.html's Health Connect lists and the Health apps declaration together.
4. **iOS ships**: add Apple App Store / HealthKit disclosures.
