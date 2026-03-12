(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var purchasePrice = parseFloat(document.getElementById('purchasePrice').value) || 0;
    var salvageValue = parseFloat(document.getElementById('salvageValue').value) || 0;
    var usefulLife = parseFloat(document.getElementById('usefulLife').value) || 0;
    var hoursPerYear = parseFloat(document.getElementById('hoursPerYear').value) || 0;

    // Calculation logic
    var totalDepr = purchasePrice - salvageValue; var annual = totalDepr / usefulLife; var hourly = annual / hoursPerYear; var bv5 = Math.max(salvageValue, purchasePrice - (annual * 5)); document.getElementById('annualDepr').textContent = dollar(annual); document.getElementById('hourlyDepr').textContent = dollar(hourly); document.getElementById('bookValue5').textContent = dollar(bv5); document.getElementById('totalDepr').textContent = dollar(totalDepr);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['purchasePrice', 'salvageValue', 'usefulLife', 'hoursPerYear'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
