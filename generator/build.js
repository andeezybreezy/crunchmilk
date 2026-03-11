#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

// Paths
const ROOT = path.resolve(__dirname, '..');
const CONFIGS_DIR = path.join(ROOT, 'sites', 'configs');
const CUSTOM_DIR = path.join(ROOT, 'sites', 'custom');
const TEMPLATE_PATH = path.join(ROOT, 'generator', 'templates', 'base.html');
const OUTPUT_DIR = path.join(ROOT, 'output');
const MASTER_LIST_PATH = path.join(ROOT, 'data', 'master-tool-list.json');
const { SHARE_SYSTEM_JS } = require('./share-system');

// ---------------------------------------------------------------------------
// Master tool list (loaded once, may not exist)
// ---------------------------------------------------------------------------

let masterList = null;

function loadMasterList() {
  if (masterList !== null) return masterList;
  try {
    if (fs.existsSync(MASTER_LIST_PATH)) {
      masterList = JSON.parse(fs.readFileSync(MASTER_LIST_PATH, 'utf8'));
      console.log('Loaded master-tool-list.json\n');
    } else {
      masterList = {};
    }
  } catch (e) {
    console.log('WARNING: Could not parse master-tool-list.json, skipping related tools.\n');
    masterList = {};
  }
  return masterList;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Build the WebApplication JSON-LD block from config.
 */
function buildJsonLdWeb(config) {
  const obj = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": config.toolName,
    "description": config.jsonLdDescription || config.metaDescription,
    "url": `https://${config.domain}/${config.slug}/`,
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };
  return JSON.stringify(obj, null, 2);
}

/**
 * Build the FAQPage JSON-LD block from config.faq array.
 */
function buildJsonLdFaq(config) {
  // Some configs store jsonLdFaq as a pre-built object
  if (config.jsonLdFaq) return JSON.stringify(config.jsonLdFaq, null, 2);
  if (!config.faq || config.faq.length === 0) return '{}';
  const obj = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": config.faq.map(function(item) {
      return {
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      };
    })
  };
  return JSON.stringify(obj, null, 2);
}

/**
 * Build the "How It Works" HTML section from config.howItWorks.
 */
function buildHowItWorks(config) {
  if (!config.howItWorks) return '';
  // Some configs store howItWorks as pre-built HTML string
  if (typeof config.howItWorks === 'string') return config.howItWorks;
  const hw = config.howItWorks;
  const title = hw.title || 'How It Works';
  let html = '  <div class="calc-card">\n';
  html += '    <h2>' + title + '</h2>\n';

  if (hw.intro) {
    html += '    <p style="margin-bottom:12px">' + hw.intro + '</p>\n';
  }

  if (hw.rules && hw.rules.length > 0) {
    html += '    <p style="margin-bottom:12px"><strong>The basic rule:</strong></p>\n';
    html += '    <ul style="margin-left:20px;margin-bottom:12px;line-height:2">\n';
    hw.rules.forEach(function(rule) {
      html += '      <li>' + rule + '</li>\n';
    });
    html += '    </ul>\n';
  }

  if (hw.outro) {
    html += '    <p style="font-size:0.9rem;color:var(--text-light)">' + hw.outro + '</p>\n';
  }

  html += '  </div>';
  return html;
}

/**
 * Build the FAQ HTML section from config.faq array.
 */
function buildFaqHtml(config) {
  // Some configs store faqHTML as a pre-built HTML string
  if (typeof config.faqHTML === 'string') return config.faqHTML;
  if (!config.faq || config.faq.length === 0) return '';
  let html = '  <div class="faq-section">\n';
  html += '    <h2>Frequently Asked Questions</h2>\n\n';
  config.faq.forEach(function(item) {
    html += '    <div class="faq-item">\n';
    html += '      <h3>' + item.question + '</h3>\n';
    html += '      <p>' + item.answer + '</p>\n';
    html += '    </div>\n\n';
  });
  html += '  </div>';
  return html;
}

/**
 * Resolve tool info (name + tagline) for a given slug.
 * Looks in master list first, then tries loading the tool's own config file.
 */
function resolveToolInfo(slug) {
  const master = loadMasterList();
  // Check master list
  if (master[slug] && master[slug].toolName) {
    return { name: master[slug].toolName, tagline: master[slug].tagline || '' };
  }
  // Fallback: try loading the tool's own config file
  const configPath = path.join(CONFIGS_DIR, slug + '.json');
  try {
    if (fs.existsSync(configPath)) {
      const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      return { name: cfg.toolName || slug, tagline: cfg.tagline || '' };
    }
  } catch (e) {
    // ignore parse errors
  }
  return null;
}

