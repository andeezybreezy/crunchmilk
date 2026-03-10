#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT, 'output');
const MASTER_LIST_PATH = path.join(ROOT, 'data', 'master-tool-list.json');

const CATEGORY_META = {
  'construction': { name: 'Construction', slug: 'construction-calculators', icon: '&#9635;' },
  'cooking': { name: 'Cooking & Recipes', slug: 'cooking-calculators', icon: '&#9672;' },
  'fitness': { name: 'Fitness & Health', slug: 'fitness-calculators', icon: '&#9651;' },
  'finance': { name: 'Finance & Money', slug: 'finance-calculators', icon: '&#11044;' },
  'niche-finance': { name: 'Investment', slug: 'niche-finance-calculators', icon: '&#9670;' },
  'automotive': { name: 'Automotive', slug: 'automotive-calculators', icon: '&#9654;' },
  'gardening': { name: 'Gardening', slug: 'gardening-calculators', icon: '&#10022;' },
  'energy': { name: 'Energy', slug: 'energy-calculators', icon: '&#9733;' },
  'energy-independence': { name: 'Energy Independence', slug: 'energy-independence-calculators', icon: '&#9737;' },
  'legal': { name: 'Legal', slug: 'legal-calculators', icon: '&#9878;' },
  'legal-regulatory': { name: 'Regulatory', slug: 'legal-regulatory-calculators', icon: '&#9744;' },
  'firearms': { name: 'Hunting & Outdoors', slug: 'firearms-calculators', icon: '&#9678;' },
  'agriculture': { name: 'Agriculture', slug: 'agriculture-calculators', icon: '&#10047;' },
  'trades-industrial': { name: 'Trades', slug: 'trades-industrial-calculators', icon: '&#9881;' },
  'ai-automation': { name: 'AI & Automation', slug: 'ai-automation-calculators', icon: '&#9043;' },
  'tariffs': { name: 'Tariffs & Trade', slug: 'tariff-calculators', icon: '&#8853;' },
  'housing': { name: 'Housing', slug: 'housing-calculators', icon: '&#9632;' },
  'crypto': { name: 'Crypto', slug: 'crypto-calculators', icon: '&#9830;' },
  'climate': { name: 'Climate & Safety', slug: 'climate-calculators', icon: '&#8776;' },
  'demographics': { name: 'Relocation', slug: 'demographics-calculators', icon: '&#10148;' },
  'health-longevity': { name: 'Health & Longevity', slug: 'health-longevity-calculators', icon: '&#10023;' },
  'niche-health': { name: 'Medical', slug: 'medical-calculators', icon: '&#10010;' },
  'paranormal': { name: 'Astrology', slug: 'paranormal-calculators', icon: '&#10038;' },
  'survival': { name: 'Survival', slug: 'survival-calculators', icon: '&#9650;' },
  'audio': { name: 'Audio & Music', slug: 'audio-calculators', icon: '&#9835;' },
  'pet': { name: 'Pets', slug: 'pet-calculators', icon: '&#10070;' },
  'crafts': { name: 'Crafts', slug: 'craft-calculators', icon: '&#10036;' },
  'sewing': { name: 'Sewing & Quilting', slug: 'sewing-calculators', icon: '&#10687;' },
  'photography': { name: 'Photography', slug: 'photography-calculators', icon: '&#9724;' },
  'woodworking': { name: 'Woodworking', slug: 'woodworking-calculators', icon: '&#9646;' },
  'science': { name: 'Science', slug: 'science-calculators', icon: '&#9883;' },
  'marine': { name: 'Boating', slug: 'marine-calculators', icon: '&#9875;' },
  'weather': { name: 'Weather', slug: 'weather-calculators', icon: '&#9730;' },
  'sports': { name: 'Sports', slug: 'sports-calculators', icon: '&#9898;' },
  'education': { name: 'Education', slug: 'education-calculators', icon: '&#9998;' },
  'shipping': { name: 'Shipping', slug: 'shipping-calculators', icon: '&#9645;' },
  'printing': { name: 'Printing', slug: 'printing-calculators', icon: '&#9641;' },
  '3d-printing': { name: '3D Printing', slug: '3d-printing-calculators', icon: '&#11200;' },
  'rv': { name: 'RV', slug: 'rv-calculators', icon: '&#9656;' }
};

