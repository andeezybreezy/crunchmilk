#!/usr/bin/env node
/**
 * Mass Tool Generator for CrunchMilk
 * Takes compact tool definitions and generates full config JSON + custom JS files.
 * Also updates master-tool-list.json with new entries.
 *
 * Usage: node scripts/mass-generate.js <batch-file.json>
 */

const fs = require('fs');
const path = require('path');

const CONFIGS_DIR = path.join(__dirname, '..', 'sites', 'configs');
const CUSTOM_DIR = path.join(__dirname, '..', 'sites', 'custom');
const MASTER_LIST = path.join(__dirname, '..', 'data', 'master-tool-list.json');

const CATEGORY_COLORS = {
  'construction': ['#d97706', '#b45309'],
  'cooking': ['#dc2626', '#b91c1c'],
  'fitness': ['#059669', '#047857'],
  'finance': ['#2563eb', '#1d4ed8'],
  'niche-finance': ['#7c3aed', '#6d28d9'],
  'automotive': ['#374151', '#1f2937'],
  'gardening': ['#16a34a', '#15803d'],
  'crafts': ['#ec4899', '#db2777'],
  'sewing': ['#f472b6', '#ec4899'],
  'photography': ['#6366f1', '#4f46e5'],
  'pet': ['#f59e0b', '#d97706'],
  'shipping': ['#0891b2', '#0e7490'],
  'printing': ['#8b5cf6', '#7c3aed'],
  'sports': ['#dc2626', '#b91c1c'],
  'education': ['#2563eb', '#1d4ed8'],
  'weather': ['#0ea5e9', '#0284c7'],
  'science': ['#6366f1', '#4f46e5'],
  'marine': ['#0369a1', '#075985'],
  'woodworking': ['#92400e', '#78350f'],
  'audio': ['#7c3aed', '#6d28d9'],
  'energy': ['#eab308', '#ca8a04'],
  'energy-independence': ['#16a34a', '#15803d'],
  '3d-printing': ['#8b5cf6', '#7c3aed'],
  'agriculture': ['#65a30d', '#4d7c0f'],
  'trades-industrial': ['#ea580c', '#c2410c'],
  'legal': ['#1e3a5f', '#162d4a'],
  'legal-regulatory': ['#1e3a5f', '#162d4a'],
  'firearms': ['#57534e', '#44403c'],
  'paranormal': ['#7c3aed', '#6d28d9'],
  'survival': ['#365314', '#1a2e05'],
  'niche-health': ['#0d9488', '#0f766e'],
  'health-longevity': ['#10b981', '#059669'],
  'ai-automation': ['#6366f1', '#4f46e5'],
  'tariffs': ['#dc2626', '#b91c1c'],
  'housing': ['#0891b2', '#0e7490'],
  'crypto': ['#f59e0b', '#d97706'],
  'climate': ['#0ea5e9', '#0284c7'],
  'demographics': ['#8b5cf6', '#7c3aed'],
  'rv': ['#b45309', '#92400e'],
  'mental-health': ['#8b5cf6', '#7c3aed'],
  'pregnancy': ['#ec4899', '#db2777'],
  'insurance': ['#2563eb', '#1d4ed8']
};

