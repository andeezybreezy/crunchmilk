(function() {
  'use strict';

  function fmtDollars(n) {
    return '$' + n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // Country database: income req (USD/mo), duration, cost, tax, notes
  var countries = {
    portugal:    { name: 'Portugal', income: 3500, duration: '1 year (renewable)', cost: '$85', tax: 'NHR: 20% flat rate on qualifying income', region: 'Europe', notes: 'NHR regime for 10 years. EU access. Great coworking scene in Lisbon.' },
    spain:       { name: 'Spain', income: 2700, duration: '1 year (renewable to 3yr)', cost: '$80', tax: 'Beckham Law: 24% flat rate', region: 'Europe', notes: 'Beckham Law special tax regime. Must not have been Spanish resident in prior 5 years.' },
    croatia:     { name: 'Croatia', income: 2700, duration: '1 year', cost: '$100', tax: 'Tax exempt on foreign income', region: 'Europe', notes: 'EU member. No local income tax on remote earnings. Beautiful coastline.' },
    greece:      { name: 'Greece', income: 3500, duration: '1 year (renewable)', cost: '$75', tax: '50% income tax reduction for 7 years', region: 'Europe', notes: '50% tax discount for new residents. Excellent weather and low cost of living.' },
    italy:       { name: 'Italy', income: 2800, duration: '1 year (renewable)', cost: '$100', tax: '70% income tax exemption option', region: 'Europe', notes: 'Inpatriate tax regime offers major savings. Apply for Elective Residency visa.' },
    malta:       { name: 'Malta', income: 2700, duration: '1 year', cost: '$300', tax: '15% flat rate on remitted income', region: 'Europe', notes: 'English-speaking EU island. Nomad Residence Permit program.' },
    estonia:     { name: 'Estonia', income: 4500, duration: '1 year', cost: '$100', tax: 'Tax after 183 days residency', region: 'Europe', notes: 'First country to offer digital nomad visa. E-Residency program for company setup.' },
    czech:       { name: 'Czech Republic', income: 5500, duration: '1 year', cost: '$120', tax: '15-23% progressive', region: 'Europe', notes: 'Zivno (trade license) visa. Prague is a major nomad hub. Higher income requirement.' },
    germany:     { name: 'Germany', income: 4000, duration: '6 months - 3 years', cost: '$100', tax: 'Progressive 14-45%', region: 'Europe', notes: 'Freelancer visa available. Must prove income from German or international clients.' },
    costa_rica:  { name: 'Costa Rica', income: 3000, duration: '1 year (renewable)', cost: '$100', tax: 'Tax exempt on foreign income', region: 'Americas', notes: 'No tax on foreign-sourced income. Pura vida lifestyle. Strong internet in cities.' },
    mexico:      { name: 'Mexico', income: 2600, duration: '1-4 years', cost: '$50', tax: 'Tax after 183 days', region: 'Americas', notes: 'Temporary Resident visa. Mexico City, Playa del Carmen, Oaxaca are popular hubs.' },
    colombia:    { name: 'Colombia', income: 750, duration: '2 years', cost: '$100', tax: 'Tax after 183 days', region: 'Americas', notes: 'Lowest income requirement. Medellin is top nomad city. Great weather year-round.' },
    brazil:      { name: 'Brazil', income: 1500, duration: '1 year (renewable)', cost: '$100', tax: 'Tax after 183 days (progressive 7.5-27.5%)', region: 'Americas', notes: 'Digital Nomad Visa launched 2022. Must prove remote employment/freelancing.' },
    argentina:   { name: 'Argentina', income: 1500, duration: '6 months (renewable)', cost: '$200', tax: 'Tax exempt if < 6 months', region: 'Americas', notes: 'Buenos Aires is a top nomad city. Favorable exchange rates. Blue dollar market.' },
    uruguay:     { name: 'Uruguay', income: 1500, duration: '6 months - 1 year', cost: '$100', tax: 'Tax holiday first year', region: 'Americas', notes: 'Stable economy, good infrastructure. Tax holiday for new residents first year.' },
    panama:      { name: 'Panama', income: 3000, duration: '9 months (renewable)', cost: '$250', tax: 'Territorial taxation (foreign income exempt)', region: 'Americas', notes: 'Only local-sourced income taxed. USD currency. Modern Panama City.' },
    barbados:    { name: 'Barbados', income: 5000, duration: '1 year', cost: '$2,000', tax: 'Tax exempt', region: 'Caribbean', notes: 'Welcome Stamp visa. No local taxes on remote income. Premium pricing.' },
    bermuda:     { name: 'Bermuda', income: 5000, duration: '1 year', cost: '$263', tax: 'No income tax', region: 'Caribbean', notes: 'No income tax at all. High cost of living. Close to US East Coast.' },
    cayman:      { name: 'Cayman Islands', income: 8333, duration: '2 years', cost: '$1,469', tax: 'No income tax', region: 'Caribbean', notes: 'Global Citizen Concierge Program. Zero income tax. High minimum income.' },
    dubai:       { name: 'Dubai (UAE)', income: 5000, duration: '1 year', cost: '$287', tax: 'No income tax', region: 'Middle East', notes: 'Virtual Working Programme. Zero income tax. World-class infrastructure.' },
    thailand:    { name: 'Thailand', income: 2500, duration: '5 years (Long-Term Resident)', cost: '$300', tax: 'Exempt if income not remitted', region: 'Asia', notes: 'Long-Term Resident visa. Excellent value. Bangkok, Chiang Mai are nomad hubs.' },
    indonesia:   { name: 'Indonesia (Bali)', income: 2000, duration: '1 year (renewable)', cost: '$350', tax: 'Tax exempt on foreign income', region: 'Asia', notes: 'B211A Digital Nomad visa. Bali is #1 nomad destination. Affordable living.' },
    malaysia:    { name: 'Malaysia', income: 2000, duration: '1 year (renewable)', cost: '$200', tax: 'Foreign income exempt', region: 'Asia', notes: 'DE Rantau Programme. KL is modern and affordable. Foreign income not taxed.' },
    japan:       { name: 'Japan', income: 3500, duration: '6 months', cost: '$200', tax: 'Tax after 183 days', region: 'Asia', notes: 'Digital Nomad visa launched 2024. 6-month max stay. Strong infrastructure.' },
    south_korea: { name: 'South Korea', income: 2800, duration: '1 year', cost: '$150', tax: 'Tax after 183 days', region: 'Asia', notes: 'Workcation visa. Seoul has excellent internet and infrastructure.' },
    taiwan:      { name: 'Taiwan', income: 2500, duration: '6 months (renewable)', cost: '$100', tax: 'Tax after 183 days', region: 'Asia', notes: 'Gold Card for professionals. Taiwan has world-class internet and safety.' },
    georgia:     { name: 'Georgia', income: 2000, duration: '1 year', cost: 'Free', tax: 'Tax exempt < 183 days; 1% program available', region: 'Europe/Asia', notes: 'Remotely from Georgia program. Most nationalities visa-free for 1 year. Very affordable.' },
    mauritius:   { name: 'Mauritius', income: 1500, duration: '1 year (renewable)', cost: '$0', tax: '15% flat rate (after 183 days)', region: 'Africa', notes: 'Premium Visa. Beautiful island. No application fee.' },
    south_africa:{ name: 'South Africa', income: 3000, duration: '1 year', cost: '$200', tax: 'Tax after 183 days', region: 'Africa', notes: 'Remote work visa proposal. Cape Town is a top nomad city. Great exchange rate.' },
    cabo_verde:  { name: 'Cabo Verde', income: 1500, duration: '6 months (renewable)', cost: '$100', tax: 'Tax exempt on foreign income', region: 'Africa', notes: 'Remote Working Cabo Verde. Island nation off West Africa. Growing nomad community.' },
    iceland:     { name: 'Iceland', income: 7500, duration: '6 months', cost: '$100', tax: 'Tax after 183 days', region: 'Europe', notes: 'High income requirement. Stunning nature. High cost of living.' },
    norway:      { name: 'Norway', income: 4200, duration: '2 years', cost: '$600', tax: '22% + social contributions', region: 'Europe', notes: 'Independent Contractor visa. High taxes but world-class quality of life.' }
  };

  var nationalityEl = document.getElementById('nationality');
  var monthlyIncomeEl = document.getElementById('monthlyIncome');
  var destinationEl = document.getElementById('destination');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var chartData = [
    ['Portugal', '$3,500', '1 year', '$85', 'NHR: 20% flat rate'],
    ['Spain', '$2,700', '1 year', '$80', 'Beckham Law: 24%'],
    ['Croatia', '$2,700', '1 year', '$100', 'Tax exempt'],
    ['Thailand', '$2,500', '5 years', '$300', 'Exempt < 180 days'],
    ['Colombia', '$750', '2 years', '$100', 'Tax after 183 days'],
    ['Barbados', '$5,000', '1 year', '$2,000', 'Tax exempt']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      var cells = '';
      for (var i = 0; i < row.length; i++) cells += '<td>' + row[i] + '</td>';
      tr.innerHTML = cells;
      chartBody.appendChild(tr);
    });
  }

  function getVal(el) {
    var v = parseFloat(el.value);
    return isNaN(v) ? 0 : v;
  }

  function calculate() {
    var income = getVal(monthlyIncomeEl);
    var dest = destinationEl.value;

    if (income <= 0) return;

    var eligible = [];
    var notEligible = [];

    if (dest === 'all') {
      var keys = Object.keys(countries);
      keys.forEach(function(k) {
        var c = countries[k];
        if (income >= c.income) eligible.push(c);
        else notEligible.push(c);
      });
      eligible.sort(function(a, b) { return a.income - b.income; });
      notEligible.sort(function(a, b) { return a.income - b.income; });
    } else {
      var c = countries[dest];
      if (c) {
        if (income >= c.income) eligible.push(c);
        else notEligible.push(c);
      }
    }

    var totalCount = eligible.length;
    document.getElementById('rEligibility').textContent = totalCount > 0 ? 'Eligible' : 'Not Eligible';
    document.getElementById('rEligibility').style.color = totalCount > 0 ? '#059669' : '#dc2626';
    document.getElementById('rCount').textContent = totalCount + ' of ' + Object.keys(countries).length;
    document.getElementById('rCount').style.color = '#2563eb';

    var d = '';

    if (eligible.length > 0) {
      d += '<div style="margin-bottom:16px">';
      d += '<strong style="color:#059669">Eligible Countries (' + eligible.length + ')</strong>';

      eligible.forEach(function(c) {
        var surplus = income - c.income;
        d += '<div style="padding:12px;background:#f0fdf4;border-radius:8px;margin-top:8px;border-left:3px solid #059669">';
        d += '<div style="display:flex;justify-content:space-between;align-items:center">';
        d += '<strong>' + c.name + '</strong>';
        d += '<span style="color:#059669;font-size:0.85rem">+' + fmtDollars(surplus) + '/mo surplus</span>';
        d += '</div>';
        d += '<div style="font-size:0.85rem;margin-top:6px;display:grid;grid-template-columns:1fr 1fr;gap:4px">';
        d += '<span>Min income: ' + fmtDollars(c.income) + '/mo</span>';
        d += '<span>Duration: ' + c.duration + '</span>';
        d += '<span>Cost: ' + c.cost + '</span>';
        d += '<span>Tax: ' + c.tax + '</span>';
        d += '</div>';
        d += '<div style="font-size:0.8rem;color:var(--text-light);margin-top:4px">' + c.notes + '</div>';
        d += '</div>';
      });
      d += '</div>';
    }

    if (notEligible.length > 0 && dest === 'all' && notEligible.length <= 10) {
      d += '<div>';
      d += '<strong style="color:#dc2626">Not Yet Eligible (' + notEligible.length + ')</strong>';
      notEligible.forEach(function(c) {
        var shortfall = c.income - income;
        d += '<div style="padding:8px 12px;background:#fef2f2;border-radius:8px;margin-top:6px;font-size:0.85rem;border-left:3px solid #dc2626">';
        d += '<strong>' + c.name + '</strong> — need ' + fmtDollars(shortfall) + '/mo more (min: ' + fmtDollars(c.income) + '/mo)';
        d += '</div>';
      });
      d += '</div>';
    } else if (notEligible.length > 0 && dest !== 'all') {
      var c2 = notEligible[0];
      var shortfall2 = c2.income - income;
      d += '<div style="padding:12px;background:#fef2f2;border-radius:8px;border-left:3px solid #dc2626">';
      d += '<strong style="color:#dc2626">Not Eligible for ' + c2.name + '</strong><br>';
      d += 'Minimum income: ' + fmtDollars(c2.income) + '/mo<br>';
      d += 'Your income: ' + fmtDollars(income) + '/mo<br>';
      d += 'Shortfall: <strong>' + fmtDollars(shortfall2) + '/mo</strong><br>';
      d += '<span style="font-size:0.85rem">' + c2.notes + '</span>';
      d += '</div>';
    }

    document.getElementById('resultDetails').innerHTML = d;
    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  [nationalityEl, monthlyIncomeEl, destinationEl].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('change', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

})();
