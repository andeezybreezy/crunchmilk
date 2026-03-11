#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT, 'output');
const DOMAIN = 'crunchmilk.com';

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

  // About page
  const about = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>About CrunchMilk - Free Online Calculators</title><meta name="description" content="CrunchMilk provides 1,000+ free online calculators for finance, construction, fitness, cooking, and more. No signup required."><meta name="robots" content="index, follow"><link rel="canonical" href="https://${DOMAIN}/about/"><meta property="og:title" content="About CrunchMilk"><meta property="og:description" content="1,000+ free online calculators. No signup required."><meta property="og:type" content="website"><meta property="og:url" content="https://${DOMAIN}/about/"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="About CrunchMilk"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:700px;margin:0 auto;padding:40px 20px;line-height:1.7;color:#333;background:#fafaf8}h1{font-size:1.6rem;margin-bottom:8px;color:#1a1a2e}h2{font-size:1.2rem;margin-top:28px;margin-bottom:8px;color:#1a1a2e}p{margin-bottom:14px}.back{display:inline-block;margin-top:24px;padding:10px 20px;background:#1a1a2e;color:#fff;text-decoration:none;border-radius:6px;font-size:0.9rem;font-weight:600}.back:hover{background:#2a2a4e}.stat{display:inline-block;background:#ff6b6b;color:#fff;padding:2px 10px;border-radius:12px;font-weight:700;font-size:0.85rem}</style></head><body><h1>About CrunchMilk</h1><p>CrunchMilk is a free calculator platform with <span class="stat">1,000+ tools</span> across 50+ categories \u2014 from finance and construction to fitness, cooking, and beyond.</p><h2>Our Mission</h2><p>We believe useful tools should be free, fast, and private. Every calculator on CrunchMilk runs entirely in your browser \u2014 no data is collected, no signup is required, and results appear instantly.</p><h2>How It Works</h2><p>Each calculator is built with real-world formulas used by professionals in their respective fields. Whether you\u2019re estimating a mortgage payment, sizing a concrete slab, or tracking macros, you get accurate results you can trust.</p><h2>Quality &amp; Accuracy</h2><p>Our tools use industry-standard formulas and are regularly reviewed for accuracy. That said, calculators provide estimates \u2014 always consult a qualified professional for critical decisions.</p><h2>Built for Speed</h2><p>CrunchMilk pages are lightweight static HTML with zero frameworks. They load fast on any device and work offline once loaded.</p><p><a class="back" href="/">\u2190 Browse All Calculators</a></p></body></html>`;

  fs.mkdirSync(path.join(OUTPUT_DIR, 'about'), { recursive: true });
  fs.writeFileSync(path.join(OUTPUT_DIR, 'about', 'index.html'), about, 'utf8');
  console.log('Built about/index.html');

  // Contact page
  const contact = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Contact CrunchMilk</title><meta name="description" content="Get in touch with the CrunchMilk team. Report bugs, suggest new calculators, or ask questions."><meta name="robots" content="index, follow"><link rel="canonical" href="https://${DOMAIN}/contact/"><meta property="og:title" content="Contact CrunchMilk"><meta property="og:description" content="Report bugs, suggest calculators, or get in touch."><meta property="og:type" content="website"><meta property="og:url" content="https://${DOMAIN}/contact/"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="Contact CrunchMilk"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:700px;margin:0 auto;padding:40px 20px;line-height:1.7;color:#333;background:#fafaf8}h1{font-size:1.6rem;margin-bottom:8px;color:#1a1a2e}h2{font-size:1.2rem;margin-top:28px;margin-bottom:8px;color:#1a1a2e}p{margin-bottom:14px}a{color:#ff6b6b}.contact-card{background:#fff;border:1px solid #e8e6e1;border-radius:8px;padding:24px;margin:20px 0}.contact-card p{margin-bottom:8px}.back{display:inline-block;margin-top:24px;padding:10px 20px;background:#1a1a2e;color:#fff;text-decoration:none;border-radius:6px;font-size:0.9rem;font-weight:600}.back:hover{background:#2a2a4e}</style></head><body><h1>Contact Us</h1><p>We\u2019d love to hear from you! Whether you have a suggestion for a new calculator, found a bug, or just want to say hello.</p><div class="contact-card"><h2>Get in Touch</h2><p><strong>Email:</strong> <a href="mailto:hello@crunchmilk.com">hello@crunchmilk.com</a></p></div><h2>Suggest a Calculator</h2><p>Have an idea for a calculator we should build? Email us with the subject line "Calculator Suggestion" and we\u2019ll review it.</p><h2>Report a Bug</h2><p>If you find an error in any calculator, please let us know! Include the calculator name and what result you expected vs. what you got.</p><p><a class="back" href="/">\u2190 Browse All Calculators</a></p></body></html>`;

  fs.mkdirSync(path.join(OUTPUT_DIR, 'contact'), { recursive: true });
  fs.writeFileSync(path.join(OUTPUT_DIR, 'contact', 'index.html'), contact, 'utf8');
  console.log('Built contact/index.html');
}

main();