/**
 * Build the Related Tools HTML section.
 * Priority: master-tool-list.json entry > config.relatedTools field > empty.
 */
function buildRelatedToolsHtml(config) {
  const master = loadMasterList();

  // Determine the list of related tool slugs
  let relatedSlugs = [];
  if (master[config.slug] && Array.isArray(master[config.slug].relatedTools) && master[config.slug].relatedTools.length > 0) {
    relatedSlugs = master[config.slug].relatedTools;
  } else if (Array.isArray(config.relatedTools) && config.relatedTools.length > 0) {
    relatedSlugs = config.relatedTools;
  }

  if (relatedSlugs.length === 0) return '';

  // Build link cards
  const cards = [];
  relatedSlugs.forEach(function(slug) {
    const info = resolveToolInfo(slug);
    if (!info) return; // skip unknown tools
    cards.push(
      '<a href="/' + escapeHtml(slug) + '/" style="display:block;padding:16px;background:#f5f5f5;border-radius:8px;text-decoration:none;color:var(--text);border:2px solid var(--border);transition:border-color 0.2s">' +
        '<strong style="display:block;font-size:0.95rem;margin-bottom:4px">' + escapeHtml(info.name) + '</strong>' +
        '<span style="font-size:0.8rem;color:var(--text-light)">' + escapeHtml(info.tagline) + '</span>' +
      '</a>'
    );
  });

  if (cards.length === 0) return '';

  let html = '  <div class="related-section" style="background:var(--card);border-radius:var(--radius);box-shadow:var(--shadow);padding:28px 24px;margin-bottom:24px">\n';
  html += '    <h2 style="font-size:1.25rem;margin-bottom:16px">Related Tools</h2>\n';
  html += '    <div class="related-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px">\n';
  html += '      ' + cards.join('\n      ') + '\n';
  html += '    </div>\n';
  html += '  </div>';
  return html;
}

/**
 * Build the reference chart HTML from config.chart.
 */
function buildChartHtml(config) {
  if (!config.chart) return '';
  const chart = config.chart;
  let html = '  <div class="chart-section">\n';
  html += '    <h2>' + (chart.title || 'Reference Chart').replace(/&/g, '&amp;') + '</h2>\n';
  if (chart.subtitle) {
    html += '    <p style="font-size:0.9rem;color:var(--text-light);margin-bottom:16px">' + chart.subtitle + '</p>\n';
  }
  html += '    <div style="overflow-x:auto">\n';
  html += '    <table class="chart-table">\n';
  html += '      <thead>\n        <tr>\n';
  (chart.columns || []).forEach(function(col) {
    html += '          <th>' + col + '</th>\n';
  });
  html += '        </tr>\n      </thead>\n';
  html += '      <tbody id="chartBody">\n';
  (chart.rows || []).forEach(function(row) {
    html += '        <tr>';
    row.forEach(function(cell) {
      html += '<td>' + cell + '</td>';
    });
    html += '</tr>\n';
  });
  html += '      </tbody>\n';
  html += '    </table>\n    </div>\n';
  html += '  </div>';
  return html;
}

// ---------------------------------------------------------------------------
// Category metadata for hub pages + breadcrumbs
// ---------------------------------------------------------------------------

