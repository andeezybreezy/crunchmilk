#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'sites', 'configs');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

// Load all configs
const allConfigs = {};
files.forEach(f => {
  const cfg = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  allConfigs[cfg.slug] = cfg;
});

const allSlugs = Object.keys(allConfigs);
let updated = 0;

// -------------------------------------------------------
// 1. State-specific tools: link to parent + 5 nearby states
// -------------------------------------------------------
const STATE_FAMILIES = [
  'bail-bond-calculator', 'child-support-estimator', 'speeding-ticket-calculator',
  'small-claims-limit-calculator', 'self-employment-tax-calculator',
  'dui-fine-calculator', 'hurricane-insurance-calculator', 'wildfire-risk-calculator',
  'flood-zone-calculator', 'rent-vs-buy-calculator', 'solar-payback-calculator',
  'home-battery-calculator', 'ev-vs-gas-calculator', 'squatter-rights-calculator',
  'remote-work-tax-calculator', 'gig-worker-tax-calculator', 'non-compete-checker'
];

STATE_FAMILIES.forEach(family => {
  // Find all state variants
  const variants = allSlugs.filter(s => s.startsWith(family + '-') && s !== family);
  // Also check if parent exists
  const parentExists = allConfigs[family] !== undefined;

  variants.forEach((slug, idx) => {
    const cfg = allConfigs[slug];
    if (!cfg) return;

    const related = new Set(cfg.relatedTools || []);

    // Link to parent
    if (parentExists) related.add(family);

    // Link to 4 nearby state variants (circular)
    for (let offset = 1; offset <= 4; offset++) {
      const neighbor = variants[(idx + offset) % variants.length];
      related.add(neighbor);
    }

    cfg.relatedTools = Array.from(related).slice(0, 8);
    allConfigs[slug] = cfg;
  });
});

// -------------------------------------------------------
// 2. Core finance tools cross-linking
// -------------------------------------------------------
const FINANCE_CLUSTERS = {
  mortgage: [
    'mortgage-early-payoff-calculator', 'amortization-calculator',
    'rent-vs-buy-calculator', 'home-equity-calculator',
    'down-payment-calculator', 'house-affordability-calculator',
    'assumable-mortgage-calculator', 'canada-mortgage-stress-test-calculator'
  ],
  retirement: [
    '401k-calculator', '529-plan-calculator', 'fire-calculator',
    'roth-ira-conversion-calculator', 'compound-interest-calculator',
    'annuity-calculator', 'retirement-savings-calculator',
    'social-security-break-even-calculator'
  ],
  debt: [
    'debt-snowball-calculator', 'debt-payoff-calculator',
    'credit-card-payoff-calculator', 'auto-loan-calculator',
    'apr-calculator', 'loan-comparison-calculator',
    'personal-loan-calculator', 'student-loan-repayment-calculator'
  ],
  tax: [
    'self-employment-tax-calculator', 'capital-gains-tax-calculator',
    'income-tax-calculator', 'freelance-rate-calculator',
    'crypto-tax-calculator', 'rental-property-roi-calculator',
    'estate-tax-calculator', 'sales-tax-calculator'
  ],
  legal_docs: [
    'nda-generator', 'llc-operating-agreement-generator',
    'contractor-agreement-generator', 'cease-desist-letter-generator',
    'simple-will-generator', 'lease-agreement-generator',
    'bill-of-sale-generator', 'promissory-note-generator',
    'demand-letter-generator', 'dmca-takedown-generator',
    'power-of-attorney-generator', 'eviction-notice-generator'
  ],
  insurance: [
    'auto-insurance-deductible-calculator', 'life-insurance-calculator',
    'umbrella-insurance-calculator', 'pet-insurance-calculator',
    'hurricane-insurance-calculator', 'flood-insurance-calculator',
    'renters-insurance-calculator', 'disability-insurance-calculator'
  ]
};

Object.values(FINANCE_CLUSTERS).forEach(cluster => {
  // Filter to only slugs that actually exist
  const existing = cluster.filter(s => allConfigs[s]);

  existing.forEach(slug => {
    const cfg = allConfigs[slug];
    const related = new Set(cfg.relatedTools || []);

    // Add all other cluster members
    existing.forEach(other => {
      if (other !== slug) related.add(other);
    });

    cfg.relatedTools = Array.from(related).slice(0, 8);
    allConfigs[slug] = cfg;
  });
});

// -------------------------------------------------------
// 3. Write updated configs
// -------------------------------------------------------
Object.entries(allConfigs).forEach(([slug, cfg]) => {
  const fp = path.join(dir, slug + '.json');
  if (fs.existsSync(fp)) {
    const original = fs.readFileSync(fp, 'utf8');
    const updated_json = JSON.stringify(cfg, null, 2) + '\n';
    if (original !== updated_json) {
      fs.writeFileSync(fp, updated_json);
      updated++;
    }
  }
});

console.log(`Updated ${updated} configs with improved internal links`);
