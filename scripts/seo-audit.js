#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'sites', 'configs');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

const inboundLinks = {};
const toolCategories = {};
const allConfigs = [];

files.forEach(f => {
  const cfg = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  allConfigs.push(cfg);
  toolCategories[cfg.slug] = cfg.category || '';
  const related = cfg.relatedTools || [];
  related.forEach(r => { inboundLinks[r] = (inboundLinks[r] || 0) + 1; });
});

// Top linked-to tools
const sorted = Object.entries(inboundLinks).sort((a,b) => b[1] - a[1]);
console.log('TOP 20 MOST-LINKED-TO TOOLS:');
sorted.slice(0, 20).forEach(([slug, count]) => {
  console.log(`  ${count} links -> ${slug} [${toolCategories[slug] || '?'}]`);
});

// Finance/legal tools with no inbound links
const highValue = ['finance','legal','insurance','niche-finance','legal-regulatory','housing'];
const noLinks = allConfigs.filter(c => {
  return highValue.indexOf(c.category) !== -1 && !inboundLinks[c.slug];
});

console.log(`\nFINANCE/LEGAL WITH ZERO INBOUND LINKS: ${noLinks.length}`);
noLinks.slice(0, 20).forEach(c => console.log(`  ${c.slug} [${c.category}]`));

// Tools with missing/empty contentIntro (need content depth)
const noContent = allConfigs.filter(c => {
  return highValue.indexOf(c.category) !== -1 && !c.contentIntro;
});
console.log(`\nFINANCE/LEGAL TOOLS MISSING CONTENT INTRO: ${noContent.length}`);

// Tools with no FAQ
const noFaq = allConfigs.filter(c => {
  return highValue.indexOf(c.category) !== -1 && (!c.faq || c.faq.length === 0);
});
console.log(`FINANCE/LEGAL TOOLS MISSING FAQ: ${noFaq.length}`);
