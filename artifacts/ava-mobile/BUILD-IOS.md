# Alpha Visual Artists — iOS App Store Build

## Prerequisites (you already have these ✅)
- Apple Developer account ($99/yr) — paid
- App Store Connect access

## Run these 4 commands in the Replit Shell (one at a time)

Open the **Shell** tab in Replit, then:

### 1. Login to Expo (one-time)
```bash
cd artifacts/ava-mobile
pnpm exec eas login
```
> Sign up free at expo.dev if you don't have an account. Note your username.

### 2. Initialize the EAS project (one-time)
```bash
pnpm exec eas init --non-interactive --force
```
> This creates the project on Expo's servers and writes the `projectId` into app.json automatically.

### 3. Build the iOS app
```bash
pnpm exec eas build --platform ios --profile production
```
> Asks you to login to your Apple Developer account (Apple ID + password + 2FA code).
> Asks if you want EAS to manage your provisioning profile / certs — **say YES** to all.
> Build runs on Expo's cloud (~15–25 min). You'll get a download link for the `.ipa`.

### 4. Submit to App Store
```bash
pnpm exec eas submit --platform ios --latest
```
> Asks for your App Store Connect credentials (same Apple ID).
> Uploads the `.ipa` to TestFlight automatically.

---

## After submission

1. Go to **appstoreconnect.apple.com** → My Apps
2. Your app "Alpha Visual Artists" will appear in TestFlight within ~10 min
3. Click **Distribution** → fill in:
   - App description
   - Screenshots (5x for 6.7" iPhone — required)
   - Privacy policy URL
   - App category: **Photo & Video**
   - Age rating
4. Click **Submit for Review** — Apple reviews in 24–48 hours typically
5. Once approved, it's live on the App Store 🎉

## Bundle ID & version
- Bundle ID: `com.alphavisualartists.app`
- Version: `1.0.0`
- Build number: auto-increments on each build

## If anything fails
Run `pnpm exec eas build:list` to see status, or paste the error to me and I'll fix.
