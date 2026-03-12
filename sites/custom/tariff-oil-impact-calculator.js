(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var tariffRate = parseFloat(document.getElementById('tariffRate').value) || 0;
    var oilIncrease = parseFloat(document.getElementById('oilIncrease').value) || 0;
    var householdIncome = parseFloat(document.getElementById('householdIncome').value) || 0;
    var householdSize = parseFloat(document.getElementById('householdSize').value) || 0;

    // Calculation logic
    var importedGoodsSpend = householdIncome * 0.15; var tariffCost = importedGoodsSpend * (tariffRate / 100) * 0.7; var energyCost = (householdSize * 1800 + 2400) * (oilIncrease / 100) * 0.4; var combined = tariffCost + energyCost; var monthlyHit = combined / 12; var effectiveTax = (combined / householdIncome * 100); var inflation = tariffRate * 0.15 + oilIncrease * 0.08;     document.getElementById('tariffCost').textContent = '+$' + Math.round(tariffCost).toLocaleString() + '/yr';
    document.getElementById('oilCost').textContent = '+$' + Math.round(energyCost).toLocaleString() + '/yr';
    document.getElementById('combinedCost').textContent = '+$' + Math.round(combined).toLocaleString() + '/yr';
    document.getElementById('monthlyHit').textContent = '+$' + Math.round(monthlyHit) + '/mo';
    document.getElementById('effectiveTax').textContent = effectiveTax.toFixed(1) + '% of your income';
    document.getElementById('inflationImpact').textContent = '+' + inflation.toFixed(1) + '% to inflation rate';

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
