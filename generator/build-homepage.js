#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT, 'output');
const MASTER_LIST_PATH = path.join(ROOT, 'data', 'master-tool-list.json');

const CATEGORY_META = {
  'construction': { name: 'Construction', slug: 'construction-calculators', icon: '🏗️' },
  'cooking': { name: 'Cooking & Recipes', slug: 'cooking-calculators', icon: '🍳' },
  'fitness': { name: 'Fitness & Health', slug: 'fitness-calculators', icon: '💪' },
  'finance': { name: 'Finance & Money', slug: 'finance-calculators', icon: '💰' },
  'niche-finance': { name: 'Investment', slug: 'niche-finance-calculators', icon: '📈' },
  'automotive': { name: 'Automotive', slug: 'automotive-calculators', icon: '🚗' },
  'gardening': { name: 'Gardening', slug: 'gardening-calculators', icon: '🌱' },
  'energy': { name: 'Energy', slug: 'energy-calculators', icon: '⚡' },
  'energy-independence': { name: 'Energy Independence', slug: 'energy-independence-calculators', icon: '🔋' },
  'legal': { name: 'Legal', slug: 'legal-calculators', icon: '⚖️' },
  'legal-regulatory': { name: 'Regulatory', slug: 'legal-regulatory-calculators', icon: '📋' },
  'firearms': { name: 'Hunting & Outdoors', slug: 'firearms-calculators', icon: '🎯' },
  'agriculture': { name: 'Agriculture', slug: 'agriculture-calculators', icon: '🌾' },
  'trades-industrial': { name: 'Trades', slug: 'trades-industrial-calculators', icon: '🔧' },
  'ai-automation': { name: 'AI & Automation', slug: 'ai-automation-calculators', icon: '🤖' },
  'tariffs': { name: 'Tariffs & Trade', slug: 'tariff-calculators', icon: '🌐' },
  'housing': { name: 'Housing', slug: 'housing-calculators', icon: '🏠' },
  'crypto': { name: 'Crypto', slug: 'crypto-calculators', icon: '₿' },
  'climate': { name: 'Climate & Safety', slug: 'climate-calculators', icon: '🌊' },
  'demographics': { name: 'Relocation', slug: 'demographics-calculators', icon: '📍' },
  'health-longevity': { name: 'Health & Longevity', slug: 'health-longevity-calculators', icon: '🧬' },
  'niche-health': { name: 'Medical', slug: 'medical-calculators', icon: '🏥' },
  'paranormal': { name: 'Astrology', slug: 'paranormal-calculators', icon: '🔮' },
  'survival': { name: 'Survival', slug: 'survival-calculators', icon: '🏕️' },
  'audio': { name: 'Audio & Music', slug: 'audio-calculators', icon: '🎵' },
  'pet': { name: 'Pets', slug: 'pet-calculators', icon: '🐾' },
  'crafts': { name: 'Crafts', slug: 'craft-calculators', icon: '🎨' },
  'sewing': { name: 'Sewing & Quilting', slug: 'sewing-calculators', icon: '🧵' },
  'photography': { name: 'Photography', slug: 'photography-calculators', icon: '📷' },
  'woodworking': { name: 'Woodworking', slug: 'woodworking-calculators', icon: '🪵' },
  'science': { name: 'Science', slug: 'science-calculators', icon: '🔬' },
  'marine': { name: 'Boating', slug: 'marine-calculators', icon: '⛵' },
  'weather': { name: 'Weather', slug: 'weather-calculators', icon: '🌤️' },
  'sports': { name: 'Sports', slug: 'sports-calculators', icon: '⛳' },
  'education': { name: 'Education', slug: 'education-calculators', icon: '🎓' },
  'shipping': { name: 'Shipping', slug: 'shipping-calculators', icon: '📦' },
  'printing': { name: 'Printing', slug: 'printing-calculators', icon: '🖨️' },
  '3d-printing': { name: '3D Printing', slug: '3d-printing-calculators', icon: '🖨️' },
  'rv': { name: 'RV', slug: 'rv-calculators', icon: '🚐' }
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
    .map(k => {
      const m = CATEGORY_META[k];
      const count = catCounts[k] || 0;
      return `<a href="/${m.slug}/" class="cat-card"><span class="cat-icon">${m.icon}</span><span class="cat-name">${m.name}</span><span class="cat-count">${count} tools</span></a>`;
    }).join('\n      ');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CrunchMilk — ${totalTools}+ Free Online Calculators</title>
<meta name="description" content="CrunchMilk: ${totalTools}+ free online calculators for construction, cooking, fitness, finance, and more. No signup required. Fast, accurate, mobile-friendly.">
<meta name="keywords" content="CrunchMilk, free online calculators, calculator tools, construction calculator, cooking calculator, finance calculator">
<link rel="canonical" href="https://crunchmilk.com/">
<meta property="og:title" content="CrunchMilk — ${totalTools}+ Free Online Calculators">
<meta property="og:description" content="${totalTools}+ free calculators for construction, cooking, fitness, finance, and more. No signup required.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://crunchmilk.com/">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="CrunchMilk — ${totalTools}+ Free Online Calculators">
<meta name="twitter:description" content="${totalTools}+ free calculators for construction, cooking, fitness, finance, and more.">
<meta name="robots" content="index, follow">
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
:root{--primary:#2563eb;--primary-dark:#1d4ed8;--accent:#f59e0b;--bg:#fafaf9;--card:#fff;--text:#1a1a1a;--text-light:#555;--border:#e0e0e0;--radius:12px;--shadow:0 2px 8px rgba(0,0,0,0.08)}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:var(--bg);color:var(--text);line-height:1.6}
.container{max-width:1100px;margin:0 auto;padding:0 20px}

/* Header */
.site-header{background:#fff;border-bottom:1px solid var(--border);padding:0;position:sticky;top:0;z-index:100;box-shadow:0 1px 3px rgba(0,0,0,0.04)}
.header-inner{display:flex;align-items:center;justify-content:space-between;max-width:1100px;margin:0 auto;padding:12px 20px}
.logo{display:flex;align-items:center;text-decoration:none;gap:10px}
.logo-icon{width:36px;height:36px;background:linear-gradient(135deg,#2563eb,#7c3aed);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px;color:#fff;font-weight:800;letter-spacing:-1px;font-family:'Georgia',serif}
.logo-text{font-size:1.35rem;font-weight:800;color:var(--text);letter-spacing:-0.5px}
.logo-text span{color:var(--primary)}
.header-nav{display:flex;align-items:center;gap:20px}
.header-nav a{text-decoration:none;color:var(--text-light);font-size:0.85rem;font-weight:500;transition:color 0.2s}
.header-nav a:hover{color:var(--primary)}
.header-stat{font-size:0.75rem;color:#fff;background:var(--primary);padding:4px 12px;border-radius:20px;font-weight:600}

/* Hero */
.hero{background:linear-gradient(135deg,#1e40af 0%,#7c3aed 50%,#a855f7 100%);color:#fff;padding:56px 0 48px;text-align:center;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;top:-50%;left:-50%;width:200%;height:200%;background:radial-gradient(circle at 30% 50%,rgba(255,255,255,0.05) 0%,transparent 50%);pointer-events:none}
.hero h1{font-size:2.2rem;margin-bottom:10px;font-weight:800;letter-spacing:-0.5px}
.hero p{font-size:1.15rem;opacity:0.9;max-width:560px;margin:0 auto;line-height:1.5}
.hero-badges{display:flex;justify-content:center;gap:12px;margin-top:20px;flex-wrap:wrap}
.hero-badge{display:inline-flex;align-items:center;gap:6px;padding:8px 18px;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.2);border-radius:24px;font-size:0.85rem;font-weight:600;backdrop-filter:blur(4px)}

main{padding:32px 0 48px}
.section-title{font-size:1.3rem;margin-bottom:20px;text-align:center;font-weight:700}
.cat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px;margin-bottom:40px}
.cat-card{display:flex;flex-direction:column;align-items:center;padding:20px 16px;background:var(--card);border-radius:var(--radius);box-shadow:var(--shadow);text-decoration:none;color:var(--text);border:2px solid transparent;transition:all 0.2s;text-align:center}
.cat-card:hover{border-color:var(--primary);transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,0.12)}
.cat-icon{font-size:2rem;margin-bottom:8px}
.cat-name{font-weight:700;font-size:0.95rem;margin-bottom:4px}
.cat-count{font-size:0.8rem;color:var(--text-light)}
.ad-slot{background:#f0f0f0;border:2px dashed #ccc;padding:20px;text-align:center;color:#999;font-size:0.85rem;margin:20px 0;border-radius:var(--radius)}
footer{background:#1a1a2e;padding:28px 0;text-align:center;font-size:0.8rem;color:rgba(255,255,255,0.5)}
footer a{color:rgba(255,255,255,0.5);text-decoration:none}
footer a:hover{color:#fff}
.footer-brand{font-weight:700;color:rgba(255,255,255,0.8);font-size:0.9rem;margin-bottom:6px}
@media(max-width:600px){.hero h1{font-size:1.6rem}.hero p{font-size:1rem}.cat-grid{grid-template-columns:repeat(2,1fr)}.header-nav{gap:12px}.header-stat{display:none}}
</style>
</head>
<body>

<header class="site-header">
  <div class="header-inner">
    <a href="/" class="logo">
      <div class="logo-icon">CM</div>
      <div class="logo-text">Crunch<span>Milk</span></div>
    </a>
    <nav class="header-nav">
      <span class="header-stat">${totalTools}+ Tools</span>
    </nav>
  </div>
</header>

<div class="hero">
  <div class="container">
    <h1>Crunch the numbers. Get answers.</h1>
    <p>Free calculators for construction, cooking, fitness, finance, and dozens more categories. No signup, no paywalls.</p>
    <div class="hero-badges">
      <span class="hero-badge">${totalTools}+ Calculators</span>
      <span class="hero-badge">100% Free</span>
      <span class="hero-badge">No Signup</span>
    </div>
  </div>
</div>

<main>
<div class="container">
  <div class="ad-slot" aria-hidden="true">Ad Space — 728x90 Leaderboard</div>

  <h2 class="section-title">Browse by Category</h2>
  <div class="cat-grid">
      ${catCards}
  </div>

  <div class="ad-slot" aria-hidden="true">Ad Space — 336x280 Rectangle</div>
</div>
</main>

<footer>
  <div class="container">
    <p class="footer-brand">CrunchMilk</p>
    <p>&copy; ${year} CrunchMilk. All tools are free — no signup required.</p>
    <p style="margin-top:6px"><a href="/privacy/">Privacy Policy</a> &middot; <a href="/terms/">Terms</a> &middot; <a href="/sitemap.xml">Sitemap</a></p>
  </div>
</footer>

</body>
</html>`;

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), html, 'utf8');
  console.log('Built homepage: output/index.html');
}

main();
