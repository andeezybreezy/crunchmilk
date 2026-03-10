#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CONFIGS_DIR = path.join(ROOT, 'sites', 'configs');
const OUTPUT_DIR = path.join(ROOT, 'output');
const TEMPLATE_PATH = path.join(ROOT, 'generator', 'templates', 'hub.html');
const MASTER_LIST_PATH = path.join(ROOT, 'data', 'master-tool-list.json');

// Category metadata
const CATEGORY_META = {
  'construction': { name: 'Construction Calculators', slug: 'construction-calculators', color: '#b45309', colorDark: '#92400e', tagline: 'Estimate materials, dimensions, and costs for any building project', intro: '<p>Whether you\'re a professional contractor or a weekend DIYer, these construction calculators help you estimate materials accurately before you buy. From concrete and lumber to insulation and roofing, every calculator uses industry-standard formulas to minimize waste and save money.</p>' },
  'cooking': { name: 'Cooking & Recipe Calculators', slug: 'cooking-calculators', color: '#dc2626', colorDark: '#b91c1c', tagline: 'Scale recipes, convert temperatures, and calculate cooking times', intro: '<p>Take the guesswork out of cooking with these kitchen calculators. Convert between cooking methods, scale recipes up or down, calculate precise ratios for baking, and estimate cooking times for every cut of meat.</p>' },
  'fitness': { name: 'Fitness & Health Calculators', slug: 'fitness-calculators', color: '#059669', colorDark: '#047857', tagline: 'Track macros, calculate body composition, and plan workouts', intro: '<p>Science-based fitness calculators to help you reach your health goals. Calculate your TDEE, figure out macro splits, estimate body fat percentage, plan running paces, and more — all using peer-reviewed formulas.</p>' },
  'finance': { name: 'Finance & Money Calculators', slug: 'finance-calculators', color: '#2563eb', colorDark: '#1d4ed8', tagline: 'Budget, invest, and plan your financial future', intro: '<p>Make smarter money decisions with these financial calculators. From debt payoff strategies and retirement planning to real estate ROI and freelance rate calculations, every tool helps you see the numbers clearly.</p>' },
  'niche-finance': { name: 'Niche Finance Calculators', slug: 'niche-finance-calculators', color: '#4f46e5', colorDark: '#4338ca', tagline: 'Advanced financial strategies and alternative investments', intro: '<p>Specialized financial calculators for real estate investors, tax strategists, and alternative investment approaches. These tools cover strategies most generic calculators ignore.</p>' },
  'automotive': { name: 'Automotive Calculators', slug: 'automotive-calculators', color: '#475569', colorDark: '#334155', tagline: 'Calculate vehicle costs, performance specs, and trip expenses', intro: '<p>From fuel cost estimates to towing capacity checks, these automotive calculators help you make informed decisions about your vehicle. Compare tire sizes, calculate gear ratios, and estimate the true cost of driving.</p>' },
  'gardening': { name: 'Gardening Calculators', slug: 'gardening-calculators', color: '#16a34a', colorDark: '#15803d', tagline: 'Plan your garden layout, soil needs, and planting schedule', intro: '<p>Get your garden right the first time. Calculate soil volumes for raised beds, plan seed spacing, figure out fertilizer application rates, and optimize your composting ratios.</p>' },
  'crafts': { name: 'Craft Calculators', slug: 'craft-calculators', color: '#d946ef', colorDark: '#c026d3', tagline: 'Calculate materials for DIY craft projects', intro: '<p>Precision calculators for crafters. Whether you\'re pouring epoxy resin, making candles, or mixing soap, these tools help you get your ratios and quantities right.</p>' },
  'sewing': { name: 'Sewing & Quilting Calculators', slug: 'sewing-calculators', color: '#e11d48', colorDark: '#be123c', tagline: 'Calculate fabric yardage, binding, and pattern measurements', intro: '<p>Sewing calculators for quilters, seamstresses, and knitters. Estimate yardage, calculate binding strips, and plan your projects with precision.</p>' },
  'energy': { name: 'Energy Calculators', slug: 'energy-calculators', color: '#f59e0b', colorDark: '#d97706', tagline: 'Calculate solar, battery, and electricity costs', intro: '<p>Energy calculators to help you understand your power consumption, plan solar installations, size battery banks, and estimate electricity costs.</p>' },
  'energy-independence': { name: 'Energy Independence Calculators', slug: 'energy-independence-calculators', color: '#ea580c', colorDark: '#c2410c', tagline: 'Plan your path to energy independence', intro: '<p>Tools for homeowners planning to reduce or eliminate their dependence on the grid. Size generators, calculate solar ROI, optimize time-of-use rates, and plan battery storage.</p>' },
  'legal': { name: 'Legal Calculators', slug: 'legal-calculators', color: '#6366f1', colorDark: '#4f46e5', tagline: 'Estimate legal costs, fines, and deadlines', intro: '<p>Legal calculators to help you understand potential costs and deadlines before consulting an attorney. Estimate child support, check statutes of limitations, and calculate potential fines.</p>' },
  'legal-regulatory': { name: 'Legal & Regulatory Calculators', slug: 'legal-regulatory-calculators', color: '#7c3aed', colorDark: '#6d28d9', tagline: 'Navigate compliance requirements and regulatory costs', intro: '<p>Tools for navigating the complex world of regulatory compliance. From tax-specific calculators to filing requirements, these tools help you understand your obligations.</p>' },
  'firearms': { name: 'Firearms & Hunting Calculators', slug: 'firearms-calculators', color: '#78716c', colorDark: '#57534e', tagline: 'Ballistics, reloading, and hunting season tools', intro: '<p>Precision calculators for hunters and shooting enthusiasts. Calculate bullet drop, estimate reloading costs, check draw odds, and plan your hunting season.</p>' },
  'agriculture': { name: 'Agriculture & Homestead Calculators', slug: 'agriculture-calculators', color: '#65a30d', colorDark: '#4d7c0f', tagline: 'Farm planning, livestock, and crop calculators', intro: '<p>Practical calculators for farmers, homesteaders, and hobby farmers. From egg production estimates to soil volume calculations, these tools help you plan and manage your agricultural operations.</p>' },
  'trades-industrial': { name: 'Trades & Industrial Calculators', slug: 'trades-industrial-calculators', color: '#ca8a04', colorDark: '#a16207', tagline: 'Professional trade calculations for field work', intro: '<p>Specialized calculators for tradespeople and industrial professionals. Size septic systems, calculate well pump requirements, plan irrigation systems, and more.</p>' },
  'ai-automation': { name: 'AI & Automation Calculators', slug: 'ai-automation-calculators', color: '#8b5cf6', colorDark: '#7c3aed', tagline: 'Understand AI costs, job impact, and automation timelines', intro: '<p>Tools to help you understand how AI and automation affect your work and costs. Compare AI vs human rates, estimate automation timelines, and check AI detection scores.</p>' },
  'tariffs': { name: 'Tariff & Trade Calculators', slug: 'tariff-calculators', color: '#dc2626', colorDark: '#b91c1c', tagline: 'Calculate import duties, tariff costs, and trade impacts', intro: '<p>Navigate the complex world of international trade with these tariff calculators. Estimate import duties, calculate landed costs, and understand how tariffs affect consumer prices.</p>' },
  'housing': { name: 'Housing & Real Estate Calculators', slug: 'housing-calculators', color: '#0891b2', colorDark: '#0e7490', tagline: 'Navigate housing costs, mortgages, and investment strategies', intro: '<p>Specialized housing calculators for today\'s challenging real estate market. Explore assumable mortgages, ADU costs, co-buying strategies, and more.</p>' },
  'crypto': { name: 'Cryptocurrency Calculators', slug: 'crypto-calculators', color: '#f97316', colorDark: '#ea580c', tagline: 'Calculate crypto gains, staking rewards, and DCA strategies', intro: '<p>Cryptocurrency calculators for investors and traders. Track cost basis, project staking rewards, plan DCA strategies, and understand Bitcoin halving cycles.</p>' },
  'climate': { name: 'Climate & Disaster Preparedness Calculators', slug: 'climate-calculators', color: '#0d9488', colorDark: '#0f766e', tagline: 'Assess climate risks and plan for natural disasters', intro: '<p>Understand your property\'s vulnerability to climate events and natural disasters. Assess wildfire risk, check flood zones, estimate insurance costs, and plan resilience upgrades.</p>' },
  'demographics': { name: 'Demographics & Relocation Calculators', slug: 'demographics-calculators', color: '#6366f1', colorDark: '#4f46e5', tagline: 'Compare cost of living and plan your next move', intro: '<p>Planning a move? These calculators help you compare cost of living between cities, adjust remote work salaries, evaluate retirement locations, and estimate moving costs.</p>' },
  'health-longevity': { name: 'Health & Longevity Calculators', slug: 'health-longevity-calculators', color: '#10b981', colorDark: '#059669', tagline: 'Optimize health metrics and track longevity markers', intro: '<p>Advanced health calculators focused on longevity and optimization. From biological age estimates to GLP-1 dosing and zone 2 heart rate training, these tools go beyond basic fitness.</p>' },
  'niche-health': { name: 'Medical & Clinical Calculators', slug: 'medical-calculators', color: '#ef4444', colorDark: '#dc2626', tagline: 'Clinical dosing, recovery, and medical cost calculators', intro: '<p>Medical calculators for healthcare professionals and patients. Calculate IV drip rates, medication half-lives, pediatric dosing, and recovery timelines.</p>' },
  'paranormal': { name: 'Astrology & Mystical Calculators', slug: 'paranormal-calculators', color: '#7c3aed', colorDark: '#6d28d9', tagline: 'Moon phases, birth charts, and cosmic calculations', intro: '<p>Explore the mystical side with these calculators. Track moon phases, check Mercury retrograde periods, calculate biorhythms, and generate numerology readings.</p>' },
  'survival': { name: 'Survival & Preparedness Calculators', slug: 'survival-calculators', color: '#854d0e', colorDark: '#713f12', tagline: 'Plan your emergency supplies and survival strategy', intro: '<p>Be prepared for any scenario. Calculate water storage needs, estimate emergency food requirements, size backup generators, and plan bug-out bag contents.</p>' },
  'audio': { name: 'Audio & Music Calculators', slug: 'audio-calculators', color: '#9333ea', colorDark: '#7e22ce', tagline: 'BPM, delay times, and audio equipment calculations', intro: '<p>Essential calculators for musicians, audio engineers, and home theater enthusiasts. Tap tempo, calculate delay times, and size speaker wire.</p>' },
  'pet': { name: 'Pet Care Calculators', slug: 'pet-calculators', color: '#f97316', colorDark: '#ea580c', tagline: 'Feed, stock, and care for your pets properly', intro: '<p>Pet care calculators for dogs, cats, fish, and more. Calculate feeding amounts, aquarium stocking levels, and tank volumes.</p>' },
  'photography': { name: 'Photography Calculators', slug: 'photography-calculators', color: '#1e40af', colorDark: '#1e3a8a', tagline: 'Depth of field, print sizes, and exposure calculations', intro: '<p>Technical photography calculators for hobbyists and professionals. Calculate depth of field, figure out print sizes, and determine aspect ratios.</p>' },
  'printing': { name: 'Printing Calculators', slug: 'printing-calculators', color: '#4b5563', colorDark: '#374151', tagline: 'DPI, bleed, and print-ready file calculations', intro: '<p>Calculators for graphic designers and print professionals. Figure out DPI requirements and bleed specifications for print-ready files.</p>' },
  'shipping': { name: 'Shipping Calculators', slug: 'shipping-calculators', color: '#b45309', colorDark: '#92400e', tagline: 'Calculate dimensional weight and shipping costs', intro: '<p>Shipping calculators to help you estimate costs before you ship. Calculate dimensional weight, compare box sizes, and optimize packaging.</p>' },
  'sports': { name: 'Sports Calculators', slug: 'sports-calculators', color: '#16a34a', colorDark: '#15803d', tagline: 'Handicaps, scores, and performance calculations', intro: '<p>Sports calculators for golfers, bowlers, and athletes. Calculate handicap indexes and performance metrics.</p>' },
  'education': { name: 'Education Calculators', slug: 'education-calculators', color: '#2563eb', colorDark: '#1d4ed8', tagline: 'GPA, grades, and academic planning tools', intro: '<p>Academic calculators for students. Figure out what grade you need on the final, calculate your GPA, and plan your academic path.</p>' },
  'weather': { name: 'Weather Calculators', slug: 'weather-calculators', color: '#0284c7', colorDark: '#0369a1', tagline: 'Wind chill, heat index, and weather-related calculations', intro: '<p>Weather calculators for safety planning and outdoor activities. Calculate wind chill, heat index, snow loads, and rainwater collection potential.</p>' },
  'science': { name: 'Science Calculators', slug: 'science-calculators', color: '#0891b2', colorDark: '#0e7490', tagline: 'Chemistry, physics, and lab calculations', intro: '<p>Science calculators for students and lab professionals. Perform dilution calculations, determine molarity, and solve concentration problems.</p>' },
  'marine': { name: 'Marine & Boating Calculators', slug: 'marine-calculators', color: '#0369a1', colorDark: '#075985', tagline: 'Fuel, propeller, and boating calculations', intro: '<p>Calculators for boat owners and marine enthusiasts. Estimate fuel consumption, size propellers, and plan voyages.</p>' },
  'woodworking': { name: 'Woodworking Calculators', slug: 'woodworking-calculators', color: '#92400e', colorDark: '#78350f', tagline: 'Board feet, joinery, and wood movement calculations', intro: '<p>Precision calculators for woodworkers. Calculate board footage, plan dovetail joints, and estimate wood movement across seasons.</p>' },
  '3d-printing': { name: '3D Printing Calculators', slug: '3d-printing-calculators', color: '#7c3aed', colorDark: '#6d28d9', tagline: 'Filament usage and print cost calculations', intro: '<p>3D printing calculators to help you estimate filament usage, calculate print costs, and plan your projects.</p>' },
  'rv': { name: 'RV Calculators', slug: 'rv-calculators', color: '#b45309', colorDark: '#92400e', tagline: 'Propane, fuel, and RV living calculations', intro: '<p>Calculators for RV owners and full-time travelers. Estimate propane usage and plan your trips.</p>' }
};

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function main() {
  console.log('Building Hub Pages\n==================\n');

  const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  const masterList = JSON.parse(fs.readFileSync(MASTER_LIST_PATH, 'utf8'));

  // Group tools by category
  const toolsByCategory = {};
  masterList.forEach(function(tool) {
    const cat = tool.category || 'uncategorized';
    if (!toolsByCategory[cat]) toolsByCategory[cat] = [];
    toolsByCategory[cat].push(tool);
  });

  // Load configs for taglines
  const configCache = {};
  fs.readdirSync(CONFIGS_DIR).filter(f => f.endsWith('.json')).forEach(function(f) {
    try {
      const cfg = JSON.parse(fs.readFileSync(path.join(CONFIGS_DIR, f), 'utf8'));
      configCache[cfg.slug] = cfg;
    } catch (e) {}
  });

  const allHubSlugs = Object.keys(CATEGORY_META).map(k => CATEGORY_META[k].slug);
  let builtCount = 0;

  Object.keys(CATEGORY_META).forEach(function(catKey) {
    const meta = CATEGORY_META[catKey];
    const tools = toolsByCategory[catKey] || [];
    if (tools.length === 0) return;

    // Build tool cards
    const toolCards = tools.map(function(tool) {
      const cfg = configCache[tool.slug];
      const tagline = (cfg && cfg.tagline) || tool.primaryKeyword || '';
      return '<a href="/' + escapeHtml(tool.slug) + '/" class="tool-card">' +
        '<h3>' + escapeHtml(tool.toolName) + '</h3>' +
        '<p>' + escapeHtml(tagline) + '</p>' +
        '</a>';
    }).join('\n    ');

    // Build related hub links (exclude self)
    const relatedHubs = allHubSlugs.filter(s => s !== meta.slug).slice(0, 12).map(function(hubSlug) {
      const hubCatKey = Object.keys(CATEGORY_META).find(k => CATEGORY_META[k].slug === hubSlug);
      const hubMeta = CATEGORY_META[hubCatKey];
      return '<a href="/' + escapeHtml(hubSlug) + '/">' + escapeHtml(hubMeta.name) + '</a>';
    }).join('\n    ');

    // Breadcrumb JSON-LD
    const breadcrumb = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com/" },
        { "@type": "ListItem", "position": 2, "name": meta.name }
      ]
    }, null, 2);

    // ItemList JSON-LD for the tools
    const itemList = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": meta.name,
      "numberOfItems": tools.length,
      "itemListElement": tools.slice(0, 50).map(function(tool, i) {
        return {
          "@type": "ListItem",
          "position": i + 1,
          "name": tool.toolName,
          "url": "https://example.com/" + tool.slug + "/"
        };
      })
    }, null, 2);

    // Hub FAQ
    let hubFaqHTML = '';
    const hubFaqs = generateHubFaqs(catKey, meta.name, tools.length);
    if (hubFaqs.length > 0) {
      hubFaqHTML = '<div class="hub-faq">\n    <h2>Frequently Asked Questions</h2>\n';
      hubFaqs.forEach(function(faq) {
        hubFaqHTML += '    <div class="faq-item"><h3>' + faq.q + '</h3><p>' + faq.a + '</p></div>\n';
      });
      hubFaqHTML += '  </div>';
    }

    // Render
    let html = template
      .replace(/\{\{title\}\}/g, meta.name + ' — Free Online Tools')
      .replace(/\{\{metaDescription\}\}/g, 'Free ' + meta.name.toLowerCase() + '. ' + tools.length + ' tools to help you calculate, estimate, and plan. No signup required.')
      .replace(/\{\{keywords\}\}/g, meta.name.toLowerCase() + ', free calculators, online tools')
      .replace(/\{\{domain\}\}/g, 'example.com')
      .replace(/\{\{hubSlug\}\}/g, meta.slug)
      .replace(/\{\{primaryColor\}\}/g, meta.color)
      .replace(/\{\{primaryDarkColor\}\}/g, meta.colorDark)
      .replace(/\{\{categoryName\}\}/g, meta.name)
      .replace(/\{\{hubTagline\}\}/g, meta.tagline)
      .replace(/\{\{hubIntro\}\}/g, meta.intro)
      .replace(/\{\{toolCount\}\}/g, tools.length.toString())
      .replace(/\{\{toolCards\}\}/g, toolCards)
      .replace(/\{\{hubFaqHTML\}\}/g, hubFaqHTML)
      .replace(/\{\{relatedHubLinks\}\}/g, relatedHubs)
      .replace(/\{\{jsonLdBreadcrumb\}\}/g, breadcrumb)
      .replace(/\{\{jsonLdItemList\}\}/g, itemList)
      .replace(/\{\{year\}\}/g, new Date().getFullYear().toString());

    // Write
    const outDir = path.join(OUTPUT_DIR, meta.slug);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
    console.log('  Built: ' + meta.slug + ' (' + tools.length + ' tools)');
    builtCount++;
  });

  console.log('\nDone! Built ' + builtCount + ' hub pages.');
}

function generateHubFaqs(catKey, catName, toolCount) {
  return [
    { q: 'Are these ' + catName.toLowerCase() + ' free?', a: 'Yes, all ' + toolCount + ' calculators are completely free with no signup required. They run entirely in your browser — no data is sent to any server.' },
    { q: 'How accurate are these calculators?', a: 'Our calculators use industry-standard formulas and are regularly updated. However, they provide estimates — always verify critical calculations with a professional in the relevant field.' },
    { q: 'Can I use these calculators on my phone?', a: 'Yes, all calculators are mobile-responsive and work on any device with a web browser. No app download needed.' },
    { q: 'Do you save my calculations?', a: 'No. All calculations happen in your browser. We don\'t store any of your inputs or results. Your data stays on your device.' },
    { q: 'Can I embed these calculators on my website?', a: 'Select calculators offer embed codes that you can copy and paste into your website or blog. Look for the "Embed This Calculator" section on individual tool pages.' }
  ];
}

main();