const CATEGORY_META = {
  'construction': { name: 'Construction Calculators', slug: 'construction-calculators' },
  'cooking': { name: 'Cooking Calculators', slug: 'cooking-calculators' },
  'fitness': { name: 'Fitness & Health Calculators', slug: 'fitness-calculators' },
  'finance': { name: 'Finance Calculators', slug: 'finance-calculators' },
  'niche-finance': { name: 'Niche Finance Calculators', slug: 'niche-finance-calculators' },
  'automotive': { name: 'Automotive Calculators', slug: 'automotive-calculators' },
  'gardening': { name: 'Gardening Calculators', slug: 'gardening-calculators' },
  'crafts': { name: 'Craft Calculators', slug: 'craft-calculators' },
  'sewing': { name: 'Sewing Calculators', slug: 'sewing-calculators' },
  'photography': { name: 'Photography Calculators', slug: 'photography-calculators' },
  'pet': { name: 'Pet Calculators', slug: 'pet-calculators' },
  'shipping': { name: 'Shipping Calculators', slug: 'shipping-calculators' },
  'printing': { name: 'Printing Calculators', slug: 'printing-calculators' },
  'sports': { name: 'Sports Calculators', slug: 'sports-calculators' },
  'education': { name: 'Education Calculators', slug: 'education-calculators' },
  'weather': { name: 'Weather Calculators', slug: 'weather-calculators' },
  'science': { name: 'Science Calculators', slug: 'science-calculators' },
  'marine': { name: 'Marine & Boating Calculators', slug: 'marine-calculators' },
  'woodworking': { name: 'Woodworking Calculators', slug: 'woodworking-calculators' },
  'audio': { name: 'Audio & Music Calculators', slug: 'audio-calculators' },
  'energy': { name: 'Energy Calculators', slug: 'energy-calculators' },
  'energy-independence': { name: 'Energy Independence Calculators', slug: 'energy-independence-calculators' },
  '3d-printing': { name: '3D Printing Calculators', slug: '3d-printing-calculators' },
  'agriculture': { name: 'Agriculture Calculators', slug: 'agriculture-calculators' },
  'trades-industrial': { name: 'Trades & Industrial Calculators', slug: 'trades-industrial-calculators' },
  'legal': { name: 'Legal Calculators', slug: 'legal-calculators' },
  'legal-regulatory': { name: 'Legal & Regulatory Calculators', slug: 'legal-regulatory-calculators' },
  'firearms': { name: 'Firearms & Hunting Calculators', slug: 'firearms-calculators' },
  'paranormal': { name: 'Paranormal & Astrology Calculators', slug: 'paranormal-calculators' },
  'survival': { name: 'Survival & Preparedness Calculators', slug: 'survival-calculators' },
  'niche-health': { name: 'Medical & Health Calculators', slug: 'medical-calculators' },
  'health-longevity': { name: 'Health & Longevity Calculators', slug: 'health-longevity-calculators' },
  'ai-automation': { name: 'AI & Automation Calculators', slug: 'ai-automation-calculators' },
  'tariffs': { name: 'Tariff & Trade Calculators', slug: 'tariff-calculators' },
  'housing': { name: 'Housing Calculators', slug: 'housing-calculators' },
  'crypto': { name: 'Cryptocurrency Calculators', slug: 'crypto-calculators' },
  'climate': { name: 'Climate & Disaster Calculators', slug: 'climate-calculators' },
  'demographics': { name: 'Demographics & Relocation Calculators', slug: 'demographics-calculators' },
  'rv': { name: 'RV Calculators', slug: 'rv-calculators' },
  'mental-health': { name: 'Mental Health Calculators', slug: 'mental-health-calculators' },
  'pregnancy': { name: 'Pregnancy & Baby Calculators', slug: 'pregnancy-calculators' },
  'insurance': { name: 'Insurance Calculators', slug: 'insurance-calculators' },
  'currency': { name: 'Currency Conversion Calculators', slug: 'currency-calculators' },
  'precious-metals': { name: 'Gold & Precious Metal Calculators', slug: 'precious-metals-calculators' },
  'ai-developer': { name: 'AI & Developer Cost Calculators', slug: 'ai-developer-calculators' },
  'economics': { name: 'Economics & Dollar Calculators', slug: 'economics-calculators' },
  'blockchain': { name: 'Blockchain & DeFi Calculators', slug: 'blockchain-calculators' },
  'food-beverage': { name: 'Food & Beverage Calculators', slug: 'food-beverage-calculators' },
  'music': { name: 'Music & Production Calculators', slug: 'music-calculators' },
  'diy-home': { name: 'DIY & Home Improvement Calculators', slug: 'diy-home-calculators' },
  'travel': { name: 'Travel Calculators', slug: 'travel-calculators' },
  'gaming': { name: 'Gaming Calculators', slug: 'gaming-calculators' },
  'electrical': { name: 'Electrical Calculators', slug: 'electrical-calculators' },
  'plumbing': { name: 'Plumbing Calculators', slug: 'plumbing-calculators' }
};

// Top 20 emotionally charged tools that get aggressive share CTAs
const EMOTIONAL_TOOLS = [
  'tariff-cost-calculator', 'tariff-price-impact-calculator',
  'ai-job-displacement-calculator', 'rent-vs-buy-calculator',
  'fire-calculator', 'debt-snowball-calculator', 'calorie-deficit-calculator',
  'body-fat-calculator', 'bac-calculator', 'biological-age-calculator',
  'glp1-weight-loss-calculator', 'self-employment-tax-calculator',
  'child-support-estimator', 'dui-fine-calculator', 'speeding-ticket-calculator',
  'bail-bond-calculator', 'wildfire-risk-calculator', 'flood-zone-calculator',
  'hurricane-insurance-calculator', 'squatter-rights-calculator'
];

