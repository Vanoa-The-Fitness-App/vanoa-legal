# Data Safety Notes — unpublished review draft

**Status: PENDING RELEASE / PROVIDER / OWNER REVIEW.** Not submitted or approved Google Play Console answers. No new legal-document effective date is assigned. Reviewed 4 October 2026 against the current app source, generated Android configuration, safe named-project metadata and synthetic source tests. This proposal is derived from data flows, not copied from the legal pages. Source-supported paths do not establish the configured behavior of every distributed build; named backend metadata is not an installed-build/network test. Detailed evidence and engineering notes are kept privately outside this public repository.

## 1. Classification rules and official guidance

Use [Google Play's official Data Safety guidance](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en) and verify it again when preparing the actual submission. The collection, sharing, ephemeral and optionality definitions were consulted for this editorial review; unresolved classifications remain **UNKNOWN**, not NO.

- **Collected:** includes off-device app/SDK transmission. Health Connect access that remains solely on-device is distinct from imports uploaded to Vanoa's backend. Controlled WebViews and server-to-server forwarding also need assessment under the guidance.
- **Shared:** assess each recipient and purpose under Google's definition and exceptions. Do not automatically classify every provider transfer as sharing, or automatically exempt it because it is called a provider. The service-provider exception depends on processing on the developer's behalf and instructions; roles/contracts remain unconfirmed.
- **Ephemeral:** real-time, memory-only processing must be established for the complete chain. A zero-retention routing request or stateless server function does not prove it. Ephemeral off-device processing still belongs in the form response under the guidance.
- **Pseudonymous:** data that can reasonably be re-associated with a person is not automatically anonymous.
- **Optional:** verify the definition across all relevant users/builds/regions, not merely whether a permission dialog exists. Some body/setup inputs are required even though individual health logging features are optional.
- **YES (source):** a supported off-device path, not a verified twelve-month production history. **UNKNOWN:** missing release, SDK, operational or classification evidence. **Local-only observed:** a bounded source finding, not a global NO for the category.

## 2. Proposed data mapping — not final Console selections

| Candidate category/type | Collected | Shared under Play definition | Ephemeral | Optionality / purpose / scope |
|---|---|---|---|---|
| Personal information: email, name, user IDs | YES (source) | UNKNOWN | NO for stored records | Account management, functionality and security; account/email and some setup inputs required; Google sign-in is an alternative |
| Other personal information: DOB, formula/sex choice, bio, preferences, goals and device time zone | YES (source) | UNKNOWN | NO for cloud records | Personalization/functionality; required setup and optional fields are mixed; exact category selection requires review |
| Health information: nutrition, sleep/stages, weight/body measures, medicine/supplement schedules/logs and notes | YES (source), including uploaded Health Connect imports | UNKNOWN | NO for stored logs | Functionality/personalization; logging and Health Connect optional, some onboarding body inputs required |
| Fitness information: steps, workouts/sets/routines/programs, records and derived progress | YES (source) | UNKNOWN | NO for stored logs | Functionality/personalization; feature choices vary |
| Heart/respiratory sleep-detail summaries | Local-only in inspected caller; historical cloud ingestion UNKNOWN | UNKNOWN for historical/cloud scope | NOT APPLICABLE for observed local processing; other scope UNKNOWN | Optional reads; a cloud schema field alone does not prove an active uploader |
| Approximate location | YES (source): newly captured coordinates rounded to two decimals and place label in cloud | UNKNOWN | NO for stored preferences | Optional, off-default regional food ranking; manual place lookup or OS location. Typed labels can identify precise addresses; do not promise a fixed kilometre radius. |
| Precise location | UNKNOWN across platform/SDK paths | UNKNOWN | UNKNOWN | Low-accuracy/rounded first-party intent does not establish every native/platform destination; manually supplied place text and legacy/server values require separate review |
| Photos: selected profile image | YES (source) | UNKNOWN, including any user-initiated exception | NO for stored image | Optional profile functionality; source and fresh bucket metadata confirm public avatar storage/URLs. Cache/CDN expiry and downloaded copies remain unverified. |
| Photos: meal and food/supplement-label scans | YES (source): backend to OpenRouter to serving provider | UNKNOWN | UNKNOWN, despite zero-retention routing request | Optional estimation/transcription; provider/temp-file handling unverified; saved outputs are separate records |
| Financial information: purchase history | YES (source) when configured; release activation UNKNOWN | UNKNOWN | NO for persisted subscription/ledger records | Plus access, account management/security; purchase optional, configured SDK can receive account identity before purchase |
| Financial information: payment instruments | No first-party card/CVC/bank form identified; automatic store/SDK scope UNKNOWN | UNKNOWN | UNKNOWN | Store/provider checkout; do not substitute a global financial-data NO for purchase metadata |
| App activity: online search queries/barcodes | YES (source) | UNKNOWN | UNKNOWN for requests/provider logs | Online food/exercise functionality and barcode lookup; distinct from optional quality uploads |
| Other user-generated content: custom food/recipes/notes and contributions | YES (source) | UNKNOWN, including promoted-catalogue handling | NO for stored content | Functionality; separate off-default contribution opt-in; attribution/anonymity needs verification |
| App interactions/quality metrics | Local recording active; current remote uploader not established; historical processing requires review | UNKNOWN | NO for persisted local/historical records; prospective remote processing UNKNOWN | Catalogue quality; local measurement is distinct from opt-in uploader capability |
| Diagnostics / crash data | UNKNOWN across vendor logs and SDKs; no initialized first-party crash-analytics integration identified | UNKNOWN | UNKNOWN | Verify operational diagnostics and exact vendor automatic fields |
| Device or other IDs | UNKNOWN for SDK/CAPTCHA/update fields | UNKNOWN | UNKNOWN | Account UUID is not automatically the device-ID category; verify actual unique identifiers |
| Contacts, SMS/call logs, microphone recordings, videos/browser history | No relevant first-party collection path identified; whole-release/SDK scope UNKNOWN | UNKNOWN | UNKNOWN | Local alarm playback or chosen export/ringtone file is not evidence of remote recording/file collection |

Derived scores/targets/trends and saved scan outputs must be mapped with their underlying health/profile records. Exports shared at the user's direction and manual Health Connect writes need separate assessment of Google's user-initiated exceptions. No blanket no-tracking, no-advertising, no-diagnostics or fully anonymous-telemetry answer is approved from this bounded source review.

## 3. Implemented recipients and activation boundaries

| Recipient/path | Supported processing | Outstanding evidence |
|---|---|---|
| Supabase and its email-delivery services | Authentication, account/profile/health cloud records, queries, contributions, image/server operations | Installed-build binding; actual SMTP vendor; roles, countries, logging, retention and deletion |
| Google OAuth and hosted confirmation fallback | Identity claims/authentication links | Enabled scopes, fallback cookies/logs and release behavior |
| Cloudflare Turnstile | Authentication challenge and browser/device/network metadata | Automatic fields, cookies and retention; Turnstile describes both processor bot-protection and controller improvement roles, so do not automatically apply a blanket sharing exception |
| OpenRouter and selected serving provider | Optional meal/label image requests | Request-specific serving provider, countries, role, human access, router logging/use-of-input settings and end-to-end retention; model name is not host identity |
| RevenueCat and enabled stores | Configured account/customer and purchase/entitlement processing | Products/releases, automatic SDK data, store/processor classification and retention; Google Play verifier implemented, Apple/web activation not established |
| Open Food Facts | Barcode lookup and request metadata | Provider role/log retention |
| Unsplash/Pexels image services | Rendered stock-image requests and metadata | Actual rendering paths, role and cache/log retention |
| Platform location/geocoder | Optional location/manual-place resolution | Exact provider, payload, countries and transport |
| Expo update host | Eligible-build update/runtime requests | Released configuration and automatic fields, including vendor-documented randomized update tokens; remote push registration/delivery not established |

Opening the legal website separately involves website-hosting request metadata; assess open-web versus controlled-WebView scope rather than automatically importing every website visit into app collection. An installed package alone is not a recipient. Local notifications, alarm audio, bundled assets and local-only caches do not establish remote push, microphone collection or CDN calls. No fixed “exactly three providers” inventory is supported.

## 4. Retention, deletion and security answers

- In-app route supported by source: **Profile → Privacy and Data → Your controls → Delete your account → Start deletion**, with fresh email verification, confirmation and additional enrolled authentication. External candidate URL: **https://vanoa.app/delete-account.html**, using the existing support email without reinstalling. Monitored handling, verification and request completion were not tested.
- A request route/button is not evidence of complete per-category erasure. Synthetic source tests confirmed incomplete file deletion despite a successful response; this is not a tested production incident and does not make a retention exception lawful. Cloud/account-owned records are targeted; purchase/provider, operational, pseudonymous quality/security, promoted catalogue, device, Health Connect, backup/log/cache and export copies have separate limits or unresolved coverage.
- Category-specific justified retention grounds and periods, deletion completion periods, backup expiry and erasure after restore remain **UNKNOWN / pending approval**. Engineering gaps are not lawful retention reasons. Do not repeat the prior unsupported 30-day completion/backup promises, or replace them with an indefinite-retention policy.
- Account deletion does **not** implement subscription cancellation or store/RevenueCat erasure. Health Connect permission revocation does **not** erase existing imports/exports. Uninstalling, disconnecting, cancelling and deleting are distinct actions.
- Encryption in transit: configured first-party endpoints support encrypted transport; complete release/SDK/geocoder/provider-chain evidence is **UNKNOWN**. Do not make an all-data YES solely from the legal website using HTTPS.
- Native protected authentication-session storage does not prove all health caches are encrypted at rest. No independent security badge/certification is established.

## 5. Submission gates and ongoing changes

Before selecting final answers, confirm applicable distributed artifacts/tracks/countries, exact feature activation, all SDK automatic data, recipient roles/instructions, whole-chain ephemeral/transit handling, optionality, working deletion/support routes and justified retention. Recheck the official guidance for collected/shared exceptions and purpose/type labels. Review the applicable Health Apps/Health Connect declarations, age/target-audience rules, minimum permissions and actual paid offers separately; this file does not certify store or legal compliance.

Revisit whenever Plus platforms/products, inference providers, remote telemetry, crash/analytics services, permissions or other recipient paths change. Keep actual app behavior, approved privacy/deletion/subscription disclosures and Console answers consistent after verification, not by copying one unsupported document into another. Vanoa is a product operated by individuals; operator/seller identity, UAE legal/health applicability and licensing remain for owner and qualified legal review.


## 6. Health permissions, consent and publication coordination

See [HEALTH_CONNECT_NOTES.md](HEALTH_CONNECT_NOTES.md) for the separate 15-permission mapping and [APPLE_PRIVACY_NOTES.md](APPLE_PRIVACY_NOTES.md) for conditional Apple classifications. The generated Android main/debug declarations match the inspected requested set; a signed release and OS rationale/denial/revocation tests remain UNKNOWN. Regular sync currently requires all 13 core grants; two additional optional vital grants are paired. Imported sleep stages have a separate cloud-persistence caller, and disconnect is not a verified stop for every reader or operation already underway.

No automatic Health Connect-history-to-AI transfer was demonstrated. That is not permission for prohibited downstream health use. Resolve minimum scopes, prominent cloud disclosure, transfer basis, permitted human access and effective withdrawal under the current Health Connect Limited Use policy before submission; disclosure alone cannot legalize prohibited processing. Keep actual permission fields distinct from derived health information and account-linked operational data.

Current app/client consent still identifies September 2026 documents while the publicly retrieved Privacy page identifies October 2026. The candidate pages are unpublished with no effective date. Coordinate an approved legal-version rollout separately; do not direct consent to these drafts or assume a passing version test checks hosted content. Explicit Terms/Privacy acceptance and reliable age attestation are different questions.

Google Play's current Console requirements identify health apps as requiring Organization registration; personal-account legal names and monetized full-address display are separate identity rules. The supplied independent-developer/no-personal-name constraint is an unresolved owner/legal/account decision, not satisfied by a brand-only page. No actual account type or Console classification was verified. Official sources consulted 4 October 2026:

- [User Data](https://support.google.com/googleplay/android-developer/answer/10144311?hl=en), including prominent disclosure, AI, policy and deletion.
- [Sensitive APIs / Health Connect](https://support.google.com/googleplay/android-developer/answer/9888170?hl=en), Limited Use, minimum scope, transparent notice and control.
- [Health Content and Services](https://support.google.com/googleplay/android-developer/answer/16679511?hl=en), health declaration and applicable listing disclaimer.
- [Play Console Requirements](https://support.google.com/googleplay/android-developer/answer/10788890?hl=en), §1.2 Organization registration for health apps.
- [Developer account information](https://support.google.com/googleplay/android-developer/answer/13628312?hl=en), public identity fields.
- [Account deletion](https://support.google.com/googleplay/android-developer/answer/13327111?hl=en), both app and functional external route.

The internal-testing Data Safety-form exemption applies only to apps exclusively active on that track under Google's guidance. A repository submit profile naming internal testing does not establish that the entire distributed app qualifies, and it is not a general exemption from health/privacy requirements. Actual tracks, territories and offered products remain UNKNOWN.