function main() {
  const masterList = JSON.parse(fs.readFileSync(MASTER_LIST_PATH, 'utf8'));

  // Count tools per category
  const catCounts = {};
  masterList.forEach(t => {
    const c = t.category || 'uncategorized';
    catCounts[c] = (catCounts[c] || 0) + 1;
  });

  const totalTools = masterList.length;
  const year = new Date().getFullYear();

  // Build category grid
  const catCards = Object.keys(CATEGORY_META)
    .filter(k => catCounts[k] > 0)
    .sort((a, b) => (catCounts[b] || 0) - (catCounts[a] || 0))
    .map((k, i) => {
      const m = CATEGORY_META[k];
      const count = catCounts[k] || 0;
      return `<a href="/${m.slug}/" class="cat-card" style="animation-delay:${i * 40}ms"><span class="cat-icon">${m.icon}</span><span class="cat-name">${m.name}</span><span class="cat-count">${count} tools</span></a>`;
    }).join('\n      ');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CrunchMilk \u2014 ${totalTools}+ Free Online Calculators</title>
<meta name="description" content="CrunchMilk: ${totalTools}+ free online calculators for construction, cooking, fitness, finance, and more. No signup required. Fast, accurate, mobile-friendly.">
<meta name="keywords" content="CrunchMilk, free online calculators, calculator tools, construction calculator, cooking calculator, finance calculator">
<link rel="canonical" href="https://crunchmilk.com/">
<meta property="og:title" content="CrunchMilk \u2014 ${totalTools}+ Free Online Calculators">
<meta property="og:description" content="${totalTools}+ free calculators for construction, cooking, fitness, finance, and more. No signup required.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://crunchmilk.com/">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="CrunchMilk \u2014 ${totalTools}+ Free Online Calculators">
<meta name="twitter:description" content="${totalTools}+ free calculators for construction, cooking, fitness, finance, and more.">
<meta name="robots" content="index, follow">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;800&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "CrunchMilk",
  "url": "https://crunchmilk.com/",
  "description": "${totalTools}+ free online calculators for every need",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://crunchmilk.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
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
body::after{content:'';position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;opacity:0.03;z-index:9999;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}

/* Header */
.site-header{background:var(--navy);padding:0;position:sticky;top:0;z-index:100}
.header-inner{display:flex;align-items:center;justify-content:space-between;max-width:1120px;margin:0 auto;padding:14px 24px}
.logo{display:flex;align-items:center;text-decoration:none;gap:12px}
.logo-mark{width:34px;height:34px;background:var(--coral);border-radius:6px;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:15px;color:#fff;font-weight:800;letter-spacing:-0.5px;transform:rotate(-2deg)}
.logo-text{font-family:var(--font-display);font-size:1.3rem;font-weight:800;color:#fff;letter-spacing:-0.5px}
.logo-text span{color:var(--coral)}
.header-nav{display:flex;align-items:center;gap:16px}
.header-stat{font-size:0.72rem;color:var(--cream);background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);padding:5px 14px;border-radius:4px;font-weight:600;font-family:var(--font-body);letter-spacing:0.5px;text-transform:uppercase}

/* Hero */
.hero{background:var(--navy);color:#fff;padding:0 0 64px;text-align:center;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;bottom:0;left:0;right:0;height:200px;background:linear-gradient(to top,rgba(29,53,87,1),transparent);pointer-events:none}
.hero-grid{position:absolute;top:0;left:0;right:0;bottom:0;background-image:
  linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
  linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
background-size:48px 48px;pointer-events:none}
.hero-content{position:relative;z-index:1;padding-top:48px}
.hero-eyebrow{display:inline-block;font-family:var(--font-body);font-size:0.78rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--coral);margin-bottom:16px;padding:6px 20px;border:1px solid rgba(230,57,70,0.3);border-radius:4px;background:rgba(230,57,70,0.08)}
.hero h1{font-family:var(--font-display);font-size:3.2rem;margin-bottom:16px;font-weight:800;letter-spacing:-1.5px;line-height:1.1}
.hero h1 em{font-style:normal;color:var(--coral);position:relative}
.hero p{font-size:1.1rem;opacity:0.7;max-width:520px;margin:0 auto;line-height:1.6;font-weight:400}
.hero-stats{display:flex;justify-content:center;gap:48px;margin-top:40px;padding-top:32px;border-top:1px solid rgba(255,255,255,0.08)}
.hero-stat-item{text-align:center}
.hero-stat-num{font-family:var(--font-display);font-size:2rem;font-weight:800;color:var(--coral);letter-spacing:-1px;line-height:1}
.hero-stat-label{font-size:0.75rem;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:1.5px;font-weight:600;margin-top:6px}

/* Section */
main{padding:48px 0 64px}
.section-header{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:28px;padding-bottom:16px;border-bottom:2px solid var(--text)}
.section-title{font-family:var(--font-display);font-size:1.5rem;font-weight:800;letter-spacing:-0.5px}
.section-count{font-size:0.8rem;color:var(--text-light);font-weight:500}

/* Category grid */
.cat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px;margin-bottom:48px}
.cat-card{display:flex;align-items:center;gap:14px;padding:18px 20px;background:var(--card);border-radius:var(--radius);box-shadow:var(--shadow);text-decoration:none;color:var(--text);border:1px solid rgba(0,0,0,0.04);transition:all 0.2s ease;position:relative;overflow:hidden;animation:cardIn 0.4s ease both}
.cat-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--coral);transform:scaleY(0);transition:transform 0.2s ease;transform-origin:bottom}
.cat-card:hover{transform:translateY(-2px);box-shadow:0 4px 20px rgba(28,25,23,0.1);border-color:rgba(0,0,0,0.08)}
.cat-card:hover::before{transform:scaleY(1)}
.cat-icon{font-size:1.4rem;width:40px;height:40px;display:flex;align-items:center;justify-content:center;background:var(--cream);border-radius:6px;flex-shrink:0;color:var(--navy);font-weight:700}
.cat-info{display:flex;flex-direction:column}
.cat-name{font-family:var(--font-display);font-weight:700;font-size:0.92rem;letter-spacing:-0.2px;line-height:1.3}
.cat-count{font-size:0.75rem;color:var(--text-light);font-weight:500;margin-top:2px}

