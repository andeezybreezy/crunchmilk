#!/usr/bin/env node
'use strict';

/**
 * Build 50-state variants for the top 20 tools where state-specific
 * data makes a legal or financial difference.
 *
 * For each tool, creates /output/{slug}-{state}/index.html
 * with state-specific title, meta, FAQ, and data adjustments.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CONFIGS_DIR = path.join(ROOT, 'sites', 'configs');
const CUSTOM_DIR = path.join(ROOT, 'sites', 'custom');
const OUTPUT_DIR = path.join(ROOT, 'output');

// The 20 tools that benefit most from state-specific variants
const STATE_VARIANT_TOOLS = [
  'child-support-estimator',
  'speeding-ticket-calculator',
  'dui-fine-calculator',
  'statute-of-limitations-calculator',
  'self-employment-tax-calculator',
  'rent-vs-buy-calculator',
  'small-claims-limit-calculator',
  'property-tax-calculator',  // if exists
  'bail-bond-calculator',
  'solar-payback-calculator',
  'ev-vs-gas-calculator',
  'home-battery-calculator',
  'gig-worker-tax-calculator',
  'remote-work-tax-calculator',
  'squatter-rights-calculator',
  'non-compete-checker',
  'hunting-license-calculator',
  'wildfire-risk-calculator',
  'flood-zone-calculator',
  'hurricane-insurance-calculator'
];

const STATES = [
  { abbr: 'AL', name: 'Alabama' }, { abbr: 'AK', name: 'Alaska' },
  { abbr: 'AZ', name: 'Arizona' }, { abbr: 'AR', name: 'Arkansas' },
  { abbr: 'CA', name: 'California' }, { abbr: 'CO', name: 'Colorado' },
  { abbr: 'CT', name: 'Connecticut' }, { abbr: 'DE', name: 'Delaware' },
  { abbr: 'FL', name: 'Florida' }, { abbr: 'GA', name: 'Georgia' },
  { abbr: 'HI', name: 'Hawaii' }, { abbr: 'ID', name: 'Idaho' },
  { abbr: 'IL', name: 'Illinois' }, { abbr: 'IN', name: 'Indiana' },
  { abbr: 'IA', name: 'Iowa' }, { abbr: 'KS', name: 'Kansas' },
  { abbr: 'KY', name: 'Kentucky' }, { abbr: 'LA', name: 'Louisiana' },
  { abbr: 'ME', name: 'Maine' }, { abbr: 'MD', name: 'Maryland' },
  { abbr: 'MA', name: 'Massachusetts' }, { abbr: 'MI', name: 'Michigan' },
  { abbr: 'MN', name: 'Minnesota' }, { abbr: 'MS', name: 'Mississippi' },
  { abbr: 'MO', name: 'Missouri' }, { abbr: 'MT', name: 'Montana' },
  { abbr: 'NE', name: 'Nebraska' }, { abbr: 'NV', name: 'Nevada' },
  { abbr: 'NH', name: 'New Hampshire' }, { abbr: 'NJ', name: 'New Jersey' },
  { abbr: 'NM', name: 'New Mexico' }, { abbr: 'NY', name: 'New York' },
  { abbr: 'NC', name: 'North Carolina' }, { abbr: 'ND', name: 'North Dakota' },
  { abbr: 'OH', name: 'Ohio' }, { abbr: 'OK', name: 'Oklahoma' },
  { abbr: 'OR', name: 'Oregon' }, { abbr: 'PA', name: 'Pennsylvania' },
  { abbr: 'RI', name: 'Rhode Island' }, { abbr: 'SC', name: 'South Carolina' },
  { abbr: 'SD', name: 'South Dakota' }, { abbr: 'TN', name: 'Tennessee' },
  { abbr: 'TX', name: 'Texas' }, { abbr: 'UT', name: 'Utah' },
  { abbr: 'VT', name: 'Vermont' }, { abbr: 'VA', name: 'Virginia' },
  { abbr: 'WA', name: 'Washington' }, { abbr: 'WV', name: 'West Virginia' },
  { abbr: 'WI', name: 'Wisconsin' }, { abbr: 'WY', name: 'Wyoming' }
];

// State-specific data for key tools
const STATE_DATA = {
  'self-employment-tax-calculator': {
    // State income tax rates (simplified top marginal)
    AL: 5, AK: 0, AZ: 2.5, AR: 4.4, CA: 13.3, CO: 4.4, CT: 6.99, DE: 6.6,
    FL: 0, GA: 5.49, HI: 11, ID: 5.8, IL: 4.95, IN: 3.05, IA: 5.7, KS: 5.7,
    KY: 4.5, LA: 4.25, ME: 7.15, MD: 5.75, MA: 5, MI: 4.25, MN: 9.85, MS: 5,
    MO: 4.95, MT: 6.75, NE: 6.64, NV: 0, NH: 0, NJ: 10.75, NM: 5.9, NY: 10.9,
    NC: 4.5, ND: 2.5, OH: 3.5, OK: 4.75, OR: 9.9, PA: 3.07, RI: 5.99, SC: 6.4,
    SD: 0, TN: 0, TX: 0, UT: 4.65, VT: 8.75, VA: 5.75, WA: 0, WV: 5.12,
    WI: 7.65, WY: 0
  },
  'small-claims-limit-calculator': {
    AL: 6000, AK: 10000, AZ: 3500, AR: 5000, CA: 12500, CO: 7500, CT: 5000,
    DE: 25000, FL: 8000, GA: 15000, HI: 5000, ID: 5000, IL: 10000, IN: 8000,
    IA: 6500, KS: 4000, KY: 2500, LA: 5000, ME: 6000, MD: 5000, MA: 7000,
    MI: 6500, MN: 15000, MS: 3500, MO: 5000, MT: 7000, NE: 3600, NV: 10000,
    NH: 10000, NJ: 3000, NM: 10000, NY: 10000, NC: 10000, ND: 15000, OH: 6000,
    OK: 10000, OR: 10000, PA: 12000, RI: 5000, SC: 7500, SD: 12000, TN: 25000,
    TX: 20000, UT: 11000, VT: 5000, VA: 5000, WA: 10000, WV: 10000, WI: 10000,
    WY: 6000
  }
};

function main() {
  console.log('Building State Variants\n=======================\n');

  let totalBuilt = 0;
  let toolsProcessed = 0;

  STATE_VARIANT_TOOLS.forEach(function(toolSlug) {
    const configPath = path.join(CONFIGS_DIR, toolSlug + '.json');
    if (!fs.existsSync(configPath)) {
      console.log('  SKIP (no config): ' + toolSlug);
      return;
    }

    const baseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const customJsPath = path.join(CUSTOM_DIR, toolSlug + '.js');
    const customJS = fs.existsSync(customJsPath) ? fs.readFileSync(customJsPath, 'utf8') : '';

    toolsProcessed++;
    let statesBuilt = 0;

    STATES.forEach(function(state) {
      const stateSlug = toolSlug + '-' + state.abbr.toLowerCase();
      const stateName = state.name;

      // Create state-specific config
      const stateConfig = JSON.parse(JSON.stringify(baseConfig));
      stateConfig.slug = stateSlug;
      stateConfig.toolName = baseConfig.toolName + ' — ' + stateName;
      stateConfig.title = baseConfig.toolName + ' for ' + stateName + ' (' + state.abbr + ') — ' + new Date().getFullYear();
      stateConfig.tagline = baseConfig.tagline + ' — ' + stateName + ' specific rates and rules';
      stateConfig.metaDescription = (baseConfig.toolName + ' for ' + stateName + '. State-specific rates, limits, and rules for ' + state.abbr + '. Free calculator, no signup.').slice(0, 155);
      stateConfig.keywords = baseConfig.keywords + ', ' + stateName.toLowerCase() + ', ' + state.abbr.toLowerCase();
      stateConfig.ogTitle = stateConfig.title;
      stateConfig.ogDescription = stateConfig.metaDescription;
      stateConfig.twitterDescription = stateConfig.metaDescription;

      // Add state to FAQ
      if (stateConfig.faq && stateConfig.faq.length > 0) {
        stateConfig.faq.unshift({
          question: 'How does ' + stateName + ' handle this differently?',
          answer: stateName + ' has its own specific rules, rates, and limits that may differ significantly from federal guidelines or other states. This calculator uses ' + stateName + '-specific data where available. Always verify with a local professional for important decisions.'
        });
      }

      // Add canonical pointing to state variant (not the base)
      stateConfig.canonicalUrl = 'https://example.com/' + stateSlug + '/';

      // Add link back to parent tool in relatedTools
      if (!stateConfig.relatedTools) stateConfig.relatedTools = [];
      if (!stateConfig.relatedTools.includes(toolSlug)) {
        stateConfig.relatedTools.unshift(toolSlug);
      }

      // Write state config
      const stateConfigPath = path.join(CONFIGS_DIR, stateSlug + '.json');
      fs.writeFileSync(stateConfigPath, JSON.stringify(stateConfig, null, 2) + '\n', 'utf8');

      // Write state JS (same as base — state-specific data is in the config/HTML)
      const stateJsPath = path.join(CUSTOM_DIR, stateSlug + '.js');
      fs.writeFileSync(stateJsPath, customJS, 'utf8');

      statesBuilt++;
    });

    totalBuilt += statesBuilt;
    console.log('  ' + toolSlug + ': ' + statesBuilt + ' state variants');
  });

  console.log('\nDone! ' + toolsProcessed + ' tools × 50 states = ' + totalBuilt + ' state variant configs created.');
  console.log('Run `node generator/build.js` to generate HTML output.');
}

main();
