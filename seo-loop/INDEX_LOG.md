# CrunchMilk SEO Loop — Run Log (the compounding memory)

Newest entry at the TOP. Every run appends one entry. Read this before doing
anything. This is what makes the loop compound instead of repeating itself.

---

## Run 1 — 2026-07-13 — De-template the 15 highest-demand pages

**Hypothesis:** The pages Google refuses to index share one templated prose
skeleton. Rewriting the pages that ALREADY get impressions into genuinely unique,
expert content should be what finally earns them into the index. Start where
demand is proven so we can see movement fastest.

**What shipped (branch `seo-loop/2026-07-13`, 15 pages):**
batt-insulation, oil-price-gas-pump, road-trip-fuel, student-loan-repayment,
cost-per-mile, wind-speed-converter, social-security-benefit, raised-bed-soil,
sonotube, safe-withdrawal-rate, freelance-rate, silver-dollar-melt-value,
twitch-earnings, laminate-flooring, concrete-block-fill.

For each, rewrote the `contentIntro`, `howItWorks`, `howWeCalculate`, `whenToUse`,
`tips`, `howToSteps`, and `faq` fields into ~800–1,450 words of unique, tool-
specific prose with a concrete worked example and real numbers. Calculator HTML,
titles, meta, and keywords untouched. Verified: all 15 valid JSON, zero shared
boilerplate phrases remain in the rendered HTML, sitemap `lastmod` bumped for
recrawl. (Fixed a double-escape bug where 2 pages used HTML entities → Unicode.)

**Method note:** used 15 parallel domain-expert subagents (one per page), each
banned from the shared template phrases. This is the repeatable engine for future
batches.

**Next run (Run 2) should check FIRST:**
1. In GSC → Indexing, did any of these 15 slugs move to "Indexed"? (the real test)
2. Did impressions/position on these 15 improve vs the 2026-07-13 baseline?
Then: either (a) if indexing moved, expand — de-template the next 20 demand pages;
or (b) if not, add authority signals (internal links from hubs into these 15,
request indexing on them in GSC) before widening. Also begin pruning: noindex or
consolidate the long tail of zero-demand duplicate pages so crawl budget
concentrates on the good ones.

**Action needed from Andy:** merge the PR (deploys via Cloudflare), then in GSC use
"Request indexing" on 3–4 of these URLs to prod a recrawl. Drop a fresh GSC export
into `seo-loop/data/<next-date>/` before Run 2.

---

## Run 0 — 2026-07-13 — BASELINE + diagnosis (no changes shipped)

**Metrics (from GSC export dated 2026-06-29 + performance export ~March):**
- Indexed pages: **1**
- Discovered – currently not indexed: ~2,020
- Crawled – currently not indexed: 1–1,999 (varies by snapshot)
- Excluded by 'noindex' tag: 61
- Alternate page w/ canonical: 2–11 · Not found (404): 3
- Performance (older 3-mo window): 11 clicks, 2,187 impressions; 11 pages ever
  got a click, ~100 pages got ≥1 impression.
- Domain age: created 2026-03-10 (~4 months). Last deploy commit: fd24f14 (Mar 16).

**Diagnosis:** Not a technical/thin-content problem. Pages have 700–1,100 words,
correct canonical, JSON-LD, no stray noindex. The problem is that all ~2,200
pages share ONE prose template with nouns swapped ("The [X] is a free online tool
designed for [audience]…"). Google reads them as near-duplicate boilerplate and
declines to index. Compounded by a 4-month-old zero-authority domain that
published 2,200 pages at once.

**Highest-opportunity pages right now** (already getting impressions despite not
being indexed — these are where demand exists):
- wind-speed-converter (68 impr, pos 16)
- social-security-benefit-calculator (68 impr, pos 66)
- laminate-flooring-calculator (36 impr, pos 50)
- ovulation-calculator (24 impr, pos 83)
- boat-fuel-calculator (16 impr, pos 8.8)
- ai-detection-score-calculator, fertilizer-cost-per-acre-calculator,
  biorhythm-calculator (31 impr), student-loan / brick / insulation calculators
  (all from Queries.csv — real search demand we're not capturing).

**Hypothesis for Run 1:** De-template the ~20 highest-impression pages into
genuinely unique, best-answer content + tighten internal links into them, and
noindex/prune a slice of demand-free duplicates. Expect indexed count to start
moving on THIS batch first. (Pending Andy's go-ahead on scope.)

**Repo note:** Loop operates on the LOCAL clone at `~/dev/crunchmilk` (off
iCloud). The old iCloud copy at
`~/Library/Mobile Documents/.../Desktop/micro-site-empire` is stale — do not edit.

**Next run should check:** did any of the ~20 batch pages move from
"discovered/crawled – not indexed" to "indexed"? That's the whole ballgame.
