#!/usr/bin/env node
/**
 * Bulk content enrichment script for CrunchMilk calculator tools.
 * Reads each config, extracts input/result labels, and generates:
 *   - contentIntro (with sections)
 *   - howToSteps
 *   - tips
 *   - expanded FAQ (to 5+)
 *   - longer metaDescription (120+ chars)
 *
 * Usage: node scripts/enrich-content.js [--dry-run] [--max N] [--min-score N]
 */

const fs = require('fs');
const path = require('path');

const CONFIGS_DIR = path.join(__dirname, '..', 'sites', 'configs');
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const MAX = parseInt(args[args.indexOf('--max') + 1]) || 99999;
const MIN_SCORE = parseInt(args[args.indexOf('--min-score') + 1]) || 0;
const MAX_SCORE = parseInt(args[args.indexOf('--max-score') + 1]) || 4;

// ── Extract labels from calculatorHTML ──
function extractLabels(html) {
  const inputLabels = [];
  const resultLabels = [];
  const re1 = /<label[^>]*>([^<]+)<\/label>/g;
  const re2 = /class="result-label">([^<]+)<\/div>/g;
  let m;
  while ((m = re1.exec(html))) inputLabels.push(m[1].trim());
  while ((m = re2.exec(html))) resultLabels.push(m[1].trim());
  return { inputLabels, resultLabels };
}

// ── Score a config (same logic as audit) ──
function scoreConfig(config) {
  let score = 0;
  const faq = config.faq || [];
  if (faq.length >= 5) score += 2; else if (faq.length >= 3) score += 1;
  const hw = config.howItWorks;
  if (hw && typeof hw === 'object') {
    const rules = hw.rules || [];
    if (rules.length > 0 && hw.intro) score += 2;
    else if (rules.length > 0 || hw.intro) score += 1;
  } else if (hw && typeof hw === 'string' && hw.length > 100) score += 2;
  const intro = config.contentIntro || config.longDescription || '';
  if (typeof intro === 'object' && intro.sections) {
    if (intro.sections.length >= 3) score += 3;
    else if (intro.sections.length >= 1) score += 2;
  } else if (typeof intro === 'string') {
    if (intro.length > 300) score += 3;
    else if (intro.length > 100) score += 2;
    else if (intro.length > 0) score += 1;
  }
  const steps = config.howToSteps || [];
  if (steps.length >= 3) score += 1;
  const tips = config.tips || [];
  if (tips.length >= 3) score += 1;
  const meta = config.metaDescription || '';
  if (meta.length >= 120) score += 1;
  return score;
}

// ── Humanize a label (remove units in parens, clean up) ──
function humanize(label) {
  return label.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
}

