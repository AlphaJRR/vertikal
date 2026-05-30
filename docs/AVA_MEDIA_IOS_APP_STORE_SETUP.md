# Alpha Visual Artists – iOS App (Capacitor) – App Store setup

This app wraps **https://alphavisualartists.com** in a native iOS WebView for App Store distribution. It uses **Capacitor** and is configured for **Alpha Visual Artists (AVA Media)**.

---

## 1. Project configuration (already done)

| Item | Value |
|------|--------|
| **Bundle ID** | `com.alphavisualartists.app` |
| **App name** | Alpha Visual Artists |
| **Website** | https://alphavisualartists.com |
| **Privacy** | https://alphavisualartists.com/privacy |
| **Terms** | https://alphavisualartists.com/terms |
| **Deep link scheme** | `alphavisualartists://` |

- **Capacitor** is configured in `capacitor.config.ts`: `appId`, `appName`, `server.url` (live site), `allowNavigation` for your domain only.
- **iOS project**: Bundle ID and display name are set in `ios/App/App.xcodeproj` and `ios/App/App/Info.plist`.
- **URL scheme** in `Info.plist`: `alphavisualartists` for deep links (e.g. `alphavisualartists://path`).

---

## 2. Loading the live site and external links

The app is set to load the **live website** via `server.url` in `capacitor.config.ts`. Only your domain is in `allowNavigation`; other domains should open in Safari for App Store compliance (payments/booking outside the app).

Add this script to **alphavisualartists.com** so that in the app, links to Calendly, Shopify, Stripe, etc. open in the system browser instead of the in-app WebView:

```html
<!-- Add once before </body> on alphavisualartists.com -->
<script>
(function() {
  if (typeof window.Capacitor === 'undefined') return; // not in app
  var externalHosts = [
    'calendly.com', 'stripe.com', 'shopify.com', 'checkout.stripe.com',
    'pay.stripe.com', '*.myshopify.com'
  ];
  function isExternal(url) {
    try {
      var host = new URL(url, location.origin).hostname.toLowerCase();
      return externalHosts.some(function(h) {
        var pattern = h.replace(/\./g, '\\.').replace(/\*/g, '.*');
        return new RegExp('^' + pattern + '$').test(host);
      });
    } catch (e) { return false; }
  }
  document.addEventListener('click', function(e) {
    var a = e.target && e.target.closest && e.target.closest('a');
    if (!a || !a.href) return;
    if (!isExternal(a.href)) return;
    e.preventDefault();
    window.Capacitor.Plugins.Browser.open({ url: a.href });
  }, true);
})();
</script>
```

Ensure **@capacitor/browser** is present in the project (it is in your `package.json`). The script only runs when `window.Capacitor` exists (i.e. inside the app); on the normal website it does nothing.

Alternatively, host the script from this repo at `public/assets/js/ava-capacitor-external-links.js` on your site and include it:

```html
<script src="https://alphavisualartists.com/assets/js/ava-capacitor-external-links.js"></script>
```

---

## 3. App icons and splash (iOS)

- **Icons**: Replace assets in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`.
  - Required: one **1024×1024** PNG (e.g. `AppIcon-512@2x.png`). Xcode can generate all sizes from it, or you provide each size per `Contents.json`.
  - Current reference: `AppIcon-512@2x.png` (1024×1024). Use your Alpha Visual Artists logo, no transparency for the icon.
- **Splash**: Replace images in `ios/App/App/Assets.xcassets/Splash.imageset/`.
  - Use 1x, 2x, 3x (e.g. 2732×2732 or equivalent) for the splash. Current filenames: `splash-2732x2732.png`, `splash-2732x2732-1.png`, `splash-2732x2732-2.png` (match scales in `Contents.json`).

After replacing, run **Product → Clean Build Folder** in Xcode, then build again.

---

## 4. Build and run locally

```bash
# From project root
npm install
npm run build:web          # if you use a static build (optional when using server.url)
npx cap sync ios
npx cap open ios
```

In Xcode:

1. Select the **App** scheme and a simulator or a connected device.
2. **Signing & Capabilities**: choose your Team and ensure **Bundle Identifier** is `com.alphavisualartists.app`.
3. **Product → Run** (⌘R).

The app will load **https://alphavisualartists.com** in the WebView.

---

## 5. App Store submission checklist

### 5.1 Apple Developer account and App Store Connect

1. **Apple Developer Program**: Enrolled at [developer.apple.com](https://developer.apple.com).
2. **App Store Connect**: Create an app:
   - **Bundle ID**: `com.alphavisualartists.app` (must match Xcode).
   - **Name**: Alpha Visual Artists.
   - **Privacy Policy URL**: `https://alphavisualartists.com/privacy`
   - **Terms of Service (EULA)** or link: `https://alphavisualartists.com/terms` (or in “App Information” / attachment).

### 5.2 Paying users and IAP

- All payment and booking flows (Stripe, Calendly, Shopify) open in **Safari** (using the script above). No in-app purchases for those flows, so no IAP setup required for them.
- If you ever sell digital goods or subscriptions **inside** the app (e.g. in-app only content), you would need IAP and compliance with App Store rules.

### 5.3 Export compliance

- **ITSAppUsesNonExemptEncryption** is set to `false` in `Info.plist`. If you use custom encryption beyond HTTPS, check [Export Compliance](https://developer.apple.com/documentation/security/complying_with_encryption_export_regulations).

### 5.4 Archive and upload

1. In Xcode: **Product → Destination → Any iOS Device (arm64)**.
2. **Product → Archive**.
3. When Organizer opens: **Distribute App** → **App Store Connect** → **Upload**.
4. Complete the wizard (signing, options). Wait for “Processing” to finish in App Store Connect.

### 5.5 App Store Connect metadata

- **Screenshots**: iPhone 6.7", 6.5", 5.5"; iPad if you support it.
- **Description**, **Keywords**, **Category** (e.g. Business or Photo & Video).
- **Support URL**: e.g. `https://alphavisualartists.com` or a contact page.
- **Age Rating** questionnaire.
- **Pricing**: Free or paid.

### 5.6 Submit for review

- In App Store Connect, complete all required fields, then **Submit for Review**.  
- Review time is typically 24–48 hours.

---

## 6. Deep linking (optional)

- **Custom URL scheme**: `alphavisualartists://` is registered in `Info.plist`.  
  Example: `alphavisualartists://services` can open the app (and you can pass a path for the website to handle).
- **Universal Links**: For `https://alphavisualartists.com/...` to open the app on iOS, configure **Associated Domains** in Xcode and the **apple-app-site-association** file on your domain. This is optional and can be added later.

---

## 7. Summary

| Step | Status |
|------|--------|
| Capacitor iOS initialized | ✅ |
| `capacitor.config.ts`: appId, appName, server.url, allowNavigation | ✅ |
| iOS Bundle ID `com.alphavisualartists.app` | ✅ |
| App loads live site (alphavisualartists.com) | ✅ |
| External links (Calendly/Shopify/Stripe) open in Safari | ✅ (via script on website) |
| URL scheme for deep linking | ✅ `alphavisualartists://` |
| App icons / splash | ⚠️ Replace with AVA branding (see §3) |
| Build & submit steps | ✅ Documented above |

Replace app icons and splash with Alpha Visual Artists assets, add the external-link script to your live site, then build, archive, and submit as above.
