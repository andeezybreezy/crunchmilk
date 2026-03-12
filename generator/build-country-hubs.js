#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT, 'output');
const CONFIGS_DIR = path.join(ROOT, 'sites', 'configs');
const MASTER_LIST_PATH = path.join(ROOT, 'data', 'master-tool-list.json');

const COUNTRIES = [
  {
    slug: 'uk',
    name: 'UK',
    fullName: 'United Kingdom',
    flag: '\uD83C\uDDEC\uD83C\uDDE7',
    prefixes: ['uk-'],
    subtitle: 'Free tools built for UK tax rates, laws & currency',
    description: 'Free calculators built for the United Kingdom \u2014 VAT, stamp duty, council tax, pensions, and more. All using current HMRC rates and UK-specific rules.'
  },
  {
    slug: 'canada',
    name: 'Canada',
    fullName: 'Canada',
    flag: '\uD83C\uDDE8\uD83C\uDDE6',
    prefixes: ['canada-', 'canadian-'],
    subtitle: 'Free tools built for Canadian tax rates, laws & currency',
    description: 'Free calculators built for Canada \u2014 GST/HST, RRSP, TFSA, CPP, provincial taxes, and more. All using current CRA rates and Canadian-specific rules.'
  },
  {
    slug: 'australia',
    name: 'Australia',
    fullName: 'Australia',
    flag: '\uD83C\uDDE6\uD83C\uDDFA',
    prefixes: ['australia-', 'australian-'],
    subtitle: 'Free tools built for Australian tax rates, laws & currency',
    description: 'Free calculators built for Australia \u2014 superannuation, stamp duty, HECS-HELP, CGT, GST, and more. All using current ATO rates and Australian-specific rules.'
  }
];

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildPage(country, tools, configCache, totalSiteTools) {
  const year = new Date().getFullYear();
  const toolCount = tools.length;

  const toolCards = tools.map((t, i) => {
    const cfg = configCache[t.slug];
    const tagline = (cfg && cfg.tagline) || t.primaryKeyword || '';
    return `<a href="/${escapeHtml(t.slug)}/" class="tool-card" style="animation-delay:${i * 50}ms">
        <div class="tool-name">${escapeHtml(t.toolName)}</div>
        <div class="tool-tagline">${escapeHtml(tagline)}</div>
        <span class="tool-arrow">\u2192</span>
      </a>`;
  }).join('\n      ');

  const breadcrumbLD = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://crunchmilk.com/" },
      { "@type": "ListItem", "position": 2, "name": country.name + " Calculators" }
    ]
  }, null, 2);

  const itemListLD = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": country.name + " Calculators",
    "numberOfItems": toolCount,
    "itemListElement": tools.map(function(tool, i) {
      return {
        "@type": "ListItem",
        "position": i + 1,
        "name": tool.toolName,
        "url": "https://crunchmilk.com/" + tool.slug + "/"
      };
    })
  }, null, 2);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(country.name)} Calculators \u2014 CrunchMilk</title>
<meta name="description" content="${toolCount} free ${escapeHtml(country.name)} calculators. ${escapeHtml(country.subtitle)}. No signup required.">
<link rel="canonical" href="https://crunchmilk.com/${country.slug}/">
<meta property="og:title" content="${escapeHtml(country.name)} Calculators \u2014 CrunchMilk">
<meta property="og:description" content="${toolCount} free ${escapeHtml(country.name)} calculators. ${escapeHtml(country.subtitle)}.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://crunchmilk.com/${country.slug}/">
<meta property="og:image" content="https://crunchmilk.com/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(country.name)} Calculators \u2014 CrunchMilk">
<meta name="twitter:description" content="${toolCount} free ${escapeHtml(country.name)} calculators. ${escapeHtml(country.subtitle)}.">
<meta name="twitter:image" content="https://crunchmilk.com/og-image.png">
<meta name="robots" content="index, follow">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;800&family=DM+Sans:wght@400;500;600;700&display=swap" as="style">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;800&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4448238469960841"
     crossorigin="anonymous"></script>
<script type="application/ld+json">
${breadcrumbLD}
</script>
<script type="application/ld+json">
${itemListLD}
</script>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
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
.container{max-width:1120px;margin:0 auto;padding:0 24px}

/* Noise overlay */
body::after{content:'';position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;opacity:0.025;z-index:9999;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}

