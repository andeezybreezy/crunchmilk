#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const configDir = path.join(__dirname, '..', 'sites', 'configs');
const customDir = path.join(__dirname, '..', 'sites', 'custom');

const toolFixes = [
  {
    slug: 'strait-of-hormuz-gas-price-calculator',
    ranges: [{ id: 'disruption', suffix: '%', label: 'Disruption Level' }]
  },
  {
    slug: 'gaza-reconstruction-cost-calculator',
    ranges: [{ id: 'destructionLevel', suffix: '%', label: 'Destruction Level' }]
  },
  {
    slug: 'generator-runtime-calculator',
    ranges: [{ id: 'loadPct', suffix: '%', label: 'Load' }]
  },
  {
    slug: 'conflict-escalation-risk-index',
    ranges: [
      { id: 'ukraine', suffix: '/10', label: 'Ukraine' },
      { id: 'mideast', suffix: '/10', label: 'Middle East' },
      { id: 'taiwan', suffix: '/10', label: 'Taiwan' },
      { id: 'tradeWar', suffix: '/10', label: 'Trade War' },
      { id: 'nuclear', suffix: '/10', label: 'Nuclear' }
    ]
  },
  {
    slug: 'middle-east-escalation-risk-index',
    ranges: [
      { id: 'militaryActivity', suffix: '/10', label: 'Military' },
      { id: 'diplomaticTension', suffix: '/10', label: 'Diplomatic' },
      { id: 'proxyConflict', suffix: '/10', label: 'Proxy' },
      { id: 'oilMarketStress', suffix: '/10', label: 'Oil Market' },
      { id: 'nuclearThreat', suffix: '/10', label: 'Nuclear' }
    ]
  }
];

toolFixes.forEach(tool => {
  const configPath = path.join(configDir, tool.slug + '.json');
  const jsPath = path.join(customDir, tool.slug + '.js');

  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  let js = fs.readFileSync(jsPath, 'utf8');
  let html = config.calculatorHTML;

  tool.ranges.forEach(range => {
    // Add value display span after the range input in HTML
    const rangeRegex = new RegExp(
      '(<input\\s+type=["\']range["\']\\s+id=["\']' + range.id + '["\'][^>]*>)'
    );
    const match = html.match(rangeRegex);
    if (match) {
      // Extract the default value from the input
      const valMatch = match[1].match(/value=["']([^"']+)["']/);
      const defaultVal = valMatch ? valMatch[1] : '50';

      // Add a styled span showing the current value right after the input
      const valueDisplay = `<span id="${range.id}Val" style="display:inline-block;min-width:48px;text-align:center;font-weight:700;font-size:1.05rem;color:var(--primary);margin-top:4px">${defaultVal}${range.suffix}</span>`;
      html = html.replace(match[1], match[1] + '\n      ' + valueDisplay);
    }
  });

  // Add JS to update the value display on input
  const rangeUpdateLines = tool.ranges.map(range => {
    return `  document.getElementById('${range.id}').addEventListener('input', function() { document.getElementById('${range.id}Val').textContent = this.value + '${range.suffix}'; });`;
  }).join('\n');

  // Insert the listeners right before the closing })();
  js = js.replace(/\}\)\(\);?\s*$/, rangeUpdateLines + '\n})();\n');

  config.calculatorHTML = html;
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
  fs.writeFileSync(jsPath, js, 'utf8');
  console.log('Fixed: ' + tool.slug + ' (' + tool.ranges.length + ' range sliders)');
});

console.log('\nDone! Rebuild to apply changes.');
