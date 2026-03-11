(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var heatingCost = parseFloat(document.getElementById('heatingCost').value) || 0;
    var fuelType = document.getElementById('fuelType').value;
    var hpCOP = parseFloat(document.getElementById('hpCOP').value) || 0;
    var elecRate = parseFloat(document.getElementById('elecRate').value) || 0;

    // Calculation logic
    var effMap = {gas: 0.80, oil: 0.85, electric: 1.0, propane: 0.80}; var eff = effMap[fuelType] || 0.80; var heatNeeded = heatingCost * eff; var hpElecCost = (heatNeeded / hpCOP) * (elecRate / 0.034); if (fuelType === 'electric') { hpElecCost = heatingCost / hpCOP; } var savings = heatingCost - hpElecCost; var installCost = 8000; var payback = savings > 0 ? installCost / savings : 999; document.getElementById('hpAnnual').textContent = dollar(Math.max(0, hpElecCost)); document.getElementById('annualSavings').textContent = dollar(Math.max(0, savings)); document.getElementById('payback').textContent = savings > 0 ? fmt(payback, 1) + ' years (on ~$8K install)' : 'May not save with current rates';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['heatingCost', 'fuelType', 'hpCOP', 'elecRate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
