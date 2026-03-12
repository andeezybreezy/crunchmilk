(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var purchasePrice = parseFloat(document.getElementById('purchasePrice').value) || 0;
    var salePrice = parseFloat(document.getElementById('salePrice').value) || 0;
    var holdingPeriod = document.getElementById('holdingPeriod').value;
    var taxBracket = document.getElementById('taxBracket').value;

    // Calculation logic
    var gain = salePrice - purchasePrice;
    var rate;
    if (holdingPeriod === 'short') {
      rate = parseInt(taxBracket);
    } else {
      var bracket = parseInt(taxBracket);
      if (bracket <= 12) rate = 0;
      else if (bracket <= 35) rate = 15;
      else rate = 20;
    }
    var tax = Math.max(0, gain * rate / 100);
    var netProfit = gain - tax;
    document.getElementById('capitalGain').textContent = (gain >= 0 ? '+' : '') + dollar(gain);
    document.getElementById('taxRate').textContent = rate + '% (' + holdingPeriod + '-term)';
    document.getElementById('taxOwed').textContent = dollar(tax);
    document.getElementById('netProfit').textContent = dollar(netProfit);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['purchasePrice', 'salePrice', 'holdingPeriod', 'taxBracket'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
