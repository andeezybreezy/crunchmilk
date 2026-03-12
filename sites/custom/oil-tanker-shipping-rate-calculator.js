(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var rateIncrease = parseFloat(document.getElementById('rateIncrease').value) || 0;
    var insurancePremium = parseFloat(document.getElementById('insurancePremium').value) || 0;
    var reroutePct = parseFloat(document.getElementById('reroutePct').value) || 0;
    var gasPrice = parseFloat(document.getElementById('gasPrice').value) || 0;

    // Calculation logic
    var baseShipping = 2.50; var baseInsurance = 0.30; var shippingCost = baseShipping * (1 + rateIncrease / 100); var insuranceCost = baseInsurance * (1 + insurancePremium / 100); var rerouteCost = reroutePct / 100 * 4; var totalExtra = (shippingCost - baseShipping) + (insuranceCost - baseInsurance) + rerouteCost; var gasImpact = totalExtra / 42 * 0.6; var globalDaily = totalExtra * 50e6; var annualConsumer = gasImpact * (1200 / 25) * 12; var delay = Math.round(reroutePct / 100 * 14);     document.getElementById('costPerBarrel').textContent = '+$' + totalExtra.toFixed(2) + '/barrel';
    document.getElementById('gasPriceImpact').textContent = '+$' + gasImpact.toFixed(3) + '/gal';
    document.getElementById('dailyGlobalCost').textContent = '$' + Math.round(globalDaily / 1e6) + ' million/day';
    document.getElementById('consumerImpact').textContent = '+$' + Math.round(annualConsumer) + '/year';
    document.getElementById('transitDelay').textContent = '+' + delay + ' days (Cape of Good Hope route)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['rateIncrease', 'insurancePremium', 'reroutePct', 'gasPrice'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
