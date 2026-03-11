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
    var totalGallons = v.monthlyGallons * v.hedgeMonths; var hedgeCost = totalGallons * v.hedgePrice; var unhedgedCost = totalGallons * v.priceSpike; var savings = unhedgedCost - hedgeCost; var premium = totalGallons * (v.hedgePrice - v.currentPrice); return {hedgeCost: '$' + Math.round(hedgeCost).toLocaleString(), unhegdedCost: '$' + Math.round(unhedgedCost).toLocaleString(), savings: '$' + Math.round(savings).toLocaleString(), hedgePremium: '$' + Math.round(premium).toLocaleString() + ' (cost to lock in)', breakeven: '$' + v.hedgePrice.toFixed(2) + '/gal'};

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