// ── Category context for richer content ──
const CATEGORY_CONTEXT = {
  'finance': { domain: 'financial planning', audience: 'individuals and families', verb: 'manage your finances' },
  'health': { domain: 'health and wellness', audience: 'health-conscious individuals', verb: 'monitor your health' },
  'fitness': { domain: 'fitness and training', audience: 'athletes and fitness enthusiasts', verb: 'optimize your training' },
  'cooking': { domain: 'cooking and food preparation', audience: 'home cooks and chefs', verb: 'perfect your recipes' },
  'construction': { domain: 'construction and building', audience: 'contractors and DIY builders', verb: 'plan your projects' },
  'real-estate': { domain: 'real estate and property', audience: 'homebuyers and investors', verb: 'make informed property decisions' },
  'automotive': { domain: 'automotive care and maintenance', audience: 'car owners and enthusiasts', verb: 'maintain your vehicle' },
  'crypto': { domain: 'cryptocurrency and blockchain', audience: 'crypto investors and traders', verb: 'evaluate your crypto portfolio' },
  'business': { domain: 'business operations', audience: 'entrepreneurs and business owners', verb: 'grow your business' },
  'technology': { domain: 'technology and computing', audience: 'tech professionals and enthusiasts', verb: 'optimize your tech setup' },
  'home': { domain: 'home improvement', audience: 'homeowners and renters', verb: 'improve your living space' },
  'pets': { domain: 'pet care', audience: 'pet owners', verb: 'care for your pets' },
  'sports': { domain: 'sports analytics', audience: 'athletes, coaches, and fans', verb: 'analyze performance' },
  'education': { domain: 'education and learning', audience: 'students and educators', verb: 'plan your education' },
  'science': { domain: 'science and research', audience: 'researchers and curious minds', verb: 'explore scientific concepts' },
  'gardening': { domain: 'gardening and horticulture', audience: 'gardeners and growers', verb: 'grow a thriving garden' },
  'crafts': { domain: 'crafting and DIY', audience: 'crafters and makers', verb: 'plan your projects' },
  'music': { domain: 'music and audio', audience: 'musicians and audio engineers', verb: 'fine-tune your sound' },
  'photography': { domain: 'photography', audience: 'photographers', verb: 'capture better images' },
  'travel': { domain: 'travel planning', audience: 'travelers', verb: 'plan your trips' },
  'sustainability': { domain: 'sustainability and environment', audience: 'eco-conscious individuals', verb: 'reduce your environmental impact' },
  'legal': { domain: 'legal matters', audience: 'individuals navigating legal issues', verb: 'understand your legal situation' },
  'insurance': { domain: 'insurance planning', audience: 'individuals and families', verb: 'choose the right coverage' },
  'pregnancy': { domain: 'pregnancy and parenting', audience: 'expecting parents', verb: 'prepare for parenthood' },
  'mental-health': { domain: 'mental health and wellness', audience: 'individuals seeking balance', verb: 'support your mental well-being' },
  'military': { domain: 'military and defense', audience: 'service members and families', verb: 'plan your military career' },
  'energy': { domain: 'energy and utilities', audience: 'homeowners and businesses', verb: 'manage energy costs' },
  'geopolitical-energy': { domain: 'geopolitics and energy markets', audience: 'analysts and informed citizens', verb: 'understand global dynamics' },
  'marine': { domain: 'boating and marine', audience: 'boaters and sailors', verb: 'navigate safely' },
  '3d-printing': { domain: '3D printing and additive manufacturing', audience: 'makers and 3D printing enthusiasts', verb: 'optimize your prints' },
  'brewing': { domain: 'homebrewing', audience: 'homebrewers', verb: 'brew better beer' },
  'ai': { domain: 'artificial intelligence', audience: 'developers and AI practitioners', verb: 'leverage AI effectively' },
};

const DEFAULT_CTX = { domain: 'practical calculation', audience: 'users', verb: 'get accurate results' };

// ── Generate contentIntro sections ──
function generateContentIntro(config, labels) {
  const name = config.toolName;
  const ctx = CATEGORY_CONTEXT[config.category] || DEFAULT_CTX;
  const inputList = labels.inputLabels.map(humanize);
  const resultList = labels.resultLabels.map(humanize);

  const sections = [];

  // Section 1: What is this calculator
  const inputPhrase = inputList.length > 0
    ? `By entering your ${inputList.slice(0, 3).join(', ')}, you get instant results`
    : 'With just a few inputs, you get instant results';
  const resultPhrase = resultList.length > 0
    ? ` including ${resultList.slice(0, 3).join(', ')}`
    : '';

  sections.push({
    title: `What Is the ${name}?`,
    body: `The ${name} is a free online tool designed for ${ctx.audience} who need quick, accurate calculations in the ${ctx.domain} space. ${inputPhrase}${resultPhrase}. No formulas to memorize, no spreadsheets to build — just enter your numbers and get the answer in seconds. Whether you're a beginner or experienced professional, this calculator saves you time and eliminates guesswork.`
  });

  // Section 2: Why it matters
  sections.push({
    title: `Why This Calculation Matters`,
    body: `Getting ${resultList.length > 0 ? resultList[0] : 'these numbers'} right can make the difference between success and costly mistakes. In ${ctx.domain}, small errors compound quickly. Manual calculations are error-prone and time-consuming, especially under pressure. This calculator applies proven formulas used by ${ctx.audience} worldwide, giving you confidence that your numbers are correct. Use it to ${ctx.verb} with precision and avoid common pitfalls that trip up beginners.`
  });

  // Section 3: When to use
  const useCases = [];
  if (inputList.length >= 2) {
    useCases.push(`when you know your ${inputList[0]} and need to find the right ${resultList[0] || 'result'}`);
  }
  useCases.push(`for quick estimates before committing to a decision`);
  useCases.push(`to double-check manual calculations or professional quotes`);
  useCases.push(`when comparing different scenarios side by side`);

  sections.push({
    title: `When Should You Use This Calculator?`,
    body: `This tool is most useful ${useCases[0]}. It's also great ${useCases.slice(1).join(', and ')}. Bookmark this page and come back whenever you need a fast, reliable answer — the calculator is always free and requires no signup.`
  });

  return { sections };
}

