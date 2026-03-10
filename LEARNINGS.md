# LEARNINGS.md — SEO Architecture & Build Insights

## SEO Architecture Decisions (March 2026)

### 1. Hub Pages (Category Index Pages)
- Every tool category gets a hub page at `/{category-slug}/` (e.g., `/construction-calculators/`)
- Hub pages contain: intro copy, grid of all tools in category, FAQ, links to other hubs
- Schema: BreadcrumbList + ItemList JSON-LD on every hub
- Purpose: Category pages act as topical authority signals, distribute link equity to child tools, and capture category-level search queries ("construction calculators", "cooking calculators")
- Build: `node generator/build-hubs.js`

### 2. Related Tools (5+ Internal Links Per Page)
- Every tool page links to at minimum 5 related tools using descriptive anchor text
- Priority order: manually curated list > same-category tools > master list relatedTools
- Related tools section uses card-style links with tool name + tagline
- Why 5+: Internal linking is the #1 lever for distributing PageRank. More relevant internal links = faster indexing + stronger topical clusters

### 3. Structured Data (JSON-LD)
- **WebApplication schema** on every tool page (name, description, url, free offer)
- **FAQPage schema** on every tool page (5-8 real FAQ items)
- **BreadcrumbList schema** on every tool page (Home > Category > Tool)
- **ItemList schema** on hub pages (ordered list of all tools)
- FAQ schema qualifies pages for rich results in Google, significantly increasing CTR

### 4. State Variants (50 States × 20 Tools = 1,000 Pages)
**Tools selected for state variants** (criteria: state law/tax/regulation meaningfully changes the result):
1. child-support-estimator — every state has different formulas
2. speeding-ticket-calculator — fines vary wildly by state
3. dui-fine-calculator — penalties are state-specific
4. statute-of-limitations-calculator — timelines vary by state
5. self-employment-tax-calculator — state income tax varies 0-13.3%
6. rent-vs-buy-calculator — property tax, insurance rates vary
7. small-claims-limit-calculator — limits range from $2,500 to $25,000
8. bail-bond-calculator — bail schedules are state-specific
9. solar-payback-calculator — incentives, net metering laws vary
10. ev-vs-gas-calculator — EV incentives, electricity rates vary
11. home-battery-calculator — utility rates, TOU policies vary
12. gig-worker-tax-calculator — state tax obligations vary
13. remote-work-tax-calculator — nexus rules differ by state
14. squatter-rights-calculator — adverse possession laws vary
15. non-compete-checker — enforceability varies dramatically
16. hunting-license-calculator — fees and seasons are state-specific
17. wildfire-risk-calculator — risk profiles are geographic
18. flood-zone-calculator — FEMA zones are location-specific
19. hurricane-insurance-calculator — coastal state specific
20. property-tax-calculator — rates vary by county/state

Build: `node scripts/build-state-variants.js`

### 5. Content Sections for Long-Tail Traffic
- **"How We Calculate This"** — explains the methodology, captures "how is X calculated" queries
- **"When Would You Use This Calculator?"** — captures "when do I need X" queries
- **"How It Works"** (existing) — the operational guide
- **FAQ** (existing, 5-8 items) — captures question-format searches, qualifies for rich results

### 6. Last Updated Dates
- Every tool page displays a "Last updated: YYYY-MM-DD" line
- Stored in config as `lastUpdated` field
- Tools needing annual refresh tracked in this file (see section below)

### 7. Embed Codes (Top 20 Shareable Tools)
- Top 20 tools get an "Embed This Calculator" section with copyable iframe code
- Embeds link back to our domain = free backlinks from bloggers
- Selected tools: tariff-cost, mortgage, compound-interest, body-fat, tdee, bac, calorie-deficit, rent-vs-buy, fire, debt-snowball, meat-smoking, air-fryer-converter, concrete, ai-job-displacement, glp1-weight-loss, biological-age, sleep-cycle, pregnancy-due-date, bmr, macro

---

## Tools Needing Annual Data Refresh

### Quarterly Refresh (data changes frequently)
- tariff-cost-calculator — tariff rates change with policy
- tariff-price-impact-calculator
- made-in-usa-premium-calculator
- ev-vs-gas-calculator — gas prices, electricity rates
- solar-payback-calculator — incentive programs change
- home-battery-calculator — battery prices dropping
- crypto tools — halving dates, staking rates

