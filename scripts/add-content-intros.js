#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'sites', 'configs');

// Tools missing contentIntro
const slugs = ["australia-cgt-calculator","australia-first-home-buyer-calculator","australia-fuel-excise-calculator","australia-gst-calculator","australia-hecs-help-calculator","australia-income-tax-calculator","australia-negative-gearing-calculator","australia-payg-tax-calculator","australia-stamp-duty-calculator","australia-superannuation-calculator","best-state-to-retire-calculator","bill-of-sale-generator","black-friday-savings-calculator","canada-capital-gains-calculator","canada-child-benefit-calculator","canada-cpp-calculator","canada-ei-calculator","canada-gst-hst-calculator","canada-land-transfer-tax-calculator","canada-mortgage-stress-test-calculator","canada-provincial-tax-calculator","canada-rrsp-calculator","canada-tfsa-calculator","catering-cost-estimator","cease-desist-letter-generator","christmas-budget-calculator","contractor-agreement-generator","demand-letter-generator","dmca-takedown-generator","effective-tax-rate-by-income-calculator","fed-rate-mortgage-impact-calculator","honeymoon-budget-calculator","housing-market-correction-calculator","housing-report-buyer-impact-calculator","lease-agreement-generator","llc-operating-agreement-generator","llc-vs-scorp-vs-sole-prop-calculator","mortgage-rate-forecast-calculator","nda-generator","overtime-worth-calculator","promissory-note-generator","rent-vs-buy-comparison","rent-vs-own-honest-comparison-calculator","simple-will-generator","social-security-depletion-calculator","stock-market-crash-probability-calculator","stock-market-drop-401k-calculator","tax-penalty-calculator","term-vs-whole-life-insurance-calculator","uk-council-tax-estimator","uk-energy-bill-calculator","uk-income-tax-calculator","uk-inheritance-tax-calculator","uk-mortgage-stamp-duty-calculator","uk-national-insurance-calculator","uk-pension-calculator","uk-stamp-duty-calculator","uk-student-loan-repayment-calculator","uk-vat-calculator","valentines-day-spending-calculator","venue-cost-comparison-calculator","wedding-cost-per-head-calculator","wedding-debt-payoff-calculator"];

let updated = 0;

slugs.forEach(slug => {
  const fp = path.join(dir, slug + '.json');
  if (!fs.existsSync(fp)) return;
  const cfg = JSON.parse(fs.readFileSync(fp, 'utf8'));
  if (cfg.contentIntro) return; // already has one

  const name = cfg.toolName || slug;
  const desc = cfg.metaDescription || cfg.tagline || '';
  const category = cfg.category || '';

  // Generate contextual intro sections based on tool type
  const sections = [];

  // Section 1: What this tool does
  sections.push({
    title: `What Is the ${name}?`,
    body: `The ${name} helps you ${getActionPhrase(slug, category, desc)}. Instead of guessing or spending hours on manual calculations, get accurate results in seconds. Enter your details above and let the calculator do the work.`
  });

  // Section 2: Why it matters
  sections.push({
    title: getWhyTitle(slug, category),
    body: getWhyBody(slug, category, name)
  });

  cfg.contentIntro = { sections };
  fs.writeFileSync(fp, JSON.stringify(cfg, null, 2) + '\n');
  updated++;
});

console.log(`Added content intros to ${updated} tools`);

function getActionPhrase(slug, category, desc) {
  if (slug.includes('generator')) return 'create professional legal documents quickly and accurately without expensive attorney fees';
  if (slug.includes('tax')) return 'estimate your tax obligations accurately so you can plan ahead and avoid surprises at filing time';
  if (slug.includes('mortgage') || slug.includes('home')) return 'make smarter decisions about one of the biggest financial commitments of your life';
  if (slug.includes('insurance')) return 'compare coverage options and understand the true cost of protecting what matters most';
  if (slug.includes('budget') || slug.includes('cost') || slug.includes('spending')) return 'plan your spending with confidence so you stay on budget without cutting corners';
  if (slug.includes('retirement') || slug.includes('pension') || slug.includes('superannuation') || slug.includes('401k')) return 'plan for a secure retirement by understanding exactly where you stand today';
  if (slug.includes('loan') || slug.includes('debt') || slug.includes('payoff')) return 'understand your repayment timeline and find the fastest path to being debt-free';
  if (slug.includes('investment') || slug.includes('stock') || slug.includes('market')) return 'assess your investment position with real numbers instead of guesswork';
  if (slug.includes('rent-vs-buy') || slug.includes('rent-vs-own')) return 'compare the true cost of renting versus buying so you can make an informed decision';
  if (slug.includes('calculator')) return 'get precise numbers for your specific situation in seconds';
  return 'get accurate results tailored to your specific situation';
}