// ── Generate howToSteps ──
function generateHowToSteps(config, labels) {
  const steps = [];
  const inputs = labels.inputLabels;
  const results = labels.resultLabels;

  if (inputs.length === 0) {
    steps.push({ title: 'Enter Your Values', description: 'Fill in the required fields with your numbers.' });
  } else if (inputs.length <= 3) {
    inputs.forEach(inp => {
      steps.push({ title: `Enter Your ${inp}`, description: `Type or select your ${humanize(inp)} in the field provided. Use the most accurate value available for best results.` });
    });
  } else {
    steps.push({ title: `Enter Your ${inputs[0]}`, description: `Start by entering your ${humanize(inputs[0])} — this is the primary input for the calculation.` });
    steps.push({ title: 'Fill In Additional Details', description: `Complete the remaining fields: ${inputs.slice(1).map(humanize).join(', ')}. Each value refines the calculation for greater accuracy.` });
  }

  steps.push({ title: 'Click Calculate', description: 'Hit the Calculate button to run the numbers. Results appear instantly below.' });

  if (results.length > 0) {
    steps.push({ title: 'Review Your Results', description: `Check your ${results.map(humanize).slice(0, 3).join(', ')}. Use these figures to inform your next decision or compare against alternative scenarios.` });
  }

  return steps;
}

// ── Generate tips ──
function generateTips(config, labels) {
  const ctx = CATEGORY_CONTEXT[config.category] || DEFAULT_CTX;
  const inputs = labels.inputLabels;
  const results = labels.resultLabels;
  const tips = [];

  if (inputs.length > 0) {
    tips.push(`Double-check your ${humanize(inputs[0])} before calculating — even small input errors can significantly change your results.`);
  }

  tips.push(`Run the calculator with different values to compare scenarios and find the optimal approach for your situation.`);

  if (results.length >= 2) {
    tips.push(`Pay attention to both ${humanize(results[0])} and ${humanize(results[1])} — they work together to give you the full picture.`);
  }

  tips.push(`Bookmark this page for quick access next time you need to ${ctx.verb}.`);

  if (inputs.length >= 2) {
    tips.push(`If you're unsure about your ${humanize(inputs[inputs.length - 1])}, start with a conservative estimate and adjust from there.`);
  }

  return tips;
}

