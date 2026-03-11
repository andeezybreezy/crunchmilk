#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT, 'output');
const year = new Date().getFullYear();

// Shared styles & components matching the site design system
const ADSENSE = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4448238469960841"
     crossorigin="anonymous"></script>`;

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;800&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">`;

const SHARED_CSS = `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --coral:#E63946;
  --coral-dark:#C1121F;
  --navy:#1D3557;
  --navy-light:#264773;
  --cream:#F5F0EB;
  --cream-dark:#E8E0D8;
  --card:#FFFFFF;
  --text:#1C1917;
  --text-mid:#57534E;
  --text-light:#A8A29E;
  --border:#D6D3D1;
  --radius:8px;
  --shadow:0 1px 3px rgba(28,25,23,0.06),0 4px 12px rgba(28,25,23,0.04);
  --font-display:'Bricolage Grotesque',Georgia,serif;
  --font-body:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif;
}
body{font-family:var(--font-body);background:var(--cream);color:var(--text);line-height:1.6;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}

/* Noise */
body::after{content:'';position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;opacity:0.025;z-index:9999;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}

/* Site Nav */
.site-nav{background:var(--navy);padding:0;position:sticky;top:0;z-index:100}
.nav-inner{display:flex;align-items:center;justify-content:space-between;max-width:760px;margin:0 auto;padding:14px 24px}
.logo{display:flex;align-items:center;text-decoration:none;gap:10px}
.logo-mark{width:30px;height:30px;background:var(--coral);border-radius:5px;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:13px;color:#fff;font-weight:800;letter-spacing:-0.5px;transform:rotate(-2deg)}
.logo-text{font-family:var(--font-display);font-size:1.1rem;font-weight:800;color:#fff;letter-spacing:-0.5px}
.logo-text span{color:var(--coral)}

.container{max-width:760px;margin:0 auto;padding:0 24px}

/* Footer */
footer{background:var(--navy);padding:36px 0;text-align:center;font-size:0.78rem;color:rgba(255,255,255,0.4)}
footer a{color:rgba(255,255,255,0.4);text-decoration:none;transition:color 0.2s}
footer a:hover{color:#fff}
.footer-inner{display:flex;flex-direction:column;align-items:center;gap:8px}
.footer-brand{font-family:var(--font-display);font-weight:800;color:rgba(255,255,255,0.7);font-size:1rem;letter-spacing:-0.5px}
.footer-links{display:flex;gap:20px}
.footer-links a{font-size:0.78rem}
.footer-rule{width:40px;height:2px;background:var(--coral);opacity:0.4;border:none;margin:4px 0}`;

const NAV_HTML = `<nav class="site-nav">
  <div class="nav-inner">
    <a href="/" class="logo">
      <div class="logo-mark">CM</div>
      <div class="logo-text">Crunch<span>Milk</span></div>
    </a>
  </div>
</nav>`;

const FOOTER_HTML = `<footer>
  <div class="container footer-inner">
    <span class="footer-brand">CrunchMilk</span>
    <hr class="footer-rule">
    <p>&copy; ${year} CrunchMilk. All tools free &mdash; no signup required.</p>
    <div class="footer-links">
      <a href="/privacy/">Privacy</a>
      <a href="/terms/">Terms</a>
      <a href="/">All Tools</a>
    </div>
  </div>
</footer>`;

const FAVICON = `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`;

// ─── 404 Page ───
function build404() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Page Not Found &mdash; CrunchMilk</title>
<meta name="robots" content="noindex">
${ADSENSE}
${FONTS}
${FAVICON}
<style>
${SHARED_CSS}

