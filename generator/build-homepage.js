#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT, 'output');
const MASTER_LIST_PATH = path.join(ROOT, 'data', 'master-tool-list.json');

// Consistent 20x20 SVG icons - all use stroke style for visual uniformity
const SVG = (d) => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const CATEGORY_META = {
  'construction':        { name: 'Construction',         slug: 'construction-calculators',         icon: SVG('<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 6V2"/><path d="M6 6V4"/><path d="M18 6V4"/>') },
  'cooking':             { name: 'Cooking & Recipes',    slug: 'cooking-calculators',              icon: SVG('<path d="M12 2v6"/><path d="M8 2v6"/><path d="M16 2v6"/><path d="M2 10h20"/><path d="M4 10v10a2 2 0 002 2h12a2 2 0 002-2V10"/>') },
  'fitness':             { name: 'Fitness & Health',     slug: 'fitness-calculators',              icon: SVG('<path d="M18 8h2a1 1 0 011 1v6a1 1 0 01-1 1h-2"/><path d="M6 8H4a1 1 0 00-1 1v6a1 1 0 001 1h2"/><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/><path d="M10 12h4"/>') },
  'finance':             { name: 'Finance & Money',      slug: 'finance-calculators',              icon: SVG('<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>') },
  'niche-finance':       { name: 'Investment',           slug: 'niche-finance-calculators',        icon: SVG('<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>') },
  'automotive':          { name: 'Automotive',           slug: 'automotive-calculators',           icon: SVG('<path d="M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h14a2 2 0 012 2v6a2 2 0 01-2 2M5 17l-1 2M19 17l1 2"/><circle cx="7.5" cy="13" r="1.5"/><circle cx="16.5" cy="13" r="1.5"/>') },
  'gardening':           { name: 'Gardening',            slug: 'gardening-calculators',            icon: SVG('<path d="M7 20h10"/><path d="M10 20c5-6 9.5-9 9.5-9a9.5 9.5 0 00-9.5 9z"/><path d="M14 20c-5-6-9.5-9-9.5-9A9.5 9.5 0 0114 20z"/>') },
  'energy':              { name: 'Energy',               slug: 'energy-calculators',               icon: SVG('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>') },
  'energy-independence': { name: 'Energy Independence',  slug: 'energy-independence-calculators',  icon: SVG('<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>') },
  'legal':               { name: 'Legal',                slug: 'legal-calculators',                icon: SVG('<path d="M12 3v18"/><path d="M5 7l7-4 7 4"/><path d="M5 7v2a7 7 0 007 7"/><path d="M19 7v2a7 7 0 01-7 7"/>') },
  'legal-regulatory':    { name: 'Regulatory',           slug: 'legal-regulatory-calculators',     icon: SVG('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12h8"/><path d="M8 8h8"/><path d="M8 16h4"/>') },
  'firearms':            { name: 'Hunting & Outdoors',   slug: 'firearms-calculators',             icon: SVG('<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>') },
  'agriculture':         { name: 'Agriculture',          slug: 'agriculture-calculators',          icon: SVG('<path d="M12 22V8"/><path d="M5 12H2a10 10 0 0020 0h-3"/><path d="M8 5l4-3 4 3"/>') },
  'trades-industrial':   { name: 'Trades',               slug: 'trades-industrial-calculators',    icon: SVG('<path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>') },
  'ai-automation':       { name: 'AI & Automation',      slug: 'ai-automation-calculators',        icon: SVG('<rect x="4" y="4" width="16" height="16" rx="2"/><circle cx="9" cy="10" r="1.5"/><circle cx="15" cy="10" r="1.5"/><path d="M8 15h8"/>') },
  'tariffs':             { name: 'Tariffs & Trade',      slug: 'tariff-calculators',               icon: SVG('<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>') },
  'housing':             { name: 'Housing',              slug: 'housing-calculators',              icon: SVG('<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>') },
  'crypto':              { name: 'Crypto',               slug: 'crypto-calculators',               icon: SVG('<path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042l-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893l-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042l.348-1.97M7.48 20.364l3.126-17.727"/>') },
  'climate':             { name: 'Climate & Safety',     slug: 'climate-calculators',              icon: SVG('<path d="M2 12h2"/><path d="M8 12H6"/><path d="M12 2v2"/><path d="M12 8V6"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 7.34l1.41-1.41"/><path d="M20 12h2"/><path d="M17 12h-1"/><path d="M12 20v2"/><path d="M12 17v-1"/><path d="M4.93 19.07l1.41-1.41"/><path d="M17.66 16.66l1.41 1.41"/>') },
  'demographics':        { name: 'Relocation',           slug: 'demographics-calculators',         icon: SVG('<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>') },
  'health-longevity':    { name: 'Health & Longevity',   slug: 'health-longevity-calculators',     icon: SVG('<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>') },
  'niche-health':        { name: 'Medical',              slug: 'medical-calculators',              icon: SVG('<path d="M8 2v4"/><path d="M16 2v4"/><rect x="4" y="4" width="16" height="18" rx="2"/><path d="M9 14h6"/><path d="M12 11v6"/>') },
  'paranormal':          { name: 'Astrology',            slug: 'paranormal-calculators',           icon: SVG('<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>') },
  'survival':            { name: 'Survival',             slug: 'survival-calculators',             icon: SVG('<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>') },
  'audio':               { name: 'Audio & Music',        slug: 'audio-calculators',                icon: SVG('<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>') },
  'pet':                 { name: 'Pets',                 slug: 'pet-calculators',                  icon: SVG('<circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="4" cy="8" r="2"/><path d="M12 12c-4 0-6 2-6 6s2 4 6 4 6 0 6-4-2-6-6-6z"/>') },
  'crafts':              { name: 'Crafts',               slug: 'craft-calculators',                icon: SVG('<path d="M12 2L2 22h20L12 2z"/>') },
  'sewing':              { name: 'Sewing & Quilting',    slug: 'sewing-calculators',               icon: SVG('<path d="M18 12.5V10a2 2 0 00-2-2v0a2 2 0 00-2 2v1.4"/><path d="M14 11V9a2 2 0 00-2-2v0a2 2 0 00-2 2v2"/><path d="M10 10.5V5a2 2 0 00-2-2v0a2 2 0 00-2 2v9"/><path d="M18 12a2 2 0 012 2v0a6 6 0 01-6 6H8"/>') },
  'photography':         { name: 'Photography',          slug: 'photography-calculators',          icon: SVG('<path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>') },
  'woodworking':         { name: 'Woodworking',          slug: 'woodworking-calculators',          icon: SVG('<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 12h16"/><path d="M12 4v16"/>') },
  'science':             { name: 'Science',              slug: 'science-calculators',              icon: SVG('<path d="M10 2v8L4.5 20.5a1 1 0 00.9 1.5h13.2a1 1 0 00.9-1.5L14 10V2"/><path d="M8 2h8"/><path d="M7 16h10"/>') },
  'marine':              { name: 'Boating',              slug: 'marine-calculators',               icon: SVG('<path d="M2 20l.8-2.2A6 6 0 018.5 14H12l3.5 6"/><path d="M12 14l3-8 3 8"/><path d="M2 20h20"/>') },
  'weather':             { name: 'Weather',              slug: 'weather-calculators',              icon: SVG('<path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/>') },
  'sports':              { name: 'Sports',               slug: 'sports-calculators',               icon: SVG('<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 000 20"/><path d="M12 2a14.5 14.5 0 010 20"/><path d="M2 12h20"/>') },
  'education':           { name: 'Education',            slug: 'education-calculators',            icon: SVG('<path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>') },
  'shipping':            { name: 'Shipping',             slug: 'shipping-calculators',             icon: SVG('<rect x="1" y="6" width="15" height="12" rx="1"/><path d="M16 10h4l3 4v4h-7V10z"/><circle cx="5.5" cy="19.5" r="1.5"/><circle cx="18.5" cy="19.5" r="1.5"/>') },
  'printing':            { name: 'Printing',             slug: 'printing-calculators',             icon: SVG('<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>') },
  '3d-printing':         { name: '3D Printing',          slug: '3d-printing-calculators',          icon: SVG('<path d="M12 2l10 6v8l-10 6L2 16V8l10-6z"/><path d="M12 8l10 6"/><path d="M12 8L2 14"/><path d="M12 8v14"/>') },
  'rv':                  { name: 'RV',                   slug: 'rv-calculators',                   icon: SVG('<rect x="1" y="8" width="18" height="10" rx="2"/><path d="M19 12h3l2 3v3h-5"/><circle cx="5" cy="19" r="1.5"/><circle cx="21" cy="19" r="1.5"/>') },
  'currency':            { name: 'Currency',              slug: 'currency-calculators',             icon: SVG('<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>') },
  'precious-metals':     { name: 'Gold & Silver',         slug: 'precious-metals-calculators',      icon: SVG('<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>') },
  'ai-developer':        { name: 'AI & Dev Tools',        slug: 'ai-developer-calculators',         icon: SVG('<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9l3 3-3 3"/><line x1="15" y1="15" x2="18" y2="15"/>') },
  'economics':           { name: 'Economics',             slug: 'economics-calculators',            icon: SVG('<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>') },
  'blockchain':          { name: 'Blockchain & DeFi',     slug: 'blockchain-calculators',           icon: SVG('<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v3"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/>') },
  'food-beverage':       { name: 'Food & Drink',          slug: 'food-beverage-calculators',        icon: SVG('<path d="M17 8h1a4 4 0 010 8h-1"/><path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/>') },
  'music':               { name: 'Music',                 slug: 'music-calculators',                icon: SVG('<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>') },
  'diy-home':            { name: 'DIY & Home',            slug: 'diy-home-calculators',             icon: SVG('<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>') },
  'travel':              { name: 'Travel',                slug: 'travel-calculators',               icon: SVG('<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>') },
  'gaming':              { name: 'Gaming',                slug: 'gaming-calculators',               icon: SVG('<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 12h4M8 10v4"/><circle cx="16" cy="10" r="1"/><circle cx="18" cy="12" r="1"/>') },
  'electrical':          { name: 'Electrical',            slug: 'electrical-calculators',           icon: SVG('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>') },
  'plumbing':            { name: 'Plumbing',              slug: 'plumbing-calculators',             icon: SVG('<path d="M6 12h6"/><path d="M12 6v12"/><circle cx="12" cy="12" r="10"/>') },
  'geopolitical-energy': { name: 'Geopolitical & Energy', slug: 'geopolitical-energy-calculators',  icon: SVG('<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>') },
  'mental-health':       { name: 'Mental Health',          slug: 'mental-health-calculators',         icon: SVG('<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>') },
  'pregnancy':           { name: 'Pregnancy & Baby',       slug: 'pregnancy-calculators',             icon: SVG('<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 12h8"/><path d="M12 8v8"/>') },
  'insurance':           { name: 'Insurance',              slug: 'insurance-calculators',             icon: SVG('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>') }
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

  // Build tool search index (slim: name, slug, category label)
  const toolIndex = masterList.map(t => {
    const catMeta = CATEGORY_META[t.category];
    const catLabel = catMeta ? catMeta.name : t.category;
    return { n: t.toolName, s: t.slug, c: catLabel };
  });
  const toolIndexJSON = JSON.stringify(toolIndex);

  // Popular tools - the 20 highest-traffic tools
  const POPULAR_TOOLS = [
    { slug: 'net-worth-percentile-calculator', name: 'Net Worth Percentile Calculator', tag: 'Where do you rank?' },
    { slug: 'salary-after-tax-calculator', name: 'Salary After Tax Calculator', tag: 'Take-home pay by state' },
    { slug: 'mortgage-affordability-calculator', name: 'Mortgage Affordability Calculator', tag: 'How much house can you afford?' },
    { slug: 'rent-vs-buy-calculator', name: 'Rent vs Buy Calculator', tag: 'The big decision' },
    { slug: 'property-tax-calculator', name: 'Property Tax Calculator', tag: 'By state comparison' },
    { slug: 'concrete-calculator', name: 'Concrete Calculator', tag: 'Bags, yards & cost' },
    { slug: 'gravel-calculator', name: 'Gravel & Fill Calculator', tag: 'Driveways, paths & more' },
    { slug: 'deck-material-calculator', name: 'Deck Material Calculator', tag: 'Boards, joists & cost' },
    { slug: 'paint-coverage-calculator', name: 'Paint Coverage Calculator', tag: 'Gallons for any room' },
    { slug: 'roof-pitch-calculator', name: 'Roof Pitch Calculator', tag: 'Angle, ratio & area' },
    { slug: 'irs-audit-probability-calculator', name: 'IRS Audit Probability Calculator', tag: 'What are your odds?' },
    { slug: 'ai-job-replacement-risk-calculator', name: 'AI Job Replacement Risk', tag: 'Will AI take your job?' },
    { slug: 'billionaire-wealth-comparison', name: 'Billionaire Wealth Comparison', tag: 'How rich is too rich?' },
    { slug: 'nuclear-blast-radius-calculator', name: 'Nuclear Blast Radius Calculator', tag: 'Destruction mapped' },
    { slug: 'cost-of-living-comparison', name: 'Cost of Living Comparison', tag: 'City vs city' },
    { slug: 'compound-interest-calculator', name: 'Compound Interest Calculator', tag: 'Watch your money grow' },
    { slug: 'loan-payment-calculator', name: 'Loan Payment Calculator', tag: 'Monthly payments & more' },
    { slug: 'inflation-calculator', name: 'Inflation Calculator', tag: 'Purchasing power over time' },
    { slug: 'body-fat-calculator', name: 'Body Fat Calculator', tag: 'Navy method estimate' },
    { slug: 'biological-age-calculator', name: 'Biological Age Calculator', tag: 'Your real age revealed' }
  ];

  const popCards = POPULAR_TOOLS.map((t, i) => {
    return `<a href="/${t.slug}/" class="pop-card"><span class="pop-rank">${i + 1}</span><div class="pop-info"><div class="pop-name">${t.name}</div><div class="pop-tag">${t.tag}</div></div></a>`;
  }).join('\n      ');

  // Build category grid
  const catCards = Object.keys(CATEGORY_META)
    .filter(k => catCounts[k] > 0)
    .sort((a, b) => (catCounts[b] || 0) - (catCounts[a] || 0))
    .map((k, i) => {
      const m = CATEGORY_META[k];
      const count = catCounts[k] || 0;
      return `<a href="/${m.slug}/" class="cat-card" style="animation-delay:${i * 40}ms"><span class="cat-icon">${m.icon}</span><span class="cat-name">${m.name}</span><span class="cat-count">${count}</span></a>`;
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
<meta property="og:image" content="https://crunchmilk.com/og-image.png">
<meta name="twitter:image" content="https://crunchmilk.com/og-image.png">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="dns-prefetch" href="https://pagead2.googlesyndication.com">
<link rel="dns-prefetch" href="https://www.googletagmanager.com">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;800&family=DM+Sans:wght@400;500;600;700&display=swap" as="style">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;800&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4448238469960841"
     crossorigin="anonymous"></script>
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
body::after{content:'';position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;opacity:0.025;z-index:9999;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}

/* Header */
.site-header{background:var(--navy);padding:0;position:sticky;top:0;z-index:100;border-bottom:1px solid rgba(255,255,255,0.06)}
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
.cat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px;margin-bottom:48px}
.cat-card{display:flex;align-items:center;gap:14px;padding:16px 18px;background:var(--card);border-radius:var(--radius);box-shadow:var(--shadow);text-decoration:none;color:var(--text);border:1px solid rgba(0,0,0,0.04);transition:all 0.2s ease;position:relative;overflow:hidden;animation:cardIn 0.4s ease both}
.cat-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--coral);transform:scaleY(0);transition:transform 0.2s ease;transform-origin:bottom}
.cat-card:hover{transform:translateY(-2px);box-shadow:0 4px 20px rgba(28,25,23,0.1);border-color:rgba(0,0,0,0.08)}
.cat-card:hover::before{transform:scaleY(1)}
.cat-icon{width:38px;height:38px;display:flex;align-items:center;justify-content:center;background:var(--cream);border-radius:6px;flex-shrink:0;color:var(--navy)}
.cat-icon svg{width:20px;height:20px}
.cat-name{font-family:var(--font-display);font-weight:700;font-size:0.92rem;letter-spacing:-0.2px;line-height:1.3;flex:1;min-width:0}
.cat-count{font-size:0.72rem;color:var(--text-light);font-weight:600;white-space:nowrap;flex-shrink:0;background:var(--cream);padding:3px 10px;border-radius:10px}