function getWhyTitle(slug, category) {
  if (slug.includes('generator')) return 'Why Use a Document Generator?';
  if (category === 'legal' || category === 'legal-regulatory') return 'Why This Matters for Your Situation';
  if (category === 'insurance') return 'Why Getting This Right Matters';
  if (slug.includes('australia')) return 'Understanding the Australian System';
  if (slug.includes('canada')) return 'Understanding the Canadian System';
  if (slug.includes('uk-')) return 'Understanding the UK System';
  return 'Why This Calculation Matters';
}

function getWhyBody(slug, category, name) {
  if (slug.includes('generator')) {
    return 'Legal documents drafted incorrectly can be unenforceable or create liability you did not intend. While this generator creates professionally structured documents based on widely accepted templates, complex situations may still warrant review by a licensed attorney. Use this as a starting point to save time and money on standard legal paperwork.';
  }
  if (slug.includes('tax')) {
    return 'Tax obligations vary significantly based on your income, deductions, filing status, and jurisdiction. Small miscalculations compound over time and can lead to penalties or missed refund opportunities. Running your numbers through this calculator before filing season gives you a clear picture of where you stand and time to adjust your strategy.';
  }
  if (slug.includes('australia')) {
    return 'Australian tax and financial regulations have specific thresholds, rates, and rules that differ from other countries. This calculator uses current Australian rates and brackets so you get results that actually apply to your situation rather than generic estimates.';
  }
  if (slug.includes('canada')) {
    return 'Canadian financial calculations involve federal and provincial components that interact in ways that are easy to miscalculate manually. This tool accounts for those interactions so you get an accurate picture of your real obligations and benefits.';
  }
  if (slug.includes('uk-')) {
    return 'UK financial regulations include specific thresholds, bands, and allowances that change with each tax year. This calculator reflects current UK rates so your results are accurate and actionable for planning purposes.';
  }
  if (slug.includes('mortgage') || slug.includes('home') || slug.includes('rent-vs')) {
    return 'Housing decisions involve large sums of money over long time horizons. A difference of even half a percentage point or a few thousand dollars in your assumptions can mean tens of thousands over the life of a mortgage. Getting the math right before you commit is one of the highest-value uses of five minutes you will ever find.';
  }
  if (slug.includes('stock') || slug.includes('market') || slug.includes('401k')) {
    return 'Market conditions affect your financial security in ways that are hard to quantify without running the actual numbers. This calculator helps you see concrete outcomes based on different scenarios so you can make decisions based on data rather than anxiety or optimism.';
  }
  if (slug.includes('insurance')) {
    return 'Insurance decisions involve balancing premium costs against coverage gaps that could cost you significantly more in the event of a claim. Understanding the real tradeoffs with actual numbers helps you make an informed choice rather than just picking the cheapest option.';
  }
  if (slug.includes('budget') || slug.includes('cost') || slug.includes('spending')) {
    return 'Budgeting decisions are easier when you can see the complete picture before committing to spending. This calculator breaks down the real costs so you can allocate your money with confidence and avoid overspending in areas that matter less to you.';
  }
  if (slug.includes('wedding') || slug.includes('honeymoon') || slug.includes('valentine')) {
    return 'Big life events come with big expenses that add up faster than most people expect. Getting a realistic cost estimate upfront helps you set a budget you can actually stick to and avoid the financial stress that often follows celebrations.';
  }
  return 'Making financial decisions without accurate numbers is like driving without a dashboard. This calculator gives you the specific figures for your situation so you can plan with confidence rather than rough estimates.';
}
