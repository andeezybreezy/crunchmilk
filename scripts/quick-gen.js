#!/usr/bin/env node
/**
 * Quick Tool Generator - creates tools from minimal definitions.
 * Input: JSON array of compact tool defs. Generates full config + JS.
 *
 * Usage: node scripts/quick-gen.js <definitions-file.json>
 *
 * Each tool definition needs:
 *   slug, toolName, category, tagline, keywords,
 *   inputs: [{id, label, default, unit?, min?, max?, step?, type?}],
 *   results: [{id, label}],
 *   calcFn: string of JS function body (receives object of input values, returns object of result values),
 *   faq: [{question, answer}],
 *   formulas: [string],
 *   relatedTools: [slug]
 */

const fs = require('fs');
const path = require('path');

const CONFIGS_DIR = path.join(__dirname, '..', 'sites', 'configs');
const CUSTOM_DIR = path.join(__dirname, '..', 'sites', 'custom');
const MASTER_LIST = path.join(__dirname, '..', 'data', 'master-tool-list.json');

const CATEGORY_COLORS = {
  'construction': ['#d97706', '#b45309'], 'cooking': ['#dc2626', '#b91c1c'],
  'fitness': ['#059669', '#047857'], 'finance': ['#2563eb', '#1d4ed8'],
  'niche-finance': ['#7c3aed', '#6d28d9'], 'automotive': ['#374151', '#1f2937'],
  'gardening': ['#16a34a', '#15803d'], 'crafts': ['#ec4899', '#db2777'],
  'sewing': ['#f472b6', '#ec4899'], 'photography': ['#6366f1', '#4f46e5'],
  'pet': ['#f59e0b', '#d97706'], 'shipping': ['#0891b2', '#0e7490'],
  'printing': ['#8b5cf6', '#7c3aed'], 'sports': ['#dc2626', '#b91c1c'],
  'education': ['#2563eb', '#1d4ed8'], 'weather': ['#0ea5e9', '#0284c7'],
  'science': ['#6366f1', '#4f46e5'], 'marine': ['#0369a1', '#075985'],
  'woodworking': ['#92400e', '#78350f'], 'audio': ['#7c3aed', '#6d28d9'],
  'energy': ['#eab308', '#ca8a04'], 'energy-independence': ['#16a34a', '#15803d'],
  '3d-printing': ['#8b5cf6', '#7c3aed'], 'agriculture': ['#65a30d', '#4d7c0f'],
  'trades-industrial': ['#ea580c', '#c2410c'], 'legal': ['#1e3a5f', '#162d4a'],
  'legal-regulatory': ['#1e3a5f', '#162d4a'], 'firearms': ['#57534e', '#44403c'],
  'paranormal': ['#7c3aed', '#6d28d9'], 'survival': ['#365314', '#1a2e05'],
  'niche-health': ['#0d9488', '#0f766e'], 'health-longevity': ['#10b981', '#059669'],
  'ai-automation': ['#6366f1', '#4f46e5'], 'tariffs': ['#dc2626', '#b91c1c'],
  'housing': ['#0891b2', '#0e7490'], 'crypto': ['#f59e0b', '#d97706'],
  'climate': ['#0ea5e9', '#0284c7'], 'demographics': ['#8b5cf6', '#7c3aed'],
  'rv': ['#b45309', '#92400e'], 'mental-health': ['#8b5cf6', '#7c3aed'],
  'pregnancy': ['#ec4899', '#db2777'], 'insurance': ['#2563eb', '#1d4ed8'],
  'currency': ['#059669', '#047857'], 'precious-metals': ['#d97706', '#b45309'],
  'ai-developer': ['#6366f1', '#4f46e5'], 'economics': ['#dc2626', '#b91c1c'],
  'blockchain': ['#f59e0b', '#d97706'], 'food-beverage': ['#dc2626', '#b91c1c'],
  'music': ['#7c3aed', '#6d28d9'], 'diy-home': ['#ea580c', '#c2410c'],
  'travel': ['#0891b2', '#0e7490'], 'gaming': ['#6366f1', '#4f46e5'],
  'electrical': ['#eab308', '#ca8a04'], 'plumbing': ['#0369a1', '#075985']
};

