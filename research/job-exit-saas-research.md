# Job Exit Planning SaaS — Comprehensive Market Research Report
**Date: March 12, 2026**

---

## Table of Contents
1. [Competitive Landscape](#1-competitive-landscape)
2. [Available APIs & Data Sources](#2-available-apis--data-sources)
3. [Market Size & Demand](#3-market-size--demand)
4. [Viral Mechanics Research](#4-viral-mechanics-research)
5. [Monetization Research](#5-monetization-research)
6. [Name Ideas & Domain Strategy](#6-name-ideas--domain-strategy)

---

## 1. Competitive Landscape

### KEY FINDING: No Direct Competitor Exists
After extensive research, **no single product combines financial runway planning with career transition planning, side hustle recommendations, and a quit-date countdown**. This is a genuine whitespace opportunity. Competitors exist in adjacent categories but none unify the concept.

### A. Financial Runway / Planning Tools

| Product | What It Does | Pricing | Weaknesses |
|---------|-------------|---------|------------|
| **ProjectionLab** | FIRE-focused financial planning with Monte Carlo simulations, tax optimization, milestone tracking | $109/year ($9/mo) | No career planning, no side hustle recs, no "quit date" concept — purely retirement-focused |
| **Expense Sorted** | Google Sheets runway calculator — savings ÷ expenses = months of freedom | $10 one-time | Spreadsheet-based, no automation, no bank connection, no career element |
| **Runway 2.0** (Vercel app) | Simple web calculator for financial projections | Free | Bare-bones, no account linking, no career features, hobbyist project |
| **Monarch Money** | Full personal finance dashboard — budgeting, investments, net worth, cash flow forecasting | $99/year ($14.99/mo monthly) | No career planning, no runway concept, no quit-date feature |
| **Copilot Money** | AI-powered budgeting with smart categorization, investment tracking | $95/year ($13/mo monthly) | Apple-only, no career features, no runway planning |
| **Cleo** | AI chatbot financial assistant for Gen Z — budgeting, cash advances | Freemium + subscriptions | Targets paycheck-to-paycheck users, no career transition features |
| **YNAB** | Zero-based budgeting methodology | $99/year | Budgeting-only, steep learning curve, no career/runway planning |
| **Empower (Personal Capital)** | Investment tracking, retirement planning, net worth | Free (upsells advisory at 0.89% AUM) | Deteriorating product, aggressive upsells, no career planning |

### B. FIRE Movement Calculators

| Product | What It Does | Pricing | Weaknesses |
|---------|-------------|---------|------------|
| **The FIRE Calculator** (thefirecalculator.com) | Calculate FIRE number across Lean/Fat/Coast/Barista FIRE | Free | Calculator only, no ongoing tracking, no career pivot |
| **Playing With FIRE** (playingwithfire.co) | Suite of retirement calculators | Free | Content/calculator site, not a SaaS product |
| **WalletBurst** | FIRE calculator + Coast FIRE calculator | Free | Simple calculators, no app |
| **InvestingFIRE** | Retirement simulation with accumulation/withdrawal phases | Free | Simulation-only, no bank connections |

### C. Career Transition / Job Search Platforms

| Product | What It Does | Pricing | Weaknesses |
|---------|-------------|---------|------------|
| **Teal** | Career growth platform — resume builder, job CRM, LinkedIn optimizer, AI interview prep | Free tier / $29/mo premium | Job *search* focused, not job *exit* planning. No financial runway component |
| **Careerflow** | AI job search tools — resume builder, job tracker, networking CRM | Free tier / $23.99/mo premium | Same gap — helps you find next job, doesn't help you plan the exit |
| **LinkedIn** | Professional networking, job search, salary insights | Free / Premium $29.99-$59.99/mo | Platform, not a planning tool |
| **Amatum** | Career pivot courses and skill assessments | Course-based pricing | Education platform, not a planning dashboard |

### D. Side Hustle / Freelance Platforms

| Product | What It Does | Pricing | Weaknesses |
|---------|-------------|---------|------------|
| **Upwork** | Freelance marketplace | Free to join, service fees | Marketplace, not a planning tool |
| **Fiverr** | Freelance marketplace | Free to join, service fees | Same — no income projection, no career planning |
| **Contra** | Portfolio-based freelance platform | Free | No financial planning integration |

### E. Career Coaching Services

| Provider | Pricing | Format |
|----------|---------|--------|
| Traditional career coaches | $75-$250/session | 1-on-1 sessions |
| Package programs | $600-$3,000 for 3-6 month programs | Structured programs |
| Premium coaching (BetterUp, etc.) | $3,000-$5,000+ for 3-6 months | Enterprise-focused |
| HiCounselor | $10,000+ (income-share at 9-14%) | Intensive with placement |

**Coaching is expensive and unscalable — a SaaS tool that provides 80% of the value at 1% of the cost is the opportunity.**

### Competitive Summary

The market is **fragmented**:
- Financial tools don't touch career planning
- Career tools don't touch financial planning
- FIRE tools target retirement, not career transitions
- Coaching is expensive and manual

**Nobody is building the "quit your job" dashboard.**

---

## 2. Available APIs & Data Sources

### A. Plaid API (Financial Data) — PRIMARY INTEGRATION

**What you can pull:**
- **Transactions**: 24 months of history with AI-categorized data (merchant, category, geolocation). As of Dec 2025, 20% higher accuracy on subcategories
- **Balances**: Real-time current and available balance, historical balance data, account type/status
- **Income**: Multiple income sources, employment verification, pre/post-tax income (current year + projected), number of income streams
- **Investments**: Holdings, balances, and transactions across brokerage accounts
- **Liabilities**: Credit card, student loan, mortgage data
- **Assets**: Full asset reports for underwriting
- **Identity**: Account holder name, email, phone, address

**Pricing:**
- Free tier: 200 API calls per product (good for prototyping)
- Pay-as-you-go: Per-request pricing, no commitment
- Growth: 12-month commitment, discounted rates
- Custom: Volume pricing, contact sales
- Billing models: One-time per connection, monthly subscription per account, or per-request fees

**Developer experience:** Excellent. Quickstart repos, SDKs in multiple languages, Plaid Link drop-in UI for bank connections. The gold standard for fintech developer onboarding.

**Verdict:** Essential. This is how you auto-calculate someone's runway without manual entry.

### B. Bureau of Labor Statistics (BLS) API — FREE SALARY DATA

**What's available:**
- Wage data by occupation for 800+ occupations
- National, state, regional, and metro-area data
- Employment projections and growth rates
- Consumer Price Index (inflation data)
- Cost of living indices

**Pricing:** Completely free
- Version 1.0: No registration, limited queries
- Version 2.0: Free registration, higher limits, net/percent changes, series descriptions

**Caveat:** Requires knowledge of BLS Series IDs. Data is aggregated (not real-time job listings).

**Verdict:** Essential for salary benchmarking and career pivot income projections. Free and authoritative.

### C. O*NET API — CAREER SKILLS & OCCUPATIONAL DATA

**What's available:**
- 900+ occupation profiles covering 55,000+ jobs
- Skills, knowledge, abilities, and technology skills per occupation
- Skills gap analysis between two occupations (via CareerOneStop)
- Task descriptions, work activities, work context
- Education/training requirements
- Related occupations

**Pricing:** Free (requires registration for web services)

**Verdict:** Critical for the career pivot feature. Can map someone's current skills to adjacent careers and identify skill gaps. Combined with BLS salary data, you can show "if you learn X, you can earn $Y."

### D. LinkedIn API — RESTRICTED

**Current status:** Heavily restricted. Talent API only available to LinkedIn-certified partners. No public salary data API.

**Alternatives:**
| Provider | Data | Pricing |
|----------|------|---------|
| **Proxycurl** | Profile data, company data | Per-request pricing, affordable |
| **Coresignal** | 823M+ profiles, 74M+ companies, 399M+ job postings | Enterprise pricing |
| **Netrows** | 48+ LinkedIn endpoints (profiles, companies, jobs, posts) | API access |
| **People Data Labs** | Professional profile enrichment | Per-request |

**Verdict:** Skip official LinkedIn API. Use BLS + O*NET for salary/career data instead. Consider Proxycurl for profile enrichment if needed later.

### E. Glassdoor API — DEPRECATED

**Status:** Public API closed in 2021. Only employers get limited access.

**Alternatives for salary data:**
- Coresignal (company profiles, reviews, salary data)
- Bright Data (flexible datasets)
- Bloomberry (multi-source, free trial)
- Piloterr (job salary scraper API)

**Verdict:** Not worth pursuing. BLS data is more authoritative and free.

### F. Indeed API — LIMITED

**Status:** Publisher Jobs API (job search) is deprecated. Only Job Sync API remains, designed for ATS partners to post/manage jobs. Not available for direct developers.

**Verdict:** Not useful for this product. Use BLS + O*NET instead.

### G. Cost of Living / Rent APIs

| API | Data | Pricing |
|-----|------|---------|
| **Numbeo** | Global cost of living by city/country, rent prices, quality of life | API access (contact for pricing) |
| **LivingCost.net** | Real-time cost of living datasets | API access |
| **Rentometer** | Rent data for US addresses | $199/year (Pro), volume pricing available |
| **RentCast** | Property data, rent trends, market averages | Free (50 calls/mo), paid plans from ~$20/mo |
| **ATTOM** | 158M US properties, comprehensive property data | From $95/mo |

**Verdict:** RentCast (free tier) + Numbeo would give you excellent cost-of-living projections for different cities. Useful for "if you move to X, your runway extends by Y months."

### H. Upwork API — FREELANCE DATA

**Available data:** Job postings, contracts, freelancer profiles
**Rate limits:** 40K requests/day
**Access:** Requires application, reviewed within 2 weeks. Commercial use requires partner approval.

**Verdict:** Useful for showing "freelancers in your field earn $X/hour" but access is restricted. Consider scraping aggregated data or using salary surveys instead.

### I. AI/LLM APIs — FOR PERSONALIZED RECOMMENDATIONS

**Current pricing (March 2026):**

| Provider | Model | Input/Output per 1M tokens |
|----------|-------|---------------------------|
| **OpenAI** | GPT-5 mini | $0.25 / $2.00 |
| **OpenAI** | GPT-5.2 | $1.75 / $14.00 |
| **Anthropic** | Claude Haiku | $0.25 / $1.25 |
| **Anthropic** | Claude Sonnet 4.6 | $3.00 / $15.00 |
| **Google** | Gemini Flash | $0.30 / $2.50 |
| **Google** | Gemini Flash-Lite | $0.10 / $0.40 |
| **DeepSeek** | Various | Rock-bottom pricing |

**Use case:** Power the personalized "exit plan" — analyze someone's skills, financial situation, and goals to generate customized side hustle recommendations, career pivot suggestions, and timeline advice.

**Cost optimization:** Use GPT-5 mini or Gemini Flash-Lite for standard recommendations (~$0.10-0.25 per 1M input tokens). Use Claude Sonnet or GPT-5.2 for premium/detailed analysis.

**Verdict:** Essential. The AI layer is what transforms this from a calculator into a personalized advisor. Keep costs low with smaller models for 90% of use cases.

### Recommended API Stack (MVP)

| Purpose | API | Cost |
|---------|-----|------|
| Bank connections + auto-calculations | **Plaid** | Free for 200 calls, then per-request |
| Salary/occupation data | **BLS API** | Free |
| Career skills mapping | **O*NET** | Free |
| Cost of living | **RentCast** | Free (50/mo) |
| AI personalization | **OpenAI GPT-5 mini** or **Gemini Flash-Lite** | ~$0.10-0.25/1M tokens |

**Total MVP API cost: Nearly $0 until you hit scale.**

---

## 3. Market Size & Demand

### A. The Addressable Market Is Massive

**Workers who want to quit:**
- **60% of workers** planned to look for new jobs in 2025 (ResumeTemplates.com)
- **1 in 3 people** will quit even without another job lined up
- **35.9% of workers** quit a job in the past year
- **77% of employees** are either "not engaged" or "actively disengaged" (Gallup: 59% + 18%)
- **Only 18%** of US employees say they are "very satisfied" — the lowest level EVER recorded (Gallup's "Great Detachment")
- **51% of North American workers** feel less satisfied than 5 years ago

**US workforce context:**
- ~165 million in the US labor force
- 60% considering new jobs = ~99 million potential users
- Even 0.1% conversion = 99,000 paying customers

### B. The "Great Detachment" — Perfect Timing

The market has shifted from the "Great Resignation" (2021-2022) to the "Great Detachment" (2025-2026):
- Workers are NOT quitting because the job market is tight
- But dissatisfaction is at record highs
- They're "job hugging" — staying in jobs they hate because switching doesn't pay
- The pay premium for job switching has collapsed: 1.9 percentage points (down from 8-10 during Great Resignation peak)
- **Pent-up demand**: Experts predict another wave of resignations when the market improves
- Job openings fell to 6.5M in Dec 2025 (down from 12M+ peak in March 2022)

**This is the IDEAL moment for a "plan your exit" tool** — people want to leave but feel trapped. They need a plan, not just motivation.

### C. Adjacent Market Sizes

| Market | Size | Growth |
|--------|------|--------|
| **Personal finance apps** | $31.7B (2025) → $38.2B (2026) | 20%+ CAGR |
| **Personal finance software** | $1.35B (2025) → $2.57B by 2034 | 7.6% CAGR |
| **Global coaching industry** | $5.34B (2025) → $5.8B (2026) | Growing |
| **Career coaching segment** | $1.43B (2025) → $2.5B by 2034 | 6.93% CAGR |
| **Financial planning software** | Growing $15.94B by 2030 | 28.1% CAGR |
| **Gig/freelance economy** | $582.2B (2025) → $2.18T by 2034 | 15.79% CAGR |

### D. Gig Economy / Side Hustle Stats

- **76.4 million** US freelancers (36% of workforce)
- By 2027, freelancers expected to hit **50.9%** of US workforce
- **51% of Americans** worked a side hustle in the past year
- **72% of workers** either have or are considering a side hustle
- Average side hustler earns **$891/month** (up from $810 in 2023)
- High-earning freelancers ($100K+): grew from 3M to **5.6 million** (2020-2025)
- Average US freelancer income: **$108,028/year**

### E. FIRE Movement

- **9% of non-retired US adults** actively pursuing FIRE
- **39% additional** considering FIRE
- = ~48% of non-retired adults interested in financial independence
- Skews toward millennials but broadening to Gen Z
- Active communities on Reddit (r/financialindependence: 2M+ members), blogs, podcasts

### F. Search Demand Indicators

- "How to quit my job" — consistently high search volume (Google Trends shows sustained interest)
- "QuitTok" — active TikTok community around quitting jobs
- "Side hustle" — massive search volume and social media engagement
- "Financial runway" — growing search interest
- "FIRE calculator" — established search demand

---

## 4. Viral Mechanics Research

### A. What Financial/Career Apps Have Gone Viral

**Cleo (AI Financial Assistant) — The Viral Playbook:**
- Grew from 1,000 users/day (UK) to **10,000 users/day** (US) within a week of US launch
- Now: **850,000+ paying subscribers**, $280M ARR
- Doubles subscriber base every year since 2021
- **Secret:** Personality. Uses comedic, "roasting" tone that generates shareable content. Hired comedians alongside engineers
- **Lesson:** Make the output sharable and emotionally resonant

**Robinhood — Democratization as Virality:**
- Commission-free trading made investing accessible
- Simplified UX forced entire industry to adapt
- Referral program (free stock) drove massive word-of-mouth

**NerdWallet — Content-Led Growth:**
- 2,000+ articles/month driving organic search traffic
- 40,000+ referring websites
- Content drives >50% of traffic
- **Lesson:** SEO content around "how to quit your job," "financial runway," "side hustle income" could drive massive organic traffic

### B. Emotional Triggers That Drive Sharing

Research shows these psychological triggers drive sharing in finance/career content:

1. **Anger/Outrage** — The most viral emotion. "I have to work 47 more years" or "My boss makes 300x my salary" triggers sharing
2. **Hope/Aspiration** — "I'm 8 months away from quitting" — aspirational content gets shared
3. **Social Currency** — Sharing your runway/quit-date makes you look smart and in control
4. **Identity Reinforcement** — "I'm not just an employee, I'm planning my escape" — people share to signal identity
5. **Utility/Value** — Practical tools get shared because they help others ("use this to calculate your runway")
6. **Curiosity Gap** — "How long could YOU survive without a paycheck?" — irresistible to click

### C. The Countdown Timer = Built-In Viral Mechanic

**Why countdowns work:**
- Forest App: Countdown timer creates urgency, 40M+ downloads
- Habitica: Gamification + progress tracking, massive community
- Streaks/milestones drive engagement (proven by TickTick, Duolingo, etc.)

**For this product:**
- "247 days until I quit" is inherently sharable
- Milestone celebrations (1 year of runway! 6 months to quit date!) create share moments
- Progress bars and visual countdowns trigger dopamine
- **The countdown IS the viral loop** — users naturally screenshot and share their quit date

### D. Content Formats That Work on TikTok/Social

| Format | Why It Works | Application |
|--------|-------------|-------------|
| **"Day in the life" transitions** | Aspirational storytelling | "Day 1 vs Day 247 of my quit plan" |
| **Roasting/humor** | Cleo proved this works | "Your runway is 3 weeks. Have you considered not buying $8 lattes?" |
| **Calculator/quiz reveals** | Interactive, personal | "Calculate your quit date" |
| **Before/after** | Transformation narrative | "Before: 0 months runway. After 6 months of planning: 14 months" |
| **Storytime** | Personal narrative hooks | "I quit my job 90 days ago. Here's what happened" |
| **Hot takes** | Controversy drives engagement | "You don't need a new job. You need a runway." |

### E. User Acquisition Playbook (Based on Successful Apps)

1. **Cleo model**: Personality-driven brand voice + social-first content
2. **NerdWallet model**: SEO content engine targeting "how to quit my job" keywords
3. **Robinhood model**: Referral program ("Get 1 free month when a friend calculates their runway")
4. **Product-led growth**: Free runway calculator (no signup required) → upgrade for full dashboard
5. **Community-led**: Reddit (r/financialindependence, r/careerguidance, r/sidehustle), TikTok QuitTok

---

## 5. Monetization Research

### A. SaaS Pricing Benchmarks

**Competitor pricing context:**
| App | Price | Model |
|-----|-------|-------|
| ProjectionLab | $109/year | Annual subscription |
| Monarch Money | $99/year ($14.99/mo) | Subscription |
| Copilot Money | $95/year ($13/mo) | Subscription |
| YNAB | $99/year | Subscription |
| Teal | $29/mo | Subscription |
| Careerflow | $23.99/mo | Subscription |

**SaaS pricing trends (2025-2026):**
- Average SaaS prices up 11.4% year-over-year
- 85% of SaaS companies now use some form of usage-based pricing
- 31% use hybrid models (subscription + usage)
- 68% of high-growth companies use value-based pricing
- Top companies derive 42-48% of new revenue from expansion (upsells)

### B. Recommended Pricing Strategy

**Freemium + Tiered Subscription:**

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | Basic runway calculator (manual entry), quit-date countdown, limited career suggestions |
| **Pro** | $9.99/mo ($99/year) | Plaid bank connection, auto-calculated runway, AI-powered career pivot recommendations, side hustle matching, milestone tracking |
| **Premium** | $19.99/mo ($179/year) | Everything in Pro + AI career coaching sessions, detailed financial scenarios, cost-of-living comparison tool, priority support |

**Why this works:**
- Free tier drives virality (the calculator IS the acquisition tool)
- $9.99/mo sits below Monarch/YNAB/Copilot but offers unique value
- $19.99/mo competes with career coaching at 1/100th the cost

### C. Affiliate Revenue Opportunities

**High-value finance affiliates:**
| Program | Commission | Cookie Duration |
|---------|-----------|----------------|
| American Express | Up to $200/sale | Varies |
| Chase (cards, savings, investments) | Varies by product | Varies |
| Ally Bank | Starting $5/qualified sale | 45 days |
| Wise | $10-50 per customer | Varies |
| Credit Sesame | $9/registered user | Varies |
| Coinbase | Up to 50% commission (3 months) | Varies |
| Questrade | $70/acquisition | Varies |
| Binance | Up to 50% lifetime commission | Lifetime |

**Contextual affiliate plays:**
- "Your runway is 6 months. Open a high-yield savings account to extend it by 2 months" → Ally Bank affiliate link
- "Start freelancing to add $2K/month to your runway" → Upwork/course affiliate
- "Reduce your expenses by $200/month with this credit card" → Chase affiliate

**Estimated affiliate revenue:** $5-15 per user over lifetime, on top of subscription revenue.

### D. What People Pay for Career Transition Help

- **Career coaching sessions:** $75-$250/session
- **3-6 month coaching packages:** $600-$3,000
- **Premium programs:** $3,000-$10,000+
- **Online courses:** $50-$500

**Key insight:** People ARE willing to pay $100-3,000+ for career transition help. A $99/year SaaS tool that provides ongoing, personalized exit planning is a **massive value proposition** compared to a single $250 coaching session.

### E. Additional Revenue Streams

1. **Course partnerships** — Affiliate revenue for skill-building courses (Coursera, Udemy, Skillshare)
2. **Premium AI coaching** — Pay-per-session AI career coaching powered by LLM
3. **Employer partnerships** — Companies could offer this as an offboarding/transition benefit
4. **Data insights** — Anonymized, aggregated data on career transitions (sell to recruiters, employers)
5. **Community/events** — Premium community access, virtual meetups, accountability groups

---

## 6. Name Ideas & Domain Strategy

### A. What Makes a Great SaaS Name

Based on research of 550+ SaaS companies:
- **95% use .com** — non-negotiable for credibility
- Keep it **6-15 characters**
- Avoid hyphens and numbers
- Should be **easy to spell and pronounce**
- Must work for **word-of-mouth** ("Have you tried [name]?")
- Avoid generic names that could be any SaaS
- Portmanteau, compound words, or evocative/invented names work best
- Secure social handles + trademark simultaneously

### B. Name Concepts by Theme

**"Runway" Theme:**
| Name | .com Status | Notes |
|------|------------|-------|
| Runway | runway.com — TAKEN (FP&A platform) | Already a well-known brand |
| RunwayApp | Check availability | Might confuse with Runway ML (AI video) |
| MyRunway | Check availability | Personal, clear meaning |
| RunwayHQ | Check availability | Professional feel |

**"Escape / Exit" Theme:**
| Name | Notes |
|------|-------|
| ExitPlan | Strong, clear, action-oriented |
| ExitVelocity | Physics metaphor, implies speed and momentum |
| EscapeHatch | Playful, memorable |
| TheExit | Simple, bold |
| ExitReady | Clear value proposition |

**"Launch / Leap" Theme:**
| Name | Notes |
|------|-------|
| LaunchPad | Implies preparation for takeoff (may be taken) |
| LeapDay | Memorable, implies the moment of transition |
| ReadyToLeap | Descriptive, clear |
| BigLeap | Simple, aspirational |

**"Bridge / Freedom" Theme:**
| Name | Notes |
|------|-------|
| BridgeApp | Transitional, implies getting from A to B |
| FreeRange | Freedom + range/runway wordplay |
| Unchain | Emotional, liberation-focused |
| Untethered | Premium feel, implies freedom |

**"Countdown / Timer" Theme:**
| Name | Notes |
|------|-------|
| QuitClock | Catchy, immediately understood, great for virality |
| DayZero | The day you quit — dramatic, memorable |
| CountdownHQ | Clear, functional |

**Creative / Invented Names:**
| Name | Notes |
|------|-------|
| Offramp | Highway metaphor — taking the exit from your career highway |
| Springboard | Implies launching into something better |
| Launchkit | Practical, implies toolkit |
| Waypoint | Navigation metaphor — a stop on your journey |
| Pivotal | Career pivot + pivotal moment wordplay |
| Driftless | Implies purposeful direction, not drifting |

### C. Top 5 Recommendations

1. **QuitClock** — Immediately understood, inherently viral ("Check your QuitClock"), the countdown IS the brand. Easy to spell, say, and remember. Great for TikTok/social.

2. **ExitVelocity** — Sophisticated, implies momentum and physics of escape. Appeals to analytical/FIRE crowd. Strong brand voice potential.

3. **Offramp** — Simple metaphor everyone understands. "Taking the offramp from your 9-to-5." Short, memorable, visual.

4. **DayZero** — Dramatic, milestone-focused. "What's your Day Zero?" creates intrigue. Works as both brand and concept.

5. **Launchpad** — Familiar concept, implies preparation + launch. May have domain challenges but strong brand potential.

### D. Naming Inspiration from Successful Apps

- **Mint** — Simple, fresh, money-adjacent
- **Robinhood** — Storytelling name (steal from the rich)
- **Cleo** — Human name, approachable
- **Monarch** — Aspirational, premium
- **YNAB** — Acronym of value prop (You Need A Budget)
- **Teal** — Abstract but memorable
- **Loom** — Simple word, evocative
- **Notion** — Abstract concept

---

## Summary & Key Takeaways

### The Opportunity
1. **No direct competitor exists** — the intersection of financial runway + career planning + side hustle matching + quit-date countdown is completely unoccupied
2. **Massive addressable market** — 60% of workers want new jobs, 18% actively disengaged, record-low satisfaction
3. **Perfect timing** — "Great Detachment" means millions are stuck in jobs they hate, waiting for a plan
4. **API stack is nearly free** — BLS, O*NET are free; Plaid has a free tier; LLM costs are plummeting
5. **Built-in virality** — The countdown timer and runway number are inherently sharable
6. **Multiple revenue streams** — Subscription + affiliates + AI coaching + courses

### The Risks
1. **Plaid costs at scale** — Per-connection pricing can get expensive with many users
2. **LLM hallucination risk** — Career/financial advice must be accurate; needs guardrails
3. **Regulatory considerations** — Must be clear this is NOT financial advice (disclaimer required)
4. **User activation** — Getting people to connect their bank accounts requires trust-building

### Recommended Next Steps
1. Build a free, no-signup runway calculator (the viral acquisition tool)
2. Layer on the countdown timer and share mechanics
3. Add Plaid integration for auto-calculation (paid tier)
4. Integrate BLS + O*NET for career pivot suggestions
5. Add AI-powered personalized exit plans
6. Launch on Product Hunt, Reddit FIRE communities, TikTok QuitTok

---

## Sources

### Competitive Landscape
- [ProjectionLab](https://projectionlab.com/pricing)
- [Expense Sorted Financial Runway Calculator](https://www.expensesorted.com/blog/financial-runway-calculator-how-long-without-income)
- [Runway 2.0](https://runway2-0.vercel.app/)
- [Monarch Money Pricing](https://www.monarch.com/pricing)
- [Copilot Money Review](https://productivewithchris.com/tools/copilot-money/)
- [Cleo Revenue & Growth](https://sacra.com/c/cleo/)
- [Teal Career Platform](https://www.tealhq.com)
- [Careerflow Features](https://www.careerflow.ai/features)
- [FinancialAha Runway Calculator](https://www.financialaha.com/financial-planning-tools/runway-calculator/)

### APIs & Data Sources
- [Plaid Pricing](https://plaid.com/pricing/)
- [Plaid Product Updates Dec 2025](https://plaid.com/blog/product-updates-december-2025/)
- [BLS API Features](https://www.bls.gov/bls/api_features.htm)
- [BLS Developers](https://www.bls.gov/developers/home.htm)
- [O*NET Web Services](https://services.onetcenter.org/about)
- [O*NET Database](https://www.onetcenter.org/database.html)
- [LinkedIn API Guide 2026](https://www.outx.ai/blog/linkedin-api-guide)
- [Glassdoor API Status](https://zuplo.com/learning-center/what-is-glassdoor-api)
- [Indeed Partner Docs](https://docs.indeed.com/)
- [Numbeo API](https://www.numbeo.com/common/api.jsp)
- [Rentometer API](https://www.rentometer.com/rentometer-api)
- [RentCast API](https://www.rentcast.io/api)
- [Upwork Developer](https://www.upwork.com/developer)
- [LLM API Pricing 2026](https://pricepertoken.com/)
- [LLM API Pricing Comparison](https://intuitionlabs.ai/articles/ai-api-pricing-comparison-grok-gemini-openai-claude)

### Market Size & Demand
- [Job Satisfaction Statistics 2026](https://emapta.com/blog/job-satisfaction-statistics/)
- [100+ Job Satisfaction Statistics 2026](https://novoresume.com/career-blog/job-satisfaction-statistics)
- [Talent Retention Report 2025](https://www.ihire.com/resourcecenter/employer/pages/talent-retention-report-2025)
- [Great Detachment 2025](https://c-suiteanalytics.com/trend-great-detachment-2025/)
- [Great Re-Resignation 2025](https://universumglobal.com/resources/blog/the-great-re-resignation-insights-from-talent-outlook-2025/)
- [Life After Great Resignation](https://www.cnbc.com/2026/02/19/life-after-the-great-resignation-incentives-are-dimming-for-workers-to-change-jobs.html)
- [Job Hugging & Next Great Resignation](https://fortune.com/2025/08/18/what-is-job-hugging-next-great-resignation/)
- [Gig Economy Statistics 2026](https://www.demandsage.com/gig-economy-statistics/)
- [Side Hustle Statistics 2026](https://www.hostinger.com/tutorials/side-hustle-statistics)
- [Freelancing Stats 2026 (Upwork)](https://www.upwork.com/resources/freelancing-stats)
- [Coaching Industry Market Size](https://luisazhou.com/blog/coaching-industry-market-size/)
- [Career Coaching Market](https://www.iacareercoaches.org/post/coaching-industry-statistics)
- [Personal Finance Apps Market](https://www.researchnester.com/reports/personal-finance-apps-market/8243)
- [Financial Planning Software Market](https://www.fortunebusinessinsights.com/personal-finance-software-market-112683)
- [FIRE Movement Wikipedia](https://en.wikipedia.org/wiki/FIRE_movement)
- [FIRE Movement 2025](https://www.finance-monthly.com/fire-movement-early-retirement-2025/)

### Viral Mechanics
- [Cleo AI Growth Story](https://www.glbgpt.com/resource/from-zero-to-280m-the-ai-money-app-revolution)
- [NerdWallet Market Position](https://tomorrowdesk.com/info/nerdwallet)
- [Budgeting Apps State](https://sacra.com/q/whats-the-current-state-of-budgeting-apps/)
- [Psychology of Social Media Sharing](https://everyonesocial.com/blog/the-psychology-of-how-and-why-we-share/)
- [Viral Content Psychology](https://postnitro.ai/blog/post/viral-social-media-psychology-7-mental-triggers)
- [Emotional Triggers in Social Media](https://spintadigital.com/blog/the-psychology-of-social-media-how-to-use-emotional-triggers-to-drive-engagement/)
- [TikTok QuitTok](https://www.tiktok.com/discover/quit-tok)
- [TikTok Job Quitting Trend](https://www.theladders.com/career-advice/the-latest-tiktok-trend-quitting-your-job-for-everyone-to-see)
- [Gamification Apps Examples](https://trophy.so/blog/productivity-gamification-examples)
- [TikTok for Financial Services](https://megadigital.ai/en/blog/tiktok-for-financial-services/)

### Monetization
- [SaaS Pricing Benchmarks 2025](https://www.getmonetizely.com/articles/saas-pricing-benchmarks-2025-how-do-your-monetization-metrics-stack-up)
- [SaaS Price Surge 2025](https://www.saastr.com/the-great-price-surge-of-2025-a-comprehensive-breakdown-of-pricing-increases-and-the-issues-they-have-created-for-all-of-us/)
- [Career Coaching Costs](https://www.betterup.com/blog/career-coaching-cost)
- [Career Coaching Pricing](https://sofia-health.com/c/career-coach-cost/)
- [Financial Affiliate Programs](https://getlasso.co/niche/financial/)
- [Finance Affiliate Programs 2025](https://www.authorityhacker.com/financial-affiliate-programs/)
- [Credit Card Affiliate Programs](https://tapfiliate.com/blog/credit-card-affiliate-programs/)

### Naming & Domains
- [SaaS Product Naming Guide 2026](https://www.selfstorming.com/guides/brand-naming/saas-product-naming)
- [500+ SaaS Domain Name Choices](https://smartbranding.com/saas-companies-and-their-domain-name-choices/)
- [Choosing SaaS Domain Name](https://www.touchpoint.com/blog/how-to-choose-saas-domain-name/)
- [Cloud & SaaS Domain Best Practices](https://www.oyzta.com/blog/cloud-and-saas-domain-naming-best-practices-for-tech-startups/)
