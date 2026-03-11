#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const CONFIGS_DIR = path.resolve(__dirname, '..', 'sites', 'configs');

// The 16 series base names (as they appear in filenames before the state code)
const SERIES_BASES = [
  'bail-bond-calculator',
  'child-support-estimator',
  'ev-vs-gas-calculator',
  'flood-zone-calculator',
  'gig-worker-tax-calculator',
  'home-battery-calculator',
  'hurricane-insurance-calculator',
  'non-compete-checker',
  'remote-work-tax-calculator',
  'rent-vs-buy-calculator',
  'self-employment-tax-calculator',
  'small-claims-limit-calculator',
  'solar-payback-calculator',
  'speeding-ticket-calculator',
  'squatter-rights-calculator',
  'wildfire-risk-calculator'
];

// Build regex: match {base}-{2-letter-state}.json
const pattern = new RegExp(
  '^(' + SERIES_BASES.map(b => b.replace(/-/g, '\\-')).join('|') + ')-([a-z]{2})\\.json$'
);

const allFiles = fs.readdirSync(CONFIGS_DIR).filter(f => f.endsWith('.json'));

let updated = 0;
let alreadySet = 0;
const bySeries = {};

for (const file of allFiles) {
  const m = file.match(pattern);
  if (!m) continue;

  const series = m[1];
  const state = m[2];

  if (!bySeries[series]) bySeries[series] = [];
  bySeries[series].push(state);

  const filePath = path.join(CONFIGS_DIR, file);
  const config = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  if (config.noindex === true) {
    alreadySet++;
    continue;
  }

  config.noindex = true;
  fs.writeFileSync(filePath, JSON.stringify(config, null, 2) + '\n', 'utf8');
  updated++;
}

console.log('State-variant noindex update');
console.log('===========================');
console.log(`Files matched: ${updated + alreadySet}`);
console.log(`Files updated: ${updated}`);
console.log(`Already had noindex: ${alreadySet}`);
console.log('');
console.log('By series:');
for (const [series, states] of Object.entries(bySeries).sort()) {
  console.log(`  ${series}: ${states.length} states`);
}
