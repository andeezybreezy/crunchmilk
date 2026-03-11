(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var rateIncrease = parseFloat(document.getElementById('rateIncrease').value) || 0;
    var insurancePremium = parseFloat(document.getElementById('insurancePremium').value) || 0;
    var reroutePct = parseFloat(document.getElementById('reroutePct').value) || 0;
    var gasPrice = parseFloat(document.getElementById('gasPrice').value) || 0;

    // Calculation logic
    var baseShipping = 2.50; var baseInsurance = 0.30; var shippingCost = baseShipping * (1 + v.rateIncrease / 100); var insuranceCost = baseInsurance * (1 + v.insurancePremium / 100); var rerouteCost = v.reroutePct / 100 * 4; var totalExtra = (shippingCost - baseShipping) + (insuranceCost - baseInsurance) + rerouteCost; var gasImpact = totalExtra / 42 * 0.6; var globalDaily = totalExtra * 50e6; var annualConsumer = gasImpact * (1200 / 25) * 12; var delay = Math.round(v.reroutePct / 100 * 14); return {costPerBarrel: '+$' + totalExtra.toFixed(2) + '/barrel', gasPriceImpact: '+$' + gasImpact.toFixed(3) + '/gal', dailyGlobalCost: '$' + Math.round(globalDaily / 1e6) + ' million/day', consumerImpact: '+$' + Math.round(annualConsumer) + '/year', transitDelay: '+' + delay + ' days (Cape of Good Hope route)'};

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
