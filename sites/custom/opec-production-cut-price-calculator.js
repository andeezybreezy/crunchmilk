(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var cutSize = parseFloat(document.getElementById('cutSize').value) || 0;
    var currentOil = parseFloat(document.getElementById('currentOil').value) || 0;
    var gasPrice = parseFloat(document.getElementById('gasPrice').value) || 0;
    var monthlyMiles = parseFloat(document.getElementById('monthlyMiles').value) || 0;

    // Calculation logic
    var globalSupply = 100; var pctCut = v.cutSize / globalSupply; var priceElasticity = 8; var oilIncrease = pctCut * priceElasticity; var newOil = v.currentOil * (1 + oilIncrease); var gasIncrease = oilIncrease * 0.6; var newGas = v.gasPrice * (1 + gasIncrease); var gallonsPerMonth = v.monthlyMiles / 25; var extraMonthly = gallonsPerMonth * (newGas - v.gasPrice);     document.getElementById('oilPriceImpact').textContent = '$' + newOil.toFixed(0) + '/barrel (+' + (oilIncrease * 100).toFixed(0) + '%)';
    document.getElementById('gasPriceImpact').textContent = '$' + newGas.toFixed(2) + '/gal';
    document.getElementById('monthlyExtraCost').textContent = '+$' + extraMonthly.toFixed(0) + '/mo';
    document.getElementById('annualExtraCost').textContent = '+$' + Math.round(extraMonthly * 12) + '/yr';
    document.getElementById('globalImpact').textContent = v.cutSize + ' million bpd = ' + (pctCut * 100).toFixed(1) + '% of global supply';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['cutSize', 'currentOil', 'gasPrice', 'monthlyMiles'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
