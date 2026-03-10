#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT, 'output');
const DOMAIN = 'example.com'; // Replace with actual domain

function main() {
  const dirs = fs.readdirSync(OUTPUT_DIR).filter(d => {
    const full = path.join(OUTPUT_DIR, d);
    return fs.statSync(full).isDirectory() && fs.existsSync(path.join(full, 'index.html'));
  });

  const today = new Date().toISOString().split('T')[0];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Homepage
  xml += `  <url>\n    <loc>https://${DOMAIN}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

  dirs.sort().forEach(dir => {
    const isHub = dir.endsWith('-calculators');
    const isState = /-[a-z]{2}$/.test(dir) && dir.length > 5;
    const priority = isHub ? '0.8' : isState ? '0.5' : '0.7';
    const freq = isHub ? 'weekly' : 'monthly';

    xml += `  <url>\n    <loc>https://${DOMAIN}/${dir}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
  });

  xml += '</urlset>\n';

  fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap.xml'), xml, 'utf8');
  console.log('Built sitemap.xml with ' + (dirs.length + 1) + ' URLs');

  // robots.txt
  const robots = `User-agent: *
Allow: /

Sitemap: https://${DOMAIN}/sitemap.xml

# Crawl-delay for polite bots
User-agent: AhrefsBot
Crawl-delay: 10

User-agent: SemrushBot
Crawl-delay: 10
`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'robots.txt'), robots, 'utf8');
  console.log('Built robots.txt');

  // Privacy policy
  const privacy = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Privacy Policy</title><meta name="robots" content="noindex"><style>body{font-family:-apple-system,sans-serif;max-width:700px;margin:40px auto;padding:0 20px;line-height:1.7;color:#333}h1{font-size:1.5rem}h2{font-size:1.2rem;margin-top:24px}p{margin-bottom:12px}</style></head><body><h1>Privacy Policy</h1><p>Last updated: ${today}</p><h2>What We Collect</h2><p>We do not collect any personal data. All calculations run entirely in your browser. No inputs or results are sent to any server.</p><h2>Cookies</h2><p>We use standard analytics cookies (Google Analytics) and advertising cookies (Google AdSense/Ezoic) to understand traffic and serve relevant ads. You can opt out via your browser settings.</p><h2>Third-Party Services</h2><p>Our advertising partners may use cookies to serve personalized ads. See Google's privacy policy for details on how ad data is handled.</p><h2>Contact</h2><p>For privacy questions, contact us via the information on our homepage.</p><p><a href="/">Back to calculators</a></p></body></html>`;

  fs.mkdirSync(path.join(OUTPUT_DIR, 'privacy'), { recursive: true });
  fs.writeFileSync(path.join(OUTPUT_DIR, 'privacy', 'index.html'), privacy, 'utf8');
  console.log('Built privacy/index.html');

  // Terms
  const terms = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Terms of Use</title><meta name="robots" content="noindex"><style>body{font-family:-apple-system,sans-serif;max-width:700px;margin:40px auto;padding:0 20px;line-height:1.7;color:#333}h1{font-size:1.5rem}h2{font-size:1.2rem;margin-top:24px}p{margin-bottom:12px}</style></head><body><h1>Terms of Use</h1><p>Last updated: ${today}</p><h2>Accuracy</h2><p>All calculators provide estimates based on standard formulas. Results are for informational purposes only. We are not responsible for decisions made based on calculator results. Always consult a qualified professional for critical decisions.</p><h2>Use</h2><p>You may use these calculators for personal and commercial purposes. Embedding is permitted via the provided embed codes — please do not scrape or reproduce the tools without the embed code.</p><h2>No Warranty</h2><p>These tools are provided "as is" without warranty of any kind. We make no guarantees about accuracy, completeness, or fitness for any particular purpose.</p><p><a href="/">Back to calculators</a></p></body></html>`;

  fs.mkdirSync(path.join(OUTPUT_DIR, 'terms'), { recursive: true });
  fs.writeFileSync(path.join(OUTPUT_DIR, 'terms', 'index.html'), terms, 'utf8');
  console.log('Built terms/index.html');
}

main();