function buildCalcHTML(tool) {
  let html = `<div class="calc-card">\n  <h2>${tool.toolName}</h2>\n`;

  // Build input groups - use grid for 2-3 inputs per row
  const inputs = tool.inputs;
  if (inputs.length <= 3) {
    html += `  <div style="display:grid;grid-template-columns:${inputs.map(() => '1fr').join(' ')};gap:12px">\n`;
    for (const inp of inputs) {
      html += buildInputField(inp, true);
    }
    html += `  </div>\n`;
  } else {
    // Pair inputs into rows of 2
    for (let i = 0; i < inputs.length; i += 2) {
      if (i + 1 < inputs.length) {
        html += `  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">\n`;
        html += buildInputField(inputs[i], true);
        html += buildInputField(inputs[i + 1], true);
        html += `  </div>\n`;
      } else {
        html += buildInputField(inputs[i], false);
      }
    }
  }

  html += `\n  <button type="button" class="convert-btn" id="calcBtn">Calculate</button>\n\n`;
  html += `  <div class="result" id="result" role="status" aria-live="polite">\n`;

  // Build result rows (2 per row)
  const results = tool.results;
  for (let i = 0; i < results.length; i += 2) {
    html += `    <div class="result-row">\n`;
    html += `      <div class="result-item">\n        <div class="result-label">${results[i].label}</div>\n        <div class="result-value" id="${results[i].id}">—</div>\n      </div>\n`;
    if (i + 1 < results.length) {
      html += `      <div class="result-item">\n        <div class="result-label">${results[i + 1].label}</div>\n        <div class="result-value" id="${results[i + 1].id}">—</div>\n      </div>\n`;
    }
    html += `    </div>\n`;
  }

  html += `    <div class="result-tip" id="resultTip"></div>\n`;
  html += `  </div>\n</div>`;
  return html;
}

function buildInputField(inp, inGrid) {
  const mb = inGrid ? ' style="margin-bottom:0"' : '';
  const type = inp.type || 'number';
  const inputMode = type === 'number' ? ' inputmode="decimal"' : '';
  const minAttr = inp.min !== undefined ? ` min="${inp.min}"` : '';
  const maxAttr = inp.max !== undefined ? ` max="${inp.max}"` : '';
  const stepAttr = inp.step !== undefined ? ` step="${inp.step}"` : '';
  const unitSuffix = inp.unit ? ` (${inp.unit})` : '';

  if (inp.options) {
    // Select dropdown
    let optionsHtml = inp.options.map(o => {
      const selected = o.value == inp.default ? ' selected' : '';
      return `<option value="${o.value}"${selected}>${o.label}</option>`;
    }).join('');
    return `    <div class="input-group"${mb}>\n      <label for="${inp.id}">${inp.label}${unitSuffix}</label>\n      <select id="${inp.id}">${optionsHtml}</select>\n    </div>\n`;
  }

  return `    <div class="input-group"${mb}>\n      <label for="${inp.id}">${inp.label}${unitSuffix}</label>\n      <input type="${type}" id="${inp.id}" value="${inp.default}"${minAttr}${maxAttr}${stepAttr}${inputMode}>\n    </div>\n`;
}

function buildCustomJS(tool) {
  const inputIds = tool.inputs.map(i => i.id);
  const resultIds = tool.results.map(r => r.id);

  let js = `(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
`;

  // Parse inputs
  for (const inp of tool.inputs) {
    if (inp.options) {
      js += `    var ${inp.id} = document.getElementById('${inp.id}').value;\n`;
    } else {
      js += `    var ${inp.id} = parseFloat(document.getElementById('${inp.id}').value) || 0;\n`;
    }
  }

  js += `\n    // Calculation logic\n`;
  js += `    ${tool.calcFn}\n\n`;

  // Show results
  js += `    resultEl.classList.add('visible');\n`;
  js += `    resultEl.style.display = 'block';\n`;
  js += `    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });\n`;
  js += `  }\n\n`;

  // Event listeners
  js += `  calcBtn.addEventListener('click', calculate);\n`;
  js += `  [${inputIds.map(id => `'${id}'`).join(', ')}].forEach(function(id) {\n`;
  js += `    var el = document.getElementById(id);\n`;
  js += `    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });\n`;
  js += `  });\n`;
  js += `})();\n`;

  return js;
}

