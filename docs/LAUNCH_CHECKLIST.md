# Launch checklist

## 0. Things only you can do
- [ ] Replace the placeholder app ID `com.kidslearningapp.owlschool` in `app.json` (both `ios.bundleIdentifier` and `android.package`) with an ID you own, e.g. `com.yourname.kidslearning`. It cannot be changed after the first store release.
- [ ] Create an Expo account → `npx eas-cli@latest login` → `npx eas-cli@latest init`.
- [ ] Google Play Console account (one-off fee) and Apple Developer account (yearly fee).
- [ ] Host `docs/PRIVACY_POLICY.md` as a web page; fill in the contact email and date.
- [ ] Have a primary teacher check the questions before claiming curriculum alignment.

## 1. Test on a real phone (do before building)
Run `npx expo start -c`, scan the QR code with Expo Go, then check each item:
- [ ] Welcome: Play now, name + buddy + year, Start learning, keyboard does not hide the name box
- [ ] ⚙️ Settings: Light / Dark / Auto change the colours; sound toggle; Privacy text
- [ ] All 4 games + Daily Mission, in English, Maths, Science and Mixed, at Year 1 and Year 6
- [ ] Balloon Pop with long answers (e.g. English Year 4 "What is a paragraph?") — full text visible
- [ ] Match It: 3 rounds complete, results screen shows stars + sticker
- [ ] Sound: voice reads questions; pop / right / try-again / match / fanfare tones play. If tones are silent on Android, tell me — that is the first thing I'd fix.
- [ ] Close the app fully and reopen: stars, coins, stickers, name, year and streak are still there
- [ ] Parent tab: first visit asks you to set a PIN; wrong PIN message; "Forgot the PIN?" maths check; Change PIN; leaving the tab locks it again
- [ ] Reset really zeroes everything and stays zero after reopening
- [ ] Small phone (360 px wide) and a tablet: nothing cut off or overlapping
- [ ] Rotate / background / incoming call: app recovers

## 2. Build
```bash
npx eas-cli@latest build --profile preview --platform android   # installable .apk for testers
npx eas-cli@latest build --profile production --platform all    # store builds (.aab and .ipa)
npx eas-cli@latest submit --platform android
npx eas-cli@latest submit --platform ios
```

## 3. Store paperwork
Use `docs/STORE_LISTING.md` for the descriptions, rating answers, Data safety form and App Privacy answers.

## 4. After launch
- [ ] Watch reviews for crashes; fix and ship with `npx eas-cli@latest update`
- [ ] Next content/features: custom illustrations, more questions, audio recordings