### Annual Refresh (update at start of each year)
- self-employment-tax-calculator — tax brackets
- gig-worker-tax-calculator — state tax rates
- remote-work-tax-calculator — nexus rules
- rmd-calculator — IRS life expectancy tables
- child-support-estimator state variants — state formulas
- small-claims-limit-calculator — state limits
- hunting-license-calculator — license fees
- dui-fine-calculator — penalty structures
- speeding-ticket-calculator — fine schedules
- bail-bond-calculator — bail schedules

### Biennial Refresh (every 2 years)
- Most construction calculators — material pricing references
- Most cooking calculators — stable formulas, no refresh needed unless UI update
- Fitness calculators — formulas are stable (Mifflin-St Jeor, Katch-McArdle, etc.)

---

## What Makes a Tool Rank

### High-Performing Patterns
1. **Specificity wins** — "meat smoking calculator" outranks "cooking calculator" because searchers want the specific tool
2. **State-specific pages** crush generic pages for legal/financial queries — "Texas child support calculator" has way less competition than "child support calculator"
3. **FAQ schema = rich results** — pages with FAQ schema get expandable answers in SERPs, dramatically increasing CTR
4. **Internal linking clusters** — tools that link to 5+ related tools in the same category index faster and rank higher
5. **Embed backlinks** — every blogger who embeds our calculator creates a dofollow backlink

### Template Patterns That Convert
1. **Immediate value** — calculator above the fold, no scroll needed to start
2. **Presets/defaults** — pre-filled values so users see a result instantly
3. **Before/after comparisons** — tariff calculator showing "before vs after" drives shares
4. **Emotional framing** — "You're losing $X per year" performs better than neutral results
5. **Reference charts** — tables rank independently for featured snippets

### Most Promising Niches (by RPM potential)
1. **Finance/Tax** — $30-80 RPM (insurance, mortgage, tax ads pay premium)
2. **Legal** — $20-50 RPM (lawyer ads are expensive)
3. **Real Estate** — $15-40 RPM
4. **Health/Wellness** — $10-25 RPM
5. **Construction** — $8-20 RPM (building material ads)
6. **Cooking/Lifestyle** — $5-15 RPM (volume play, not RPM)

---

## Virality & Shareability Architecture

### Share System (every tool page)
- **Shareable URL**: Every result generates a URL with query params that pre-populate all inputs. Sharing this link auto-fills the calculator and triggers calculation for the recipient.
- **Canvas Result Image**: Downloads a branded 1200x630 PNG showing the tool name, result values, and site URL. Sized for Twitter/Facebook OG images.
- **Social Share Buttons**: X, Facebook, Reddit — each opens a pre-filled share dialog with result text + shareable URL.
- **Copy Result**: Copies formatted text (tool name + result values + URL) to clipboard.
- **Email Capture**: After results, offers to email the result + notify when underlying data changes. Stored in localStorage segmented by tool category (connect to backend in production).
- **Emotional CTA**: Top 20 emotionally charged tools show "You need to share this. Tag someone who should see their number." above share buttons.

### Top 20 Emotional Tools (aggressive share CTAs)
tariff-cost, tariff-price-impact, ai-job-displacement, rent-vs-buy, fire, debt-snowball, calorie-deficit, body-fat, bac, biological-age, glp1-weight-loss, self-employment-tax, child-support, dui-fine, speeding-ticket, bail-bond, wildfire-risk, flood-zone, hurricane-insurance, squatter-rights

### Sharing Conversion Tracking (implement when traffic arrives)
- Track clicks on each share button type (X, FB, Reddit, Copy, Download)
- Track email capture rate per tool category
- Track shareable URL visits (UTM params or referrer tracking)
- Log findings here once data is available

---

## Build Pipeline Commands
```bash
# Enrich all configs with new SEO fields
node scripts/enrich-configs.js

# Build all hub pages
node generator/build-hubs.js

# Build state variants (creates 1,000 state-specific configs)
node scripts/build-state-variants.js

# Build all HTML output
node generator/build.js

# Run SEO audit
node scripts/site-audit.js

# Gap analysis
node scripts/gap.js

# Build homepage, sitemap, robots.txt, privacy, terms
node generator/build-homepage.js
node generator/build-sitemap.js
```