.error-page{text-align:center;padding:80px 24px 120px;min-height:60vh;display:flex;flex-direction:column;align-items:center;justify-content:center}
.error-code{font-family:var(--font-display);font-size:8rem;font-weight:800;color:var(--coral);line-height:1;letter-spacing:-4px;opacity:0.15;position:absolute;top:50%;left:50%;transform:translate(-50%,-60%);pointer-events:none;user-select:none}
.error-content{position:relative;z-index:1}
.error-content h1{font-family:var(--font-display);font-size:2rem;font-weight:800;letter-spacing:-0.5px;margin-bottom:12px;color:var(--text)}
.error-content p{font-size:1rem;color:var(--text-mid);margin-bottom:32px;max-width:400px;line-height:1.6}
.error-content a.home-btn{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;background:var(--coral);color:#fff;text-decoration:none;border-radius:6px;font-weight:700;font-family:var(--font-body);font-size:0.95rem;transition:all 0.15s}
.error-content a.home-btn:hover{background:var(--coral-dark);transform:translateY(-1px);box-shadow:0 4px 12px rgba(230,57,70,0.3)}
.error-content a.home-btn svg{width:18px;height:18px}
.error-suggestions{margin-top:48px;text-align:left;max-width:400px}
.error-suggestions h2{font-family:var(--font-display);font-size:0.95rem;font-weight:700;margin-bottom:12px;color:var(--text)}
.error-suggestions ul{list-style:none;display:flex;flex-direction:column;gap:6px}
.error-suggestions a{color:var(--coral);text-decoration:none;font-size:0.88rem;font-weight:500;transition:color 0.15s}
.error-suggestions a:hover{color:var(--coral-dark);text-decoration:underline}
</style>
</head>
<body>

${NAV_HTML}

<main class="error-page">
  <div class="error-code">404</div>
  <div class="error-content">
    <h1>Nothing here to crunch.</h1>
    <p>The page you're looking for doesn't exist, was moved, or never had any numbers to begin with.</p>
    <a href="/" class="home-btn">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      Browse All Calculators
    </a>
    <div class="error-suggestions">
      <h2>Popular categories</h2>
      <ul>
        <li><a href="/construction-calculators/">Construction Calculators</a></li>
        <li><a href="/finance-calculators/">Finance & Money Calculators</a></li>
        <li><a href="/fitness-calculators/">Fitness & Health Calculators</a></li>
        <li><a href="/cooking-calculators/">Cooking & Recipe Calculators</a></li>
      </ul>
    </div>
  </div>
</main>

${FOOTER_HTML}

</body>
</html>`;

  fs.writeFileSync(path.join(OUTPUT_DIR, '404.html'), html, 'utf8');
  console.log('  Built: 404.html');
}

// ─── Privacy Policy ───
function buildPrivacy() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Privacy Policy &mdash; CrunchMilk</title>
<meta name="description" content="CrunchMilk privacy policy. We don't collect personal data. All calculations run in your browser.">
<link rel="canonical" href="https://crunchmilk.com/privacy/">
<meta name="robots" content="noindex, follow">
${ADSENSE}
${FONTS}
${FAVICON}
<style>
${SHARED_CSS}

.page-header{background:var(--navy);color:#fff;padding:32px 0 36px}
.page-header h1{font-family:var(--font-display);font-size:1.8rem;font-weight:800;letter-spacing:-0.5px;line-height:1.2}
.page-header::after{content:'';display:block;width:40px;height:3px;background:var(--coral);margin-top:20px;border-radius:2px}

main{padding:28px 0 48px}
.legal-card{background:var(--card);border-radius:var(--radius);box-shadow:var(--shadow);padding:32px 28px;border:1px solid rgba(0,0,0,0.04)}
.legal-card .updated{font-size:0.78rem;color:var(--text-light);text-transform:uppercase;letter-spacing:0.5px;font-weight:600;margin-bottom:24px}
.legal-card h2{font-family:var(--font-display);font-size:1.05rem;font-weight:700;letter-spacing:-0.2px;margin:28px 0 8px;color:var(--text)}
.legal-card h2:first-of-type{margin-top:0}
.legal-card p{font-size:0.9rem;color:var(--text-mid);line-height:1.7;margin-bottom:12px}
</style>
</head>
<body>

${NAV_HTML}

<header class="page-header">
  <div class="container">
    <h1>Privacy Policy</h1>
  </div>
</header>

<main>
<div class="container">
  <div class="legal-card">
    <p class="updated">Last updated: March 10, 2026</p>

    <h2>What We Collect</h2>
    <p>We do not collect any personal data. All calculations run entirely in your browser. No inputs or results are sent to any server.</p>

    <h2>Cookies</h2>
    <p>We use standard analytics cookies (Google Analytics) and advertising cookies (Google AdSense/Ezoic) to understand traffic and serve relevant ads. You can opt out via your browser settings.</p>

    <h2>Third-Party Services</h2>
    <p>Our advertising partners may use cookies to serve personalized ads. See Google's privacy policy for details on how ad data is handled.</p>

    <h2>Data Retention</h2>
    <p>Since we don't collect personal data, there is nothing to retain. Any analytics data collected by third-party services is governed by their respective privacy policies.</p>

    <h2>Contact</h2>
    <p>For privacy questions, contact us via the information on our homepage.</p>
  </div>
</div>
</main>

${FOOTER_HTML}

</body>
</html>`;

  const outDir = path.join(OUTPUT_DIR, 'privacy');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
  console.log('  Built: privacy/index.html');
}

// ─── Terms of Use ───
function buildTerms() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Terms of Use &mdash; CrunchMilk</title>
<meta name="description" content="CrunchMilk terms of use. Free calculators provided as-is for informational purposes.">
<link rel="canonical" href="https://crunchmilk.com/terms/">
<meta name="robots" content="noindex, follow">
${ADSENSE}
${FONTS}
${FAVICON}
<style>
${SHARED_CSS}