@keyframes cardIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}

/* Ad slots */
.ad-slot{background:var(--cream-dark);border:1px dashed var(--border);padding:20px;text-align:center;color:var(--text-light);font-size:0.8rem;margin:24px 0;border-radius:var(--radius);font-weight:500}

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
  .hero-stats{gap:24px}
  .hero-stat-num{font-size:1.5rem}
  .cat-grid{grid-template-columns:1fr 1fr}
  .cat-card{padding:14px 16px;gap:10px}
  .cat-icon{width:32px;height:32px;font-size:1.1rem}
  .header-stat{display:none}
  .section-header{flex-direction:column;gap:4px}
}
@media(max-width:400px){
  .cat-grid{grid-template-columns:1fr}
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
      <span class="header-stat">${totalTools}+ Tools</span>
    </nav>
  </div>
</header>

<section class="hero">
  <div class="hero-grid"></div>
  <div class="container hero-content">
    <span class="hero-eyebrow">Free Calculator Tools</span>
    <h1>Crunch the numbers.<br><em>Get answers.</em></h1>
    <p>Calculators for construction, cooking, fitness, finance, and dozens more categories. No signup, no paywalls, no nonsense.</p>
    <div class="hero-stats">
      <div class="hero-stat-item">
        <div class="hero-stat-num">${totalTools}+</div>
        <div class="hero-stat-label">Calculators</div>
      </div>
      <div class="hero-stat-item">
        <div class="hero-stat-num">${Object.keys(CATEGORY_META).filter(k => catCounts[k] > 0).length}</div>
        <div class="hero-stat-label">Categories</div>
      </div>
      <div class="hero-stat-item">
        <div class="hero-stat-num">0</div>
        <div class="hero-stat-label">Signups needed</div>
      </div>
    </div>
  </div>
</section>

<main>
<div class="container">
  <div class="ad-slot" aria-hidden="true">Ad Space \u2014 728x90 Leaderboard</div>

  <div class="section-header">
    <h2 class="section-title">Browse by Category</h2>
    <span class="section-count">${Object.keys(CATEGORY_META).filter(k => catCounts[k] > 0).length} categories</span>
  </div>
  <div class="cat-grid">
      ${catCards}
  </div>

  <div class="ad-slot" aria-hidden="true">Ad Space \u2014 336x280 Rectangle</div>
</div>
</main>

<footer>
  <div class="container footer-inner">
    <span class="footer-brand">CrunchMilk</span>
    <hr class="footer-rule">
    <p>&copy; ${year} CrunchMilk. All tools free \u2014 no signup required.</p>
    <div class="footer-links">
      <a href="/privacy/">Privacy</a>
      <a href="/terms/">Terms</a>
      <a href="/sitemap.xml">Sitemap</a>
    </div>
  </div>
</footer>

</body>
</html>`;

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), html, 'utf8');
  console.log('Built homepage: output/index.html');
}

main();
