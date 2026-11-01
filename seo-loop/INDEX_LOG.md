# CrunchMilk SEO Loop — Run Log (the compounding memory)

Newest entry at the TOP. Every run appends one entry. Read this before doing
anything. This is what makes the loop compound instead of repeating itself.

---

## Run 2 — 2026-11-01 — Finish the demand tier (final 18) — NO FRESH DATA

**Data check (do this first, honestly):** `seo-loop/data/` still has only the
`2026-07-13` export — no newer folder was dropped since Run 1e on 2026-07-13.
This run could NOT verify whether any of the 75 previously-shipped pages
(Runs 1/1b/1c/1d/1e) moved from "discovered/crawled — not indexed" to
"Indexed," and could NOT check impressions/position movement. **That check
is still the most important thing for the next run to do, and it has now
been deferred across two runs.** Andy: please drop a fresh GSC export
(Performance `Pages.csv`/`Queries.csv` + Indexing export) into
`seo-loop/data/<today>/` before the next run — the loop is flying blind on
its primary metric without it.

**Hypothesis:** With no new data to react to, the highest-value, lowest-risk
move is to finish the one well-defined task already queued from Run 1e: the
~18-page tail of 1–2-impression demand pages that was explicitly left for
"the monthly routine." Completing it closes out the content-tier lever
entirely, so whatever the next data pull shows, we'll know the content tier
is 100% done and any remaining non-indexing is NOT explained by "some pages
still templated."

**Shipped (branch `seo-loop/2026-11-01`, 18 pages — the full remaining tail
from `Pages.csv`'s 1–2 impression rows, mapped to existing configs):**
halloween-candy-cost, shotgun-choke-spread, stock-market-drop-401k,
daily-mood-score, candle-wax, fuel-hedging, seed-oil-intake, sea-level-rise,
trademark-filing-cost, diesel-cost-per-mile, social-connection-health,
rv-campground-budget, smart-contract-gas-cost, inflation-purchasing-power,
work-life-balance, health-insurance-premium, freelance-hourly-rate,
australia-stamp-duty. Each page's present prose fields only (some configs
only had contentIntro/howItWorks/faq — those fields only) were rewritten into
800+ words (most landed 1,300–2,400 words) of genuinely unique, topic-expert
content with a concrete worked example with real numbers each. YMYL pages
(daily-mood-score, seed-oil-intake, social-connection-health,
work-life-balance, health-insurance-premium) carry natural, non-boilerplate
not-a-diagnosis/not-advice framing. All 18 configs verified valid JSON, zero
banned boilerplate phrases in rendered `output/<slug>/index.html`, real
Unicode math symbols (no HTML entities). `lastUpdated` set to 2026-11-01;
sitemap rebuilt (lastmod bump → recrawl signal).

**Running total: 93 of ~99 demand pages de-templated — the content tier is
now effectively complete.** One page was deliberately skipped, not missed:
`heat-index-calculator` duplicates `heat-index-temperature-calculator`
(already de-templated in Run 1d) — per the standing cannibalization note
below, it needs a 301/canonical consolidation, not a second unique rewrite,
and that's still unresolved.

**DECISION — this closes the content-tier era.** Per Run 1e's plan, the next
lever is the PRUNE: ~1,800 zero-impression templated pages are index bloat
diluting crawl budget/site-quality signal. **Next run should, in order:**
1. Check the (hopefully by-then fresh) GSC data: did indexed count move off
   1? Did any of the 93 de-templated pages flip to "Indexed"? This is the
   whole ballgame and has now been unchecked for 2+ runs.
2. If indexed count is still ~1 despite 93 genuinely unique pages, that is
   itself a strong signal the content tier alone isn't sufficient — proceed
   to design the `noindex` capability (config flag → base template
   `<meta robots noindex>`) and apply it to a first batch of the
   lowest-value templated pages, staged as its own PR for a human look
   (per the guardrail: consequential, reversible, needs a human eyeball).
3. Resolve the heat-index-calculator / heat-index-temperature-calculator
   duplicate (canonical or 301 one into the other).

---

## Run 1e — 2026-07-13 — Finish the demand tier (15 more, same day)

