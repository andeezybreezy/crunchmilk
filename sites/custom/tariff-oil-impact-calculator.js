(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var tariffRate = parseFloat(document.getElementById('tariffRate').value) || 0;
    var oilIncrease = parseFloat(document.getElementById('oilIncrease').value) || 0;
    var householdIncome = parseFloat(document.getElementById('householdIncome').value) || 0;
    var householdSize = parseFloat(document.getElementById('householdSize').value) || 0;

    // Calculation logic
    var importedGoodsSpend = v.householdIncome * 0.15; var tariffCost = importedGoodsSpend * (v.tariffRate / 100) * 0.7; var energyCost = (v.householdSize * 1800 + 2400) * (v.oilIncrease / 100) * 0.4; var combined = tariffCost + energyCost; var monthlyHit = combined / 12; var effectiveTax = (combined / v.householdIncome * 100); var inflation = v.tariffRate * 0.15 + v.oilIncrease * 0.08; return {tariffCost: '+$' + Math.round(tariffCost).toLocaleString() + '/yr', oilCost: '+$' + Math.round(energyCost).toLocaleString() + '/yr', combinedCost: '+$' + Math.round(combined).toLocaleString() + '/yr', monthlyHit: '+$' + Math.round(monthlyHit) + '/mo', effectiveTax: effectiveTax.toFixed(1) + '% of your income', inflationImpact: '+' + inflation.toFixed(1) + '% to inflation rate'};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['tariffRate', 'oilIncrease', 'householdIncome', 'householdSize'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
