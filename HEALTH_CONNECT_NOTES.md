# Vanoa — candidate Health Connect declaration mapping

**UNPUBLISHED REVIEW DRAFT — not submission-ready or approved.** This is a sanitized permission-to-feature mapping derived from reviewed source, not evidence of a released build or Google Play approval. Confirm each feature in the actual Android release before submitting. Do not add personal/operator identifiers, internal infrastructure details or test data to this document.

## Proposed use case

**Fitness, wellness and coaching.** Vanoa uses supported Health Connect information to help users view activity, sleep, hydration, weight, nutrition and workout history alongside their Vanoa logs, monitor progress toward wellness goals, and view sleep detail. This is a candidate fit to Google's stated use-case category—not an approval or a claim that medical-device requirements are inapplicable.[1]

The declaration must match the release manifest and actual read/write behavior. Justify each permission by its specific user-facing benefit, rather than “required for app functionality.”[1][2]

## Permission-to-feature mapping

All names below include the full Android permission prefix. Read and write are separate purposes even where the current app requests them together.

| Permission | User-facing feature and candidate justification | Data-handling qualification |
|---|---|---|
| `android.permission.health.READ_STEPS` | Read step information so the user can view daily steps, progress toward a step goal and an hourly activity chart. | Daily imported totals and estimated step calories are saved to the Vanoa account. The hourly chart is calculated on device from interval records. Step calories are an estimate, not imported calorie-burn records. |
| `android.permission.health.WRITE_STEPS` | Write manually logged step totals from Vanoa to Health Connect so the user can use those entries in other permitted health apps. | Writes the manual component, not a re-export of the imported daily component. |
| `android.permission.health.READ_SLEEP` | Read sleep-session timing to show sleep duration and history; read available sleep stages to show the stage breakdown of a logged night. | Imported durations and timing are stored in the Vanoa account. Opening Sleep can also save stage names and their start/end times to that account. |
| `android.permission.health.WRITE_SLEEP` | Write eligible sleep sessions captured in Vanoa to Health Connect for the user's health history. | Only sessions with valid captured bounds and matching duration qualify; not every manually entered duration. The current exporter does not write sleep stages. |
| `android.permission.health.READ_WEIGHT` | Read recorded weight to show weigh-in history, weight trends and progress toward the user's weight goal. | Imported weight/date information is stored in the account and may contribute to weight-related estimates. Manual entries take precedence for the same day. |
| `android.permission.health.WRITE_WEIGHT` | Write manually saved Vanoa weigh-ins to Health Connect so the user can use them in other permitted health apps. | User saving an imported day's value as a manual weigh-in can make it exportable. |
| `android.permission.health.READ_HYDRATION` | Read hydration entries to show daily water intake and progress toward a hydration goal. | Imported amount and date information is stored in the account. |
| `android.permission.health.WRITE_HYDRATION` | Write manually logged Vanoa water intake to Health Connect for the user's combined hydration history. | Writes volume at the logging time using a short interval, not a measured drinking duration. |
| `android.permission.health.READ_NUTRITION` | Read nutrition entries to show food/meal history, calories and macronutrient intake alongside Vanoa meal logs. | Food name, meal category, date, energy, protein, carbohydrate, fat and available fiber are imported to the account. The native record may expose additional nutrient fields on device; the current import saves the narrower subset. |
| `android.permission.health.WRITE_NUTRITION` | Write manually logged Vanoa nutrition to Health Connect, including energy, macronutrients and available supported micronutrients. | Eligible nutrition entries can include supplement-derived food/nutrient logs. This is not a Medication-record permission or export of all medicine logs. |
| `android.permission.health.READ_EXERCISE` | Read completed workout sessions to show workout history, timing and duration in Vanoa. | Session title/type-derived label and timing are stored in the account. The current importer does not save routes, laps or sets, and does not import workout calorie-burn records. |
| `android.permission.health.WRITE_EXERCISE` | Write completed workouts logged in Vanoa to Health Connect for the user's exercise history. | The current exporter labels these sessions as strength training; confirm this accurately describes the release's eligible workout feature before submission. |
| `android.permission.health.WRITE_ACTIVE_CALORIES_BURNED` | Write available stored calorie estimates alongside completed Vanoa workouts so the user can view their workout energy estimate in other permitted health apps. | Write-only; Vanoa does not request reading this record type in the reviewed flow. |
| `android.permission.health.READ_HEART_RATE` | With optional permission, read heart-rate samples during a logged sleep interval to display minimum, maximum and average heart rate in Sleep. | The reviewed live reader reduces samples on device and displays summaries; it does not upload raw samples or live summaries through that reader. Existing account rows may separately contain stored vital fields. |
| `android.permission.health.READ_RESPIRATORY_RATE` | With optional permission, read respiratory-rate measurements during a logged sleep interval to display minimum, maximum and average respiratory rate in Sleep. | The reviewed live reader reduces measurements on device. Both optional vital permissions must currently be granted before either live summary is read. |