function generateConfig(tool) {
  const colors = CATEGORY_COLORS[tool.category] || ['#2563eb', '#1d4ed8'];
  const primaryColor = tool.primaryColor || colors[0];
  const primaryDarkColor = tool.primaryDarkColor || colors[1];

  return {
    slug: tool.slug,
    toolName: tool.toolName,
    tagline: tool.tagline,
    title: `${tool.toolName} — Free Online Calculator`,
    metaDescription: `${tool.tagline}. Free, instant, no signup required.`,
    keywords: tool.keywords,
    domain: 'crunchmilk.com',
    primaryColor,
    primaryDarkColor,
    ogTitle: `${tool.toolName} — Free Online Calculator`,
    ogDescription: `Free ${tool.toolName.toLowerCase()}. ${tool.tagline}. No signup required.`,
    twitterDescription: `Free ${tool.toolName.toLowerCase()}. ${tool.tagline}.`,
    jsonLdDescription: `${tool.toolName}: ${tool.tagline}. Enter your values for instant results.`,
    calculatorHTML: tool.calculatorHTML,
    howItWorks: {
      intro: tool.howItWorksIntro || `This ${tool.toolName.toLowerCase()} uses established formulas to provide accurate results.`,
      rules: tool.formulas || ['Enter your values and get instant results based on standard formulas.'],
      outro: tool.howItWorksOutro || 'Results are estimates. Consult a professional for critical decisions.'
    },
    faq: tool.faq,
    chart: tool.chart || undefined,
    relatedTools: tool.relatedTools || [],
    howWeCalculate: {
      intro: `This ${tool.toolName.toLowerCase()} uses established formulas and current data to provide accurate estimates.`,
      steps: [
        'Enter your specific values into the calculator fields above',
        'Our algorithm applies the relevant formulas using your inputs',
        'Results are calculated instantly in your browser — nothing is sent to a server',
        'Review the detailed breakdown to understand how each factor affects your result'
      ],
      disclaimer: 'These calculations are estimates based on standard formulas. For critical decisions, always consult a qualified professional.'
    },
    whenToUse: {
      intro: `This ${tool.toolName.toLowerCase()} is designed for anyone who needs quick, reliable estimates without complex spreadsheets or professional consultations.`,
      scenarios: tool.scenarios || [
        'When you need a quick estimate before committing to a purchase or project',
        'When comparing different options or scenarios side by side',
        'When planning a budget and need to understand potential costs',
        'When you want to verify a quote or estimate you\'ve received from a professional',
        'When teaching or learning about the concepts behind these calculations'
      ]
    },
    category: tool.category,
    lastUpdated: new Date().toISOString().split('T')[0]
  };
}

function generateMasterEntry(tool, id) {
  return {
    id,
    slug: tool.slug,
    toolName: tool.toolName,
    category: tool.category,
    subcategory: tool.subcategory || tool.category,
    primaryKeyword: tool.slug.replace(/-/g, ' '),
    competition: tool.competition || 'medium',
    rpm: tool.rpm || 'medium',
    priority: tool.priority || 2,
    status: 'active',
    relatedTools: tool.relatedTools || [],
    notes: tool.notes || `Generated batch tool for ${tool.category}`
  };
}

function run(batchFile) {
  const batch = JSON.parse(fs.readFileSync(batchFile, 'utf-8'));
  const masterList = JSON.parse(fs.readFileSync(MASTER_LIST, 'utf-8'));
  const existingSlugs = new Set(masterList.map(t => t.slug));
  let maxId = Math.max(...masterList.map(t => t.id));

  let created = 0;
  let skipped = 0;

  for (const tool of batch) {
    // Skip if config already exists
    const configPath = path.join(CONFIGS_DIR, `${tool.slug}.json`);
    if (fs.existsSync(configPath)) {
      console.log(`  SKIP (exists): ${tool.slug}`);
      skipped++;
      continue;
    }

    // Generate config
    const config = generateConfig(tool);
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    // Write custom JS
    const jsPath = path.join(CUSTOM_DIR, `${tool.slug}.js`);
    fs.writeFileSync(jsPath, tool.customJS);

    // Add to master list if not already there
    if (!existingSlugs.has(tool.slug)) {
      maxId++;
      masterList.push(generateMasterEntry(tool, maxId));
      existingSlugs.add(tool.slug);
    }

    console.log(`  CREATED: ${tool.slug}`);
    created++;
  }

  // Save updated master list
  fs.writeFileSync(MASTER_LIST, JSON.stringify(masterList, null, 2));

  console.log(`\nDone! Created: ${created}, Skipped: ${skipped}`);
  console.log(`Master list now has ${masterList.length} entries.`);
}

if (process.argv.length < 3) {
  console.log('Usage: node scripts/mass-generate.js <batch-file.json>');
  process.exit(1);
}

run(process.argv[2]);