// ── Generate additional FAQs ──
function generateFaqs(config, labels) {
  const name = config.toolName;
  const ctx = CATEGORY_CONTEXT[config.category] || DEFAULT_CTX;
  const inputs = labels.inputLabels;
  const results = labels.resultLabels;
  const existing = config.faq || [];
  const existingQs = existing.map(f => (f.question || f.q || '').toLowerCase());

  const candidates = [];

  candidates.push({
    question: `Is the ${name} free to use?`,
    answer: `Yes, completely free with no signup required. Use it as many times as you need — there are no limits or hidden fees.`
  });

  candidates.push({
    question: `How accurate is this calculator?`,
    answer: `This calculator uses standard ${ctx.domain} formulas trusted by ${ctx.audience}. Results are reliable estimates for planning purposes. For critical decisions, we recommend consulting a qualified professional to verify.`
  });

  if (inputs.length > 0) {
    candidates.push({
      question: `What ${humanize(inputs[0])} should I enter?`,
      answer: `Enter the most accurate ${humanize(inputs[0])} value you have available. If you're estimating, use a conservative figure. You can always run the calculator again with different values to see how changes affect the results.`
    });
  }

  candidates.push({
    question: `Can I use this calculator on my phone?`,
    answer: `Yes, the ${name} is fully responsive and works on any device — phone, tablet, or desktop. No app download needed.`
  });

  if (results.length > 0) {
    candidates.push({
      question: `What does ${humanize(results[0])} mean in my results?`,
      answer: `The ${humanize(results[0])} value represents the primary output of the calculation based on your inputs. Use it as a baseline figure for your ${ctx.domain} planning and decision-making.`
    });
  }

  candidates.push({
    question: `How often should I recalculate?`,
    answer: `Recalculate whenever your inputs change or when you're comparing different scenarios. Many ${ctx.audience} run multiple calculations to find the best option before making a final decision.`
  });

  candidates.push({
    question: `Can I save or share my results?`,
    answer: `You can use the share buttons to send your results via social media or copy the link. For a personal record, take a screenshot or use the download option if available.`
  });

  // Filter out duplicates
  const newFaqs = [];
  for (const faq of candidates) {
    const qLower = faq.question.toLowerCase();
    const isDup = existingQs.some(eq => {
      // Check for significant word overlap
      const words1 = qLower.split(/\s+/);
      const words2 = eq.split(/\s+/);
      const overlap = words1.filter(w => w.length > 3 && words2.includes(w)).length;
      return overlap >= 3;
    });
    if (!isDup) {
      newFaqs.push(faq);
    }
  }

  return newFaqs;
}

// ── Improve meta description ──
function improveMetaDescription(config) {
  const meta = config.metaDescription || '';
  if (meta.length >= 130) return meta;
  const name = config.toolName;
  const ctx = CATEGORY_CONTEXT[config.category] || DEFAULT_CTX;
  return `Use the free ${name} to get instant, accurate results. Built for ${ctx.audience} — no signup, no fees. Calculate now and ${ctx.verb} with confidence.`;
}

// ── Main ──
const files = fs.readdirSync(CONFIGS_DIR).filter(f => f.endsWith('.json')).sort();
let enriched = 0;
let skipped = 0;

for (const fname of files) {
  if (enriched >= MAX) break;

  const configPath = path.join(CONFIGS_DIR, fname);
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const score = scoreConfig(config);

  if (score < MIN_SCORE || score > MAX_SCORE) {
    skipped++;
    continue;
  }

  const labels = extractLabels(config.calculatorHTML || '');
  let changed = false;

  // 1. contentIntro
  if (!config.contentIntro || (typeof config.contentIntro === 'object' && (!config.contentIntro.sections || config.contentIntro.sections.length === 0))) {
    config.contentIntro = generateContentIntro(config, labels);
    changed = true;
  }

  // 2. howToSteps
  if (!config.howToSteps || config.howToSteps.length < 3) {
    config.howToSteps = generateHowToSteps(config, labels);
    changed = true;
  }

  // 3. tips
  if (!config.tips || config.tips.length < 3) {
    config.tips = generateTips(config, labels);
    changed = true;
  }

  // 4. FAQ — expand to 5+
  const existingFaq = config.faq || [];
  if (existingFaq.length < 5) {
    const newFaqs = generateFaqs(config, labels);
    const needed = 5 - existingFaq.length;
    // Normalize existing to question/answer format
    const normalized = existingFaq.map(f => ({
      question: f.question || f.q || '',
      answer: f.answer || f.a || ''
    }));
    config.faq = [...normalized, ...newFaqs.slice(0, needed)];
    changed = true;
  }

  // 5. metaDescription
  if ((config.metaDescription || '').length < 120) {
    config.metaDescription = improveMetaDescription(config);
    changed = true;
  }

  if (changed) {
    if (!DRY_RUN) {
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');
    }
    enriched++;
    if (enriched % 100 === 0) {
      console.log(`  Enriched ${enriched} tools...`);
    }
  }
}

console.log(`\nDone! Enriched ${enriched} tools (skipped ${skipped}, max-score: ${MAX_SCORE})`);
