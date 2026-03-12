(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var restrictionLevel = document.getElementById('restrictionLevel').value;
    var sector = document.getElementById('sector').value;

    // Calculation logic
    var restriction = parseInt(restrictionLevel); var chinaShare = 60; var supplyGap = restriction * chinaShare / 100; var priceMultiplier = 1 + (supplyGap / 100 * 5); var sectorData = {defense: 'F-35: 920 lbs of rare earths each. Virginia-class sub: 9,200 lbs. Production delays 12-24 months.', ev: 'Each EV motor needs 1-2 kg of rare earths. Production could drop 30-60%. Prices up $2,000-8,000/vehicle.', wind: 'Each wind turbine uses 600+ lbs. New installations delayed 50-80%. Clean energy transition slowed 5-10 years.', electronics: 'Smartphones, laptops, displays affected. Consumer prices up 10-30%.', all: 'Defense, EVs, wind, electronics all face shortages. Price increases 50-400% across critical minerals.'};     document.getElementById('supplyGap').textContent = supplyGap.toFixed(0) + '% of global supply removed';
    document.getElementById('priceImpact').textContent = '+' + ((priceMultiplier - 1) * 100).toFixed(0) + '% price increase';
    document.getElementById('sectorImpact').textContent = sectorData[sector];
    document.getElementById('alternativeTimeline').textContent = restriction > 50 ? '5-10 years for alternative mines' : '2-5 years for alternative mines';
    document.getElementById('stockpile').textContent = 'US has ~42 days of critical mineral reserves';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['restrictionLevel', 'sector'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