@keyframes cardIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}

/* Search */
.search-wrap{margin-bottom:28px;position:relative}
.search-input{width:100%;padding:14px 18px 14px 46px;border:1.5px solid var(--border);border-radius:var(--radius);font-size:1rem;font-family:var(--font-body);background:var(--card);color:var(--text);transition:border-color 0.2s,box-shadow 0.2s;-webkit-appearance:none;appearance:none;box-shadow:var(--shadow)}
.search-input:focus{outline:none;border-color:var(--coral);box-shadow:0 0 0 3px rgba(230,57,70,0.08)}
.search-input::placeholder{color:var(--text-light)}
.search-wrap svg.search-icon{position:absolute;left:16px;top:16px;color:var(--text-light);pointer-events:none;width:18px;height:18px}
.search-dropdown{display:none;position:absolute;top:100%;left:0;right:0;margin-top:4px;background:var(--card);border:1.5px solid var(--border);border-radius:var(--radius);box-shadow:0 8px 32px rgba(28,25,23,0.12);max-height:380px;overflow-y:auto;z-index:200}
.search-dropdown.visible{display:block}
.search-dropdown a{display:flex;align-items:center;justify-content:space-between;padding:12px 18px;text-decoration:none;color:var(--text);border-bottom:1px solid var(--cream-dark);transition:background 0.1s}
.search-dropdown a:last-child{border-bottom:none}
.search-dropdown a:hover,.search-dropdown a.active{background:var(--cream)}
.search-dropdown a .tool-name{font-family:var(--font-display);font-size:0.9rem;font-weight:600;letter-spacing:-0.2px}
.search-dropdown a .tool-name mark{background:rgba(230,57,70,0.12);color:var(--coral);border-radius:2px;padding:0 1px;font-weight:700}
.search-dropdown a .tool-cat{font-size:0.72rem;color:var(--text-light);font-weight:500;white-space:nowrap;flex-shrink:0;margin-left:12px}
.search-dropdown .search-no-results{padding:24px 18px;text-align:center;color:var(--text-light);font-size:0.88rem}
.search-dropdown .search-hint{padding:10px 18px;font-size:0.72rem;color:var(--text-light);border-top:1px solid var(--cream-dark);text-align:center;font-weight:500}

