const fs = require('fs');
const path = require('path');

const configDir = path.join(__dirname, '..', 'sites', 'configs');

const toolContent = {
  "mortgage-affordability-calculator": {
    contentIntro: "The average American spends 30% of their income on housing, but financial advisors recommend keeping it under 28%. That gap between what a lender approves you for and what you can actually afford comfortably is where most homebuyers get into trouble. Our mortgage affordability calculator factors in your gross income, existing debts, down payment, property taxes, and insurance to show exactly how much house you can realistically afford — not just the maximum a bank will lend you. With mortgage rates hovering near 7% in 2025-2026, a $50,000 difference in home price means roughly $330 more per month. Before you start house hunting, run your numbers here so you walk into open houses with a budget grounded in reality, not wishful thinking.",
    howToSteps: [
      "Enter your annual gross household income before taxes — include your spouse's income if applying jointly",
      "Add your total monthly debt payments including car loans, student loans, and minimum credit card payments",
      "Set your expected down payment amount — remember, 20% avoids PMI but many buyers put down less",
      "Adjust the interest rate to match current market rates (check Bankrate or Freddie Mac for today's average)",
      "Set your local property tax rate — the national average is about 1.1% but it ranges from 0.3% in Hawaii to 2.2% in New Jersey",
      "Review your maximum affordable home price and the monthly payment breakdown to see where every dollar goes"
    ],
    tipsAndConsiderations: [
      "Lenders will approve you for more than you should actually spend. Just because you qualify for a $500K mortgage doesn't mean you can comfortably afford one — leave room for savings, maintenance, and life.",
      "Don't forget closing costs — typically 2-5% of the home price. On a $400K home, that's $8K-$20K you need in addition to your down payment.",
      "Your debt-to-income ratio matters more than your credit score for determining how much you can borrow. Pay down existing debts before applying to maximize your buying power.",
      "Property taxes and insurance can add $300-$800/month on top of your mortgage payment. Many first-time buyers underestimate these costs significantly.",
      "If you're putting less than 20% down, budget an extra 0.5-1% of the loan amount annually for Private Mortgage Insurance (PMI)."
    ]
  },

  "compound-interest-calculator": {
    contentIntro: "Albert Einstein supposedly called compound interest the eighth wonder of the world, and whether or not the attribution is real, the math checks out. A 25-year-old who invests $200/month at a 7% return will have roughly $525,000 by age 65 — but only $96,000 of that is money they actually contributed. The other $429,000 is pure compound growth. Start the same investment at 35 and you'll end up with about $244,000 — less than half. This calculator shows you exactly how compounding frequency, contribution timing, and rate of return interact to grow your money. Whether you're planning retirement contributions, comparing savings accounts, or just curious how long it takes to double your money, plug in your numbers and watch the year-by-year breakdown.",
    howToSteps: [
      "Enter your starting principal — this is the lump sum you're investing or already have saved",
      "Set your monthly contribution amount — even $50/month makes a dramatic difference over decades",
      "Input the annual interest rate — use 7% for a conservative stock market estimate or 4-5% for high-yield savings",
      "Choose your compounding frequency — most savings accounts compound daily, while investments typically compound monthly or quarterly",
      "Set the time period in years — try different lengths to see how time is the most powerful variable in the equation"
    ],
    tipsAndConsiderations: [
      "The Rule of 72 gives you a quick mental shortcut: divide 72 by your interest rate to find how many years it takes to double your money. At 8%, that's 9 years. At 4%, that's 18 years.",
      "The difference between starting at age 25 vs. 35 is enormous — roughly 2x the final balance for the same monthly contribution. Time in the market beats timing the market every single time.",
      "Don't confuse nominal returns with real returns. If your investment earns 10% but inflation is 3%, your real purchasing power growth is closer to 7%.",
      "Daily vs. monthly compounding makes less difference than you'd think — usually under 0.5% over a full year. Focus on contribution amount and rate of return instead.",
      "Tax-advantaged accounts (401k, IRA, Roth IRA) let you compound without annual tax drag, which can add 20-30% more to your final balance compared to a taxable account."
    ]
  },

  "loan-payment-calculator": {
    contentIntro: "Before you sign any loan agreement, you should know exactly what that monthly payment will be — and more importantly, how much of each payment goes to interest versus principal. On a typical 30-year mortgage at 7%, you'll pay nearly $140,000 in interest on a $200,000 loan. That's almost as much as the loan itself. But making just one extra payment per year can save you over $30,000 and cut years off the loan. This calculator breaks down your monthly payment, shows total interest paid, and lets you see the impact of extra payments. Whether it's a mortgage, car loan, student loan, or personal loan, understanding amortization is the difference between being in control of your debt and being controlled by it.",
    howToSteps: [
      "Enter the total loan amount — the principal you're borrowing, not the purchase price",
      "Set the annual interest rate — check your loan offer or pre-approval letter for the exact APR",
      "Choose the loan term in years — common terms are 3-5 years for auto, 10-25 years for student loans, and 15-30 years for mortgages",
      "Optionally add extra monthly payments to see how much interest you can save and how many months you'll cut from the loan",
      "Review the amortization breakdown to understand how much of each payment goes to interest vs. principal over time"
    ],
    tipsAndConsiderations: [
      "In the first years of a long-term loan, most of your payment goes to interest. On a 30-year mortgage at 7%, roughly 82% of your first payment is interest — you barely touch the principal.",
      "Even $100 extra per month on a $250,000 mortgage at 7% saves over $60,000 in interest and pays off the loan 5+ years early.",
      "Watch out for the difference between interest rate and APR. The APR includes origination fees and other costs, making it a truer measure of what you're actually paying.",
      "Bi-weekly payments instead of monthly effectively add one extra payment per year and can save thousands without feeling the pinch in your budget."
    ]
  },

  "salary-after-tax-calculator": {
    contentIntro: "Your salary and your take-home pay are two very different numbers, and the gap surprises most people. Someone earning $85,000 in California takes home about $62,500 after federal income tax, state income tax, Social Security, and Medicare. The same salary in Texas — which has no state income tax — nets roughly $66,800. That $4,300 difference adds up fast. This calculator accounts for 2025-2026 federal tax brackets, state income tax rates for all 50 states, FICA contributions (Social Security at 6.2% up to $168,600 and Medicare at 1.45%), and standard deductions. If you're comparing job offers, negotiating a raise, or just trying to build an accurate monthly budget, you need to start with what actually hits your bank account.",
    howToSteps: [
      "Enter your annual gross salary — the number on your offer letter or contract before any deductions",
      "Select your state to apply the correct state income tax rate (or lack thereof — 9 states have no income tax)",
      "Choose your filing status — Single, Married Filing Jointly, or Head of Household — as this changes your federal brackets significantly",
      "Review the breakdown showing federal tax, state tax, Social Security, and Medicare deductions separately",
      "Compare with different salary amounts or states if you're evaluating job offers in multiple locations"
    ],
    tipsAndConsiderations: [
      "Your marginal tax rate is not the same as your effective tax rate. If you're in the 24% federal bracket, you don't pay 24% on all your income — only on the portion above $100,525 (single filer, 2025).",
      "States with no income tax (Texas, Florida, Nevada, etc.) aren't always cheaper — they often make up revenue through higher property taxes or sales taxes.",
      "Social Security tax stops at $168,600 in 2025. If you earn above that, your take-home percentage actually increases on dollars above that threshold.",
      "Pre-tax 401k contributions reduce your taxable income. Contributing $23,000/year (the 2025 max) could save you $5,500+ in taxes if you're in the 24% bracket."
    ]
  },

  "net-worth-percentile-calculator": {
    contentIntro: "The average American household's net worth is about $1.06 million according to the Federal Reserve's 2022 Survey of Consumer Finances — but that number is wildly misleading because a handful of ultra-wealthy families skew the average upward. The median net worth, which is far more representative, is $192,700. And it varies dramatically by age: the median for under-35 households is just $39,000, while 55-64 year-olds sit at $364,000. This calculator uses the actual Federal Reserve SCF data to show where you fall relative to others in your age group. Knowing your net worth percentile isn't about comparison for its own sake — it's a reality check on whether your savings and investments are roughly on track for your stage of life.",
    howToSteps: [
      "Add up all your assets: cash, investments, retirement accounts, home equity, vehicles, and any other property",
      "Total all your liabilities: mortgage balance, student loans, car loans, credit card debt, and any other debts",
      "Enter your net worth (assets minus liabilities) — don't be discouraged if it's negative, that's common for younger adults with student debt",
      "Select your age bracket to compare against the correct peer group from the Federal Reserve data",
      "Review your percentile ranking and see how your net worth compares to the median and average for your age group"
    ],
    tipsAndConsiderations: [
      "Home equity typically makes up the largest share of net worth for middle-class Americans. If you're a renter, you may need more in investments to keep pace with homeowners in the same percentile.",
      "A negative net worth in your 20s is completely normal — student loans alone average $37,000 per borrower. Focus on the trajectory, not the snapshot.",
      "The 50th percentile isn't necessarily 'good enough' for retirement. Many financial planners suggest you need 10-12x your annual salary saved by age 65.",
      "Don't include personal items like furniture, clothing, or electronics in your net worth calculation. They depreciate to near zero and inflate the number meaninglessly.",
      "Net worth percentiles shift significantly by education level and race due to systemic wealth gaps. Use the data as one reference point, not the sole measure of financial health."
    ]
  },

  "bmi-calculator": {
    contentIntro: "Body Mass Index has been the go-to screening tool since Belgian mathematician Adolphe Quetelet invented it in 1832 — and despite its age, it remains the most widely used measure in clinical settings. BMI divides your weight in kilograms by your height in meters squared, producing a number that roughly correlates with body fat levels across large populations. The standard categories are underweight (below 18.5), normal (18.5-24.9), overweight (25-29.9), and obese (30+). But here's what your doctor might not tell you: BMI can't distinguish between muscle and fat. A 5'10\" athlete at 210 pounds and a sedentary person at the same height and weight get identical BMI readings despite very different body compositions. Use this calculator as a starting point, not a diagnosis.",
    howToSteps: [
      "Enter your height — you can use feet/inches or centimeters depending on your preference",
      "Enter your current weight in pounds or kilograms",
      "Click calculate to see your BMI value and which WHO category it falls into",
      "Review the healthy weight range shown for your specific height to understand the full picture",
      "Consider pairing this result with a body fat percentage measurement for a more complete assessment"
    ],
    tipsAndConsiderations: [
      "BMI systematically misclassifies muscular people as overweight. If you lift weights regularly, your BMI may read 27-28 while your body fat is a perfectly healthy 15%.",
      "BMI was designed for population-level screening, not individual diagnosis. The WHO categories don't account for age, sex, ethnicity, or muscle mass — all of which significantly affect health risk.",
      "Waist circumference is often a better predictor of health risk than BMI alone. Men above 40 inches and women above 35 inches face elevated cardiovascular risk regardless of BMI.",
      "BMI ranges are slightly different for Asian populations — the WHO suggests overweight starts at 23 rather than 25, due to higher metabolic risk at lower body weights in these groups."
    ]
  },

  "body-fat-calculator": {
    contentIntro: "Body fat percentage tells you what BMI cannot: how much of your weight is actually fat versus lean mass. The U.S. Navy developed a circumference-based estimation method that's surprisingly accurate — typically within 3-4% of hydrostatic weighing results. For men, essential fat (the minimum needed for organ function) is about 2-5%, athletes range from 6-13%, fit individuals 14-17%, and average is 18-24%. For women, the ranges are higher: essential fat is 10-13%, athletes 14-20%, fit 21-24%, and average 25-31%. This calculator uses the Navy method, which requires just a tape measure and takes about two minutes. It's far more useful than BMI for tracking fitness progress because you can lose fat and gain muscle without the scale changing at all.",
    howToSteps: [
      "Select your sex — the Navy method uses different measurement sites and formulas for men and women",
      "Measure your neck circumference at the narrowest point, just below the Adam's apple",
      "Measure your natural waist circumference at the navel level — don't suck in your stomach",
      "Women: also measure hip circumference at the widest point of the buttocks",
      "Enter your height and click calculate to see your estimated body fat percentage and fitness category"
    ],
    tipsAndConsiderations: [
      "Measure at the same time of day, ideally in the morning before eating. Bloating, hydration, and even time of day can shift circumference measurements by half an inch or more.",
      "The Navy method is most accurate for people in the 10-35% body fat range. At very low (<8%) or very high (>40%) levels, the accuracy decreases noticeably.",
      "A 1% decrease in body fat at 200 pounds means losing about 2 pounds of actual fat. Track monthly, not weekly — weekly fluctuations are mostly water and measurement noise.",
      "Women naturally carry 6-10% more essential body fat than men due to hormonal and reproductive functions. Comparing your percentage across sexes is meaningless.",
      "If you want higher accuracy, consider a DEXA scan ($50-150 at most imaging centers). It gives you not just total body fat but regional fat distribution and bone density."
    ]
  },

  "calorie-deficit-calculator": {
    contentIntro: "Weight loss comes down to one inescapable reality: you need to burn more calories than you consume. A pound of body fat contains roughly 3,500 calories, so a daily deficit of 500 calories should produce about one pound of weight loss per week. But the real world is messier than that math suggests. Your metabolism adapts to sustained deficits, water weight fluctuates wildly day to day, and losing muscle along with fat changes the equation over time. This calculator estimates your Total Daily Energy Expenditure using the Mifflin-St Jeor equation (the most accurate for most people), then builds a deficit plan based on your goal weight and timeline. It'll also flag if your target is too aggressive — dropping below 1,200 calories for women or 1,500 for men risks muscle loss, nutrient deficiencies, and metabolic slowdown.",
    howToSteps: [
      "Enter your current weight, height, age, and sex — these determine your Basal Metabolic Rate",
      "Select your activity level honestly — most people overestimate this, which inflates their calorie budget",
      "Enter your goal weight and target timeline to calculate the required daily deficit",
      "Review your recommended daily calorie intake and the projected weekly weight loss rate",
      "Adjust the timeline if the calculator shows an unsafe deficit (more than 1,000 calories/day or under minimum safe intake)"
    ],
    tipsAndConsiderations: [
      "A deficit of 500-750 calories per day (1-1.5 lbs/week) is the sweet spot for sustainable fat loss. Larger deficits lead to muscle loss, metabolic adaptation, and almost always result in regaining the weight.",
      "Your actual TDEE can vary by 15-20% from any formula's estimate. Use the calculator as a starting point, then adjust based on 2-3 weeks of real-world results on the scale.",
      "Protein intake matters enormously during a deficit. Aim for 0.7-1g per pound of body weight to preserve muscle mass. This is significantly higher than the bare minimum RDA.",
      "The scale can hide 2-3 weeks of real fat loss behind water retention, especially for women around their menstrual cycle or anyone who recently increased exercise. Track weekly averages, not daily numbers.",
      "Reverse dieting — slowly increasing calories back to maintenance after reaching your goal — is critical for keeping the weight off. Jumping straight back to old eating habits is why 80% of dieters regain."
    ]
  },

  "inflation-calculator": {
    contentIntro: "A dollar in 2000 has the same purchasing power as about $1.82 today — meaning prices have nearly doubled in 25 years. That's the quiet erosion of inflation at work. The Federal Reserve targets 2% annual inflation, but real-world numbers spike regularly: 2022 saw CPI hit 9.1%, the highest in 40 years, before settling back toward 3% in 2024-2025. This calculator uses historical Consumer Price Index data from the Bureau of Labor Statistics going back to 1913 to show you exactly how inflation has changed the value of money over any time period. Whether you're calculating how much a 1990 salary is worth today, adjusting an old contract for inflation, or projecting future purchasing power, the math here uses actual CPI figures — not estimates.",
    howToSteps: [
      "Enter the dollar amount you want to adjust for inflation",
      "Select the starting year — the calculator covers 1913 through the present using official BLS data",
      "Select the ending year to see the equivalent purchasing power",
      "Review the cumulative inflation rate and the average annual inflation rate over your selected period",
      "Try projecting forward using an assumed inflation rate to estimate future purchasing power erosion"
    ],
    tipsAndConsiderations: [
      "CPI measures a basket of goods that may not match your personal spending. Housing, healthcare, and education have inflated far faster than the overall CPI — often 2-3x the headline rate.",
      "When negotiating salary or contracts, always think in real (inflation-adjusted) terms. A 3% raise during 3% inflation is a 0% raise in purchasing power.",
      "Social Security benefits are adjusted using CPI-W, which weights differently than regular CPI. Retirees often feel inflation more acutely because healthcare costs, which rise faster than CPI, make up a larger share of their spending.",
      "The difference between 2% and 4% inflation compounded over 30 years is staggering: $100 becomes $55 in real value at 2% inflation, but just $31 at 4%."
    ]
  },

  "property-tax-calculator": {
    contentIntro: "Property taxes are the single largest ongoing cost of homeownership that people consistently underestimate. The national average effective rate is about 1.1% of assessed value, but that masks enormous variation: New Jersey homeowners pay an average of $9,500/year while Hawaii residents pay around $1,900 on similarly valued homes. Your property tax bill depends on your local millage rate, your home's assessed value (which is often lower than market value), and any exemptions you qualify for like homestead, senior, veteran, or disability exemptions. This calculator estimates your annual property tax by state and lets you factor in exemptions and local assessment ratios. If you're buying a home, add this number to your monthly mortgage payment — escrow accounts collect it monthly, and a $6,000 annual tax bill means an extra $500/month on top of principal and interest.",
    howToSteps: [
      "Enter your home's current market value or purchase price",
      "Select your state to apply the average effective property tax rate for that state",
      "Adjust the assessment ratio if your county assesses at less than full market value (many assess at 80-90%)",
      "Enter any exemptions you qualify for — homestead exemptions alone can save $25,000-$50,000 off assessed value in some states",
      "Review your estimated annual and monthly property tax amounts"
    ],
    tipsAndConsiderations: [
      "Your assessed value and your market value are often different. Many counties assess at 70-90% of market value, and reassessments may lag behind actual price changes by several years.",
      "Always check if you qualify for exemptions. Homestead exemptions are available to primary residence owners in most states and can reduce your taxable value by $25,000-$75,000.",
      "Property taxes can increase even if rates stay flat — if your home's assessed value rises after a reassessment, your bill goes up. Many states cap annual assessment increases (California's Prop 13 limits to 2%/year).",
      "When comparing homes in different areas, look at the effective tax rate (actual tax paid / market value) rather than the nominal millage rate. Two towns with the same millage rate can have very different effective rates depending on assessment practices."
    ]
  },

  "rent-vs-buy-calculator": {
    contentIntro: "The rent vs. buy question doesn't have a universal answer — it depends on how long you'll stay, local price-to-rent ratios, mortgage rates, and your opportunity cost of tying up a down payment. The New York Times popularized the breakeven calculation: in most markets, buying becomes cheaper than renting after 5-7 years, but in expensive coastal cities that breakeven can stretch to 10-15 years or never arrive at all. This calculator runs the full comparison including mortgage payments, property taxes, insurance, maintenance (budget 1-2% of home value annually), tax deductions, home appreciation, and the investment returns you'd earn if you invested your down payment and monthly savings instead. It's a true apples-to-apples comparison that accounts for what most back-of-napkin calculations miss.",
    howToSteps: [
      "Enter your monthly rent and expected annual rent increase (3-5% is typical in most markets)",
      "Enter the home purchase price, down payment, mortgage rate, and loan term",
      "Set property tax rate, homeowner's insurance, and estimated maintenance costs",
      "Input your assumptions for home appreciation rate and investment return rate (for the renter's alternative investments)",
      "Choose the time horizon — this is critical because buying almost always wins long-term but often loses in the first 3-5 years",
      "Compare the total cost of each scenario and the crossover point where buying becomes cheaper"
    ],
    tipsAndConsiderations: [
      "Transaction costs are the hidden killer for short-term buyers. Closing costs (2-5%) on purchase plus agent commissions (5-6%) on sale mean you need meaningful appreciation just to break even.",
      "Most calculators ignore the opportunity cost of your down payment. $80,000 invested in an index fund at 7% grows to about $157,000 in 10 years — that's the real cost of locking it into a house.",
      "Maintenance costs are real and relentless. The 1% rule (budget 1% of home value annually) means a $400K home costs $4,000/year in maintenance — and that's an average that includes years where you replace a $15K roof or $8K HVAC system.",
      "The mortgage interest tax deduction only helps if you itemize, and since the 2017 standard deduction increase, fewer than 10% of filers benefit from it. Don't count on it as a buying advantage."
    ]
  },

  "cost-of-living-comparison": {
    contentIntro: "A $100,000 salary in San Francisco has roughly the same purchasing power as $55,000 in Houston — and that's not an exaggeration. Housing costs alone can swing by 3-4x between major metros. But cost of living goes far beyond rent: groceries, transportation, healthcare, taxes, and childcare all vary significantly by location. When evaluating a job offer in a new city or considering a relocation, you need an equivalent salary comparison that accounts for all these categories. This calculator uses composite cost-of-living indices that weight each spending category by its typical share of household budgets. It shows you exactly how much you'd need to earn in a new city to maintain your current standard of living — or how much further your money would stretch if you moved somewhere cheaper.",
    howToSteps: [
      "Select your current city or metro area as the baseline",
      "Select the city you're comparing to or considering moving to",
      "Enter your current annual salary to calculate the equivalent salary in the comparison city",
      "Review the category-by-category breakdown showing differences in housing, groceries, transportation, healthcare, and utilities",
      "Check the state income tax comparison since some relocations involve moving to or from no-income-tax states"
    ],
    tipsAndConsiderations: [
      "Housing typically accounts for 30-40% of the cost-of-living difference between cities. If you're moving from a high-cost to low-cost area, housing savings alone can feel transformative.",
      "Remote workers earning coastal salaries while living in lower-cost areas have a massive financial advantage — but some companies are now adjusting pay based on employee location.",
      "Don't forget to account for state and local taxes. Moving from California (13.3% top marginal rate) to Texas (0%) is effectively a raise of 8-10% for high earners.",
      "Cost-of-living indices use averages and may not reflect your lifestyle. If you don't drive, transportation costs are irrelevant. If you have kids, childcare and school quality matter more than restaurant prices.",
      "The cheapest cities aren't always the best value. Factor in job market depth, career growth opportunities, and quality of life — a slightly higher cost area with more job options may be the better financial move long-term."
    ]
  },

  "concrete-calculator": {
    contentIntro: "Ordering too little concrete means a cold joint in the middle of your slab — one of the worst structural flaws in residential construction. Ordering too much means paying for a short load return fee or finding somewhere to dump it fast. A standard 60-pound bag of concrete mix covers 0.45 cubic feet, so a 10x10-foot patio slab at 4 inches thick requires about 1.23 cubic yards or roughly 56 bags. Most DIYers underestimate by 10-15% because they forget to account for sub-base irregularities, form board thickness, and spillage. This calculator computes cubic yards for slabs, footings, columns, and stairs, converts to bags (60 lb or 80 lb), and adds the industry-standard 10% waste factor so you don't come up short mid-pour.",
    howToSteps: [
      "Select the shape of your project — slab/pad, footing, column/sonotube, or staircase",
      "Enter the dimensions in feet and inches — length, width, and depth (thickness)",
      "For columns, enter the diameter and height; for stairs, enter the number of steps, rise, run, and width",
      "Review the cubic yards needed and the equivalent number of pre-mixed bags",
      "Add 10% for waste if not already included — for projects with irregular ground, add 15%"
    ],
    tipsAndConsiderations: [
      "Always round up when ordering ready-mix. A truck delivery minimum is typically 1 cubic yard, and short load fees ($50-75 per quarter yard under minimum) add up fast. It's cheaper to over-order by a quarter yard than to under-order.",
      "For slabs thinner than 4 inches, use fiber-reinforced concrete mix or add wire mesh — standard 3,000 PSI concrete under 4 inches thick is prone to cracking under load.",
      "Temperature matters for your pour. Below 50°F, concrete takes much longer to cure and can freeze before reaching strength. Above 90°F, it sets too fast and may crack. Plan your pour day accordingly.",
      "If your project exceeds 1.5 cubic yards, ready-mix delivery ($150-200/yard) is almost always cheaper and better quality than mixing 80+ bags by hand."
    ]
  },

  "paint-coverage-calculator": {
    contentIntro: "A gallon of interior paint covers approximately 350-400 square feet on smooth drywall — but drop that to 250-300 square feet on textured surfaces, new drywall, or dark-to-light color changes that need extra coats. The biggest mistake DIY painters make isn't choosing the wrong color — it's buying the wrong amount. Running out mid-wall means a trip to the store and a visible lap line where you stopped. Buying three extra gallons means $120-$180 sitting in your garage. This calculator computes the actual paintable wall area by subtracting doors (about 21 sq ft each) and windows (about 15 sq ft each), accounts for the number of coats needed, and tells you exactly how many gallons to buy. One coat rarely provides full coverage; plan for two coats minimum, three if you're going dark over light or using a bold color.",
    howToSteps: [
      "Enter the room dimensions — length, width, and ceiling height (standard is 8 feet, but many homes have 9 or 10 foot ceilings)",
      "Enter the number of doors and windows to subtract from the total wall area",
      "Select the surface type — smooth drywall covers more efficiently than textured or previously unpainted surfaces",
      "Choose the number of coats — two is standard, three for dramatic color changes",
      "Review the total gallons needed and round up to the nearest full gallon (stores rarely sell partial gallons)"
    ],
    tipsAndConsiderations: [
      "Always buy one extra gallon for touch-ups later. Keep it labeled with the room and date — paint stores can color-match, but batch variations mean a fresh mix may look slightly different.",
      "Primer isn't optional when covering dark colors, painting new drywall, or switching between latex and oil-based paint. A dedicated primer coat is cheaper and performs better than extra coats of paint-and-primer-in-one.",
      "Higher-quality paint ($40-60/gallon) covers better per coat than budget paint ($20-30/gallon) and lasts 2-3 times longer before fading or scuffing. You'll often use fewer gallons of premium paint.",
      "For ceilings, reduce your coverage estimate by 10-15%. Gravity works against you, application is slower, and roller spatter means you get less efficient coverage per gallon."
    ]
  },

  "gravel-calculator": {
    contentIntro: "Gravel is sold by the ton or cubic yard, but you need it by the square foot and inch of depth — and the conversion trips people up because gravel density varies wildly by type. Pea gravel weighs about 1.4 tons per cubic yard, crushed limestone runs 1.5 tons, and river rock can hit 1.6 tons or more. For a standard driveway base, you need 4-6 inches of compacted gravel, which means ordering 6-8 inches of loose material since gravel compacts by roughly 30%. A 12x30-foot single-car driveway at 6 inches of loose depth requires about 2.2 cubic yards or roughly 3.1 tons of crushed stone. This calculator handles the volume-to-weight conversion for common gravel types and adds a waste factor for uneven ground or spreading losses.",
    howToSteps: [
      "Enter the length and width of your project area in feet",
      "Set the desired depth in inches — 2-3 inches for walkways, 4-6 inches for driveways, 6-8 inches for heavy traffic areas",
      "Select the gravel type to get accurate weight conversion (pea gravel, crushed stone, river rock, etc.)",
      "Review both cubic yards and tons needed — you'll order in whichever unit your supplier uses",
      "Add 10-15% for waste, especially if your ground isn't perfectly level or edged"
    ],
    tipsAndConsiderations: [
      "Order by the ton from a quarry or landscape supply yard — it's typically $30-65/ton delivered, far cheaper than buying bags from a hardware store at $5-8 per 0.5 cubic foot bag.",
      "Compaction matters: loose gravel compresses 20-30% when driven over or compacted with a plate tamper. If you need 4 inches of finished depth, order material for 5-6 inches loose.",
      "For driveways, use angular crushed stone (not round pea gravel) as the base. Angular pieces lock together and create a stable surface, while round stones shift and migrate under tire weight.",
      "Most delivery trucks carry 10-15 tons. If you need more, you'll pay for multiple loads. If you need less than the minimum delivery (usually 1-2 tons), consider picking up with a trailer to avoid small load surcharges."
    ]
  },

  "deck-material-calculator": {
    contentIntro: "A 12x16-foot deck is one of the highest-ROI home improvement projects, returning 60-80% of its cost at resale. But the material list is more complex than most people expect: you need decking boards, joists, beams, posts, ledger board, joist hangers, screws, post brackets, and potentially railing materials. Miss the joist hangers and your inspector will fail the framing. Undercount your deck screws and you'll make three hardware store runs. Pressure-treated lumber runs $20-30 per board for 5/4x6 decking, while composite decking (Trex, TimberTech) costs $35-60 per board but lasts 25-50 years with virtually zero maintenance. This calculator generates a complete materials list with quantities and estimated costs based on your deck dimensions and material choice.",
    howToSteps: [
      "Enter your deck dimensions — length and width in feet",
      "Select the decking material — pressure-treated, cedar, composite, or PVC",
      "Choose your joist spacing — 16 inches on center is standard, 12 inches for composite decking or hot tub loads",
      "Specify whether you need railing and the number of sides that require it",
      "Review the complete materials list including boards, joists, hardware, and estimated total cost"
    ],
    tipsAndConsiderations: [
      "Composite decking requires 12-inch joist spacing rather than the 16-inch used for wood — it has more flex. Failing to account for this means your framing cost increases roughly 30%.",
      "Don't forget the hidden fastener cost. A 200 sq ft deck needs roughly 700-900 screws. Hidden fastener systems for composite decking add $1-2 per square foot but look much cleaner.",
      "Always buy 10-15% more decking than calculated. You'll have cuts and waste at the ends of boards, and it's much cheaper to return unused material than to order a special delivery for three missing boards.",
      "Check local building codes before you start. Most jurisdictions require a permit for decks over 30 inches above grade, and specific requirements for post footings, railing height (36-42 inches), and baluster spacing (under 4 inches) vary by location."
    ]
  },

  "roof-pitch-calculator": {
    contentIntro: "Roof pitch is expressed as rise over run — a 6/12 pitch means the roof rises 6 inches for every 12 inches of horizontal run, which works out to about a 26.6-degree angle. Knowing your exact pitch matters for everything from ordering the right amount of shingles (steeper = more material) to determining if you can walk the roof safely (most roofers won't walk anything steeper than 8/12 without harnesses). Standard architectural shingles require a minimum 4/12 pitch, while metal roofing can go as low as 2/12 or even 1/12 with proper seam treatment. This calculator converts between rise/run notation, degrees, and percentage grade, and shows you the pitch multiplier you need for calculating actual roof surface area from your home's footprint.",
    howToSteps: [
      "Enter any two of the three values: rise (vertical inches), run (horizontal inches, typically 12), or angle in degrees",
      "The calculator converts between all three formats instantly",
      "Note the pitch multiplier — multiply your home's footprint area by this number to get actual roof surface area",
      "Use the roof walkability rating to determine if you need safety equipment or professional roofers",
      "Reference the minimum pitch requirements for your roofing material type"
    ],
    tipsAndConsiderations: [
      "To measure pitch from inside your attic, hold a level horizontally against a rafter, mark 12 inches from the rafter, then measure straight down from that mark to the level. That vertical distance is your rise per 12 inches of run.",
      "Roof area is always larger than floor area. A 6/12 pitch adds about 12% more surface area than the footprint, while a 12/12 (45-degree) pitch adds 41%. This directly affects material costs.",
      "Low-slope roofs (below 4/12) require different materials — standard shingles will leak. Modified bitumen, TPO membrane, or standing-seam metal are appropriate for low slopes.",
      "Insurance companies and building codes care about pitch. Steeper roofs shed snow and rain better but cost more to build and re-roof. Some hurricane-prone regions have maximum pitch requirements."
    ]
  },

  "amortization-calculator": {
    contentIntro: "An amortization schedule reveals what your lender hopes you never look too closely at: how spectacularly front-loaded interest payments are on a long-term loan. On a $300,000 mortgage at 7% over 30 years, your monthly payment is $1,996 — but in the first month, $1,750 goes to interest and only $246 chips away at the principal. It takes over 18 years before the split is even 50/50. This is why extra payments early in a loan have such an outsized impact. An extra $200/month on that same mortgage saves $108,000 in interest and pays it off 7 years early. This calculator generates your complete month-by-month amortization schedule and lets you model extra payments to see exactly how they change your payoff timeline.",
    howToSteps: [
      "Enter the original loan amount — the total principal borrowed",
      "Input the annual interest rate from your loan agreement",
      "Select the loan term in years (15 or 30 for mortgages, 3-7 for auto, etc.)",
      "Optionally add a recurring extra monthly payment to see the accelerated payoff impact",
      "Scroll through the full schedule to see the principal vs. interest split for every single payment"
    ],
    tipsAndConsiderations: [
      "Making one extra mortgage payment per year — whether as a lump sum or divided into 12 additional monthly portions — typically cuts 4-5 years off a 30-year mortgage.",
      "If you receive a year-end bonus or tax refund, applying it as a lump-sum principal payment is one of the highest-return, zero-risk financial moves you can make.",
      "Check your loan for prepayment penalties before making extra payments. Most modern mortgages don't have them, but some personal loans and older mortgages do — typically 2-3% of the remaining balance.",
      "Refinancing resets your amortization clock. If you're 10 years into a 30-year mortgage and refinance to a new 30-year term, you're starting the front-loaded interest cycle over again, even if the rate is lower."
    ]
  },

  "401k-calculator": {
    contentIntro: "The median 401(k) balance for Americans aged 55-64 is only about $71,000 according to Vanguard's 2024 How America Saves report — nowhere near enough for a comfortable retirement. Yet someone contributing just $500/month starting at age 30 with a 7% average return would have over $850,000 by 65. The gap between those numbers is pure procrastination. This calculator projects your 401(k) balance at retirement based on your current savings, contribution rate, employer match, expected returns, and years until retirement. It accounts for the 2025 contribution limit of $23,000 ($30,500 if you're 50+) and shows you the tax-deferred growth advantage compared to a regular taxable investment account. If you're not at least contributing enough to get your full employer match, you're literally declining free money.",
    howToSteps: [
      "Enter your current 401(k) balance — check your latest statement or provider's website",
      "Set your annual contribution as a dollar amount or percentage of salary",
      "Enter your employer match details — most common is 50% match on the first 6% of salary, but formulas vary",
      "Choose your expected annual return — 7% is a conservative long-term stock market assumption, adjust based on your asset allocation",
      "Set your current age and target retirement age to calculate years of growth remaining"
    ],
    tipsAndConsiderations: [
      "At minimum, contribute enough to capture your full employer match. A typical 50% match on 6% of an $80,000 salary is $2,400 per year in free money — that compounds to over $190,000 over 30 years at 7%.",
      "If you're over 50, take advantage of catch-up contributions: an extra $7,500 per year (2025 limit) on top of the standard $23,000 maximum.",
      "Target-date funds are fine for hands-off investors, but their fees (0.10-0.75%) and conservative allocation drag on returns. A simple 3-fund portfolio (total US stock, international stock, bond index) with 0.03-0.05% expense ratios often performs better.",
      "Your 401(k) balance isn't all yours — traditional 401(k) withdrawals are taxed as ordinary income. A $1 million balance at a 22% effective tax rate is really $780,000 in spending power. Consider Roth 401(k) contributions if available."
    ]
  },

  "tip-calculator": {
    contentIntro: "Tipping in the United States has expanded well beyond its traditional roots in table service, and the recommended percentages have crept upward too. What was 15% a decade ago is now 18-20% as the baseline for sit-down restaurants, with 25%+ for exceptional service. But tip math at the table is surprisingly error-prone — especially when splitting a check among friends after a few drinks. A $187.43 bill split four ways with 20% tip should come to $56.23 each, but trying to calculate that on the spot usually results in either an embarrassingly small tip or an awkwardly inflated one. This calculator handles tip percentages, tax-exclusive calculations, and even splits to any number of people so the math takes two seconds and everyone pays their fair share.",
    howToSteps: [
      "Enter the pre-tax bill amount — tip should be calculated on the food and drink total, not on sales tax",
      "Select your desired tip percentage or enter a custom amount — 18% for adequate service, 20% for good, 25% for excellent",
      "Enter the number of people splitting the bill if applicable",
      "Review the tip amount, total bill, and per-person share",
      "Adjust the tip percentage to see how small changes affect the total — the difference between 18% and 20% on a $100 bill is just $2"
    ],
    tipsAndConsiderations: [
      "Calculate tip on the pre-tax subtotal, not the total including sales tax. In high-tax cities like Chicago (10.25%) or New York (8.875%), tipping on the post-tax amount inflates your tip by nearly a full percentage point.",
      "For takeout orders, 10-15% is considered appropriate in the post-2020 era. Before the pandemic, tipping on takeout was uncommon — social norms have shifted.",
      "If you're unhappy with service, tipping 10% sends a clearer message than leaving nothing. A zero tip is often assumed to be a mistake or a cheapskate, while a notably low tip communicates intentional dissatisfaction.",
      "In many states, tipped workers have a lower minimum wage ($2.13/hour federally for tipped employees). Your tip isn't a bonus — it's their primary income."
    ]
  },

  "percentage-calculator": {
    contentIntro: "Percentage calculations show up everywhere — discounts at the store, tax rates, grade curves, investment returns, recipe scaling, and data analysis — yet they're one of the most commonly botched math operations. The classic mistake: confusing percentage of with percentage change. A shirt discounted from $80 to $60 is 25% off, but going from $60 back to $80 is a 33% increase. They're not the same. This calculator handles the three core percentage operations: finding a percentage of a number, calculating what percentage one number is of another, and computing percentage change between two values. No algebra required. Enter your numbers and get the answer instantly with the formula shown so you actually understand the math.",
    howToSteps: [
      "Choose the type of calculation: percentage of a number, what percent A is of B, or percentage change from A to B",
      "Enter your values — the calculator accepts decimals and negative numbers for decrease calculations",
      "Click calculate to see the result along with the formula used",
      "Use the percentage change mode for comparing before/after values like price changes, weight loss, or growth rates",
      "Try reversing the inputs to understand why percentage increase and percentage decrease are not symmetrical"
    ],
    tipsAndConsiderations: [
      "A 50% decrease followed by a 50% increase does NOT get you back to the original number. $100 minus 50% is $50, and $50 plus 50% is only $75. This asymmetry catches people off guard constantly.",
      "To quickly calculate a 15% tip in your head: find 10% by moving the decimal point, then add half of that. 10% of $67 is $6.70, half is $3.35, so 15% is $10.05.",
      "When comparing percentage changes, the base matters enormously. A stock going from $10 to $15 is a 50% gain, but going from $100 to $105 is only 5% — even though both gained $5.",
      "In statistics and research, percentage points and percentages mean different things. Going from 10% to 15% is a 5 percentage point increase but a 50% relative increase. News headlines frequently conflate these."
    ]
  },

  "mortgage-calculator": {
    contentIntro: "Your monthly mortgage payment on a $350,000 loan at 7% over 30 years is $2,329 — but that's just principal and interest. Add property taxes ($350/month at the national average), homeowner's insurance ($150/month), and potentially PMI ($145/month if you put less than 20% down), and your true monthly housing cost jumps to $2,974. That's a difference of $645 per month that surprises first-time buyers every single time. This mortgage calculator breaks down your total monthly payment into all its components so there are no surprises. It also generates a full amortization table showing how the principal-to-interest ratio shifts dramatically over the life of the loan — useful for understanding why early extra payments have such a massive impact.",
    howToSteps: [
      "Enter the home price and your down payment amount or percentage",
      "Set the interest rate — check Freddie Mac's weekly survey for current average rates",
      "Choose between a 15-year or 30-year term (or enter a custom term)",
      "Add your property tax rate and monthly insurance to see the full PITI payment",
      "Review the amortization schedule to see how principal and interest shift over time"
    ],
    tipsAndConsiderations: [
      "Every 0.25% increase in rate costs about $45/month per $300,000 borrowed. The difference between 6.5% and 7.5% on a $350K loan is roughly $215/month or $77,000 over 30 years.",
      "A 15-year mortgage at 6.5% on $300K has a $2,613 monthly payment vs. $1,896 for 30 years — $717 more per month, but you save $186,000 in total interest and own your home free and clear in half the time.",
      "PMI drops off automatically at 78% loan-to-value for conventional loans, but you can request removal at 80%. On a $350K home with 10% down, that's roughly $145/month until you reach $280K in equity.",
      "Points (prepaid interest) can lower your rate: one point costs 1% of the loan and typically reduces the rate by 0.25%. On a $350K loan, that's $3,500 upfront to save about $45/month. It takes about 6.5 years to break even."
    ]
  },

  "mortgage-refinance-calculator": {
    contentIntro: "Refinancing your mortgage makes financial sense when the interest savings exceed the closing costs within a reasonable timeframe — the classic rule of thumb is a 1% rate reduction, but that's an oversimplification. On a $300,000 balance, dropping from 7.5% to 6.5% saves $203/month, and with typical closing costs of $6,000-$9,000, you break even in 30-44 months. But if you have 22 years left on your mortgage and refinance into a new 30-year term, you might lower your payment while actually paying MORE total interest because you've extended the payoff by 8 years. This calculator shows both the monthly savings and the true total-cost picture, including how long it takes to recoup closing costs and whether you actually come out ahead.",
    howToSteps: [
      "Enter your current loan details: remaining balance, current interest rate, and remaining months on the loan",
      "Enter the proposed refinance terms: new interest rate, new loan term, and estimated closing costs",
      "Compare the monthly payment difference between your current and proposed mortgage",
      "Check the break-even point — the number of months until your savings exceed the closing costs",
      "Review the total interest comparison to make sure a lower payment doesn't mean higher total cost due to extending the term"
    ],
    tipsAndConsiderations: [
      "Don't just compare monthly payments — compare total remaining interest. A lower monthly payment on a longer term can cost you tens of thousands more in the long run.",
      "Cash-out refinancing (borrowing more than you owe) can be useful for consolidating high-interest debt, but you're converting unsecured debt to debt secured by your home. If you can't pay, you lose the house.",
      "Closing costs on a refinance run 2-5% of the loan amount. Some lenders offer 'no-closing-cost' refinances, but they roll the costs into a higher rate — you're still paying, just differently.",
      "If you plan to move within 3-5 years, refinancing rarely makes sense. You won't stay long enough to recoup closing costs through monthly savings."
    ]
  },

  "auto-loan-calculator": {
    contentIntro: "The average new car loan in the US is now $40,290 at 6.8% interest over 68 months, resulting in a monthly payment of about $726 according to Experian data. But what's truly expensive isn't the payment — it's the total interest. That average loan costs over $9,000 in interest, and stretching to a 72 or 84-month term to lower the monthly payment only makes it worse while putting you at high risk of being underwater (owing more than the car is worth). This calculator shows your monthly payment, total interest paid, and amortization schedule for any vehicle loan. Use it to compare different loan terms and down payment amounts so you can make the decision with full visibility into the true cost.",
    howToSteps: [
      "Enter the vehicle price minus your down payment and trade-in value to get the loan amount",
      "Input the annual interest rate from your pre-approval or dealer financing offer",
      "Select the loan term — 36-60 months is the financially sound range, though 72-84 month terms are common",
      "Add sales tax if it's being rolled into the loan (some states require this)",
      "Compare scenarios by adjusting the term length to see the tradeoff between monthly payment and total interest"
    ],
    tipsAndConsiderations: [
      "Get pre-approved through your bank or credit union BEFORE going to the dealership. Dealer financing markups (called 'rate markups' or 'dealer reserve') can add 1-3% to your rate, costing thousands over the loan.",
      "Never extend a loan past 60 months on a new car or 36 months on a used car. Depreciation outpaces equity building on longer terms, leaving you underwater — sometimes for years.",
      "A larger down payment (20%+) not only reduces your loan amount but often qualifies you for a lower interest rate. The rate difference between 10% and 20% down can be 0.5-1%.",
      "Focus on the total cost, not the monthly payment. Dealers love to negotiate in terms of monthly payment because it obscures the actual price and interest you're paying."
    ]
  },

  "personal-loan-calculator": {
    contentIntro: "Personal loans fill the gap between credit card debt (18-29% APR) and secured loans like mortgages (6-8%). At average rates of 12-15% for good credit borrowers, a $15,000 personal loan over 5 years costs about $337/month with roughly $5,200 in total interest. But rates vary enormously — excellent credit (750+) can get you 7-9%, while fair credit (630-689) may see 18-25%. The difference between 8% and 20% on a $20,000 loan is over $7,000 in interest. This calculator shows your monthly payment, total interest, and a payoff schedule so you can compare offers from different lenders side by side. Whether you're consolidating credit card debt, financing a home improvement, or covering an emergency, knowing the true cost before you sign matters.",
    howToSteps: [
      "Enter the total loan amount you need to borrow",
      "Input the annual interest rate — compare offers from at least 3 lenders before choosing",
      "Select the repayment term in months or years (personal loans typically range from 12 to 84 months)",
      "Review the monthly payment amount and total interest over the life of the loan",
      "Try different term lengths to find the sweet spot between an affordable payment and reasonable total interest"
    ],
    tipsAndConsiderations: [
      "Debt consolidation loans only save money if the rate is significantly lower than your existing debts AND you stop adding new debt. Most people who consolidate end up running up their credit cards again within 2 years.",
      "Watch for origination fees — many personal loan lenders charge 1-8% of the loan amount upfront. A 5% fee on a $20,000 loan means you receive $19,000 but owe $20,000.",
      "Credit unions often offer personal loan rates 2-4% lower than banks or online lenders for the same credit profile. Check your local credit union before applying elsewhere.",
      "Applying for multiple personal loans within a 14-day window counts as a single hard inquiry on your credit report. Use this rate-shopping window to compare offers without hurting your score."
    ]
  },

  "home-equity-loan-calculator": {
    contentIntro: "A home equity loan lets you borrow against the equity you've built in your house — typically up to 80-85% of your home's value minus what you still owe on the mortgage. If your home is worth $400,000 and you owe $250,000, you could potentially borrow up to $70,000-$90,000. Rates on home equity loans currently run 8-9% for good credit, which is significantly lower than personal loans or credit cards because your home serves as collateral. That collateral is both the advantage and the risk: lower rates, potential tax deductibility on interest if used for home improvements (up to $750K combined mortgage debt), but you can lose your home if you can't make payments. This calculator shows your borrowing capacity, monthly payment, and total interest cost.",
    howToSteps: [
      "Enter your home's current market value — use a recent appraisal, Zillow estimate, or comparable sales in your area",
      "Enter your remaining mortgage balance to calculate available equity",
      "Set the maximum LTV ratio your lender allows (typically 80-85% combined)",
      "Enter the home equity loan amount, interest rate, and term to calculate the payment",
      "Review the monthly payment and total interest alongside your existing mortgage payment to ensure combined affordability"
    ],
    tipsAndConsiderations: [
      "Home equity loans have fixed rates and fixed payments, while HELOCs have variable rates that can change monthly. If you need a specific lump sum, the fixed loan is more predictable. If you need ongoing access to funds, a HELOC offers flexibility.",
      "Interest on home equity loans is only tax-deductible if the funds are used for home improvements (per 2017 Tax Cuts and Jobs Act). Using the money for debt consolidation or vacations means no deduction.",
      "Your combined loan-to-value ratio (first mortgage + equity loan) should stay below 80%. Going higher not only risks being underwater if home values dip but also typically means higher rates.",
      "Closing costs on home equity loans run $2,000-$5,000 including appraisal, title search, and origination fees. Some lenders waive these if you keep the loan open for 3+ years."
    ]
  },

  "retirement-savings-calculator": {
    contentIntro: "The widely cited '4% rule' says you can withdraw 4% of your retirement portfolio annually without running out of money over a 30-year retirement. That means a $1 million portfolio supports $40,000/year in withdrawals. Combine that with average Social Security benefits of $22,800/year and you're at $62,800 annually. If your current expenses are $75,000/year, you have a $12,200 gap to close. This calculator projects whether your current savings trajectory will get you to your target retirement nest egg. It factors in your current savings, annual contributions, expected returns, employer matching, and years until retirement. The most common mistake people make is not running these numbers until it's too late — at 55, the compounding runway is mostly gone.",
    howToSteps: [
      "Enter your current total retirement savings across all accounts (401k, IRA, Roth, taxable)",
      "Set your annual contribution amount and expected employer match",
      "Input your expected annual investment return — 7% is a common assumption for a stock-heavy portfolio",
      "Enter your current age and planned retirement age",
      "Set your desired annual retirement income to see if your projected savings will sustain it using the 4% withdrawal rule"
    ],
    tipsAndConsiderations: [
      "The 4% rule was based on historical US market returns and a 30-year retirement. If you retire early or expect a longer retirement, use 3-3.5% as a safer withdrawal rate.",
      "Healthcare costs in retirement average $315,000 per couple (Fidelity 2023 estimate). This is often the largest underestimated expense in retirement planning and isn't fully covered by Medicare.",
      "Social Security benefits are reduced by 30% if you claim at 62 vs. waiting until 67. Delaying to 70 increases your benefit by another 24%. The breakeven age is roughly 80-82.",
      "Sequence-of-returns risk is real: a market crash in the first 3-5 years of retirement can devastate a portfolio even if long-term average returns are fine. Having 2-3 years of expenses in cash or bonds provides a buffer.",
      "Inflation at 3% means your $75,000/year lifestyle costs $121,000/year in 16 years. Your retirement projections must account for rising expenses, not just today's dollars."
    ]
  },

  "debt-to-income-calculator": {
    contentIntro: "Debt-to-income ratio is the number mortgage lenders care about most — more than your credit score, more than your savings, more than your employment history. DTI is simply your total monthly debt payments divided by your gross monthly income. Most conventional lenders want to see a DTI below 36%, with no more than 28% going to housing costs (the 'front-end' ratio). FHA loans allow up to 43-50% in some cases, but just because you can qualify at 45% DTI doesn't mean you should — at that level, nearly half your pre-tax income goes to debt, leaving dangerously little room for savings, emergencies, or any unexpected expense. This calculator computes both your front-end and back-end DTI and tells you where you stand relative to standard lending thresholds.",
    howToSteps: [
      "Enter your gross monthly income (before taxes and deductions)",
      "Add your monthly housing payment including mortgage/rent, property tax, insurance, and HOA",
      "Enter all other monthly debt payments: car loans, student loans, minimum credit card payments, personal loans, and child support",
      "Review your front-end DTI (housing only) and back-end DTI (all debts) against lender benchmarks",
      "If your DTI is too high, try adjusting the numbers to see how paying off specific debts would improve it"
    ],
    tipsAndConsiderations: [
      "DTI uses your minimum required payments, not what you actually pay. If your credit card minimum is $50 but you pay $200, lenders count $50. This works in your favor.",
      "Only recurring debts count toward DTI. Utilities, groceries, insurance premiums, and subscriptions are not included — even though they obviously affect your real ability to pay.",
      "Increasing income and decreasing debt both improve DTI, but paying off a $300/month car loan improves it much faster than a raise that adds $300/month in gross pay (which is only $200 after tax).",
      "Some lenders manually underwrite exceptions for high DTI if you have substantial cash reserves (6+ months), a strong credit history, or a large down payment. It's worth asking."
    ]
  },

  "car-depreciation-calculator": {
    contentIntro: "A new car loses roughly 20% of its value the moment you drive it off the lot, and about 60% over the first five years. That means a $40,000 new car is worth around $32,000 by the time you get home and $16,000 five years later. Depreciation is the single largest cost of car ownership — larger than fuel, insurance, and maintenance combined for most vehicles. But depreciation rates vary wildly by make, model, and segment. Trucks and SUVs like the Toyota Tacoma and Jeep Wrangler hold value exceptionally well (losing only 30-35% over five years), while luxury sedans can lose 60-70%. This calculator estimates your vehicle's value over time using standard depreciation curves so you can plan for trade-in timing, understand your actual cost of ownership, and avoid being underwater on your loan.",
    howToSteps: [
      "Enter the vehicle's purchase price or MSRP",
      "Select whether it's new or used and enter the current age if used",
      "Choose the vehicle type or depreciation rate category (standard, luxury, truck/SUV, economy)",
      "Set the number of years you want to project forward",
      "Review the year-by-year value decline and total depreciation cost"
    ],
    tipsAndConsiderations: [
      "Buying a 2-3 year old certified pre-owned vehicle lets someone else absorb the steepest depreciation. You get a nearly-new car at 30-40% off with manufacturer warranty remaining.",
      "Mileage affects depreciation almost as much as age. The average is 12,000-15,000 miles/year — significantly higher mileage accelerates value loss, while lower mileage preserves it.",
      "Color matters more than you'd expect at resale. White, black, and silver hold value best. Unusual colors (orange, purple, bright green) can reduce resale by 5-10% in most segments.",
      "Electric vehicles currently depreciate faster than comparable gas vehicles (about 50% in 3 years vs. 40%) partly due to rapidly improving battery technology making older models less desirable.",
      "The cheapest year to own a new car is usually year 4-5, when depreciation flattens but major repairs haven't started. Selling at year 3 means absorbing the worst depreciation; keeping past year 8-10 means rising repair costs."
    ]
  },

  "fuel-cost-per-mile-calculator": {
    contentIntro: "The IRS standard mileage rate for 2025 is 70 cents per mile, but your actual fuel cost per mile depends on your specific vehicle and local gas prices. A sedan getting 30 MPG with gas at $3.50/gallon costs 11.7 cents per mile in fuel alone. A truck getting 18 MPG at the same gas price costs 19.4 cents — 66% more per mile. Over 15,000 miles per year, that's a difference of $1,155 annually just in gas. This calculator converts your MPG and fuel price into an actual per-mile cost, making it easy to compare vehicles, calculate commute costs, estimate road trip fuel budgets, or figure out mileage reimbursement accuracy. If your employer pays the IRS rate of 70 cents but your fuel cost is 12 cents, the remaining 58 cents covers depreciation, insurance, and maintenance — a genuinely fair deal.",
    howToSteps: [
      "Enter your vehicle's fuel efficiency in miles per gallon (check your owner's manual or fueleconomy.gov for EPA ratings)",
      "Enter the current fuel price per gallon in your area",
      "Optionally enter a distance to calculate the total fuel cost for a specific trip or commute",
      "Review your cost per mile and compare it against the IRS standard mileage rate or employer reimbursement",
      "Try different fuel prices to see how gas price fluctuations affect your annual driving costs"
    ],
    tipsAndConsiderations: [
      "Your real-world MPG is typically 10-20% lower than the EPA estimate. City driving, cold weather, aggressive acceleration, and highway speeds above 65 MPH all reduce efficiency.",
      "Tire pressure alone affects fuel economy by 2-3%. Under-inflated tires increase rolling resistance — check them monthly and keep them at the door placard specification, not the tire sidewall maximum.",
      "The cost difference between regular and premium gas is about $0.50-$0.70/gallon. If your car doesn't require premium (check the owner's manual — 'recommended' is different from 'required'), you're wasting $300-$500/year on no measurable benefit.",
      "Electric vehicles cost roughly 3-5 cents per mile in electricity at average US rates ($0.16/kWh). That's 60-75% cheaper than a 30 MPG gas car — but home charger installation ($500-2,000) and higher purchase price offset some savings."
    ]
  },

  "electricity-cost-calculator": {
    contentIntro: "The average US household pays about $137/month for electricity, but most people have no idea which appliances are driving that bill. A window AC unit running 8 hours a day costs $40-60/month. An old refrigerator from 2005 may cost $15-20/month versus $4-6 for a modern Energy Star model. Space heaters are the silent budget killers — a single 1,500-watt heater running 8 hours daily adds roughly $45/month to your bill. This calculator converts any appliance's wattage and usage hours into actual dollar costs using your local electricity rate. The national average is about $0.16/kWh, but rates range from $0.10/kWh in Louisiana to $0.36/kWh in Hawaii, making the same appliance 3x more expensive to run depending on where you live.",
    howToSteps: [
      "Enter the appliance wattage — check the label on the device or look it up in a wattage database",
      "Set the average hours of use per day",
      "Enter your local electricity rate in cents per kilowatt-hour (find it on your utility bill under 'rate' or 'price per kWh')",
      "Choose the time period: daily, monthly, or annual cost",
      "Compare multiple appliances to identify which ones are costing you the most"
    ],
    tipsAndConsiderations: [
      "Phantom load (devices plugged in but not in active use) costs the average household $100-$200/year. TVs, game consoles, chargers, and anything with a standby light draws power 24/7.",
      "Air conditioning is the single largest electricity expense for most homes — 40-60% of summer bills. Raising your thermostat by just 2 degrees saves roughly 6-8% on cooling costs.",
      "LED bulbs use 75% less electricity than incandescent and last 25x longer. Replacing 20 old bulbs saves about $150/year. It's the easiest energy upgrade with the fastest payback.",
      "Time-of-use rates are becoming common — electricity costs 2-3x more during peak hours (typically 4-9 PM). Running your dishwasher, laundry, and EV charger overnight can meaningfully cut your bill."
    ]
  },

  "solar-panel-payback-calculator": {
    contentIntro: "The average residential solar installation costs $20,000-$25,000 before incentives, and the 30% federal tax credit (extended through 2032 by the Inflation Reduction Act) brings that down to $14,000-$17,500. In a state with $150/month electricity bills and good sun exposure, the payback period is typically 7-10 years — after which you're generating essentially free electricity for the remaining 15-20 years of panel life. But the math varies enormously by location: a system in Arizona with high sun and high rates pays back in 5-6 years, while the same system in Seattle with overcast skies and cheap hydro power might take 14+ years. This calculator factors in your system size, local electricity rates, sun hours, incentives, financing costs, and annual panel degradation (about 0.5% per year) to show your true payback timeline.",
    howToSteps: [
      "Enter your system size in kilowatts (average residential is 6-8 kW) and the total installed cost",
      "Input your current monthly electricity bill and local utility rate per kWh",
      "Enter your average peak sun hours per day (4-6 hours for most of the US — check PVWatts for your zip code)",
      "Add incentives: the 30% federal tax credit, any state rebates, and net metering credits from your utility",
      "Review the break-even year, 25-year savings, and effective return on investment compared to other uses of that capital"
    ],
    tipsAndConsiderations: [
      "Net metering policies make or break solar economics. If your utility pays retail rate for excess power you send back to the grid, solar pays off much faster than if they pay wholesale or nothing.",
      "Solar panel output degrades about 0.5% per year. A system producing 10,000 kWh in year one will produce roughly 8,800 kWh in year 25. Good calculators factor this in — cheap ones don't.",
      "Buying outright gives the best return, but solar loans at 4-6% still make financial sense in most markets. Leases and PPAs have the lowest upfront cost but also the lowest long-term savings — you're renting someone else's panels on your roof.",
      "Battery storage (like Tesla Powerwall at $10,000-$15,000) rarely makes financial sense on grid-connected homes in most US markets. The exceptions are areas with time-of-use rates, frequent outages, or poor net metering."
    ]
  },

  "air-fryer-calculator": {
    contentIntro: "Air fryers cook 20-25% faster than conventional ovens because they're smaller (less air to heat) and the fan circulates hot air directly around the food. The general conversion rule is to reduce the oven temperature by 25°F and cut the cooking time by 20%. So a recipe calling for 400°F for 30 minutes in a conventional oven becomes 375°F for about 24 minutes in an air fryer. But this is a starting point — frozen foods, thick cuts of meat, and baked goods each behave differently. Frozen french fries at 400°F for 20 minutes in the oven cook perfectly at 380°F for 14-16 minutes in the air fryer. This calculator converts any oven recipe to air fryer settings and includes specific adjustments for common food categories so you don't end up with dried-out chicken or undercooked potatoes.",
    howToSteps: [
      "Enter the conventional oven temperature from your recipe",
      "Enter the conventional oven cooking time in minutes",
      "Select the food category if applicable (meat, vegetables, frozen food, baked goods) for more precise adjustments",
      "Review the converted air fryer temperature and time",
      "Remember to check food at the minimum time — air fryers vary in intensity and you can always add more time but can't undo overcooking"
    ],
    tipsAndConsiderations: [
      "Don't overcrowd the basket — air needs to circulate around the food for even cooking. A single layer with small gaps between pieces gives the best results. Cook in batches if needed.",
      "Shake or flip food halfway through cooking time. The side touching the basket gets more direct heat and can burn while the top stays undercooked if you don't rotate.",
      "Preheat your air fryer for 3-5 minutes before cooking. Some models preheat automatically, but older ones don't — skipping this step adds 2-3 minutes to actual cooking time.",
      "Lightly spraying food with oil (not nonstick cooking spray, which damages the basket coating) gives you crispier results. A dedicated oil mister with avocado or olive oil works best.",
      "Baked goods (cookies, muffins) need a bigger temperature reduction — drop 30-50°F instead of 25°F, as the close proximity of the heating element can brown the top before the inside cooks through."
    ]
  },

  "sourdough-calculator": {
    contentIntro: "Sourdough baking is essentially applied math with flour, water, and bacteria. The key ratios that determine your bread's flavor, rise, and texture are hydration (water as a percentage of flour, typically 65-80%), starter percentage (usually 15-25% of total flour weight), and salt (1.8-2.2% of flour weight). Where most home bakers go wrong is failing to account for the flour and water already in their starter. If your starter is 100% hydration (equal parts flour and water by weight, the most common), then 200g of starter contains 100g flour and 100g water — and those need to be subtracted from your total flour and water amounts. This calculator does that math for you, adjusting all ingredient quantities based on your desired loaf size, hydration level, and starter hydration ratio.",
    howToSteps: [
      "Enter your desired total dough weight (a standard loaf is about 800-900g total)",
      "Set your target hydration percentage — 70% is a good starting point for beginners, 75-80% for a more open crumb",
      "Enter your starter's hydration ratio (100% is standard — equal parts flour and water by weight)",
      "Set the starter percentage — 20% of total flour weight is a reliable middle ground for flavor and rise",
      "Review the ingredient breakdown showing exact weights for flour, water, starter, and salt"
    ],
    tipsAndConsiderations: [
      "Baker's percentages always use total flour weight as the denominator (100%). A recipe at 72% hydration with 20% starter and 2% salt means: for every 1000g flour, you use 720g water, 200g starter, and 20g salt.",
      "Higher hydration (75%+) produces a more open crumb with bigger holes but is significantly harder to shape. If you're newer to sourdough, stay at 68-72% until your shaping skills improve.",
      "Bulk fermentation time varies wildly with temperature. At 75°F, expect 4-5 hours. At 68°F, closer to 6-8 hours. Below 65°F, you might need 10+ hours. Use dough behavior (50-75% volume increase, jiggly and domed), not the clock.",
      "Your starter should double in volume within 4-6 hours after feeding before you use it. Bread made with a sluggish starter will be dense and overly sour. The float test (does a spoonful float in water?) is a decent quick check."
    ]
  },

  "macro-calculator": {
    contentIntro: "Counting macros — protein, carbohydrates, and fat — gives you far more control over body composition than calorie counting alone. Two people eating 2,000 calories can have wildly different results: one eating 40% protein, 30% carbs, 30% fat will likely build more muscle and lose more fat than someone eating 15% protein, 55% carbs, 30% fat, even at identical calorie counts. The current evidence-based ranges are 0.7-1g protein per pound of bodyweight for active people, 0.3-0.5g fat per pound, and the remainder from carbs. This calculator takes your stats, activity level, and goal (lose fat, maintain, or build muscle) and gives you specific daily gram targets for each macronutrient — not just vague percentages.",
    howToSteps: [
      "Enter your weight, height, age, and sex to calculate your base metabolic rate",
      "Select your activity level — from sedentary (desk job, no exercise) to very active (physical job plus daily training)",
      "Choose your goal: fat loss (calorie deficit), maintenance, or muscle gain (calorie surplus)",
      "Review your daily calorie target and the gram breakdown for protein, carbs, and fat",
      "Adjust the macro ratio if you prefer a specific approach (high protein, low carb, balanced, etc.)"
    ],
    tipsAndConsiderations: [
      "Protein is the most important macro for both muscle building and fat loss. At 0.8-1g per pound of bodyweight, a 170-pound person needs 136-170g of protein daily — that's roughly 6 chicken breasts or 24 eggs worth.",
      "Fat should never go below 0.3g per pound of bodyweight. Dietary fat is essential for hormone production, vitamin absorption, and brain function. Very low-fat diets suppress testosterone and can cause persistent fatigue.",
      "Carbs are the most flexible macro. Athletes and highly active people thrive on 40-50% carbs, while sedentary individuals may feel better and manage hunger with 25-35%. Neither extreme is 'wrong.'",
      "Track macros for 2-4 weeks to build awareness, then transition to intuitive eating using what you've learned. Long-term macro tracking can become obsessive and isn't necessary for most people.",
      "Fiber counts as carbohydrate but isn't digested for energy. Aim for 25-35g of fiber daily — it fills you up, feeds gut bacteria, and doesn't meaningfully contribute to caloric intake."
    ]
  },

  "sleep-calculator": {
    contentIntro: "A complete sleep cycle takes about 90 minutes and consists of four stages: light sleep (N1 and N2), deep sleep (N3), and REM sleep. You typically cycle through 4-6 of these per night. Waking up in the middle of deep sleep or REM — which is what happens when an alarm goes off at a random time — is what makes you feel groggy and disoriented (sleep inertia). The trick to waking up refreshed is timing your alarm to the end of a complete cycle. If you need to wake up at 6:30 AM, the ideal bedtimes are 9:00 PM (6 cycles), 10:30 PM (5 cycles), or midnight (4 cycles), factoring in an average 15-minute sleep onset time. This calculator works both ways: enter your wake time to find the best bedtimes, or enter your bedtime to find optimal alarm times.",
    howToSteps: [
      "Choose your mode: calculate bedtime from a wake-up time, or calculate wake time from a bedtime",
      "Enter the relevant time — when you need to wake up or when you plan to go to bed",
      "Adjust the sleep onset time if you typically take longer or shorter than 15 minutes to fall asleep",
      "Review the optimal times listed — each represents the end of a complete 90-minute sleep cycle",
      "Pick the option that gives you 5-6 complete cycles (7.5-9 hours) for optimal rest"
    ],
    tipsAndConsiderations: [
      "Five complete sleep cycles (7.5 hours) is the minimum for most adults to feel fully rested. Four cycles (6 hours) is survivable but accumulates sleep debt over time that impairs decision-making and reaction time.",
      "Sleep cycle length varies between individuals — some people run 80-minute cycles, others 100 minutes. If 90-minute timing consistently leaves you groggy, try shifting your bedtime by 15-20 minutes in either direction.",
      "The 15-minute sleep onset assumption is an average. If you fall asleep in under 5 minutes, you're likely sleep-deprived. If it regularly takes over 30 minutes, consider sleep hygiene changes before adjusting the calculator.",
      "Consistency matters more than duration. Going to bed and waking at the same time every day — including weekends — is the single most impactful change you can make for sleep quality."
    ]
  },

  "biological-age-calculator": {
    contentIntro: "Your chronological age is just a number on your birth certificate — your biological age reflects how well your body is actually aging. A 50-year-old marathon runner who doesn't smoke, sleeps 8 hours, and maintains a healthy weight might have a biological age of 38, while a sedentary 50-year-old smoker with high blood pressure might test at 62. Biological age calculators use health metrics and lifestyle factors that correlate strongly with mortality risk and disease markers. These include resting heart rate (under 60 BPM is associated with longer life), blood pressure, BMI, exercise frequency, smoking status, sleep quality, and chronic disease presence. This calculator estimates your biological age using peer-reviewed risk factor weightings. It's not a clinical test (those require blood biomarkers like DNA methylation), but it provides a useful directional assessment.",
    howToSteps: [
      "Enter your chronological age, sex, height, and weight",
      "Input your health metrics: resting heart rate, blood pressure, and any diagnosed conditions",
      "Answer lifestyle questions: exercise frequency, smoking status, alcohol consumption, sleep duration, and stress level",
      "Enter diet quality indicators — fruit and vegetable intake, processed food frequency",
      "Review your estimated biological age and the specific factors pulling it above or below your chronological age"
    ],
    tipsAndConsiderations: [
      "Exercise is the single most powerful biological age reducer. Regular moderate exercise (150+ minutes/week) is associated with 3-7 years of biological age reduction across multiple studies.",
      "Smoking adds 4-10 years to biological age depending on duration and intensity. Quitting at any age starts reversing the damage — after 10 smoke-free years, your excess cardiovascular risk drops by roughly 50%.",
      "Sleep duration shows a U-shaped relationship with mortality. Both less than 6 hours and more than 9 hours are associated with higher biological age. The sweet spot is 7-8 hours for most adults.",
      "Chronic stress measurably accelerates cellular aging through telomere shortening. Caregivers under chronic stress show biological aging equivalent to 9-17 additional years in some studies.",
      "These calculators provide estimates, not medical diagnoses. For a clinical biological age assessment, ask your doctor about epigenetic (DNA methylation) testing, which is the current gold standard."
    ]
  },

  "irs-audit-probability-calculator": {
    contentIntro: "The IRS audited only 0.44% of all individual returns in 2023 — roughly 1 in 228 returns — and budget cuts have pushed that rate even lower for most income brackets. But that average obscures massive variation. If you earned under $25,000, your audit rate was 0.8% (largely due to EITC verification). Earn $500,000-$1 million and it jumps to 1.1%. Above $10 million and it's 8.7%. Beyond income, specific return characteristics trigger higher scrutiny: large Schedule C losses, home office deductions, cash-heavy businesses, high charitable donations relative to income, and cryptocurrency transactions. This calculator estimates your audit probability based on your income level, filing characteristics, and deduction patterns using publicly available IRS data on audit selection rates.",
    howToSteps: [
      "Enter your adjusted gross income (AGI) — this is the primary factor in audit selection",
      "Select your filing status and indicate whether you're self-employed or have Schedule C income",
      "Check any applicable flags: home office deduction, large charitable donations (>3% of AGI), cryptocurrency transactions, foreign accounts, or cash-intensive business",
      "Enter your total deductions relative to income to see if they fall outside statistical norms for your bracket",
      "Review your estimated audit probability and which factors are increasing your risk"
    ],
    tipsAndConsiderations: [
      "The IRS uses a scoring system called DIF (Discriminant Information Function) that flags returns deviating from statistical norms for their income bracket. Having legitimately high deductions is fine — just keep receipts and documentation for everything.",
      "EITC claims face disproportionate audit rates (1.1%) despite being lower-income filers. This is because EITC verification is largely automated and cheap for the IRS to perform — it doesn't mean you did anything wrong.",
      "The IRS has 3 years from your filing date to initiate an audit for most returns, but there's no time limit if they suspect fraud or if you omitted more than 25% of your income.",
      "Being audited doesn't mean you owe more taxes. About 12% of audits result in no change or a refund to the taxpayer. Keep organized records and you have nothing to fear.",
      "Amending a return actually increases audit risk slightly because it flags the return for manual review. Only amend if the correction is significant enough to justify the additional scrutiny."
    ]
  },

  "ai-job-replacement-risk-calculator": {
    contentIntro: "McKinsey estimates that by 2030, up to 30% of current work hours could be automated by AI — but that doesn't mean 30% of jobs disappear entirely. Most jobs are a bundle of tasks, some of which AI handles well (data processing, pattern recognition, content generation, scheduling) and others it cannot (physical dexterity, emotional intelligence, creative judgment, complex negotiation). A radiologist's image analysis can be augmented by AI, but patient consultation and treatment planning cannot. An accountant's data entry is automatable, but tax strategy and client relationships are not. This calculator evaluates your specific job against multiple automation risk factors: routine vs. non-routine tasks, physical vs. cognitive work, social interaction requirements, and creative thinking demands. It produces a risk score, not a prediction — because how companies choose to deploy AI matters as much as what AI can technically do.",
    howToSteps: [
      "Enter your job title or select the closest occupation category from the list",
      "Rate the proportion of your work that involves routine/repetitive tasks versus novel problem-solving",
      "Indicate the level of human interaction required — client-facing roles are generally more resistant to automation",
      "Rate the creative and judgment requirements of your position",
      "Review your overall automation risk score and the specific task categories driving it higher or lower"
    ],
    tipsAndConsiderations: [
      "Jobs most resistant to AI replacement combine physical skill with judgment: electricians, plumbers, surgeons, emergency responders. Jobs most vulnerable are routine cognitive tasks: data entry, basic report writing, scheduling, bookkeeping.",
      "AI is more likely to transform your job than eliminate it entirely. Focus on the tasks AI can't do well — relationship building, creative strategy, ethical judgment, and physical problem-solving — and build those skills.",
      "Historical precedent suggests automation creates more jobs than it destroys, but the transition period is painful and the new jobs require different skills. Start upskilling now, not when the disruption arrives.",
      "The risk isn't just direct replacement — it's productivity compression. If AI makes one person 3x more productive, companies may need one-third as many people in that role even if no one is 'replaced by AI.'",
      "Industries with strong labor regulations, licensing requirements, and liability concerns (healthcare, law, aviation) will adopt AI more slowly even where the technology is capable."
    ]
  },

  "nuclear-blast-radius-calculator": {
    contentIntro: "The destructive radius of a nuclear weapon scales with the cube root of its yield — meaning a bomb 1,000 times more powerful doesn't create a blast zone 1,000 times larger, but about 10 times larger. A 15-kiloton weapon (Hiroshima-sized) creates a total destruction radius of about 1.6 km, a severe damage radius of 3.7 km, and thermal burns out to 4.7 km. Modern strategic warheads range from 100 kilotons to 800 kilotons, with the US W76 at 100 kt and the Russian RS-28 Sarmat carrying up to 15 warheads of 500 kt each. This calculator uses the standard Glasstone & Dolan scaling laws from 'The Effects of Nuclear Weapons' to estimate blast overpressure zones, thermal radiation radii, initial radiation zones, and fallout patterns based on weapon yield, detonation altitude, and wind conditions.",
    howToSteps: [
      "Select a weapon yield in kilotons — or choose from presets like Hiroshima (15 kt), Trident W76 (100 kt), or Tsar Bomba (50 Mt)",
      "Choose airburst or surface detonation — airbursts maximize blast damage area while surface bursts create fallout craters",
      "Enter a location or address to overlay the blast zones on a map for visual reference",
      "Review the concentric damage zones: fireball, total destruction, severe damage, moderate damage, and thermal radiation",
      "Check the estimated casualties and the recommended minimum evacuation distance"
    ],
    tipsAndConsiderations: [
      "Airbursts are far more destructive over a wider area than surface bursts of the same yield. That's why most strategic weapons are designed to detonate at optimal altitude (roughly 2-3 km for a 500 kt weapon) — not on impact.",
      "Fallout is primarily a concern with surface bursts that create a crater, lofting irradiated soil into the atmosphere. In an airburst, fallout is minimal. This is counterintuitive but well-established in nuclear weapons physics.",
      "Sheltering in a concrete or brick building reduces your radiation dose by 90% compared to being outside. A basement reduces it by 99%. In a fallout scenario, the first 24-48 hours indoors are the most critical as radiation levels drop rapidly.",
      "The thermal pulse travels at the speed of light. If you see a bright flash, you have 10-30 seconds before the blast wave arrives (depending on distance). Get behind something solid, lie face-down, and cover exposed skin."
    ]
  },

  "billionaire-wealth-comparison": {
    contentIntro: "Human brains cannot intuitively comprehend numbers above a few thousand. A million seconds is 11.5 days. A billion seconds is 31.7 years. That's the gap between a millionaire and a billionaire — and it explains why 'billionaire' doesn't land with the weight it should. If you earn $60,000/year, Jeff Bezos spending $500,000 on a yacht party is proportionally equivalent to you spending about 17 cents. Elon Musk's peak net worth of $250 billion means he could spend $10 million per day for 68 years and still not run out. This tool rescales billionaire spending to your personal income so the numbers actually register. It's not about envy — it's about understanding the scale of wealth concentration in a way that abstract numbers cannot convey.",
    howToSteps: [
      "Enter your annual income or net worth to use as the comparison baseline",
      "Select a billionaire from the list or enter a custom net worth amount",
      "Browse real-world purchases and expenditures scaled to what they'd feel like at your income level",
      "Compare multiple billionaires to see the wealth gap even among the ultra-rich",
      "Check the time comparisons — how long it would take you to earn what they earn in a minute, hour, or day"
    ],
    tipsAndConsiderations: [
      "Billionaire net worth is mostly unrealized stock gains, not cash. Elon Musk doesn't have $200 billion in a bank account — it's the current market value of his Tesla and SpaceX shares. If he tried to sell it all, the price would collapse.",
      "The top 1% in the US starts at roughly $13 million in net worth. The top 0.1% starts at $43 million. The gap between the merely rich and the billionaire class is itself enormous.",
      "Wealth growth at this scale is largely passive. At a 7% annual return, $1 billion generates $70 million per year — $192,000 per day — without working a single hour.",
      "Tax rates on billionaires are often lower than on high-income earners because capital gains (20% federal max) are taxed less than income (37% top bracket), and unrealized gains aren't taxed at all until sold."
    ]
  },

  "angel-number-calculator": {
    contentIntro: "Angel numbers are repeating number sequences — 111, 222, 333, 444, and so on — that practitioners of numerology believe carry spiritual messages. The concept gained massive popularity through Doreen Virtue's work in the early 2000s and has become a mainstream element of spiritual and wellness culture. Each number from 0-9 carries a distinct vibrational meaning in numerology: 1 represents new beginnings and initiative, 2 symbolizes balance and partnership, 3 relates to creativity and communication, and so on. When digits repeat (like 444), the energy is amplified. When sequences appear (like 1234), they suggest a progression or journey. This calculator takes any number you've been noticing — on clocks, receipts, license plates, addresses — and breaks down its numerological significance using both traditional Pythagorean numerology and modern angel number interpretations.",
    howToSteps: [
      "Enter the number you've been repeatedly seeing — it can be 2 digits, 3 digits, 4 digits, or longer",
      "The calculator breaks down each individual digit's meaning and the combined significance",
      "Review the specific message associated with your angel number sequence",
      "Check the associated life areas (love, career, spiritual growth, finances) that the number relates to",
      "Learn about the numerological root number (all digits added together, reduced to a single digit) for deeper interpretation"
    ],
    tipsAndConsiderations: [
      "Confirmation bias is real — once you start looking for repeating numbers, you'll see them everywhere because your brain is primed to notice them. This doesn't necessarily invalidate the experience, but it's worth being aware of.",
      "In numerology, master numbers (11, 22, 33) are not reduced to single digits because they carry their own powerful significance. 11 relates to intuition, 22 to master building, and 33 to master teaching.",
      "The most commonly reported angel numbers are 111 (manifestation and new beginnings), 222 (trust and alignment), 444 (protection and stability), and 555 (major change approaching).",
      "Angel numbers are a modern spiritual practice, not an ancient tradition. They draw from Pythagorean numerology (6th century BC) but the 'angel' framing is from the late 20th century. Enjoy the meaning you find in them without taking them as literal divine commands."
    ]
  },

  "gold-investment-return-calculator": {
    contentIntro: "Gold has averaged about 7.8% annual returns since 1971 when Nixon ended the gold standard, roughly matching inflation-adjusted stock market returns over the same period — but with very different behavior. Gold tends to surge during crises (up 25% in 2020, up 30% in 2024) and stagnate during bull markets (flat from 2013-2019). From its 1980 peak of $850/oz, it took 28 years to permanently surpass that price in nominal terms. At $2,600+/oz in 2025-2026, gold is near all-time highs. This calculator projects returns on gold investments over your chosen time period, compares them against historical performance, and factors in the costs that eat into returns: dealer premiums (3-10% on physical gold), storage fees for physical holdings, and expense ratios for gold ETFs (0.25-0.40% annually).",
    howToSteps: [
      "Enter your investment amount in dollars",
      "Choose your gold investment type: physical bullion, gold ETF (like GLD or IAU), or gold mining stocks",
      "Set the assumed annual return rate — use 5-8% for a historically grounded estimate",
      "Enter the holding period in years",
      "Review projected returns with and without typical costs (dealer premium, storage, or ETF expense ratio) factored in"
    ],
    tipsAndConsiderations: [
      "Physical gold carries hidden costs: dealer premiums of 3-10% over spot price, secure storage ($100-300/year for a safe deposit box or vault), and insurance. These costs reduce your effective return significantly.",
      "Gold ETFs (GLD, IAU) are the cheapest way to get gold exposure. IAU charges 0.25% annually, meaning $25/year per $10,000 invested. No storage, no insurance, no dealer markup, and you can buy and sell instantly.",
      "Gold produces no income — no dividends, no interest, no rent. Its return is 100% price appreciation. In a portfolio, it works best as a 5-10% diversifier for crisis protection, not as a core holding.",
      "Gold is priced in US dollars globally. When the dollar weakens, gold tends to rise even if demand hasn't changed. This makes gold partly a bet against the dollar, which can be useful or redundant depending on your other holdings."
    ]
  },

  "bitcoin-halving-calculator": {
    contentIntro: "Bitcoin's halving is the most predictable supply shock in any financial asset. Every 210,000 blocks (roughly every 4 years), the block reward miners receive is cut in half. The first halving in 2012 dropped the reward from 50 BTC to 25 BTC. The 2024 halving cut it from 6.25 to 3.125 BTC. After each previous halving, Bitcoin's price has eventually set new all-time highs — though the timing and magnitude of gains have varied: 9,200% after the 2012 halving, 2,800% after 2016, and about 700% after 2020. This calculator tracks the countdown to the next halving, estimates the date based on current block production rates, and shows how the supply issuance schedule changes over time. It also provides historical context on post-halving price performance — useful data, but not a guarantee of future results.",
    howToSteps: [
      "View the countdown showing estimated blocks and days remaining until the next halving event",
      "Check the current block reward and what it will drop to after the halving",
      "Review the historical price data showing Bitcoin's value at each previous halving and subsequent peaks",
      "Enter a BTC amount to see how mining economics change — the same hash power will produce half the coins post-halving",
      "Explore the long-term supply curve showing how Bitcoin approaches its 21 million cap asymptotically"
    ],
    tipsAndConsiderations: [
      "Past halving cycles don't guarantee future performance. Each successive halving has produced smaller percentage gains. The supply shock matters less as Bitcoin matures because the reward is already a tiny fraction of circulating supply.",
      "Halvings are bullish for price only because demand must remain constant or increase while new supply is cut in half. If demand drops simultaneously, the halving alone doesn't prevent price declines.",
      "Mining profitability gets cut in half overnight at each halving (assuming constant BTC price). Miners with high electricity costs get squeezed out, temporarily reducing hash rate until difficulty adjusts downward — this takes about 2 weeks.",
      "The final Bitcoin will be mined around the year 2140. After that, miners are sustained entirely by transaction fees. Whether those fees will be sufficient to secure the network is an open and actively debated question."
    ]
  },

  "tariff-cost-calculator": {
    contentIntro: "Tariffs are taxes on imported goods, and they're paid by the importing company — not the foreign manufacturer. That cost gets passed to consumers through higher prices, typically marked up further through the supply chain. A 25% tariff on a $100 imported component doesn't add $25 to the final product — it adds $25 to the importer's cost, which gets marked up by distributors and retailers, often resulting in $35-$50 more at the retail level. The 2025-2026 tariff environment includes rates of 10-25% on Chinese goods, steel and aluminum tariffs, and various sector-specific duties. This calculator estimates how tariffs affect product costs at each stage of the supply chain, from landed cost to wholesale to retail price, helping importers, retailers, and consumers understand the true impact on prices.",
    howToSteps: [
      "Enter the product's foreign factory cost or FOB (free on board) price",
      "Select the applicable tariff rate based on the product's HTS code and country of origin",
      "Add shipping, insurance, and other import costs to calculate the landed cost with duties",
      "Set the wholesale and retail markup percentages to see the cascading price impact through the supply chain",
      "Compare scenarios with and without tariffs to see the total consumer price difference"
    ],
    tipsAndConsiderations: [
      "Tariffs compound through markup chains. A 25% tariff on a $10 import cost adds $2.50 in duty, but if the wholesaler applies a 40% markup and the retailer adds 50%, the consumer pays about $5.25 more — more than double the tariff itself.",
      "Tariff exclusions and exemptions exist for specific products. Check the USTR exclusion portal — some importers are paying tariffs they don't actually owe because they haven't applied for available exclusions.",
      "Country of origin rules can be complex. If a product is substantially transformed in a third country before import, it may qualify for a different (lower) tariff rate. Many companies have restructured supply chains around these rules.",
      "First Sale valuation can reduce tariff costs by 10-20% for products that go through a middleman. Instead of paying duty on the price you paid, you pay duty on the first sale price (manufacturer to middleman), which is lower."
    ]
  },

  "square-footage-calculator": {
    contentIntro: "Square footage calculations underpin virtually every home improvement project, real estate listing, flooring purchase, and paint estimate — yet miscalculation is rampant. Real estate agents routinely list homes with inaccurate square footage (ANSI standards exclude garages, unfinished basements, and rooms with ceiling heights under 7 feet, but these rules are inconsistently applied). For projects, getting the area wrong by even 5% means returning materials or making extra trips to the store. An L-shaped room can't be measured with a single length and width — you need to break it into rectangles. A room with a bay window or closet alcove requires multiple measurements. This calculator handles rectangular, triangular, circular, and irregular shaped areas, lets you combine multiple shapes, and converts between square feet, square yards, and square meters.",
    howToSteps: [
      "Select the shape of the area you're measuring: rectangle, triangle, circle, or trapezoid",
      "Enter the dimensions — for rectangles, length and width; for triangles, base and height; for circles, radius or diameter",
      "For L-shaped or irregular rooms, break them into multiple rectangles and add the areas together",
      "Use the unit conversion to switch between square feet, square yards, square meters, and acres as needed",
      "Subtract any areas that shouldn't be included (like a fireplace hearth, stairwell, or built-in closet) for accurate net square footage"
    ],
    tipsAndConsiderations: [
      "Always measure to the longest points and then subtract cutouts rather than trying to measure an irregular shape in one go. An L-shaped room is two rectangles added together, not one complex measurement.",
      "For flooring and tile, add 10% to your calculated square footage for waste from cuts, breakage, and pattern matching. For diagonal tile layouts, add 15%.",
      "ANSI standards for measuring livable square footage require finished floor-to-ceiling height of at least 7 feet. Sloped ceiling areas (like finished attics) only count where the ceiling meets this threshold.",
      "When measuring for real estate purposes, measure from the exterior walls. For materials purchasing, measure from interior wall to interior wall. The difference can be 5-8% on a typical home."
    ]
  },

  "mulch-calculator": {
    contentIntro: "Mulch is sold by the cubic yard at landscape supply yards (typically $25-$45 per yard delivered) or by the bag at hardware stores (about $4-6 for a 2 cubic foot bag). The bag route costs roughly 3x more per cubic foot, but for small projects it avoids the 2-3 cubic yard delivery minimums. A standard mulch depth of 2-3 inches is recommended for most landscaping beds — thinner than 2 inches won't suppress weeds effectively, and thicker than 4 inches can suffocate plant roots and create moisture problems. This calculator converts your bed dimensions into cubic yards and bags needed, with adjustments for mulch type and depth. It also estimates how much existing mulch you should remove first: organic mulch decomposes 1-2 inches per year, so annual top-up of 1-2 inches maintains the right depth without building up too much.",
    howToSteps: [
      "Enter the length and width of each landscaping bed (or use the irregular shape option for non-rectangular areas)",
      "Set the mulch depth — 2 inches for refreshing existing mulch, 3 inches for bare soil or new beds",
      "Select the mulch type (hardwood, pine bark, rubber, etc.) for weight and coverage estimates",
      "Review the total cubic yards needed and the equivalent number of bags",
      "Add 5-10% extra for settling, spillage, and uneven bed depths"
    ],
    tipsAndConsiderations: [
      "Keep mulch 3-6 inches away from tree trunks and plant stems. 'Volcano mulching' (piling mulch against the trunk) traps moisture, promotes rot, and invites boring insects. It's the most common landscaping mistake and it kills trees slowly.",
      "Hardwood mulch and pine bark are the most popular organic options. Hardwood breaks down in 1-2 years (adding nutrients but requiring annual refresh), while pine bark lasts 2-3 years but acidifies the soil slightly.",
      "Dyed mulch (red, black, brown) is cosmetically popular but the dye can contain chemicals from recycled pallets and construction wood. Look for mulch dyed with iron oxide (safe) rather than carbon black.",
      "One cubic yard of mulch covers approximately 162 square feet at 2 inches deep, 108 square feet at 3 inches, or 81 square feet at 4 inches. These are the three numbers worth memorizing."
    ]
  },

  "fence-material-calculator": {
    contentIntro: "A 150-foot privacy fence seems straightforward until you realize the materials list includes posts (every 6-8 feet), rails (2-3 per section), pickets (calculated to the individual board), post caps, concrete for setting posts (2 bags per post), screws or nails, and potentially a gate kit. Miss any of these and your project stalls mid-build. The most common mistake is spacing posts too far apart — 8 feet on center is the maximum for most fence types, and 6 feet is more structurally sound, especially in high-wind areas. For a standard 6-foot privacy fence using dog-ear pickets, expect to spend $15-25 per linear foot for materials alone. This calculator generates a complete materials list based on your fence length, height, style, and material so nothing gets forgotten.",
    howToSteps: [
      "Enter the total fence length in linear feet — measure along the property line or perimeter",
      "Select the fence style: privacy (board-on-board or dog-ear), picket, split rail, or shadowbox",
      "Choose the material: pressure-treated pine, cedar, composite, or vinyl",
      "Specify the fence height (4, 5, or 6 feet) and post spacing (6 or 8 feet on center)",
      "Add gates if needed — indicate width and quantity — then review the full materials list with quantities"
    ],
    tipsAndConsiderations: [
      "Set posts in concrete, not just packed dirt. Each post needs 2-3 bags of fast-setting concrete ($5-6 per bag). Posts set in dirt will lean within 2-3 years, especially in areas with freeze-thaw cycles.",
      "Pressure-treated posts should be rated for ground contact (UC4A or UC4B). Standard above-ground pressure-treated lumber (UC3B) will rot in the ground within 5-7 years.",
      "Check your local building codes and HOA rules BEFORE buying materials. Many jurisdictions limit fence height to 6 feet in back yards and 4 feet in front yards, and require the 'finished' side to face your neighbor.",
      "Cedar costs 30-50% more than pressure-treated pine upfront but lasts 15-20 years without chemical treatment and doesn't warp as badly. Over a 20-year span, cedar often costs less because pressure-treated fences need earlier replacement.",
      "Call 811 (national utility locate service) before digging post holes. Hitting a buried gas or electric line is dangerous and expensive — the locate service is free and legally required in most states."
    ]
  },

  "drywall-calculator": {
    contentIntro: "Drywall comes in standard 4x8-foot sheets (32 square feet each), with 4x12 sheets available for rooms where longer panels mean fewer seams. A 12x12 room with 8-foot ceilings has 512 square feet of wall area — accounting for two doors (42 sq ft) and a window (15 sq ft), you need about 455 square feet, or roughly 15 sheets of 4x8. But drywall is just the beginning: you also need joint tape (one roll per 100 sq ft), joint compound (roughly one 4.5-gallon bucket per 100 sq ft for three coats), screws (about 32 per sheet), and corner bead for outside corners. This calculator generates the complete supply list based on your room dimensions, automatically subtracts doors and windows, and includes the finishing materials most DIYers forget to buy.",
    howToSteps: [
      "Enter room dimensions: length, width, and ceiling height",
      "Specify the number of doors, windows, and any other openings to subtract from the wall area",
      "Select the drywall thickness — 1/2 inch is standard for walls, 5/8 inch for ceilings and fire-rated assemblies",
      "Choose sheet size — 4x8 for standard rooms, 4x12 for tall walls or long runs with fewer seams",
      "Review the total sheets needed plus tape, joint compound, screws, and corner bead quantities"
    ],
    tipsAndConsiderations: [
      "Buy 10-15% more drywall than calculated. Cuts, mistakes, and damaged sheets are inevitable — especially for beginners. Returning unused full sheets is easy; making an emergency run mid-project is not.",
      "Hang ceilings first, then walls. The wall sheets support the ceiling edges, creating tighter joints. And always hang the top row of wall sheets before the bottom — gravity helps seat them against the ceiling.",
      "Use 5/8-inch drywall on ceilings to prevent sagging between joists. Half-inch drywall on 24-inch joist spacing will visibly sag over time, giving your ceiling a wavy appearance.",
      "Three coats of joint compound is not optional — it's the minimum for invisible seams. First coat fills the joint, second coat feathers it out, third coat blends. Each coat should extend 2-3 inches wider than the previous one.",
      "Moisture-resistant (green board) drywall is required in bathrooms and laundry rooms but is NOT suitable for direct water exposure like shower surrounds. Use cement board behind tile in wet areas."
    ]
  },

  "hardwood-flooring-calculator": {
    contentIntro: "Hardwood flooring is measured and sold by the square foot, but you should never order exactly the square footage of your room. Industry standard is to add 10% for waste on straight installations and 15% for diagonal or herringbone patterns — the cuts at walls, doorways, and around obstacles produce offcuts too short to use. A 300 sq ft room needs 330-345 sq ft of material ordered. Hardwood ranges from $3/sq ft for builder-grade oak to $15+/sq ft for exotic species like Brazilian walnut. Installation adds $3-8/sq ft for nail-down or glue-down, or you can save significantly with click-lock engineered hardwood that's designed for DIY floating installation. This calculator computes your material needs including waste factor, transition strips, underlayment, and estimated cost by wood type.",
    howToSteps: [
      "Enter the room dimensions — length and width in feet, or enter total square footage directly for irregular rooms",
      "Subtract any areas that won't be covered (closets you're skipping, fireplace hearths, built-in cabinets)",
      "Select the installation pattern — straight/parallel adds 10% waste, diagonal adds 15%, herringbone adds 20%",
      "Choose your wood type and grade to get a material cost estimate per square foot",
      "Review total square footage to order, plus quantities for underlayment, transition strips, and baseboards"
    ],
    tipsAndConsiderations: [
      "Let hardwood acclimate in the room where it will be installed for at least 3-5 days before installation. Wood expands and contracts with humidity — installing before acclimation leads to gaps or buckling within months.",
      "Engineered hardwood handles humidity and temperature swings better than solid hardwood and can be installed over concrete or with radiant heat. For basements or any below-grade room, engineered is the only hardwood option.",
      "The direction you run the boards matters visually and structurally. Running boards parallel to the longest wall makes rooms feel larger. Running perpendicular to floor joists provides the most structural support for nail-down installations.",
      "Transition strips at doorways and between rooms cost $5-15 each and are easy to forget. Count every doorway and room transition — a typical house needs 8-15 transition pieces.",
      "Refinishing solid hardwood 3-4 times over its lifetime is normal and extends the floor's life to 75-100 years. Engineered hardwood can typically be refinished 1-2 times depending on the veneer thickness."
    ]
  }
};

// Process all tools
let updated = 0;
let skipped = 0;
let errors = [];

for (const [slug, content] of Object.entries(toolContent)) {
  const configPath = path.join(configDir, `${slug}.json`);

  if (!fs.existsSync(configPath)) {
    errors.push(`Config not found: ${slug}`);
    continue;
  }

  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    // Only add fields that don't already exist
    let changed = false;
    if (!config.contentIntro) {
      config.contentIntro = content.contentIntro;
      changed = true;
    }
    if (!config.howToSteps) {
      config.howToSteps = content.howToSteps;
      changed = true;
    }
    if (!config.tipsAndConsiderations) {
      config.tipsAndConsiderations = content.tipsAndConsiderations;
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');
      updated++;
      console.log(`Updated: ${slug}`);
    } else {
      skipped++;
      console.log(`Skipped (already has fields): ${slug}`);
    }
  } catch (e) {
    errors.push(`Error processing ${slug}: ${e.message}`);
  }
}

console.log(`\nDone! Updated: ${updated}, Skipped: ${skipped}, Errors: ${errors.length}`);
if (errors.length) {
  console.log('Errors:', errors);
}