## Candidate data-handling description

> Health Connect is an Android device service. When you connect Vanoa's Health Sync, Vanoa reads supported health and fitness records and saves imported activity, sleep, hydration, weight, nutrition and workout information to your Vanoa account using its cloud service provider, Supabase. Imported information supports your logs, trends, goals and related wellness estimates. Sleep-stage detail can also be saved to your account when you open Sleep. Optional live heart-rate and respiratory-rate readings are used on your device to display sleep summaries through the current live reader.
>
> Vanoa also writes supported manually logged information and eligible captured sessions to Health Connect. Other apps can access those records only as permitted by Health Connect and your permissions. You can choose to export your Vanoa account data or share supported workout and achievement summaries with recipients you select.
>
> Changing Health Connect permissions does not erase data already imported into your Vanoa account, offline copies or records already written to Health Connect. Disconnecting the main sync connection is separate from removing Android permissions and from deleting data. To stop further device-health access, remove Vanoa's permissions in Android Health Connect settings. A transfer already underway may finish. Data already exported to another app or recipient is also subject to that recipient's handling.

**Do not publish this paragraph as a complete privacy policy.** Add the approved controller/contact, purposes/legal bases where applicable, security description, category-specific retention periods and verified deletion procedure. Do not invent these facts. Current app-control and deletion gaps must be resolved or accurately addressed; copy alone cannot repair them. Google's guidance calls for accurate collection/access, storage/sharing, retention/deletion and security explanations.[1]

## Scope and release gates

- **Android only in the reviewed implementation.** No functioning Apple Health/HealthKit integration is established.
- **No background/history health-read permission is requested in the reviewed configuration.** Ordinary automatic synchronization is foreground-triggered. Do not advertise continuous background access or unlimited historical access.
- **Not independent per-metric app toggles:** regular sync currently depends on the entire required read/write set. The optional vital pair does not block ordinary synchronization. Describe the actual choices, not an imagined granular toggle model.
- **No automatic Health Connect-to-AI transfer demonstrated:** the reviewed AI scanning feature sends user-provided images through a separate flow; it does not attach imported Health Connect history. Do not describe Health Connect data as model-training material without evidence and a separate policy assessment.
- **Restricted use attestations need operator confirmation:** no advertising, brokerage, insurance, employment, sale, research or model-training purpose is established by this source review. This does not replace an operational/contractual attestation about prohibited secondary use.
- **Before submission:** verify the exact release manifest, readable Health Connect permission rationale on supported Android versions, full/partial/optional denial and revocation, cloud disclosure, account separation, retention/deletion and export completeness. The manifest and Play Console declared permissions must agree.[2]
- **Do not select additional health permissions** merely because the native library supports them. This mapping does not justify exercise-route, blood-pressure, glucose, reproductive, medication, oxygen-saturation, heart-rate-write or respiratory-rate-write permissions.

## Sources

[1] https://support.google.com/googleplay/android-developer/answer/12991134?hl=en — Android Health Permissions: Guidance and FAQs
    > "For each permission requested, provide a clear and detailed justification explaining how your app will use the data to benefit the user."
    > "Only request permissions and access data types that support the specific, user-facing health features you offer. Do not request broader access than necessary."
[2] https://developer.android.com/health-and-fitness/guides/health-connect/develop/get-started — Get started with Health Connect
    > "Your Android manifest needs to have an Activity that displays your app's privacy policy, which is your app's rationale of the requested permissions, describing how the user's data is used and handled."
    > "In your app, declare read and write permissions in the AndroidManifest.xml file based on those required data types, which should match the ones you declared access to in the Play Console."