.page-header{background:var(--navy);color:#fff;padding:32px 0 36px}
.page-header h1{font-family:var(--font-display);font-size:1.8rem;font-weight:800;letter-spacing:-0.5px;line-height:1.2}
.page-header::after{content:'';display:block;width:40px;height:3px;background:var(--coral);margin-top:20px;border-radius:2px}

main{padding:28px 0 48px}
.legal-card{background:var(--card);border-radius:var(--radius);box-shadow:var(--shadow);padding:32px 28px;border:1px solid rgba(0,0,0,0.04)}
.legal-card .updated{font-size:0.78rem;color:var(--text-light);text-transform:uppercase;letter-spacing:0.5px;font-weight:600;margin-bottom:24px}
.legal-card h2{font-family:var(--font-display);font-size:1.05rem;font-weight:700;letter-spacing:-0.2px;margin:28px 0 8px;color:var(--text)}
.legal-card h2:first-of-type{margin-top:0}
.legal-card p{font-size:0.9rem;color:var(--text-mid);line-height:1.7;margin-bottom:12px}
</style>
</head>
<body>

${NAV_HTML}

<header class="page-header">
  <div class="container">
    <h1>Terms of Use</h1>
  </div>
</header>

<main>
<div class="container">
  <div class="legal-card">
    <p class="updated">Last updated: March 10, 2026</p>

    <h2>Accuracy</h2>
    <p>All calculators provide estimates based on standard formulas. Results are for informational purposes only. We are not responsible for decisions made based on calculator results. Always consult a qualified professional for critical decisions.</p>

    <h2>Permitted Use</h2>
    <p>You may use these calculators for personal and commercial purposes. Embedding is permitted via the provided embed codes. Please do not scrape or reproduce the tools without using the embed code.</p>

    <h2>Intellectual Property</h2>
    <p>The CrunchMilk name, logo, and calculator designs are the property of CrunchMilk. The underlying mathematical formulas are in the public domain.</p>

    <h2>No Warranty</h2>
    <p>These tools are provided "as is" without warranty of any kind. We make no guarantees about accuracy, completeness, or fitness for any particular purpose.</p>

    <h2>Limitation of Liability</h2>
    <p>CrunchMilk shall not be liable for any damages arising from the use or inability to use these calculators. Use them at your own risk and always verify results independently for important decisions.</p>
  </div>
</div>
</main>

${FOOTER_HTML}

</body>
</html>`;

  const outDir = path.join(OUTPUT_DIR, 'terms');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
  console.log('  Built: terms/index.html');
}

// ─── Favicon SVG ───
function buildFavicon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#E63946"/>
  <text x="16" y="22" text-anchor="middle" font-family="Georgia, serif" font-size="14" font-weight="bold" fill="white" letter-spacing="-0.5">CM</text>
</svg>`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'favicon.svg'), svg, 'utf8');
  console.log('  Built: favicon.svg');
}

// ─── OG Image (SVG fallback — works on many platforms) ───
function buildOgImage() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <rect width="1200" height="630" fill="#1D3557"/>
  <rect x="0" y="0" width="1200" height="630" fill="url(#grid)" opacity="0.03"/>
  <defs>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" stroke-width="1"/>
    </pattern>
  </defs>
  <!-- Logo mark -->
  <rect x="80" y="220" width="64" height="64" rx="12" fill="#E63946" transform="rotate(-2 112 252)"/>
  <text x="112" y="260" text-anchor="middle" font-family="Georgia, serif" font-size="28" font-weight="bold" fill="white" letter-spacing="-1">CM</text>
  <!-- Text -->
  <text x="164" y="260" font-family="Georgia, serif" font-size="48" font-weight="bold" fill="white" letter-spacing="-1">CrunchMilk</text>
  <!-- Tagline -->
  <text x="82" y="340" font-family="sans-serif" font-size="28" fill="rgba(255,255,255,0.6)">Free online calculators for everything.</text>
  <!-- Stats bar -->
  <line x1="82" y1="400" x2="500" y2="400" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <text x="82" y="440" font-family="Georgia, serif" font-size="36" font-weight="bold" fill="#E63946">1,020+</text>
  <text x="82" y="466" font-family="sans-serif" font-size="14" fill="rgba(255,255,255,0.4)" letter-spacing="2" text-transform="uppercase">CALCULATORS</text>
  <text x="280" y="440" font-family="Georgia, serif" font-size="36" font-weight="bold" fill="#E63946">51</text>
  <text x="280" y="466" font-family="sans-serif" font-size="14" fill="rgba(255,255,255,0.4)" letter-spacing="2">CATEGORIES</text>
  <!-- Coral accent -->
  <rect x="80" y="540" width="60" height="4" rx="2" fill="#E63946" opacity="0.6"/>
  <text x="82" y="580" font-family="sans-serif" font-size="16" fill="rgba(255,255,255,0.3)">crunchmilk.com</text>
</svg>`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'og-image.svg'), svg, 'utf8');
  console.log('  Built: og-image.svg');
}

// ─── Run ───
console.log('Building static pages\n=====================\n');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });
build404();
buildPrivacy();
buildTerms();
buildFavicon();
buildOgImage();
console.log('\nDone!');
