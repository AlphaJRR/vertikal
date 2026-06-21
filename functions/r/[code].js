/** Cloudflare Pages Function — web fallback for https://alphavisualartists.com/r/:code */

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your event photos · Alpha Visual Artists</title>
  <meta name="theme-color" content="#060606">
  <style>
    :root { --bg:#060606; --card:#141414; --text:#fff; --muted:rgba(255,255,255,0.5); --red:#E8000A; --hairline:rgba(255,255,255,0.07); }
    * { box-sizing:border-box; margin:0; padding:0; }
    body { min-height:100vh; background:var(--bg); color:var(--text); font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif; display:flex; align-items:center; justify-content:center; padding:24px; }
    .card { width:100%; max-width:420px; background:var(--card); border:1px solid var(--hairline); border-radius:16px; padding:32px 28px; text-align:center; }
    .eyebrow { font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:var(--red); margin-bottom:12px; }
    h1 { font-size:28px; font-weight:800; letter-spacing:0.04em; text-transform:uppercase; line-height:1.1; margin-bottom:12px; }
    p { color:var(--muted); font-size:15px; line-height:1.55; margin-bottom:28px; }
    .code-label { font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:var(--muted); margin-bottom:8px; }
    .code { font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace; font-size:36px; font-weight:700; letter-spacing:0.35em; color:var(--text); background:rgba(255,255,255,0.04); border:1px solid rgba(232,0,10,0.35); border-radius:12px; padding:18px 12px; margin-bottom:28px; }
    .btn { display:inline-block; width:100%; background:var(--red); color:#fff; text-decoration:none; font-weight:800; font-size:13px; letter-spacing:0.12em; text-transform:uppercase; padding:16px 20px; border-radius:12px; margin-bottom:14px; }
    .hint { font-size:12px; color:var(--muted); line-height:1.5; }
  </style>
</head>
<body>
  <div class="card">
    <div class="eyebrow">Alpha Visual Artists</div>
    <h1>Your event photos</h1>
    <p id="lead">Download AVA to unlock your private gallery. Keep this code — you'll enter it after signing in.</p>
    <div class="code-label">Your code</div>
    <div class="code" id="code">__CODE__</div>
    <a class="btn" href="https://apps.apple.com/app/id6770791997" rel="noopener">Download on the App Store</a>
    <p class="hint">Already have AVA installed? Open this same link on your phone — the app will open with your code ready.</p>
  </div>
  <script>
    try { localStorage.setItem('ava_pending_redeem_code', '__CODE__'); } catch (e) {}
  </script>
</body>
</html>`;

function normalizeCode(raw) {
  const cleaned = String(raw || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 8);
  return cleaned.length >= 3 ? cleaned : null;
}

export async function onRequest(context) {
  const code = normalizeCode(context.params.code);
  if (!code) {
    const invalid = HTML
      .replace(/__CODE__/g, 'INVALID')
      .replace(
        "Download AVA to unlock your private gallery. Keep this code — you'll enter it after signing in.",
        'This link is missing a valid event code. Ask your photographer for a new card.'
      );
    return new Response(invalid, {
      status: 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  return new Response(HTML.replace(/__CODE__/g, code), {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
