(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var currentShare = parseFloat(document.getElementById('currentShare').value) || 0;
    var growthRate = parseFloat(document.getElementById('growthRate').value) || 0;
    var policySupport = document.getElementById('policySupport').value;
    var gasPrice = parseFloat(document.getElementById('gasPrice').value) || 0;
    var avgEVPrice = parseFloat(document.getElementById('avgEVPrice').value) || 0;

    // Calculation logic
    var policyAdj = {hostile: 0.6, neutral: 0.85, moderate: 1.0, aggressive: 1.3}; var gasPriceFactor = gasPrice > 5 ? 1.15 : gasPrice > 4 ? 1.05 : gasPrice < 2.50 ? 0.85 : 1.0; var adjGrowth = (growthRate / 100) * policyAdj[policySupport] * gasPriceFactor; var share = currentShare; var yr25 = 'Already reached'; var yr50 = 'Already reached'; var yr75 = 'Already reached'; var y = 2024; for (var i = 0; i < 30; i++) { var slowdown = share > 30 ? Math.max(0.3, 1 - (share - 30) / 100) : 1; share = share + share * adjGrowth * slowdown; y++; if (share >= 25 && yr25 === 'Already reached' && currentShare < 25) yr25 = y; if (share >= 50 && yr50 === 'Already reached' && currentShare < 50) yr50 = y; if (share >= 75 && yr75 === 'Already reached' && currentShare < 75) yr75 = y; if (share >= 99) break; } if (currentShare < 25 && yr25 === 'Already reached') yr25 = 'Beyond 2054'; if (currentShare < 50 && yr50 === 'Already reached') yr50 = 'Beyond 2054'; if (currentShare < 75 && yr75 === 'Already reached') yr75 = 'Beyond 2054'; var gasDecline = yr50 !== 'Beyond 2054' && typeof yr50 === 'number' ? (yr50 - 3) + ' (at ~40% EV share)' : 'Beyond projection'; var priceDrop = avgEVPrice; var parityYr = 2024; while (priceDrop > 30000 && parityYr < 2050) { priceDrop *= 0.94; parityYr++; } var annualMiles = 12000; var mpg = 28; var gasAnnual = (annualMiles / mpg) * gasPrice; var evCostPerMile = 0.04; var evAnnual = annualMiles * evCostPerMile; var fuelSavings = gasAnnual - evAnnual; document.getElementById('year25').textContent = yr25; document.getElementById('year50').textContent = yr50; document.getElementById('year75').textContent = yr75; document.getElementById('gasStationDecline').textContent = gasDecline; document.getElementById('priceParityYear').textContent = parityYr >= 2050 ? 'Beyond 2050' : parityYr; document.getElementById('savingsPerYear').textContent = dollar(fuelSavings) + '/yr in fuel';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['currentShare', 'growthRate', 'policySupport', 'gasPrice', 'avgEVPrice'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
