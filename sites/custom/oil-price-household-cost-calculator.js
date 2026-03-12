(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var oilTarget = parseFloat(document.getElementById('oilTarget').value) || 0;
    var currentOil = parseFloat(document.getElementById('currentOil').value) || 0;
    var householdSize = parseFloat(document.getElementById('householdSize').value) || 0;
    var monthlyMiles = parseFloat(document.getElementById('monthlyMiles').value) || 0;
    var heatingType = document.getElementById('heatingType').value;

    // Calculation logic
    var pctChange = (oilTarget - currentOil) / currentOil; var gasInc = (monthlyMiles / 25) * v.gasPrice * pctChange * 0.6 * 12; var gasInc2 = (monthlyMiles / 25) * 3.5 * pctChange * 0.6 * 12; var heatMult = heatingType === 'oil' ? 1.0 : heatingType === 'gas' ? 0.5 : heatingType === 'electric' ? 0.3 : 0; var heatInc = 1800 * heatMult * pctChange; var foodInc = householdSize * 250 * 12 * pctChange * 0.05; var goodsInc = householdSize * 150 * pctChange * 0.3; var total = gasInc2 + heatInc + foodInc + goodsInc;     document.getElementById('gasCostIncrease').textContent = '+$' + Math.round(gasInc2);
    document.getElementById('heatingIncrease').textContent = '+$' + Math.round(heatInc);
    document.getElementById('foodIncrease').textContent = '+$' + Math.round(foodInc);
    document.getElementById('goodsIncrease').textContent = '+$' + Math.round(goodsInc);
    document.getElementById('totalAnnual').textContent = '+$' + Math.round(total);
    document.getElementById('totalMonthly').textContent = '+$' + Math.round(total/12) + '/mo';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['oilTarget', 'currentOil', 'householdSize', 'monthlyMiles', 'heatingType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
