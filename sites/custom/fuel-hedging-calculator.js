(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var monthlyGallons = parseFloat(document.getElementById('monthlyGallons').value) || 0;
    var currentPrice = parseFloat(document.getElementById('currentPrice').value) || 0;
    var hedgePrice = parseFloat(document.getElementById('hedgePrice').value) || 0;
    var priceSpike = parseFloat(document.getElementById('priceSpike').value) || 0;
    var hedgeMonths = parseFloat(document.getElementById('hedgeMonths').value) || 0;

    // Calculation logic
    var totalGallons = monthlyGallons * hedgeMonths; var hedgeCost = totalGallons * hedgePrice; var unhedgedCost = totalGallons * priceSpike; var savings = unhedgedCost - hedgeCost; var premium = totalGallons * (hedgePrice - currentPrice);     document.getElementById('hedgeCost').textContent = '$' + Math.round(hedgeCost).toLocaleString();
    document.getElementById('unhegdedCost').textContent = '$' + Math.round(unhedgedCost).toLocaleString();
    document.getElementById('savings').textContent = '$' + Math.round(savings).toLocaleString();
    document.getElementById('hedgePremium').textContent = '$' + Math.round(premium).toLocaleString() + ' (cost to lock in)';
    document.getElementById('breakeven').textContent = '$' + hedgePrice.toFixed(2) + '/gal';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['monthlyGallons', 'currentPrice', 'hedgePrice', 'priceSpike', 'hedgeMonths'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
