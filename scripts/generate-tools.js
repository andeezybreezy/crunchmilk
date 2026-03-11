#!/usr/bin/env node
/**
 * generate-tools.js
 *
 * Generates calculator tool config JSONs and custom JS files from compact
 * tool definitions in data/new-tools.json.
 *
 * Usage: node scripts/generate-tools.js
 *
 * For each tool definition, generates:
 *   - sites/configs/{slug}.json
 *   - sites/custom/{slug}.js
 *   - Appends entry to data/master-tool-list.json
 *
 * Skips tools that already have a config file.
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ── Paths ──────────────────────────────────────────────────────────────────────
const ROOT = path.resolve(__dirname, '..');
// Accepts CLI args for input files, or defaults to all data/wave5-*.json files
const NEW_TOOLS_PATHS = process.argv.length > 2
  ? process.argv.slice(2).map(f => path.resolve(f))
  : fs.readdirSync(path.join(ROOT, 'data'))
      .filter(f => f.startsWith('wave5-') && f.endsWith('.json'))
      .map(f => path.join(ROOT, 'data', f));
const MASTER_LIST_PATH = path.join(ROOT, 'data', 'master-tool-list.json');
const CONFIGS_DIR = path.join(ROOT, 'sites', 'configs');
const CUSTOM_DIR = path.join(ROOT, 'sites', 'custom');

// ── Helpers ────────────────────────────────────────────────────────────────────

function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

function configExists(slug) {
  return fs.existsSync(path.join(CONFIGS_DIR, slug + '.json'));
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

// ── Category-aware scenario generation ─────────────────────────────────────────

const CATEGORY_SCENARIOS = {
  finance: [
    'When planning major financial decisions like buying a home, investing, or taking on debt',
    'When comparing different financial products or scenarios side by side',
    'When building a budget or projecting future savings and expenses',
    'When you want to verify a quote or estimate from a financial advisor or lender',
    'When teaching or learning about personal finance and compound growth'
  ],
  construction: [
    'When estimating materials and costs before starting a construction project',
    'When comparing different material options or project approaches',
    'When planning a budget for a home improvement or building project',
    'When you want to verify a contractor\'s estimate or material quote',
    'When ordering materials and need to avoid over- or under-buying'
  ],
  health: [
    'When tracking or planning your health, fitness, or nutrition goals',
    'When comparing different diet or exercise approaches',
    'When you want a quick health-related estimate without a doctor visit',
    'When you want to verify health metrics you\'ve received from a professional',
    'When learning about health and wellness benchmarks and standards'
  ],
  automotive: [
    'When evaluating the total cost of vehicle ownership or a new purchase',
    'When comparing different vehicles, fuel types, or financing options',
    'When planning a budget for car-related expenses',
    'When you want to verify a dealer quote or mechanic estimate',
    'When deciding between buying, leasing, or keeping your current vehicle'
  ],
  cooking: [
    'When scaling recipes up or down for different serving sizes',
    'When converting between measurement units in the kitchen',
    'When planning meal prep or ingredient quantities for events',
    'When you want to verify nutritional information or portion sizes',
    'When learning about cooking ratios and culinary measurements'
  ],
  real_estate: [
    'When evaluating a potential property purchase or investment',
    'When comparing different real estate scenarios or markets',
    'When planning your budget for homeownership costs',
    'When you want to verify an agent\'s or appraiser\'s figures',
    'When learning about real estate finance and property valuation'
  ],
  math: [
    'When you need quick, accurate calculations for school or work',
    'When comparing different mathematical scenarios or formulas',
    'When solving everyday math problems without a scientific calculator',
    'When you want to verify hand calculations or homework answers',
    'When learning about mathematical concepts and their applications'
  ],
  science: [
    'When performing scientific calculations for research or coursework',
    'When converting between scientific units or comparing measurements',
    'When estimating values for experiments or lab work',
    'When verifying scientific data or checking published results',
    'When learning about scientific formulas and their real-world applications'
  ],
  lifestyle: [
    'When making everyday decisions that involve numbers or comparisons',
    'When comparing options to make smarter lifestyle choices',
    'When planning your time, budget, or resources for daily activities',
    'When you want to verify estimates or claims you\'ve encountered',
    'When learning about practical topics that affect your daily life'
  ]
};

const DEFAULT_SCENARIOS = [
  'When you need a quick estimate before committing to a purchase or project',
  'When comparing different options or scenarios side by side',
  'When planning a budget and need to understand potential costs',
  'When you want to verify a quote or estimate you\'ve received from a professional',
  'When teaching or learning about the concepts behind these calculations'
];

function getScenariosForCategory(category) {
  return CATEGORY_SCENARIOS[category] || DEFAULT_SCENARIOS;
}

// ── Title / Meta generation ────────────────────────────────────────────────────

function generateTitle(toolName) {
  var title = toolName + ' \u2014 Free Online Calculator';
  if (title.length > 60) {
    title = toolName + ' \u2014 Free Calculator';
  }
  if (title.length > 60) {
    title = toolName;
  }
  return title;
}

function generateMetaDescription(tagline) {
  var desc = tagline + '. Free, instant, no signup.';
  if (desc.length > 155) {
    desc = tagline.slice(0, 140) + '. Free, instant.';
  }
  return desc;
}

function generateOgTitle(toolName) {
  return generateTitle(toolName);
}

function generateOgDescription(toolName, tagline) {
  return 'Free ' + toolName.toLowerCase() + '. ' + tagline + '. No signup required.';
}

function generateTwitterDescription(toolName, tagline) {
  var desc = 'Free ' + toolName.toLowerCase() + '. ' + tagline + '.';
  if (desc.length > 120) {
    desc = tagline + '.';
  }
  return desc;
}

function generateJsonLdDescription(toolName, tagline, inputs) {
  var inputNames = inputs.map(function(inp) { return inp.label.replace(/\s*\(.*\)/, ''); });
  return toolName + ': ' + tagline + '. Enter ' + inputNames.join(', ').toLowerCase() + ' for instant results.';
}

// ── Calculator HTML generation ─────────────────────────────────────────────────

function generateCalculatorHTML(tool) {
  var lines = [];
  var inputs = tool.inputs;
  var results = tool.results;
  var useGrid = inputs.length >= 4;

  lines.push('<div class="calc-card">');
  lines.push('    <h2>' + tool.name + '</h2>');
  lines.push('    <p style="font-size:0.85rem;color:var(--text-light);margin-bottom:16px">' + tool.tagline + '.</p>');

  if (useGrid) {
    lines.push('');
    lines.push('    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">');
    inputs.forEach(function(inp) {
      lines.push('      <div class="input-group" style="margin-bottom:0">');
      lines.push('        <label for="' + inp.id + '">' + inp.label + '</label>');
      lines.push('        <div class="input-row">');
      var attrs = 'type="number" id="' + inp.id + '"';
      attrs += ' value="' + (inp.default || '') + '"';
      if (inp.step) attrs += ' step="' + inp.step + '"';
      if (inp.min !== undefined) attrs += ' min="' + inp.min + '"';
      if (inp.max !== undefined) attrs += ' max="' + inp.max + '"';
      attrs += ' inputmode="decimal"';
      lines.push('          <input ' + attrs + '>');
      lines.push('        </div>');
      lines.push('      </div>');
    });
    lines.push('    </div>');
  } else {
    inputs.forEach(function(inp) {
      lines.push('');
      lines.push('    <div class="input-group">');
      lines.push('      <label for="' + inp.id + '">' + inp.label + '</label>');
      lines.push('      <div class="input-row">');
      var attrs = 'type="number" id="' + inp.id + '"';
      attrs += ' value="' + (inp.default || '') + '"';
      if (inp.step) attrs += ' step="' + inp.step + '"';
      if (inp.min !== undefined) attrs += ' min="' + inp.min + '"';
      if (inp.max !== undefined) attrs += ' max="' + inp.max + '"';
      attrs += ' inputmode="decimal"';
      lines.push('        <input ' + attrs + '>');
      lines.push('      </div>');
      lines.push('    </div>');
    });
  }

  lines.push('');
  lines.push('    <button type="button" class="convert-btn" id="calcBtn">Calculate</button>');
  lines.push('');
  lines.push('    <div class="result" id="result" role="status" aria-live="polite">');

  // Pair results into rows of 2
  for (var i = 0; i < results.length; i += 2) {
    lines.push('      <div class="result-row">');
    lines.push('        <div class="result-item">');
    lines.push('          <div class="result-label">' + results[i].label + '</div>');
    lines.push('          <div class="result-value" id="' + results[i].id + '">\u2014</div>');
    lines.push('        </div>');
    if (i + 1 < results.length) {
      lines.push('        <div class="result-item">');
      lines.push('          <div class="result-label">' + results[i + 1].label + '</div>');
      lines.push('          <div class="result-value" id="' + results[i + 1].id + '">\u2014</div>');
      lines.push('        </div>');
    }
    lines.push('      </div>');
  }

  lines.push('    </div>');
  lines.push('  </div>');

  return lines.join('\n');
}

// ── Custom JS generation ───────────────────────────────────────────────────────

function generateCustomJS(tool) {
  var lines = [];
  var inputs = tool.inputs;
  var results = tool.results;
  var calcJS = tool.calcJS;
  var chartRows = (tool.chart && tool.chart.rows) ? tool.chart.rows : null;

  lines.push('(function() {');
  lines.push("  'use strict';");
  lines.push('');

  // Helper functions
  lines.push('  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }');
  lines.push("  function $(n) { return '$' + n.toFixed(2).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ','); }");
  lines.push("  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ','); }");
  lines.push("  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }");
  lines.push('');

  // DOM references
  lines.push("  var calcBtn = document.getElementById('calcBtn');");
  lines.push("  var resultEl = document.getElementById('result');");
  lines.push('');

  // Chart data rendering
  if (chartRows) {
    lines.push('  var chartData = ' + JSON.stringify(chartRows) + ';');
    lines.push("  var chartBody = document.getElementById('chartBody');");
    lines.push('  if (chartBody) {');
    lines.push('    chartData.forEach(function(row) {');
    lines.push("      var tr = document.createElement('tr');");
    lines.push("      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';");
    lines.push('      chartBody.appendChild(tr);');
    lines.push('    });');
    lines.push('  }');
    lines.push('');
  }

  // Calculate function
  lines.push('  function calculate() {');
  lines.push('    ' + calcJS.replace(/return\s*\{/, 'var _r = {').replace(/\};\s*$/, '};'));
  lines.push('');

  // Set result textContent from returned object
  results.forEach(function(r) {
    lines.push("    document.getElementById('" + r.id + "').textContent = _r." + r.id + ";");
  });

  lines.push('');
  lines.push("    resultEl.classList.add('visible');");
  lines.push("    resultEl.style.display = 'block';");
  lines.push('  }');
  lines.push('');

  // Event listeners
  lines.push("  calcBtn.addEventListener('click', function() {");
  lines.push('    calculate();');
  lines.push("    if (resultEl.classList.contains('visible')) {");
  lines.push("      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });");
  lines.push('    }');
  lines.push('  });');
  lines.push('');

  // Enter key listeners for all inputs
  var inputIds = inputs.map(function(inp) { return "'" + inp.id + "'"; });
  lines.push('  [' + inputIds.join(', ') + '].forEach(function(id) {');
  lines.push('    var el = document.getElementById(id);');
  lines.push('    if (el) {');
  lines.push("      el.addEventListener('keydown', function(e) {");
  lines.push("        if (e.key === 'Enter') calculate();");
  lines.push('      });');
  lines.push('    }');
  lines.push('  });');
  lines.push('');
  lines.push('})();');

  return lines.join('\n') + '\n';
}

// ── Config JSON generation ─────────────────────────────────────────────────────

function generateConfig(tool) {
  var toolName = tool.name;
  var tagline = tool.tagline;
  var category = tool.category;

  // FAQ: remap from {q, a} to {question, answer}
  var faq = (tool.faqs || []).map(function(item) {
    return { question: item.q, answer: item.a };
  });

  // howItWorks
  var howItWorks = {
    intro: tool.howItWorksIntro || ('This ' + toolName.toLowerCase() + ' uses standard formulas to provide accurate estimates.'),
    rules: tool.howItWorksRules || [],
    outro: tool.howItWorksOutro || ('These are estimates based on standard formulas. For critical decisions, consult a qualified professional.')
  };

  // howWeCalculate
  var howWeCalculate = {
    intro: 'This ' + toolName.toLowerCase() + ' uses established formulas and current data to provide accurate estimates.',
    steps: [
      'Enter your specific values into the calculator fields above',
      'Our algorithm applies the relevant formulas using your inputs',
      'Results are calculated instantly in your browser \u2014 nothing is sent to a server',
      'Review the detailed breakdown to understand how each factor affects your result'
    ],
    disclaimer: 'These calculations are estimates based on standard formulas. For critical decisions, always consult a qualified professional.'
  };

  // whenToUse
  var whenToUse = {
    intro: 'This ' + toolName.toLowerCase() + ' is designed for anyone who needs quick, reliable calculations without complex spreadsheets or professional consultations.',
    scenarios: getScenariosForCategory(category)
  };

  // chart
  var chart = null;
  if (tool.chart) {
    chart = {
      title: tool.chart.title,
      subtitle: tool.chart.subtitle,
      columns: tool.chart.columns,
      rows: tool.chart.rows
    };
  }

  var config = {
    slug: tool.slug,
    toolName: toolName,
    tagline: tagline,
    title: generateTitle(toolName),
    metaDescription: generateMetaDescription(tagline),
    keywords: tool.keywords || '',
    domain: 'crunchmilk.com',
    primaryColor: tool.color || '#2563eb',
    primaryDarkColor: tool.colorDark || '#1d4ed8',
    ogTitle: generateOgTitle(toolName),
    ogDescription: generateOgDescription(toolName, tagline),
    twitterDescription: generateTwitterDescription(toolName, tagline),
    jsonLdDescription: generateJsonLdDescription(toolName, tagline, tool.inputs),
    calculatorHTML: generateCalculatorHTML(tool),
    howItWorks: howItWorks,
    faq: faq,
    chart: chart,
    relatedTools: tool.relatedTools || [],
    howWeCalculate: howWeCalculate,
    whenToUse: whenToUse,
    category: category,
    lastUpdated: today()
  };

  return config;
}

// ── Master list entry generation ───────────────────────────────────────────────

function generateMasterEntry(tool, id) {
  return {
    id: id,
    slug: tool.slug,
    toolName: tool.name,
    category: tool.category,
    subcategory: tool.subcategory || tool.category,
    primaryKeyword: tool.keywords ? tool.keywords.split(',')[0].trim() : tool.slug.replace(/-/g, ' '),
    competition: tool.competition || 'medium',
    rpm: tool.rpm || 'medium',
    priority: tool.priority || 2,
    status: 'pending',
    relatedTools: tool.relatedTools || [],
    notes: 'Auto-generated by generate-tools.js'
  };
}

// ── Main ───────────────────────────────────────────────────────────────────────

function main() {
  // Validate paths
  if (!fs.existsSync(CONFIGS_DIR)) {
    console.error('Error: configs directory not found at ' + CONFIGS_DIR);
    process.exit(1);
  }

  if (!fs.existsSync(CUSTOM_DIR)) {
    console.error('Error: custom directory not found at ' + CUSTOM_DIR);
    process.exit(1);
  }

  if (NEW_TOOLS_PATHS.length === 0) {
    console.error('No input files found. Pass file paths as args or create data/wave5-*.json files.');
    process.exit(1);
  }

  // Read all input files and merge
  var newTools = [];
  NEW_TOOLS_PATHS.forEach(function(filePath) {
    if (!fs.existsSync(filePath)) {
      console.error('Warning: ' + filePath + ' not found, skipping.');
      return;
    }
    try {
      var tools = readJSON(filePath);
      if (Array.isArray(tools)) {
        newTools = newTools.concat(tools);
        console.log('Loaded ' + tools.length + ' tools from ' + path.basename(filePath));
      }
    } catch (e) {
      console.error('Error parsing ' + filePath + ': ' + e.message);
    }
  });

  if (newTools.length === 0) {
    console.log('No tools found in input files. Nothing to do.');
    process.exit(0);
  }
  console.log('Total tools to process: ' + newTools.length + '\n');

  // Read master list
  var masterList;
  try {
    masterList = readJSON(MASTER_LIST_PATH);
  } catch (e) {
    console.error('Error reading master list: ' + e.message);
    process.exit(1);
  }

  var maxId = 0;
  masterList.forEach(function(entry) {
    if (entry.id > maxId) maxId = entry.id;
  });

  var masterSlugs = new Set(masterList.map(function(e) { return e.slug; }));

  // Process each tool
  var generated = 0;
  var skipped = 0;
  var errors = 0;
  var newMasterEntries = [];

  newTools.forEach(function(tool, index) {
    // Validate required fields
    if (!tool.slug) {
      console.error('Error: Tool at index ' + index + ' has no slug. Skipping.');
      errors++;
      return;
    }

    if (!tool.name) {
      console.error('Error: Tool "' + tool.slug + '" has no name. Skipping.');
      errors++;
      return;
    }

    if (!tool.inputs || !Array.isArray(tool.inputs) || tool.inputs.length === 0) {
      console.error('Error: Tool "' + tool.slug + '" has no inputs defined. Skipping.');
      errors++;
      return;
    }

    if (!tool.results || !Array.isArray(tool.results) || tool.results.length === 0) {
      console.error('Error: Tool "' + tool.slug + '" has no results defined. Skipping.');
      errors++;
      return;
    }

    if (!tool.calcJS) {
      console.error('Error: Tool "' + tool.slug + '" has no calcJS. Skipping.');
      errors++;
      return;
    }

    // Skip if config already exists
    if (configExists(tool.slug)) {
      console.log('Skipped (config exists): ' + tool.slug);
      skipped++;
      return;
    }

    try {
      // Generate config JSON
      var config = generateConfig(tool);
      var configPath = path.join(CONFIGS_DIR, tool.slug + '.json');
      writeJSON(configPath, config);

      // Generate custom JS
      var customJS = generateCustomJS(tool);
      var jsPath = path.join(CUSTOM_DIR, tool.slug + '.js');
      writeFile(jsPath, customJS);

      // Add to master list if not already there
      if (!masterSlugs.has(tool.slug)) {
        maxId++;
        var masterEntry = generateMasterEntry(tool, maxId);
        newMasterEntries.push(masterEntry);
        masterSlugs.add(tool.slug);
      }

      console.log('Generated: ' + tool.slug);
      generated++;
    } catch (e) {
      console.error('Error generating ' + tool.slug + ': ' + e.message);
      errors++;
    }
  });

  // Update master list
  if (newMasterEntries.length > 0) {
    masterList = masterList.concat(newMasterEntries);
    writeJSON(MASTER_LIST_PATH, masterList);
    console.log('\nUpdated master-tool-list.json with ' + newMasterEntries.length + ' new entries (total: ' + masterList.length + ')');
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('Generated ' + generated + ' new tools, skipped ' + skipped + ' existing');
  if (errors > 0) {
    console.log('Errors: ' + errors);
  }
  console.log('='.repeat(50));
}

main();
