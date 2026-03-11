#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.resolve(__dirname, '..', 'output');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Lightweight helper – grab the first match of a regex, or null. */
function firstMatch(html, regex) {
  const m = html.match(regex);
  return m ? m[1] : null;
}

/** Extract *all* matches (capture group 1) into an array. */
function allMatches(html, regex) {
  const results = [];
  let m;
  const re = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g');
  while ((m = re.exec(html)) !== null) {
    results.push(m[1]);
  }
  return results;
}

/** Get content attribute value from a meta tag by name or property. */
function metaContent(html, attr, value) {
  // Handles both name="..." and property="..."
  const re = new RegExp(
    '<meta\\s+[^>]*?' + attr + '=["\']' + escapeRegex(value) + '["\'][^>]*?>',
    'i'
  );
  const tag = html.match(re);
  if (!tag) return null;
  const contentMatch = tag[0].match(/content=["']([^"']*?)["']/i);
  return contentMatch ? contentMatch[1] : null;
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ---------------------------------------------------------------------------
// Checks
// ---------------------------------------------------------------------------

function auditPage(slug, html) {
  const errors = [];
  const warnings = [];

  // === SEO CHECKS ===

  // <title>
  const title = firstMatch(html, /<title>([^<]*)<\/title>/i);
  if (!title || title.trim() === '') {
    errors.push('Missing or empty <title> tag');
  } else if (title.length > 70) {
    errors.push(`<title> too long (${title.length} chars, max 70)`);
  }

  // <meta name="description">
  const desc = metaContent(html, 'name', 'description');
  if (!desc || desc.trim() === '') {
    errors.push('Missing or empty meta description');
  } else if (desc.length > 160) {
    errors.push(`Meta description too long (${desc.length} chars, max 160)`);
  }

  // <link rel="canonical">
  const canonicalMatch = html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*>/i);
  if (!canonicalMatch) {
    errors.push('Missing <link rel="canonical">');
  } else {
    const href = canonicalMatch[0].match(/href=["']([^"']*?)["']/i);
    if (href && /example\.com/i.test(href[1])) {
      warnings.push('Canonical URL contains "example.com" — likely placeholder');
    }
  }

  // Open Graph
  const ogChecks = ['og:title', 'og:description', 'og:type', 'og:url'];
  for (const og of ogChecks) {
    const val = metaContent(html, 'property', og);
    if (!val || val.trim() === '') {
      errors.push(`Missing Open Graph tag: ${og}`);
    } else if ((og === 'og:url') && /example\.com/i.test(val)) {
      warnings.push(`${og} contains "example.com" — likely placeholder`);
    }
  }

  // Twitter Card
  const twChecks = ['twitter:card', 'twitter:title'];
  for (const tw of twChecks) {
    const val = metaContent(html, 'name', tw);
    if (!val || val.trim() === '') {
      errors.push(`Missing Twitter Card tag: ${tw}`);
    }
  }

  // robots meta
  const robots = metaContent(html, 'name', 'robots');
  if (!robots) {
    errors.push('Missing <meta name="robots">');
  }

  // JSON-LD
  const jsonLdBlocks = html.match(/<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi) || [];
  if (jsonLdBlocks.length === 0) {
    errors.push('Missing JSON-LD structured data');
  } else {
    const hasWebApp = jsonLdBlocks.some(b => /WebApplication/i.test(b));
    const hasFaq = jsonLdBlocks.some(b => /FAQPage/i.test(b));
    const hasBreadcrumb = jsonLdBlocks.some(b => /BreadcrumbList/i.test(b));
    if (!hasWebApp) warnings.push('Missing WebApplication JSON-LD');
    if (!hasFaq) warnings.push('Missing FAQPage JSON-LD');
    if (!hasBreadcrumb) warnings.push('Missing BreadcrumbList JSON-LD');
  }

  // Heading hierarchy
  const h1s = html.match(/<h1[\s>]/gi);
  if (!h1s || h1s.length === 0) {
    errors.push('No <h1> tag found');
  } else if (h1s.length > 1) {
    errors.push(`Multiple <h1> tags found (${h1s.length})`);
  }
  const h2s = html.match(/<h2[\s>]/gi);
  if (!h2s || h2s.length === 0) {
    errors.push('No <h2> tags found');
  }

  // lang attribute on <html>
  const htmlTag = html.match(/<html\s[^>]*lang=["'][^"']+["']/i);
  if (!htmlTag) {
    errors.push('Missing lang attribute on <html>');
  }

  // viewport meta
  const viewport = metaContent(html, 'name', 'viewport');
  if (!viewport) {
    errors.push('Missing viewport meta tag');
  }

  // === FUNCTIONALITY CHECKS ===

  // Interactive element (skip for hub/category pages)
  const isHubPage = /tool-grid|tool-card/i.test(html);
  const hasButton = /<button[\s>]/i.test(html);
  const hasInput = /<input[\s>]/i.test(html);
  if (!hasButton && !hasInput && !isHubPage) {
    errors.push('No <button> or <input> found — page may not be interactive');
  }

  // Script with actual JS logic
  const scriptBlocks = allMatches(html, /<script(?:\s[^>]*)?>([^]*?)<\/script>/gi);
  const jsBlocks = scriptBlocks.filter(function (block) {
    // Exclude JSON-LD and empty blocks
    return block.trim().length > 0 && !block.trim().startsWith('{');
  });
  if (jsBlocks.length === 0 && !isHubPage) {
    errors.push('No <script> with JS logic found');
  }

  // IIFE or strict mode check
  const hasIIFE = jsBlocks.some(function (block) {
    return /\(function\s*\(/.test(block) || /\(\(\)\s*=>/.test(block);
  });
  const hasStrict = jsBlocks.some(function (block) {
    return /['"]use strict['"]/.test(block);
  });
  if (jsBlocks.length > 0 && !hasIIFE && !hasStrict && !isHubPage) {
    errors.push('JS is not wrapped in IIFE or "use strict" — potential global pollution');
  }

  // === QUALITY CHECKS ===

  // Empty divs with id but no content that should be JS-rendered
  // Look for <div id="..."></div> (nothing between tags or only whitespace)
  const emptyDivs = html.match(/<div\s+[^>]*id=["'][^"']+["'][^>]*>\s*<\/div>/gi);
  if (emptyDivs && emptyDivs.length > 0) {
    // Filter out known acceptable patterns (e.g., result containers that start hidden)
    const suspicious = emptyDivs.filter(function (d) {
      // Acceptable if it has a role or aria attribute (likely a live region filled by JS)
      return !/role=|aria-/i.test(d);
    });
    if (suspicious.length > 0) {
      warnings.push('Empty <div> with id found (may be JS-rendered): ' + suspicious.length + ' instance(s)');
    }
  }

  // Footer
  if (!/<footer[\s>]/i.test(html)) {
    errors.push('Missing <footer>');
  }

  // Ad slot placeholders
  if (!/ad[-_\s]?slot|ad[-_\s]?space/i.test(html)) {
    errors.push('No ad slot placeholders found');
  }

  // Related Tools section
  if (!/related\s+tools/i.test(html)) {
    warnings.push('No "Related Tools" section found');
  }

  // Breadcrumb nav
  if (!/class=["']breadcrumb["']/i.test(html)) {
    warnings.push('No breadcrumb navigation found');
  }

  // Last Updated
  if (!/last.updated/i.test(html)) {
    warnings.push('No "Last Updated" date found');
  }

  // How We Calculate section
  if (!/how\s+we\s+calculate/i.test(html)) {
    warnings.push('No "How We Calculate" section found');
  }

  // When Would You Use section
  if (!/when\s+would\s+you\s+use/i.test(html)) {
    warnings.push('No "When Would You Use" section found');
  }

  return { slug, errors, warnings };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const specificSlug = process.argv[2] || null;

  let dirs;
  if (specificSlug) {
    const target = path.join(OUTPUT_DIR, specificSlug);
    if (!fs.existsSync(target)) {
      console.error(`Error: "${specificSlug}" not found in ${OUTPUT_DIR}`);
      process.exit(1);
    }
    dirs = [specificSlug];
  } else {
    if (!fs.existsSync(OUTPUT_DIR)) {
      console.error(`Error: output directory not found at ${OUTPUT_DIR}`);
      process.exit(1);
    }
    dirs = fs.readdirSync(OUTPUT_DIR).filter(function (d) {
      return fs.statSync(path.join(OUTPUT_DIR, d)).isDirectory();
    });
  }

  let totalPages = 0;
  let passCount = 0;
  let failCount = 0;
  const allResults = [];

  for (const slug of dirs) {
    const indexPath = path.join(OUTPUT_DIR, slug, 'index.html');
    if (!fs.existsSync(indexPath)) {
      console.warn(`  SKIP  ${slug} — no index.html`);
      continue;
    }

    // Skip non-tool pages (privacy, terms, about, contact)
    const SKIP_SLUGS = ['privacy', 'terms', 'about', 'contact', 'press', 'sitemap'];
    if (SKIP_SLUGS.includes(slug)) {
      continue;
    }
    const html = fs.readFileSync(indexPath, 'utf8');
    if (/noindex/i.test(html)) {
      continue;
    }

    totalPages++;
    const result = auditPage(slug, html);
    allResults.push(result);

    if (result.errors.length === 0) {
      passCount++;
    } else {
      failCount++;
    }
  }

  // ---------------------------------------------------------------------------
  // Output
  // ---------------------------------------------------------------------------

  console.log('');
  console.log('=== SITE AUDIT REPORT ===');
  console.log('');
  console.log(`Total pages scanned: ${totalPages}`);
  console.log(`  PASS: ${passCount}`);
  console.log(`  FAIL: ${failCount}`);
  console.log('');

  // Failing pages
  const failing = allResults.filter(function (r) { return r.errors.length > 0; });
  if (failing.length > 0) {
    console.log('--- FAILURES ---');
    for (const r of failing) {
      console.log('');
      console.log(`  [FAIL] ${r.slug}`);
      for (const e of r.errors) {
        console.log(`    ✗ ${e}`);
      }
    }
    console.log('');
  }

  // Warnings (all pages)
  const withWarnings = allResults.filter(function (r) { return r.warnings.length > 0; });
  if (withWarnings.length > 0) {
    console.log('--- WARNINGS ---');
    for (const r of withWarnings) {
      console.log('');
      console.log(`  [WARN] ${r.slug}`);
      for (const w of r.warnings) {
        console.log(`    ! ${w}`);
      }
    }
    console.log('');
  }

  // Passing pages
  const passing = allResults.filter(function (r) { return r.errors.length === 0; });
  if (passing.length > 0) {
    console.log('--- PASSING ---');
    for (const r of passing) {
      const warnSuffix = r.warnings.length > 0 ? ` (${r.warnings.length} warning(s))` : '';
      console.log(`  [PASS] ${r.slug}${warnSuffix}`);
    }
    console.log('');
  }

  // Exit code
  process.exit(failCount > 0 ? 1 : 0);
}

main();
