'use strict';

// ---------------------------------------------------------------------------
// Affiliate CTA System
// Maps tool categories and slug patterns to relevant affiliate programs.
// CTAs are contextual "next step" suggestions, not banner ads.
// ---------------------------------------------------------------------------

const AFFILIATE_PROGRAMS = {
  // Mortgage & Home Buying
  mortgage: {
    heading: 'Ready to Take the Next Step?',
    text: 'Compare current mortgage rates from top lenders — see what you actually qualify for.',
    cta: 'Compare Mortgage Rates',
    url: 'https://www.credible.com/mortgage',
    provider: 'Credible',
    utm: { source: 'crunchmilk', medium: 'affiliate', campaign: 'mortgage-tools' }
  },

  // Debt & Credit
  debt: {
    heading: 'Ready to Tackle Your Debt?',
    text: 'See personalized debt consolidation offers — check rates without affecting your credit score.',
    cta: 'Check Your Rates',
    url: 'https://www.credible.com/personal-loans',
    provider: 'Credible',
    utm: { source: 'crunchmilk', medium: 'affiliate', campaign: 'debt-tools' }
  },

  // Student Loans
  studentLoan: {
    heading: 'Could You Be Paying Less?',
    text: 'Compare student loan refinancing rates from multiple lenders in minutes.',
    cta: 'Compare Refinancing Rates',
    url: 'https://www.credible.com/student-loans',
    provider: 'Credible',
    utm: { source: 'crunchmilk', medium: 'affiliate', campaign: 'student-loan-tools' }
  },

  // Tax
  tax: {
    heading: 'File With Confidence',
    text: 'Get your maximum refund guaranteed — file federal and state taxes online.',
    cta: 'Start Filing Free',
    url: 'https://turbotax.intuit.com/',
    provider: 'TurboTax',
    utm: { source: 'crunchmilk', medium: 'affiliate', campaign: 'tax-tools' }
  },

  // Insurance
  insurance: {
    heading: 'Are You Overpaying for Insurance?',
    text: 'Compare quotes from top insurance carriers in one place — find better coverage for less.',
    cta: 'Compare Insurance Quotes',
    url: 'https://www.policygenius.com/',
    provider: 'Policygenius',
    utm: { source: 'crunchmilk', medium: 'affiliate', campaign: 'insurance-tools' }
  },

  // Legal Documents
  legal: {
    heading: 'Need It Legally Binding?',
    text: 'Get your documents reviewed by a licensed attorney — starting at $39.',
    cta: 'Get Legal Review',
    url: 'https://www.legalzoom.com/',
    provider: 'LegalZoom',
    utm: { source: 'crunchmilk', medium: 'affiliate', campaign: 'legal-tools' }
  },

  // Investment & Retirement
  investment: {
    heading: 'Put Your Money to Work',
    text: 'Start investing with a portfolio built for your goals — no minimums, no commissions.',
    cta: 'Start Investing',
    url: 'https://www.betterment.com/',
    provider: 'Betterment',
    utm: { source: 'crunchmilk', medium: 'affiliate', campaign: 'investment-tools' }
  },

  // Savings & Banking
  savings: {
    heading: 'Earn More on Your Savings',
    text: 'High-yield savings accounts paying 4%+ APY — compare top rates from FDIC-insured banks.',
    cta: 'Compare Savings Rates',
    url: 'https://www.nerdwallet.com/best/banking/high-yield-online-savings-accounts',
    provider: 'NerdWallet',
    utm: { source: 'crunchmilk', medium: 'affiliate', campaign: 'savings-tools' }
  },

  // Small Business / LLC
  business: {
    heading: 'Form Your Business the Right Way',
    text: 'LLC formation, registered agent, and EIN filing — handled for you from $0 + state fees.',
    cta: 'Start Your LLC',
    url: 'https://www.legalzoom.com/business/business-formation/llc-overview.html',
    provider: 'LegalZoom',
    utm: { source: 'crunchmilk', medium: 'affiliate', campaign: 'business-tools' }
  },

  // Auto / Vehicle
  auto: {
    heading: 'Could You Save on Auto Insurance?',
    text: 'Compare auto insurance quotes from 50+ carriers in just 2 minutes.',
    cta: 'Get Free Quotes',
    url: 'https://www.thezebra.com/',
    provider: 'The Zebra',
    utm: { source: 'crunchmilk', medium: 'affiliate', campaign: 'auto-tools' }
  }
};

