(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var chargerType = document.getElementById('chargerType').value;
    var numChargers = parseFloat(document.getElementById('numChargers').value) || 0;
    var sessionsPerDay = parseFloat(document.getElementById('sessionsPerDay').value) || 0;
    var avgKwhPerSession = parseFloat(document.getElementById('avgKwhPerSession').value) || 0;
    var rateCharged = parseFloat(document.getElementById('rateCharged').value) || 0;
    var electricityCost = parseFloat(document.getElementById('electricityCost').value) || 0;

    // Calculation logic
    var installPrices = {'Level 2 (7-19 kW)': 6000, 'DC Fast (50 kW)': 50000, 'DC Fast (150 kW)': 120000}; var installCost = (installPrices[chargerType] || 6000) * numChargers; var dailyKwh = sessionsPerDay * avgKwhPerSession * numChargers; var monthlyRevenue = dailyKwh * rateCharged * 30; var monthlyElectricity = dailyKwh * electricityCost * 30; var monthlyMaintenance = numChargers * 50; var monthlyProfit = monthlyRevenue - monthlyElectricity - monthlyMaintenance; var paybackMonths = monthlyProfit > 0 ? Math.ceil(installCost / monthlyProfit) : 0;     document.getElementById('installCost').textContent = dollar(installCost);
    document.getElementById('monthlyRevenue').textContent = dollar(monthlyRevenue);
    document.getElementById('monthlyProfit').textContent = dollar(monthlyProfit);
    document.getElementById('paybackMonths').textContent = paybackMonths > 0 ? fmt(paybackMonths, 0) : 'N/A';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['chargerType', 'numChargers', 'sessionsPerDay', 'avgKwhPerSession', 'rateCharged', 'electricityCost'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