/* Popular Tools */
.popular-section{margin-bottom:48px}
.popular-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px}
.pop-card{display:flex;align-items:center;gap:14px;padding:16px 18px;background:var(--card);border-radius:var(--radius);box-shadow:var(--shadow);text-decoration:none;color:var(--text);border:1px solid rgba(0,0,0,0.04);transition:all 0.2s ease;position:relative;overflow:hidden}
.pop-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--coral);transform:scaleY(0);transition:transform 0.2s ease;transform-origin:bottom}
.pop-card:hover{transform:translateY(-2px);box-shadow:0 4px 20px rgba(28,25,23,0.1);border-color:rgba(0,0,0,0.08)}
.pop-card:hover::before{transform:scaleY(1)}
.pop-rank{width:28px;height:28px;display:flex;align-items:center;justify-content:center;background:var(--cream);border-radius:50%;flex-shrink:0;font-family:var(--font-display);font-size:0.72rem;font-weight:800;color:var(--coral)}
.pop-info{flex:1;min-width:0}
.pop-name{font-family:var(--font-display);font-weight:700;font-size:0.88rem;letter-spacing:-0.2px;line-height:1.3}
.pop-tag{font-size:0.72rem;color:var(--text-light);margin-top:2px}

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
  <div class="search-wrap" id="searchWrap">
    <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    <input type="text" class="search-input" id="toolSearch" placeholder="Search ${totalTools}+ calculators\u2026" autocomplete="off">
    <div class="search-dropdown" id="searchDropdown"></div>
  </div>

  <div class="popular-section">
    <div class="section-header">
      <h2 class="section-title">Popular Tools</h2>
      <span class="section-count">Top 20 most useful</span>
    </div>
    <div class="popular-grid">
      ${popCards}
    </div>
  </div>

  <div class="section-header">
    <h2 class="section-title">Browse by Category</h2>
    <span class="section-count">${Object.keys(CATEGORY_META).filter(k => catCounts[k] > 0).length} categories</span>
  </div>
  <div class="cat-grid">
      ${catCards}
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