/**
 * Build the share system JS with tool-specific values injected.
 */
function buildShareJS(config) {
  const isEmotional = EMOTIONAL_TOOLS.includes(config.slug);
  const catMeta = CATEGORY_META[config.category] || { name: 'Tools', slug: 'tools' };
  return SHARE_SYSTEM_JS
    .replace(/\{\{toolNameEsc\}\}/g, (config.toolName || '').replace(/'/g, "\\'"))
    .replace(/\{\{slug\}\}/g, config.slug)
    .replace(/\{\{domain\}\}/g, config.domain || 'crunchmilk.com')
    .replace(/\{\{isEmotional\}\}/g, isEmotional ? 'true' : 'false')
    .replace(/\{\{category\}\}/g, config.category || '');
}

/**
 * Build BreadcrumbList JSON-LD.
 */
function buildJsonLdBreadcrumb(config) {
  const catMeta = CATEGORY_META[config.category] || { name: 'Tools', slug: 'tools' };
  const obj = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `https://${config.domain}/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": catMeta.name,
        "item": `https://${config.domain}/${catMeta.slug}/`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": config.toolName
      }
    ]
  };
  return JSON.stringify(obj, null, 2);
}

/**
 * Build "How We Calculate This" section.
 */
function buildHowWeCalculate(config) {
  if (!config.howWeCalculate) return '';
  const hwc = config.howWeCalculate;
  let html = '  <div class="info-section">\n';
  html += '    <h2>How We Calculate This</h2>\n';
  if (hwc.intro) html += '    <p style="margin-bottom:12px">' + hwc.intro + '</p>\n';
  if (hwc.steps && hwc.steps.length > 0) {
    html += '    <ul>\n';
    hwc.steps.forEach(function(step) {
      html += '      <li>' + step + '</li>\n';
    });
    html += '    </ul>\n';
  }
  if (hwc.disclaimer) html += '    <p style="font-size:0.85rem;color:var(--text-light);margin-top:12px;font-style:italic">' + hwc.disclaimer + '</p>\n';
  html += '  </div>';
  return html;
}

/**
 * Build "When Would You Use This" section.
 */
function buildWhenToUse(config) {
  if (!config.whenToUse) return '';
  const wtu = config.whenToUse;
  let html = '  <div class="info-section">\n';
  html += '    <h2>When Would You Use This Calculator?</h2>\n';
  if (wtu.intro) html += '    <p style="margin-bottom:12px">' + wtu.intro + '</p>\n';
  if (wtu.scenarios && wtu.scenarios.length > 0) {
    html += '    <ul>\n';
    wtu.scenarios.forEach(function(s) {
      html += '      <li>' + s + '</li>\n';
    });
    html += '    </ul>\n';
  }
  html += '  </div>';
  return html;
}

/**
 * Build Last Updated line.
 */
function buildLastUpdated(config) {
  const dateStr = config.lastUpdated || new Date().toISOString().split('T')[0];
  return '  <div class="last-updated">Last updated: ' + dateStr + '</div>';
}

/**
 * Build embed code section (only for tools flagged as embeddable).
 */
function buildEmbedCode(config) {
  if (!config.embeddable) return '';
  const url = `https://${config.domain}/${config.slug}/`;
  let html = '  <div class="embed-section">\n';
  html += '    <h2>Embed This Calculator</h2>\n';
  html += '    <p>Want to add this calculator to your website or blog? Copy the code below:</p>\n';
  html += '    <textarea class="embed-code" rows="3" readonly id="embedCode">';
  html += '&lt;iframe src=&quot;' + url + '&quot; width=&quot;100%&quot; height=&quot;600&quot; frameborder=&quot;0&quot; title=&quot;' + escapeHtml(config.toolName) + '&quot;&gt;&lt;/iframe&gt;';
  html += '</textarea>\n';
  html += '    <button type="button" class="embed-copy-btn" onclick="navigator.clipboard.writeText(document.getElementById(\'embedCode\').value.replace(/&lt;/g,\'<\').replace(/&gt;/g,\'>\').replace(/&quot;/g,\'&quot;\'));this.textContent=\'Copied!\'">Copy Embed Code</button>\n';
  html += '  </div>';
  return html;
}

/**
 * Replace all {{placeholder}} tokens in the template.
 */
function renderTemplate(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, function(match, key) {
    if (vars.hasOwnProperty(key)) {
      return vars[key];
    }
    return match; // leave unresolved placeholders as-is
  });
}

