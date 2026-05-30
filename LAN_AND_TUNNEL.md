# Local network & public tunnel

## One command to serve on your LAN

```bash
npm run dev:lan
```

- **On this Mac:** http://localhost:5173/
- **On phone/other devices (same Wi‑Fi):** http://192.168.12.87:5173/

*(IP may change; run `ipconfig getifaddr en0` to get current LAN IP.)*

## Optional: public HTTPS (Cloudflare Tunnel)

```bash
cloudflared tunnel --url http://localhost:5173
```

Use the `https://...trycloudflare.com` URL printed in the terminal. Example from this run:

- **Public HTTPS:** https://cardiovascular-addressed-enemies-powerseller.trycloudflare.com

*(URL is temporary; a new one is generated each time you run the tunnel.)*

## If the app doesn’t load on your phone

- Allow incoming connections when macOS asks.
- Or: **System Settings → Network → Firewall** → turn off briefly to test, or add an allow rule for Node.
