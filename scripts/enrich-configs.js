#!/usr/bin/env node
'use strict';

/**
 * Enrich all tool configs with SEO fields:
 * - howWeCalculate (if missing)
 * - whenToUse (if missing)
 * - lastUpdated (if missing)
 * - category (from master list)
 * - Ensure relatedTools has 5+ entries
 * - embeddable flag for top 20 shareable tools
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CONFIGS_DIR = path.join(ROOT, 'sites', 'configs');
const MASTER_LIST_PATH = path.join(ROOT, 'data', 'master-tool-list.json');

const masterList = JSON.parse(fs.readFileSync(MASTER_LIST_PATH, 'utf8'));

// Index master list by slug
const masterIndex = {};
masterList.forEach(function(t) { masterIndex[t.slug] = t; });

// Top 20 most embeddable/shareable tools
const EMBEDDABLE_SLUGS = [
  'tariff-cost-calculator', 'mortgage-calculator', 'compound-interest-calculator',
  'body-fat-calculator', 'tdee-calculator', 'bac-calculator', 'calorie-deficit-calculator',
  'rent-vs-buy-calculator', 'fire-calculator', 'debt-snowball-calculator',
  'meat-smoking-calculator', 'air-fryer-converter', 'concrete-calculator',
  'ai-job-displacement-calculator', 'glp1-weight-loss-calculator', 'biological-age-calculator',
  'sleep-cycle-calculator', 'pregnancy-due-date-calculator', 'bmr-calculator', 'macro-calculator'
];

// Build category->tools index for finding related tools
const categoryTools = {};
masterList.forEach(function(t) {
  if (!categoryTools[t.category]) categoryTools[t.category] = [];
  categoryTools[t.category].push(t.slug);
});

function findRelatedTools(slug, category, existingRelated) {
  // Start with existing related tools
  const related = new Set(existingRelated || []);

  // Add tools from same category
  const sameCat = categoryTools[category] || [];
  sameCat.forEach(function(s) {
    if (s !== slug && related.size < 8) related.add(s);
  });

  // If still under 5, add from master list relatedTools field
  const masterEntry = masterIndex[slug];
  if (masterEntry && masterEntry.relatedTools) {
    masterEntry.relatedTools.forEach(function(s) {
      if (s !== slug) related.add(s);
    });
  }

  return Array.from(related).slice(0, 8);
}

function generateHowWeCalculate(config) {
  // Generate a generic but useful "How we calculate" based on tool name
  const name = config.toolName || '';
  return {
    intro: 'This ' + name.toLowerCase() + ' uses established formulas and industry-standard data to provide accurate estimates.',
    steps: [
      'Enter your specific values into the calculator fields above',
      'Our algorithm applies the relevant formulas using your inputs',
      'Results are calculated instantly in your browser — nothing is sent to a server',
      'Review the detailed breakdown to understand how each factor affects your result'
    ],
    disclaimer: 'These calculations are estimates based on standard formulas. For critical decisions, always consult a qualified professional.'
  };
}

function generateWhenToUse(config) {
  const name = config.toolName || '';
  const nameLC = name.toLowerCase();
  return {
    intro: 'This ' + nameLC + ' is designed for anyone who needs quick, reliable estimates without complex spreadsheets or professional consultations.',
    scenarios: [
      'When you need a quick estimate before committing to a purchase or project',
      'When comparing different options or scenarios side by side',
      'When planning a budget and need to understand potential costs',
      'When you want to verify a quote or estimate you\'ve received from a professional',
      'When teaching or learning about the concepts behind these calculations'
    ]
  };
}

// Process all configs
const configFiles = fs.readdirSync(CONFIGS_DIR).filter(f => f.endsWith('.json'));
let updated = 0;
let skipped = 0;

configFiles.forEach(function(file) {
  const filePath = path.join(CONFIGS_DIR, file);
  let config;
  try {
    config = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    console.log('  SKIP (parse error): ' + file);
    skipped++;
    return;
  }

  let changed = false;

  // Add category from master list
  if (!config.category && masterIndex[config.slug]) {
    config.category = masterIndex[config.slug].category;
    changed = true;
  }

  // Add lastUpdated
  if (!config.lastUpdated) {
    config.lastUpdated = '2026-03-10';
    changed = true;
  }

  // Add howWeCalculate
  if (!config.howWeCalculate) {
    config.howWeCalculate = generateHowWeCalculate(config);
    changed = true;
  }

  // Add whenToUse
  if (!config.whenToUse) {
    config.whenToUse = generateWhenToUse(config);
    changed = true;
  }

  // Ensure relatedTools has 5+ entries
  const currentRelated = config.relatedTools || [];
  if (currentRelated.length < 5 && config.category) {
    config.relatedTools = findRelatedTools(config.slug, config.category, currentRelated);
    if (config.relatedTools.length !== currentRelated.length) changed = true;
  }

  // Add embeddable flag
  if (EMBEDDABLE_SLUGS.includes(config.slug) && !config.embeddable) {
    config.embeddable = true;
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2) + '\n', 'utf8');
    updated++;
  } else {
    skipped++;
  }
});

console.log('Config enrichment complete.');
console.log('  Updated: ' + updated);
console.log('  Skipped (no changes): ' + skipped);
console.log('  Total: ' + configFiles.length);