<script>
(function(){
  var TOOLS=${toolIndexJSON};
  var input=document.getElementById('toolSearch');
  var dropdown=document.getElementById('searchDropdown');
  var activeIdx=-1;
  var results=[];

  function escapeHtml(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

  function highlight(text,query){
    if(!query)return escapeHtml(text);
    var i=text.toLowerCase().indexOf(query.toLowerCase());
    if(i===-1)return escapeHtml(text);
    return escapeHtml(text.slice(0,i))+'<mark>'+escapeHtml(text.slice(i,i+query.length))+'</mark>'+escapeHtml(text.slice(i+query.length));
  }

  function render(q){
    if(!q){dropdown.classList.remove('visible');activeIdx=-1;return}
    var ql=q.toLowerCase();
    // Score: starts-with > word-boundary > contains
    results=[];
    TOOLS.forEach(function(t){
      var nl=t.n.toLowerCase();
      var i=nl.indexOf(ql);
      if(i===-1)return;
      var score=i===0?0:(nl.charAt(i-1)===' '?1:2);
      results.push({t:t,score:score});
    });
    results.sort(function(a,b){return a.score-b.score});
    results=results.slice(0,8);

    if(results.length===0){
      dropdown.innerHTML='<div class="search-no-results">No calculators found for &ldquo;'+escapeHtml(q)+'&rdquo;</div>';
    }else{
      var html='';
      results.forEach(function(r,i){
        html+='<a href="/'+r.t.s+'/" data-idx="'+i+'"><span class="tool-name">'+highlight(r.t.n,q)+'</span><span class="tool-cat">'+escapeHtml(r.t.c)+'</span></a>';
      });
      html+='<div class="search-hint">'+results.length+' result'+(results.length===1?'':'s')+' \u00b7 \u2191\u2193 to navigate \u00b7 Enter to select</div>';
      dropdown.innerHTML=html;
    }
    activeIdx=-1;
    dropdown.classList.add('visible');
  }

  function setActive(idx){
    var links=dropdown.querySelectorAll('a');
    if(links.length===0)return;
    if(idx<0)idx=links.length-1;
    if(idx>=links.length)idx=0;
    links.forEach(function(l){l.classList.remove('active')});
    links[idx].classList.add('active');
    links[idx].scrollIntoView({block:'nearest'});
    activeIdx=idx;
  }

  input.addEventListener('input',function(){render(this.value.trim())});

  input.addEventListener('keydown',function(e){
    if(!dropdown.classList.contains('visible'))return;
    var links=dropdown.querySelectorAll('a');
    if(e.key==='ArrowDown'){e.preventDefault();setActive(activeIdx+1)}
    else if(e.key==='ArrowUp'){e.preventDefault();setActive(activeIdx-1)}
    else if(e.key==='Enter'&&activeIdx>=0&&links[activeIdx]){e.preventDefault();links[activeIdx].click()}
    else if(e.key==='Escape'){dropdown.classList.remove('visible');activeIdx=-1}
  });

  document.addEventListener('click',function(e){
    if(!document.getElementById('searchWrap').contains(e.target)){
      dropdown.classList.remove('visible');activeIdx=-1;
    }
  });

  input.addEventListener('focus',function(){if(this.value.trim())render(this.value.trim())});
})();
</script>

</body>
</html>`;

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), html, 'utf8');
  console.log('Built homepage: output/index.html');
}

main();
