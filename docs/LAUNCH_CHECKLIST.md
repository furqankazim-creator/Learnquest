# Launch checklist

## 0. Things only you can do (must fix before Play Store)
- [ ] **Replace placeholder app ID (required, permanent):** change `com.kidslearningapp.owlschool` in `app.json` (`ios.bundleIdentifier` and `android.package`) to an ID you own, e.g. `com.yourname.kidslearning`.
- [ ] **Support & privacy (required):** set real `SUPPORT_EMAIL` and `PRIVACY_POLICY_URL` in `src/appInfo.ts`, update `docs/PRIVACY_POLICY.md` / `docs/STORE_LISTING.md`, and host the privacy policy at a public URL.
- [ ] Create an Expo account → `npx eas-cli@latest login` → `npx eas-cli@latest init`.
- [ ] Google Play Console account (one-off fee) and Apple Developer account (yearly fee).
- [ ] Have a primary teacher check the questions before claiming curriculum alignment.

## 1. In-repo preparation done
- [x] Privacy policy draft dated and structured (`docs/PRIVACY_POLICY.md`) with clear placeholders for support email/hosting.
- [x] Store listing/support placeholders prepared (`docs/STORE_LISTING.md`).
- [x] In-app privacy/support/release placeholders surfaced in Settings (`src/appInfo.ts`, `src/screens/Settings.tsx`).
- [x] README with release must-do steps (`README.md`).
- [x] Lint/typecheck pass after code changes (`npx expo lint`, `npx tsc --noEmit`).

## 2. Test on a real phone (do before building)
Run `npx expo start -c`, scan the QR code with Expo Go, then check each item:
- [ ] Welcome: Play now, name + buddy + year, Start learning, keyboard does not hide the name box
- [ ] Settings: Light / Dark / Auto change the colours; sound toggle; Privacy/support info visible
- [ ] All 4 games + Daily Mission, in English, Maths, Science and Mixed, at Year 1 and Year 6
- [ ] Balloon Pop with long answers (e.g. English Year 4 "What is a paragraph?") — full text visible
- [ ] Match It: 3 rounds complete, results screen shows stars + sticker
- [ ] Sound: voice reads questions; pop / right / try-again / match / fanfare tones play. If tones are silent on Android, investigate.
- [ ] Close the app fully and reopen: stars, coins, stickers, name, year and streak are still there
- [ ] Parent tab: first visit asks you to set a PIN; wrong PIN message; "Forgot the PIN?" maths check; Change PIN; leaving the tab locks it again
- [ ] Reset really zeroes everything and stays zero after reopening
- [ ] Small phone (360 px wide) and a tablet: nothing cut off or overlapping
- [ ] Rotate / background / incoming call: app recovers

## 3. Build
```bash
npx eas-cli@latest build --profile preview --platform android   # installable .apk for testers
npx eas-cli@latest build --profile production --platform all    # store builds (.aab and .ipa)
npx eas-cli@latest submit --platform android
npx eas-cli@latest submit --platform ios
```

## 4. Store paperwork
Use `docs/STORE_LISTING.md` for the descriptions, rating answers, Data safety form and App Privacy answers. Ensure the hosted privacy policy URL and support email are final.

## 5. After launch
- [ ] Watch reviews for crashes; fix and ship with `npx eas-cli@latest update`
- [ ] Next content/features: custom illustrations, more questions, audio recordings
