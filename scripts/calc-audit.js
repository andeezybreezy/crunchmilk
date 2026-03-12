#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CONFIGS_DIR = path.join(ROOT, 'sites', 'configs');
const CUSTOM_DIR = path.join(ROOT, 'sites', 'custom');
const OUTPUT_FILE = path.join(__dirname, 'audit-results.json');

// Extract all id="..." values from HTML string
function extractHTMLIds(html) {
  const ids = new Set();
  const re = /\bid\s*=\s*["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html)) !== null) ids.add(m[1]);
  return ids;
}

// Extract all getElementById('...') references from JS
function extractJSIdRefs(js) {
  const ids = new Set();
  const re = /getElementById\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  let m;
  while ((m = re.exec(js)) !== null) ids.add(m[1]);
  return ids;
}

// IDs provided by the build template (not in calculatorHTML)
const TEMPLATE_IDS = new Set(['result', 'chartBody', 'embedCode']);

// Check if HTML contains a button-like element
function hasButton(html) {
  // <button, <input type="button|submit", or onclick on any element
  return /<button[\s>]/i.test(html) ||
         /<input[^>]+type\s*=\s*["'](?:button|submit)["']/i.test(html) ||
         /onclick\s*=/i.test(html);
}

// Check if HTML has a result container (class containing "result")
function hasResultContainer(html) {
  return /class\s*=\s*["'][^"']*\bresult\b[^"']*["']/i.test(html);
}

// Check if JS displays results (adds visible class or sets content on result elements)
function displaysResults(js) {
  // Checks for: .classList.add('visible'), .className, .style.display, .innerHTML, .textContent, .innerText on result-ish elements
  return /\.classList\.add\s*\(\s*['"]visible['"]\s*\)/i.test(js) ||
         /\.classList\.remove\s*\(\s*['"]hidden['"]\s*\)/i.test(js) ||
         /\.style\.display\s*=/i.test(js) ||
         /\.innerHTML\s*=/i.test(js) ||
         /\.textContent\s*=/i.test(js) ||
         /\.innerText\s*=/i.test(js);
}

// Check if JS has a calculate/compute/convert function
function hasCalcFunction(js) {
  return /function\s+(?:calculate|compute|convert|doCalc|runCalc|handleCalc|performCalc|calc)\b/i.test(js) ||
         /(?:const|let|var)\s+(?:calculate|compute|convert|doCalc|runCalc|handleCalc)\s*=/i.test(js) ||
         /(?:calculate|compute|convert)\s*\(/i.test(js) ||
         /addEventListener\s*\(\s*['"]click['"]/i.test(js) ||
         /\.onclick\s*=/i.test(js);
}

// Check JS for syntax errors using new Function()
function hasSyntaxError(js) {
  try {
    new Function(js);
    return null;
  } catch (e) {
    return e.message;
  }
}

// Main audit
function audit() {
  const configFiles = fs.readdirSync(CONFIGS_DIR).filter(f => f.endsWith('.json'));
  const total = configFiles.length;
  const brokenTools = [];
  const issueCounts = {};

  function addIssue(issues, issue) {
    issues.push(issue);
    issueCounts[issue] = (issueCounts[issue] || 0) + 1;
  }

  for (const file of configFiles) {
    const slug = file.replace('.json', '');
    const issues = [];
    const details = {};

    // Load config
    let config;
    try {
      config = JSON.parse(fs.readFileSync(path.join(CONFIGS_DIR, file), 'utf8'));
    } catch (e) {
      addIssue(issues, 'invalid-config-json');
      brokenTools.push({ slug, issues });
      continue;
    }

    const html = config.calculatorHTML || '';

    // Check 5: Empty calculatorHTML
    if (!html.trim()) {
      addIssue(issues, 'empty-calculatorHTML');
    }

    // Load JS
    const jsPath = path.join(CUSTOM_DIR, slug + '.js');
    let js = '';
    let jsExists = true;

    if (!fs.existsSync(jsPath)) {
      addIssue(issues, 'missing-js-file');
      jsExists = false;
    } else {
      js = fs.readFileSync(jsPath, 'utf8');
      // Check 1: Empty JS
      if (!js.trim()) {
        addIssue(issues, 'empty-js-file');
        jsExists = false;
      }
    }

    if (jsExists && js.trim()) {
      // Check 4: Syntax errors
      const syntaxErr = hasSyntaxError(js);
      if (syntaxErr) {
        addIssue(issues, 'js-syntax-error');
        details['js-syntax-error'] = syntaxErr;
      }

      // Check 2: No calculate function
      if (!hasCalcFunction(js)) {
        addIssue(issues, 'no-calculate-function');
      }

      // Check 3: No result display
      if (!displaysResults(js)) {
        addIssue(issues, 'no-result-display');
      }

      // Check 7: Mismatched IDs (only if HTML exists)
      if (html.trim()) {
        const htmlIds = extractHTMLIds(html);
        const jsIds = extractJSIdRefs(js);
        const mismatched = [];
        for (const id of jsIds) {
          // skip IDs provided by the build template (not in calculatorHTML)
          if (!htmlIds.has(id) && !TEMPLATE_IDS.has(id)) {
            mismatched.push(id);
          }
        }
        if (mismatched.length > 0) {
          addIssue(issues, 'mismatched-ids');
          details['mismatched-ids'] = mismatched;
        }
      }
    }

    // HTML-based checks (only if HTML exists)
    if (html.trim()) {
      // Check 6: Missing button — but skip if JS uses input/change listeners (auto-calc pattern)
      const hasAutoCalc = js && (
        /addEventListener\s*\(\s*['"](?:input|change)['"]/i.test(js) ||
        /\.oninput\s*=/i.test(js) ||
        /\.onchange\s*=/i.test(js)
      );
      if (!hasButton(html) && !hasAutoCalc) {
        addIssue(issues, 'missing-button');
      }

      // Check 8: No result container
      if (!hasResultContainer(html)) {
        addIssue(issues, 'no-result-container');
      }
    }

    if (issues.length > 0) {
      const entry = { slug, issues };
      if (Object.keys(details).length > 0) entry.details = details;
      brokenTools.push(entry);
    }
  }

  // Sort by number of issues descending
  brokenTools.sort((a, b) => b.issues.length - a.issues.length);

  const report = {
    summary: {
      total,
      broken: brokenTools.length,
      healthy: total - brokenTools.length,
      issues: issueCounts
    },
    broken_tools: brokenTools
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2));

  // Console summary
  console.log('=== Calculator Tool Audit ===');
  console.log(`Total tools: ${total}`);
  console.log(`Broken: ${brokenTools.length}`);
  console.log(`Healthy: ${total - brokenTools.length}`);
  console.log('');
  console.log('Issue breakdown:');
  const sortedIssues = Object.entries(issueCounts).sort((a, b) => b[1] - a[1]);
  for (const [issue, count] of sortedIssues) {
    console.log(`  ${issue}: ${count}`);
  }
  console.log('');

  // Show worst offenders (5+ issues)
  const worst = brokenTools.filter(t => t.issues.length >= 4);
  if (worst.length > 0) {
    console.log(`Tools with 4+ issues (${worst.length}):`);
    for (const t of worst.slice(0, 20)) {
      console.log(`  ${t.slug}: ${t.issues.join(', ')}`);
    }
    if (worst.length > 20) console.log(`  ... and ${worst.length - 20} more`);
  }

  console.log(`\nFull report written to: ${OUTPUT_FILE}`);
}

audit();