/* Header */
.site-header{background:var(--navy);padding:0;position:sticky;top:0;z-index:100;border-bottom:1px solid rgba(255,255,255,0.06)}
.header-inner{display:flex;align-items:center;justify-content:space-between;max-width:1120px;margin:0 auto;padding:14px 24px}
.logo{display:flex;align-items:center;text-decoration:none;gap:12px}
.logo-mark{width:34px;height:34px;background:var(--coral);border-radius:6px;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:15px;color:#fff;font-weight:800;letter-spacing:-0.5px;transform:rotate(-2deg)}
.logo-text{font-family:var(--font-display);font-size:1.3rem;font-weight:800;color:#fff;letter-spacing:-0.5px}
.logo-text span{color:var(--coral)}
.header-nav{display:flex;align-items:center;gap:16px}
.header-nav a{font-size:0.82rem;color:rgba(255,255,255,0.7);text-decoration:none;font-weight:500;transition:color 0.2s}
.header-nav a:hover{color:#fff}
.header-stat{font-size:0.72rem;color:var(--cream);background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);padding:5px 14px;border-radius:4px;font-weight:600;font-family:var(--font-body);letter-spacing:0.5px;text-transform:uppercase}

/* Hero */
.hero{background:var(--navy);color:#fff;padding:0 0 56px;text-align:center;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;bottom:0;left:0;right:0;height:200px;background:linear-gradient(to top,rgba(29,53,87,1),transparent);pointer-events:none}
.hero-grid{position:absolute;top:0;left:0;right:0;bottom:0;background-image:
  linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
  linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
background-size:48px 48px;pointer-events:none}
.hero-content{position:relative;z-index:1;padding-top:48px}
.hero-flag{font-size:3.5rem;margin-bottom:16px;display:block}
.hero-eyebrow{display:inline-block;font-family:var(--font-body);font-size:0.78rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--coral);margin-bottom:16px;padding:6px 20px;border:1px solid rgba(230,57,70,0.3);border-radius:4px;background:rgba(230,57,70,0.08)}
.hero h1{font-family:var(--font-display);font-size:3rem;margin-bottom:16px;font-weight:800;letter-spacing:-1.5px;line-height:1.1}
.hero h1 em{font-style:normal;color:var(--coral);position:relative}
.hero p{font-size:1.1rem;opacity:0.7;max-width:520px;margin:0 auto;line-height:1.6;font-weight:400}
.hero-stats{display:flex;justify-content:center;gap:48px;margin-top:36px;padding-top:28px;border-top:1px solid rgba(255,255,255,0.08)}
.hero-stat-item{text-align:center}
.hero-stat-num{font-family:var(--font-display);font-size:2rem;font-weight:800;color:var(--coral);letter-spacing:-1px;line-height:1}
.hero-stat-label{font-size:0.75rem;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:1.5px;font-weight:600;margin-top:6px}

/* Country nav in hero */
.country-nav{display:flex;gap:12px;justify-content:center;margin-top:32px}
.country-nav a{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);border-radius:var(--radius);color:rgba(255,255,255,0.7);text-decoration:none;font-family:var(--font-display);font-weight:600;font-size:0.88rem;transition:all 0.2s}
.country-nav a:hover{background:rgba(255,255,255,0.14);color:#fff}
.country-nav a.active{background:var(--coral);border-color:var(--coral);color:#fff}

/* Main */
main{padding:48px 0 64px}
.section-header{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:28px;padding-bottom:16px;border-bottom:2px solid var(--text)}
.section-title{font-family:var(--font-display);font-size:1.5rem;font-weight:800;letter-spacing:-0.5px}
.section-count{font-size:0.8rem;color:var(--text-light);font-weight:500}

/* Tool grid */
.tool-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:14px;margin-bottom:48px}
.tool-card{display:flex;flex-direction:column;padding:20px 22px;background:var(--card);border-radius:var(--radius);box-shadow:var(--shadow);text-decoration:none;color:var(--text);border:1px solid rgba(0,0,0,0.04);transition:all 0.2s ease;position:relative;overflow:hidden;animation:cardIn 0.4s ease both}
.tool-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--coral);transform:scaleY(0);transition:transform 0.2s ease;transform-origin:bottom}
.tool-card:hover{transform:translateY(-2px);box-shadow:0 4px 20px rgba(28,25,23,0.1);border-color:rgba(0,0,0,0.08)}
.tool-card:hover::before{transform:scaleY(1)}
.tool-card:hover .tool-arrow{opacity:1;transform:translateX(0) translateY(-50%)}
.tool-name{font-family:var(--font-display);font-weight:700;font-size:1rem;letter-spacing:-0.3px;line-height:1.3;margin-bottom:6px}
.tool-tagline{font-size:0.82rem;color:var(--text-mid);line-height:1.5;flex:1}
.tool-arrow{position:absolute;right:18px;top:50%;transform:translateX(-4px) translateY(-50%);font-size:1.1rem;color:var(--coral);opacity:0;transition:all 0.2s ease;font-weight:600}

@keyframes cardIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}

/* Back link */
.back-link{display:inline-flex;align-items:center;gap:6px;font-size:0.85rem;color:var(--text-mid);text-decoration:none;margin-bottom:24px;font-weight:500;transition:color 0.2s}
.back-link:hover{color:var(--coral)}
.back-link svg{width:16px;height:16px}