function generateConfig(tool) {
  const colors = CATEGORY_COLORS[tool.category] || ['#2563eb', '#1d4ed8'];
  const calcHTML = buildCalcHTML(tool);

  return {
    slug: tool.slug,
    toolName: tool.toolName,
    tagline: tool.tagline,
    title: `${tool.toolName} — Free Online Calculator`,
    metaDescription: `${tool.tagline}. Free, instant, no signup required.`,
    keywords: tool.keywords,
    domain: 'crunchmilk.com',
    primaryColor: colors[0],
    primaryDarkColor: colors[1],
    ogTitle: `${tool.toolName} — Free Online Calculator`,
    ogDescription: `Free ${tool.toolName.toLowerCase()}. ${tool.tagline}. No signup required.`,
    twitterDescription: `Free ${tool.toolName.toLowerCase()}. ${tool.tagline}.`,
    jsonLdDescription: `${tool.toolName}: ${tool.tagline}. Enter your values for instant results.`,
    calculatorHTML: calcHTML,
    howItWorks: {
      intro: tool.howItWorksIntro || `This ${tool.toolName.toLowerCase()} uses established formulas to provide accurate results.`,
      rules: tool.formulas || ['Enter your values and click Calculate for instant results.'],
      outro: tool.howItWorksOutro || 'Results are estimates. Consult a professional for critical decisions.'
    },
    faq: tool.faq,
    relatedTools: tool.relatedTools || [],
    howWeCalculate: {
      intro: `This ${tool.toolName.toLowerCase()} uses established formulas and current data to provide accurate estimates.`,
      steps: [
        'Enter your specific values into the calculator fields above',
        'Our algorithm applies the relevant formulas using your inputs',
        'Results are calculated instantly in your browser — nothing is sent to a server',
        'Review the detailed breakdown to understand how each factor affects your result'
      ],
      disclaimer: 'These calculations are estimates based on standard formulas. For critical decisions, always consult a qualified professional.'
    },
    whenToUse: {
      intro: `This ${tool.toolName.toLowerCase()} is designed for anyone who needs quick, reliable estimates.`,
      scenarios: tool.scenarios || [
        'When you need a quick estimate before committing to a purchase or project',
        'When comparing different options or scenarios side by side',
        'When planning a budget and need to understand potential costs',
        'When you want to verify a quote or estimate you\'ve received',
        'When teaching or learning about the concepts behind these calculations'
      ]
    },
    category: tool.category,
    lastUpdated: new Date().toISOString().split('T')[0]
  };
}

function run(defsFile) {
  const defs = JSON.parse(fs.readFileSync(defsFile, 'utf-8'));
  const masterList = JSON.parse(fs.readFileSync(MASTER_LIST, 'utf-8'));
  const existingSlugs = new Set(masterList.map(t => t.slug));
  let maxId = Math.max(...masterList.map(t => t.id));
  let created = 0, skipped = 0;

  for (const tool of defs) {
    const configPath = path.join(CONFIGS_DIR, `${tool.slug}.json`);
    if (fs.existsSync(configPath)) {
      console.log(`  SKIP: ${tool.slug}`);
      skipped++;
      continue;
    }

    const config = generateConfig(tool);
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    const customJS = buildCustomJS(tool);
    fs.writeFileSync(path.join(CUSTOM_DIR, `${tool.slug}.js`), customJS);

    if (!existingSlugs.has(tool.slug)) {
      maxId++;
      masterList.push({
        id: maxId,
        slug: tool.slug,
        toolName: tool.toolName,
        category: tool.category,
        subcategory: tool.subcategory || tool.category,
        primaryKeyword: tool.slug.replace(/-/g, ' '),
        competition: tool.competition || 'medium',
        rpm: tool.rpm || 'medium',
        priority: 2,
        status: 'active',
        relatedTools: tool.relatedTools || [],
        notes: ''
      });
      existingSlugs.add(tool.slug);
    }

    console.log(`  CREATED: ${tool.slug}`);
    created++;
  }

  fs.writeFileSync(MASTER_LIST, JSON.stringify(masterList, null, 2));
  console.log(`\nDone! Created: ${created}, Skipped: ${skipped}, Master list: ${masterList.length}`);
}

if (process.argv.length < 3) {
  console.log('Usage: node scripts/quick-gen.js <definitions.json>');
  process.exit(1);
}

run(process.argv[2]);