// ---------------------------------------------------------------------------
// Slug pattern matching — maps specific tool slugs to affiliate programs
// ---------------------------------------------------------------------------

const SLUG_PATTERNS = [
  // Mortgage
  { pattern: /mortgage|home-loan|house-afford|rent-vs-buy|home-equity|heloc|down-payment/, program: 'mortgage' },
  // Debt
  { pattern: /debt-|credit-card-pay|loan-pay|payoff/, program: 'debt' },
  // Student loans
  { pattern: /student-loan|college-cost|tuition/, program: 'studentLoan' },
  // Tax
  { pattern: /tax-|income-tax|self-employment-tax|capital-gains|1099|w2/, program: 'tax' },
  // Insurance
  { pattern: /insurance|hurricane-insurance|flood-insurance|life-insurance|health-insurance/, program: 'insurance' },
  // Legal documents
  { pattern: /generator$|nda-|lease-agreement|will-|power-of-attorney|cease-desist|contractor-agreement|llc-operating|promissory-note|bill-of-sale|demand-letter|dmca/, program: 'legal' },
  // Investment / Retirement
  { pattern: /fire-calc|retirement|401k|roth|ira-|compound-interest|investment-return|portfolio/, program: 'investment' },
  // Savings
  { pattern: /savings|emergency-fund|cd-calc|apy-/, program: 'savings' },
  // Business / LLC
  { pattern: /llc-|business-|startup-cost|break-even|profit-margin/, program: 'business' },
  // Auto
  { pattern: /car-loan|auto-loan|vehicle-|car-afford|car-deprec|gas-cost/, program: 'auto' }
];

// ---------------------------------------------------------------------------
// Category fallback mapping
// ---------------------------------------------------------------------------

const CATEGORY_AFFILIATES = {
  'finance': 'investment',
  'niche-finance': 'savings',
  'legal': 'legal',
  'legal-regulatory': 'legal',
  'insurance': 'insurance',
  'housing': 'mortgage',
  'automotive': 'auto'
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Resolve which affiliate program applies to a given tool config.
 * Returns the program key or null if no match.
 */
function resolveAffiliateProgram(config) {
  const slug = config.slug || '';

  // 1. Check slug patterns first (most specific)
  for (var i = 0; i < SLUG_PATTERNS.length; i++) {
    if (SLUG_PATTERNS[i].pattern.test(slug)) {
      return SLUG_PATTERNS[i].program;
    }
  }

  // 2. Fall back to category mapping
  var category = config.category || '';
  if (CATEGORY_AFFILIATES[category]) {
    return CATEGORY_AFFILIATES[category];
  }

  return null;
}

/**
 * Build the affiliate CTA HTML for a given tool config.
 * Returns empty string if no affiliate applies.
 */
function buildAffiliateCTA(config) {
  var programKey = resolveAffiliateProgram(config);
  if (!programKey) return '';

  var program = AFFILIATE_PROGRAMS[programKey];
  if (!program) return '';

  // Build URL with UTM parameters
  var sep = program.url.indexOf('?') === -1 ? '?' : '&';
  var trackedUrl = program.url +
    sep + 'utm_source=' + encodeURIComponent(program.utm.source) +
    '&utm_medium=' + encodeURIComponent(program.utm.medium) +
    '&utm_campaign=' + encodeURIComponent(program.utm.campaign) +
    '&utm_content=' + encodeURIComponent(config.slug);

  var html = '';
  html += '  <div class="affiliate-cta">\n';
  html += '    <div class="affiliate-inner">\n';
  html += '      <p class="affiliate-heading">' + program.heading + '</p>\n';
  html += '      <p class="affiliate-text">' + program.text + '</p>\n';
  html += '      <a href="' + trackedUrl + '" class="affiliate-btn" target="_blank" rel="noopener sponsored" data-affiliate="' + programKey + '" data-slug="' + config.slug + '">' + program.cta + ' &#8594;</a>\n';
  html += '      <p class="affiliate-disclosure">Partner offer via ' + program.provider + '</p>\n';
  html += '    </div>\n';
  html += '  </div>\n';

  return html;
}

module.exports = { buildAffiliateCTA, resolveAffiliateProgram, AFFILIATE_PROGRAMS };