// ---------------------------------------------------------------------------
// Main build
// ---------------------------------------------------------------------------

function buildSite(configFile) {
  const configPath = path.join(CONFIGS_DIR, configFile);
  const configRaw = fs.readFileSync(configPath, 'utf8');
  const config = JSON.parse(configRaw);
  const slug = config.slug;

  console.log('  Building: ' + slug);

  // Read template
  const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

  // Read custom JS
  const customJsPath = path.join(CUSTOM_DIR, slug + '.js');
  let customJS = '';
  if (fs.existsSync(customJsPath)) {
    customJS = fs.readFileSync(customJsPath, 'utf8');
  } else {
    console.log('    WARNING: No custom JS found at ' + customJsPath);
  }

  // Resolve category from master list or config
  if (!config.category) {
    const master = loadMasterList();
    if (Array.isArray(master)) {
      const entry = master.find(function(t) { return t.slug === config.slug; });
      if (entry) config.category = entry.category;
    }
  }

  const catMeta = CATEGORY_META[config.category] || { name: 'Tools', slug: 'tools' };

  // Build generated sections
  const jsonLdWeb = buildJsonLdWeb(config);
  const jsonLdFaq = buildJsonLdFaq(config);
  const jsonLdBreadcrumb = buildJsonLdBreadcrumb(config);
  const howItWorks = buildHowItWorks(config);
  const faqHTML = buildFaqHtml(config);
  const chartHTML = buildChartHtml(config);
  const relatedToolsHTML = buildRelatedToolsHtml(config);
  const howWeCalculateHTML = buildHowWeCalculate(config);
  const whenToUseHTML = buildWhenToUse(config);
  const lastUpdatedHTML = buildLastUpdated(config);
  const embedCodeHTML = buildEmbedCode(config);

  // Template variables
  const vars = {
    title: config.title || config.toolName,
    metaDescription: config.metaDescription || '',
    keywords: config.keywords || '',
    slug: config.slug,
    domain: config.domain || 'crunchmilk.com',
    toolName: config.toolName,
    tagline: config.tagline || '',
    primaryColor: config.primaryColor || '#e85d04',
    primaryDarkColor: config.primaryDarkColor || '#d45200',
    ogTitle: config.ogTitle || config.title || config.toolName,
    ogDescription: config.ogDescription || config.metaDescription || '',
    twitterDescription: config.twitterDescription || config.ogDescription || config.metaDescription || '',
    jsonLdWeb: jsonLdWeb,
    jsonLdFaq: jsonLdFaq,
    jsonLdBreadcrumb: jsonLdBreadcrumb,
    categorySlug: catMeta.slug,
    categoryName: catMeta.name,
    calculatorHTML: config.calculatorHTML || '',
    chartHTML: chartHTML,
    howItWorks: howItWorks,
    howWeCalculateHTML: howWeCalculateHTML,
    whenToUseHTML: whenToUseHTML,
    lastUpdatedHTML: lastUpdatedHTML,
    embedCodeHTML: embedCodeHTML,
    faqHTML: faqHTML,
    relatedToolsHTML: relatedToolsHTML,
    customJS: customJS,
    shareJS: buildShareJS(config),
    year: new Date().getFullYear().toString()
  };

  const html = renderTemplate(template, vars);

  // Write output
  const outputPath = path.join(OUTPUT_DIR, slug);
  fs.mkdirSync(outputPath, { recursive: true });
  const outputFile = path.join(outputPath, 'index.html');
  fs.writeFileSync(outputFile, html, 'utf8');

  console.log('    -> ' + path.relative(ROOT, outputFile));
}

function main() {
  const targetSlug = process.argv[2]; // optional: build a single site

  console.log('Micro-Site Empire — Static Site Generator');
  console.log('=========================================\n');

  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  if (targetSlug) {
    // Build single site
    const configFile = targetSlug + '.json';
    const configPath = path.join(CONFIGS_DIR, configFile);
    if (!fs.existsSync(configPath)) {
      console.error('ERROR: Config not found: ' + configPath);
      process.exit(1);
    }
    buildSite(configFile);
  } else {
    // Build all sites
    const configFiles = fs.readdirSync(CONFIGS_DIR).filter(function(f) {
      return f.endsWith('.json');
    });
    if (configFiles.length === 0) {
      console.log('No config files found in ' + CONFIGS_DIR);
      process.exit(0);
    }
    console.log('Found ' + configFiles.length + ' site config(s)\n');
    configFiles.forEach(buildSite);
  }

  console.log('\nDone!');
}

main();