/* Footer */
footer{background:var(--navy);padding:36px 0;text-align:center;font-size:0.8rem;color:rgba(255,255,255,0.4);margin-top:16px}
footer a{color:rgba(255,255,255,0.4);text-decoration:none;transition:color 0.2s}
footer a:hover{color:#fff}
.footer-inner{display:flex;flex-direction:column;align-items:center;gap:8px}
.footer-brand{font-family:var(--font-display);font-weight:800;color:rgba(255,255,255,0.7);font-size:1rem;letter-spacing:-0.5px}
.footer-links{display:flex;gap:20px}
.footer-links a{font-size:0.78rem}
.footer-rule{width:40px;height:2px;background:var(--coral);opacity:0.4;border:none;margin:4px 0}

@media(max-width:640px){
  .hero h1{font-size:2.2rem;letter-spacing:-1px}
  .hero p{font-size:1rem}
  .hero-flag{font-size:2.5rem}
  .hero-stats{gap:24px}
  .hero-stat-num{font-size:1.5rem}
  .tool-grid{grid-template-columns:1fr}
  .section-header{flex-direction:column;gap:4px}
  .country-nav{flex-wrap:wrap;gap:8px}
  .country-nav a{padding:8px 14px;font-size:0.8rem}
  .header-stat{display:none}
}
@media(max-width:400px){
  .hero-stats{flex-direction:column;gap:16px}
}
</style>
</head>
<body>

<header class="site-header">
  <div class="header-inner">
    <a href="/" class="logo">
      <div class="logo-mark">CM</div>
      <div class="logo-text">Crunch<span>Milk</span></div>
    </a>
    <nav class="header-nav">
      <span class="header-stat">${totalSiteTools}+ Tools</span>
    </nav>
  </div>
</header>

<section class="hero">
  <div class="hero-grid"></div>
  <div class="container hero-content">
    <span class="hero-flag">${country.flag}</span>
    <span class="hero-eyebrow">${escapeHtml(country.fullName)}</span>
    <h1>${escapeHtml(country.name)} <em>Calculators</em></h1>
    <p>${escapeHtml(country.description)}</p>
    <div class="hero-stats">
      <div class="hero-stat-item">
        <div class="hero-stat-num">${toolCount}</div>
        <div class="hero-stat-label">Calculators</div>
      </div>
      <div class="hero-stat-item">
        <div class="hero-stat-num">0</div>
        <div class="hero-stat-label">Signups needed</div>
      </div>
    </div>
    <nav class="country-nav">
      <a href="/uk/"${country.slug === 'uk' ? ' class="active"' : ''}>\uD83C\uDDEC\uD83C\uDDE7 UK</a>
      <a href="/canada/"${country.slug === 'canada' ? ' class="active"' : ''}>\uD83C\uDDE8\uD83C\uDDE6 Canada</a>
      <a href="/australia/"${country.slug === 'australia' ? ' class="active"' : ''}>\uD83C\uDDE6\uD83C\uDDFA Australia</a>
    </nav>
  </div>
</section>

<main>
<div class="container">
  <a href="/" class="back-link">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
    All calculators
  </a>

  <div class="section-header">
    <h2 class="section-title">${escapeHtml(country.name)} Tools</h2>
    <span class="section-count">${toolCount} calculators</span>
  </div>
  <div class="tool-grid">
      ${toolCards}
  </div>
</div>
</main>

<footer>
  <div class="container footer-inner">
    <span class="footer-brand">CrunchMilk</span>
    <hr class="footer-rule">
    <p>&copy; ${year} CrunchMilk. All tools free \u2014 no signup required.</p>
    <div class="footer-links">
      <a href="/about/">About</a>
      <a href="/contact/">Contact</a>
      <a href="/privacy/">Privacy</a>
      <a href="/terms/">Terms</a>
      <a href="/sitemap/">Sitemap</a>
    </div>
  </div>
</footer>

</body>
</html>`;
}

function main() {
  console.log('Building Country Hub Pages\n==========================\n');

  const masterList = JSON.parse(fs.readFileSync(MASTER_LIST_PATH, 'utf8'));
  const totalSiteTools = masterList.length;

  // Load configs for taglines
  const configCache = {};
  fs.readdirSync(CONFIGS_DIR).filter(f => f.endsWith('.json')).forEach(function(f) {
    try {
      const cfg = JSON.parse(fs.readFileSync(path.join(CONFIGS_DIR, f), 'utf8'));
      configCache[cfg.slug] = cfg;
    } catch (e) {}
  });

  let builtCount = 0;

  COUNTRIES.forEach(function(country) {
    // Filter tools from master list by slug prefix
    const tools = masterList.filter(function(tool) {
      return country.prefixes.some(function(prefix) {
        return tool.slug.startsWith(prefix);
      });
    }).sort(function(a, b) {
      return a.toolName.localeCompare(b.toolName);
    });

    if (tools.length === 0) {
      console.log('  Skipped: ' + country.slug + ' (no tools found)');
      return;
    }

    const html = buildPage(country, tools, configCache, totalSiteTools);

    const outDir = path.join(OUTPUT_DIR, country.slug);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
    console.log('  Built: ' + country.slug + '/index.html (' + tools.length + ' tools)');
    builtCount++;
  });

  console.log('\nDone! Built ' + builtCount + ' country hub pages.');
}

main();
