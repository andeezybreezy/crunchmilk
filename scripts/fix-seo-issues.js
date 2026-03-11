const fs = require('fs');
const path = require('path');

const configDir = path.join(__dirname, '..', 'sites', 'configs');
const GENERIC_OUTRO = 'Results are estimates. Consult a professional for critical decisions.';

// Category-specific disclaimers
const categoryDisclaimers = {
  'finance': 'Tax laws and financial markets change frequently. Verify current rates with your financial institution.',
  'construction': 'Material prices and building codes vary by region. Get local quotes before purchasing.',
  'fitness': 'Individual results vary based on metabolism, genetics, and activity level. Consult your doctor before starting any program.',
  'cooking': 'Cooking times and measurements can vary by equipment and altitude. Adjust based on your specific setup.',
  'health-longevity': 'Health metrics are general guidelines. Consult your healthcare provider for personalized medical advice.',
  'crypto': 'Cryptocurrency markets are highly volatile. Past performance does not guarantee future results.',
  'blockchain': 'Cryptocurrency markets are highly volatile. Past performance does not guarantee future results.',
  'housing': 'Real estate values and regulations vary significantly by location. Work with a local agent or attorney.',
  'insurance': 'Insurance rates depend on many individual factors. Get personalized quotes from licensed providers.',
  'automotive': 'Vehicle specifications and costs vary by model year and condition. Consult your mechanic for specific advice.',
  'education': 'Educational costs and financial aid vary by institution. Contact schools directly for current figures.',
  'energy': 'Energy costs and incentives change by region and season. Check with your local utility for current rates.',
  'energy-independence': 'Energy costs and incentives change by region and season. Check with your local utility for current rates.',
  'climate': 'Energy costs and incentives change by region and season. Check with your local utility for current rates.',
  'legal': 'Laws vary by jurisdiction and change frequently. This is not legal advice — consult a licensed attorney.',
  'legal-regulatory': 'Laws vary by jurisdiction and change frequently. This is not legal advice — consult a licensed attorney.',
};

const DEFAULT_DISCLAIMER = 'Results are estimates based on standard formulas. Verify with current local data for your specific situation.';

// Task 2: Meta description fixes
const metaFixes = {
  'car-payment-calculator': 'Estimate your monthly car payment with trade-in value, down payment, and loan term options.',
  'home-equity-loan-calculator': 'Calculate home equity loan payments, available equity, and compare HELOC vs fixed-rate options.',
  'loan-payoff-calculator': 'Plan your loan payoff strategy with extra payments, biweekly options, and interest savings.',
  'personal-loan-calculator': 'Compare personal loan offers by APR, term length, and total cost. See monthly payments instantly.',
  'boat-bottom-paint-coverage-calculator': 'Estimate antifouling paint coverage for your boat hull based on waterline length and hull shape.',
  'dew-point-from-humidity-calculator': 'Convert relative humidity and temperature to dew point. Understand moisture and comfort levels.',
  'wavelength-frequency-calculator': 'Convert between light wavelength and frequency. Calculate photon energy for any electromagnetic wave.',
  'bmi-body-mass-calculator': 'Calculate your BMI with height and weight. See where you fall on the WHO health classification scale.',
};

const files = fs.readdirSync(configDir).filter(f => f.endsWith('.json'));

let outroUpdated = 0;
let metaUpdated = 0;
const outroByCat = {};

for (const file of files) {
  const filePath = path.join(configDir, file);
  const config = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let changed = false;

  // Task 1: Fix generic outro
  if (config.howItWorks && config.howItWorks.outro === GENERIC_OUTRO) {
    const cat = config.category || '';
    const newOutro = categoryDisclaimers[cat] || DEFAULT_DISCLAIMER;
    config.howItWorks.outro = newOutro;
    outroByCat[cat] = (outroByCat[cat] || 0) + 1;
    outroUpdated++;
    changed = true;
  }

  // Task 2: Fix duplicate meta descriptions
  const slug = config.slug;
  if (metaFixes[slug]) {
    const newDesc = metaFixes[slug];
    console.log(`META FIX: ${slug}`);
    console.log(`  metaDescription: "${config.metaDescription}" -> "${newDesc}"`);
    config.metaDescription = newDesc;
    config.ogDescription = newDesc;
    console.log(`  ogDescription updated to match`);
    metaUpdated++;
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2) + '\n');
  }
}

console.log(`\n=== TASK 1: Outro Updates ===`);
console.log(`Total configs updated: ${outroUpdated}`);
console.log(`By category:`);
for (const [cat, count] of Object.entries(outroByCat).sort((a, b) => b[1] - a[1])) {
  const disclaimer = categoryDisclaimers[cat] || DEFAULT_DISCLAIMER;
  console.log(`  ${cat || '(empty)'}: ${count} — "${disclaimer.substring(0, 60)}..."`);
}

console.log(`\n=== TASK 2: Meta Description Updates ===`);
console.log(`Total meta descriptions fixed: ${metaUpdated}`);