**Shipped (branch `seo-loop/2026-07-13-e`, 15 pages):**
focal-length-crop, candle-fragrance, print-size, overtime-worth,
canada-provincial-tax, uk-student-loan-repayment, postpartum-recovery,
label-sheet, integer-operations, gratitude-practice-benefits,
dog-walking-calories, decibel, crypto-portfolio-rebalance, baby-formula,
ai-agent-cost. YMYL pages (postpartum, baby-formula) carry not-advice
disclaimers. Some configs only had a subset of prose fields (contentIntro/faq/
howItWorks) — agents correctly edited only fields present.

**Running total: 75 of ~99 demand pages de-templated.** Only a ~19-page tail of
1–2 impression pages remains — LOW ROI, left for the monthly routine.

**DECISION — content tier is essentially done. Next lever is the PRUNE:**
~1,800 zero-impression templated tool pages are index bloat dragging site-wide
quality/crawl-budget. Plan: add a `noindex` capability (config flag → base
template `<meta robots noindex>`), set it on zero-demand templated pages, drop
them from the sitemap. This is CONSEQUENTIAL (hides most of the site from Google)
though reversible — stage as its own PR for a human look before merging, unlike
the auto-merged content batches. Also: consolidate the heat-index dup.

---

## Run 1d — 2026-07-13 — De-template the next 15 demand pages (same day)

**Shipped (branch `seo-loop/2026-07-13-d`, 15 pages):**
homebrew-abv, wildfire-risk, off-grid-battery, heat-index-temperature,
dew-point-from-humidity, ai-detection-score, print-resolution-megapixel,
motor-horsepower, fertilizer-cost-per-acre, bullet-drop-ballistic,
food-truck-profit, crypto-whale-alert, side-hustle-income,
precious-metal-storage-cost, gravitational-force. Valid JSON, zero boilerplate.

**Running total: 60 of ~99 demand pages de-templated.** ~39 low-impression
(≤6) demand pages remain, then the PRUNE of ~1,800 zero-demand templated pages.

**Cannibalization note for a future run:** `heat-index-temperature-calculator`
AND `heat-index-calculator` both exist and target the same query — consolidate
(301/canonical one into the other) rather than compete.

---

## Run 1c — 2026-07-13 — De-template the next 15 demand pages (same day)

**Shipped (branch `seo-loop/2026-07-13-c`, 15 pages):**
box-size, muzzle-energy, uk-pension (actually a WORKPLACE pension tool — agent
matched prose to the real calculator), sourdough-starter, cmu-wall,
cattle-fencing, ai-job-displacement, swimming-pace, boat-fuel, plant-spacing,
wilks-score, water-heater-sizing, travel-visa-cost, interstate-migration,
ink-cost-per-page. ~700–1,500 words unique expert prose each; valid JSON, zero
boilerplate in output.

**Running total: 45 of ~99 demand pages de-templated.** ~54 demand pages left
(tail of the impressions list: homebrew-abv, wildfire-risk, off-grid-battery,
heat-index, dew-point, ai-detection-score, motor-horsepower, and the long ≤8-impr
tail). Then move to PRUNE of the ~1,800 zero-demand templated pages.

---

## Run 1b — 2026-07-13 — De-template the next 15 demand pages (same day)

**Hypothesis:** Same as Run 1 — don't wait a month; de-template more proven-demand
pages now. Target the next 15 by impressions (after the first 15), biased toward
winnable non-YMYL niches (construction/DIY/hobby) plus a few high-demand YMYL
pages that are actively hurt by being templated.

**Shipped (branch `seo-loop/2026-07-13-b`, 15 pages):**
biorhythm, rv-propane, medication-half-life, vo2-max, quilt-backing,
business-license-fee, brick, filament-cost, population-growth, epoxy-floor,
drain-slope, plywood, ovulation, steps-to-calories, home-battery.
~800–1,450 words of unique expert prose each; worked examples; medical/YMYL pages
(medication-half-life, vo2-max, ovulation) carry "estimate, not advice"
disclaimers. Verified valid JSON, zero boilerplate in output, entities→Unicode.

**Running total: 30 of ~99 demand pages de-templated.** Remaining demand pages
(~69) for future same-day batches or the monthly routine: uk-pension,
sourdough-starter, cmu-wall, cattle-fencing, ai-job-displacement, box-size,
muzzle-energy, + the tail of the 99-with-impressions list.

**Note:** brick-calculator's `howItWorks` was pre-baked HTML (already brick-
specific), left as-is; only the other prose fields changed.

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
