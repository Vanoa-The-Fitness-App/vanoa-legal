# Apple privacy mapping — future iOS review only

**UNPUBLISHED / NOT SUBMITTED / NOT APPROVED.** Reviewed 4 October 2026. The current source does not implement HealthKit: the Apple health adapter is unsupported. iOS configuration and purchase adapters do not establish an iOS release, native archive, App Store availability or working Apple entitlements. No iOS device, signed archive, App Store Connect answers or live purchase was verified.

This sanitized planning note is separate from Google Play Data Safety. Detailed source and legal evidence is kept outside this repository. Unknown answers stay **UNKNOWN**, not “No”.

## Definitions that differ from Google Play

Apple defines collection as off-device transmission allowing developer/partner access longer than necessary for real-time servicing. Ongoing collection after initial permission must be disclosed. Optional disclosure has multiple conjunctive conditions; a regular optional health or scanner feature is not automatically exempt. Account IDs and pseudonyms do not establish “not linked”; include actual third-party practices.[10]

An OpenRouter ZDR routing flag or no database write in one handler does not establish every recipient's real-time-only treatment. Tracking has its own cross-company advertising/measurement/data-broker meaning; no-tracking needs provider evidence, and ATT does not authorize prohibited health use or replace AI consent.[9][10]

## Conditional mapping, subject to the actual iOS release

| Observed service/source path | Candidate Apple data type | Linkage / purpose | Evidence still required |
|---|---|---|---|
| Email, profile name | Contact Info: Email Address, Name | Linked; App Functionality | Exact iOS OAuth/auth/support recipients and retention |
| Account/customer identifiers, consents | Identifiers: User ID | Linked; functionality, account security and entitlements | Operational records, provider identities and deletion |
| Nutrition, hydration, sleep, weight, body measures, medicines/supplements, health goals and estimates | Health & Fitness: Health; Fitness where applicable | Linked for cloud records; functionality and actual personalization | Full field map and actual iOS transmission; no HealthKit assumption |
| Workouts, sets, steps, exercise/calorie records | Health & Fitness: Fitness | Linked; functionality and actual personalization | App collection versus already existing cloud history |
| Live-only vitals / future device-health access | Health if collected off-device | UNKNOWN for future iOS | Current Android component-only summaries are not proof of iOS handling |
| Profile photo | User Content: Photos or Videos | Linked; functionality | Public avatar bucket, cache/CDN and image lifetime |
| Meal/label scan images and saved results | Photos or Videos; relevant deliberately extracted Health data | Image collection/linkage UNKNOWN across chain; saved account outputs linked | Actual AI recipients, logs, settings, native temporary files and retention |
| Bio, notes, recipes, authored contributions | Other User Content; specific Health fields where requested | Linked unless proven otherwise; functionality | Contribution review/promotion/removal and actual deidentification |
| Optional rounded coordinates/place labels | Coarse Location candidate; precise inputs require separate assessment | Linked if account-stored; functionality/personalization | iOS acquisition, geocoder, free-text address and legacy/server precision |
| DOB, formula/sex, preferences, time zone | Other Data Types and/or relevant Health; taxonomy review needed | Linked; functionality/personalization | Do not infer unrelated Sensitive Info categories |
| Transactions, products, subscription events | Purchases: Purchase History; User ID | Linked; entitlement/functionality/security | Actual enabled IAP and RevenueCat/backend lifecycle |
| Card/CVC/bank details | Payment Info: first-party collection not established | UNKNOWN for actual checkout chain | Do not equate a purchase record with receiving card data |
| Support messages and attachments | Customer Support and deliberately collected types | Usually linked; functionality | Actual mailbox provider and whether narrow optional-disclosure exception applies |
| Search queries, product lookups, quality events | Search History / Product Interaction / Other Usage Data as actually collected | Purpose depends on actual use; remote analytics UNKNOWN | Distinguish ordinary search, active local metrics and unestablished remote uploader |
| SDK/update/CAPTCHA/CDN/network information | Potential Diagnostics, Device ID, Usage Data or other applicable type | UNKNOWN until vendor/release verified | Automatic fields, identifier stability, logs, purposes, retention and tracking |
| Local reminders, alarms and truly local-only caches | Not collected only if genuinely never transmitted | No off-device entry for a verified local-only path | Check backups, exports, derived uploads and SDK attachments |

The candidate type/definition framework comes from Apple's App Privacy details. It is not a final selection table.[10]

## Required iOS acceptance gates

1. **Identity and account:** resolve actual seller/controller and legal-entity eligibility. Individual enrollment displays a personal legal seller name; organization enrollment requires a real legal entity. Review §5.1.1(ix) also addresses apps requiring sensitive user information. Keeping developer names out of these drafts does not resolve those obligations.[9][13]
2. **AI disclosure:** explicitly disclose third-party personal-data/AI sharing and obtain permission before it occurs; verify a decline path sends no image. Do not treat camera permission or a Terms link as the whole consent process.[9]
3. **Deletion:** provide easy in-app initiation, verified associated-data deletion and honest failure/completion handling. An email route alone is not automatically sufficient. A deferred option must still allow immediate deletion; cancellation is separate.[9][12]
4. **Health/iCloud:** assess all health-data uses, inaccurate writes and iCloud/backup behaviour. A missing CloudKit import is not proof no health backup reaches iCloud.[9]
5. **Login and age:** assess §4.8 equivalent-login requirements if Google login is offered; confirm real age controls, not only document wording.[9]
6. **Native privacy build:** inspect actual app and transitive SDK manifests, required-reason API usage/reasons and listed binary-SDK signatures; use the actual Xcode privacy report. A missing tracked manifest does not prove generated archive absence.[11][22][39]
7. **Subscriptions:** verify actual IAP products, localized price/period/renewal disclosures, restore, ownership, pending verification, expiry, refunds and backend support. The reviewed server verifier is Play-only; an Apple frontend adapter is not working iOS billing evidence.[9][20]
8. **EULA:** decide standard versus custom EULA. Custom-EULA minimum terms include real developer name, address and contact details; the names constraint prevents silently completing those fields. These Android-oriented Terms are not asserted to be an Apple-compliant custom EULA.[20]
9. **Territories:** establish actual markets and EU trader status where relevant. Verify UAE and other mandatory-law requirements separately from Apple review; do not declare non-trader to evade public information.[21]

No “Data Not Collected”, globally “not linked”, universal “not tracking”, compliant HealthKit or iOS-launch claim is approved by this review.

## Sources

[9] https://developer.apple.com/app-store/review/guidelines — App Review Guidelines - Apple Developer
[10] https://developer.apple.com/app-store/app-privacy-details — App Privacy Details - App Store - Apple Developer
[11] https://developer.apple.com/support/third-party-SDK-requirements
[12] https://developer.apple.com/support/offering-account-deletion-in-your-app
[13] https://developer.apple.com/programs/enroll — Become a member - Apple Developer Program - Apple Developer
[20] https://developer.apple.com/support/terms/apple-developer-program-license-agreement — Apple Developer Program License Agreement - Agreements and Guidelines - Support - Apple Developer
[21] https://developer.apple.com/help/app-store-connect/manage-compliance-information/manage-european-union-digital-services-act-trader-requirements
[22] https://developer.apple.com/documentation/bundleresources/privacy-manifest-files — Privacy manifest files | Apple Developer Documentation
[39] https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api — Describing use of required reason API | Apple Developer Documentation
