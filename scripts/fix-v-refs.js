#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const customDir = path.join(__dirname, '..', 'sites', 'custom');

const files = fs.readdirSync(customDir).filter(f => f.endsWith('.js'));
const fixed = [];
const skipped = [];

files.forEach(f => {
  const filePath = path.join(customDir, f);
  const js = fs.readFileSync(filePath, 'utf8');

  // Skip files where v is defined as a var/let/const object
  if (/\b(var|let|const)\s+v\s*=/.test(js)) return;

  // Find v.something patterns
  const vRefs = js.match(/\bv\.([a-zA-Z_]\w*)/g);
  if (!vRefs || vRefs.length === 0) return;

  // Get declared variable names
  const declaredVars = new Set([...js.matchAll(/var\s+(\w+)\s*=/g)].map(m => m[1]));

  // Get unique v.X property names
  const vProps = [...new Set(vRefs.map(r => r.replace('v.', '')))];

  // Check if any v.X matches a declared variable
  const matchesDeclared = vProps.filter(p => declaredVars.has(p));
  if (matchesDeclared.length === 0) return;

  // Replace v.X with X for each matched property
  let fixedJs = js;
  matchesDeclared.forEach(prop => {
    const regex = new RegExp('\\bv\\.' + prop + '\\b', 'g');
    fixedJs = fixedJs.replace(regex, prop);
  });

  if (fixedJs !== js) {
    fs.writeFileSync(filePath, fixedJs, 'utf8');
    fixed.push({ slug: f.replace('.js', ''), props: matchesDeclared });
  }
});

console.log('Fixed ' + fixed.length + ' files:');
fixed.forEach(f => console.log('  ' + f.slug + ': ' + f.props.map(p => 'v.' + p + ' -> ' + p).join(', ')));
