#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const customDir = path.join(__dirname, '..', 'sites', 'custom');
const configDir = path.join(__dirname, '..', 'sites', 'configs');

const configs = fs.readdirSync(configDir).filter(f => f.endsWith('.json'));
const issues = [];

configs.forEach(f => {
  const slug = f.replace('.json', '');
  const jsPath = path.join(customDir, slug + '.js');
  if (!fs.existsSync(jsPath)) return;
  const js = fs.readFileSync(jsPath, 'utf8');
  const config = JSON.parse(fs.readFileSync(path.join(configDir, f), 'utf8'));
  const html = config.calculatorHTML || '';
  const problems = [];

  // 1. Syntax error check
  try { new Function(js); } catch(e) { problems.push('SYNTAX_ERROR: ' + e.message); }

  // 2. v.X references where v is not defined
  if (!/\b(var|let|const)\s+v\s*=/.test(js)) {
    const declaredVars = new Set([...js.matchAll(/var\s+(\w+)\s*=/g)].map(m => m[1]));
    const vRefs = [...js.matchAll(/\bv\.([a-zA-Z_]\w*)/g)].map(m => m[1]);
    const badVRefs = vRefs.filter(p => declaredVars.has(p));
    if (badVRefs.length > 0) problems.push('UNDEFINED_V_REF: v.' + badVRefs.join(', v.'));
  }

  // 3. Result div never shown
  if (html.includes('class="result"') && !html.includes('class="result visible"')) {
    if (!js.includes('visible') && !js.includes('display') && !js.includes('style.')) {
      problems.push('RESULT_NEVER_SHOWN');
    }
  }

  // 4. getElementById on IDs not in HTML
  const jsIds = [...js.matchAll(/getElementById\(['"]([^'"]+)['"]\)/g)].map(m => m[1]);
  const htmlIds = new Set([...html.matchAll(/id=['"]([^'"]+)['"]/g)].map(m => m[1]));
  const templateIds = new Set(['result', 'chartBody', 'embedCode']);
  const missingIds = jsIds.filter(id => !htmlIds.has(id) && !templateIds.has(id));
  if (missingIds.length > 0) problems.push('MISSING_DOM_IDS: ' + [...new Set(missingIds)].join(', '));

  // 5. onclick referencing undefined function
  const onclickFns = [...html.matchAll(/onclick=['"](\w+)\(/g)].map(m => m[1]);
  onclickFns.forEach(fn => {
    if (!js.includes('function ' + fn) && !js.includes(fn + ' =') && !js.includes(fn + '=') && !js.includes(fn + '(')) {
      problems.push('ONCLICK_UNDEFINED: ' + fn);
    }
  });

  // 6. Empty or stub JS (< 50 chars of actual code)
  const stripped = js.replace(/\/\/.*/g, '').replace(/\/\*[\s\S]*?\*\//g, '').trim();
  if (stripped.length < 50) problems.push('EMPTY_JS');

  // 7. querySelector on elements not found in HTML
  const qsSelectors = [...js.matchAll(/querySelector\(['"]([^'"]+)['"]\)/g)].map(m => m[1]);
  qsSelectors.forEach(sel => {
    // Check for class selectors
    const classMatch = sel.match(/\.([a-zA-Z_][\w-]*)/);
    if (classMatch && !html.includes(classMatch[1]) && classMatch[1] !== 'result' && classMatch[1] !== 'visible') {
      problems.push('MISSING_SELECTOR: ' + sel);
    }
  });

  if (problems.length > 0) {
    issues.push({ slug, problems });
  }
});

// Summary
const byType = {};
issues.forEach(i => {
  i.problems.forEach(p => {
    const type = p.split(':')[0].trim();
    if (!byType[type]) byType[type] = [];
    byType[type].push(i.slug);
  });
});

console.log('=== DEEP AUDIT RESULTS ===');
console.log('Total tools: ' + configs.length);
console.log('Tools with issues: ' + issues.length);
console.log('');
Object.entries(byType).forEach(([type, slugs]) => {
  console.log(type + ': ' + slugs.length + ' tools');
  if (slugs.length <= 20) {
    slugs.forEach(s => console.log('  - ' + s));
  } else {
    slugs.slice(0, 5).forEach(s => console.log('  - ' + s));
    console.log('  ... and ' + (slugs.length - 5) + ' more');
  }
});

// Write full report
fs.writeFileSync(path.join(__dirname, 'deep-audit-results.json'), JSON.stringify({ summary: byType, details: issues }, null, 2));
console.log('\nFull report: scripts/deep-audit-results.json');
