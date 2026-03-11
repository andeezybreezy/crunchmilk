(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var basePrice = parseFloat(document.getElementById('basePrice').value) || 0;
    var tariffRate = parseFloat(document.getElementById('tariffRate').value) || 0;
    var passThrough = parseFloat(document.getElementById('passThrough').value) || 0;

    // Calculation logic
    var tariffAmount = basePrice * (tariffRate/100); var priceIncrease = tariffAmount * (passThrough/100); var newPrice = basePrice + priceIncrease;     document.getElementById('tariffAmount').textContent = dollar(tariffAmount);
    document.getElementById('priceIncrease').textContent = dollar(priceIncrease);
    document.getElementById('newPrice').textContent = dollar(newPrice);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['basePrice', 'tariffRate', 'passThrough'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
