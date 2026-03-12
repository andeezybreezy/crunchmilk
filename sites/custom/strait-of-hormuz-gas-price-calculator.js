(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var gasPrice = parseFloat(document.getElementById('gasPrice').value) || 0;
    var disruption = parseFloat(document.getElementById('disruption').value) || 0;
    var monthlyMiles = parseFloat(document.getElementById('monthlyMiles').value) || 0;
    var mpg = parseFloat(document.getElementById('mpg').value) || 0;

    // Calculation logic
    var d = disruption / 100; var globalSupplyLoss = 0.21 * d; var priceMultiplier = 1 + (globalSupplyLoss * 4.5); var newPrice = gasPrice * priceMultiplier; var gallonsNow = monthlyMiles / mpg; var costNow = gallonsNow * gasPrice; var costNew = gallonsNow * newPrice;     document.getElementById('newGasPrice').textContent = '$' + newPrice.toFixed(2);
    document.getElementById('priceIncrease').textContent = '+' + ((priceMultiplier - 1) * 100).toFixed(0) + '%';
    document.getElementById('monthlyCostNow').textContent = '$' + costNow.toFixed(0);
    document.getElementById('monthlyCostNew').textContent = '$' + costNew.toFixed(0);
    document.getElementById('monthlyHit').textContent = '+$' + (costNew - costNow).toFixed(0) + '/mo';
    document.getElementById('annualHit').textContent = '+$' + ((costNew - costNow) * 12).toFixed(0) + '/yr';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['gasPrice', 'disruption', 'monthlyMiles', 'mpg'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
  document.getElementById('disruption').addEventListener('input', function() { document.getElementById('disruptionVal').textContent = this.value + '%'; });
})();
