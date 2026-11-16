# Kids Learning App

Educational Expo/React Native app for children in Years 1–6 (ages 5–11): English, Maths, and Science games with offline, on-device progress and a privacy-first design (no accounts, ads, chat, analytics, or tracking).

## Requirements
- Node.js and npm
- Expo-compatible environment (Expo Go for quick checks; development build/EAS for release-like testing)

## Commands
```bash
npm install
npx expo start
npx expo lint
npx tsc --noEmit
```

## Release preparation (must do before Google Play submission)
These items cannot be completed automatically in code and require owner action:

1. **App identity (required, permanent after first release):** replace placeholder IDs in `app.json`
   - `expo.ios.bundleIdentifier`: `com.kidslearningapp.owlschool`
   - `expo.android.package`: `com.kidslearningapp.owlschool`
   Use an ID you own (e.g. `com.yourcompany.kidslearning`).
2. **Support + privacy details:** set real values in `src/appInfo.ts` and keep docs in sync
   - `SUPPORT_EMAIL`
   - `PRIVACY_POLICY_URL` (must be a publicly hosted URL)
   - `docs/PRIVACY_POLICY.md` (date/contact already prepared as placeholders)
   - `docs/STORE_LISTING.md`
3. **Host privacy policy:** publish `docs/PRIVACY_POLICY.md` at a public URL and use that exact URL in Play Console Data safety / store listing.
4. **Accounts & signing/build:** Expo/EAS login/init, Google Play Console setup, app signing, and `eas build` / `eas submit` flow (see `eas.json`, `docs/LAUNCH_CHECKLIST.md`).
5. **Real-device QA:** verify TTS/sound, persistence, layouts, rotation/background, PIN/parent flows, all games/years on physical Android devices (phone + tablet) before release.

## Key files
- `app.json`, `eas.json` – app config/build
- `src/appInfo.ts` – support/privacy/release metadata used in-app
- `docs/PRIVACY_POLICY.md`, `docs/STORE_LISTING.md`, `docs/LAUNCH_CHECKLIST.md` – store/release docs
- `src/` – app source
