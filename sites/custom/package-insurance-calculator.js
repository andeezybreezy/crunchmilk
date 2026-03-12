(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var declaredValue = parseFloat(document.getElementById('declaredValue').value) || 0;
    var carrier = document.getElementById('carrier').value;

    // Calculation logic
    var freeCov = {ups: 100, fedex: 100, usps: 0, third: 0}; var rates = {ups: 0.025, fedex: 0.025, usps: 0.021, third: 0.012}; var free = freeCov[carrier] || 0; var insurable = Math.max(0, declaredValue - free); var cost = carrier === 'usps' ? (declaredValue <= 50 ? 2.45 : declaredValue <= 100 ? 2.95 : declaredValue <= 200 ? 3.45 : 3.45 + Math.ceil((declaredValue - 200)/100) * 1.0) : insurable * rates[carrier]; document.getElementById('insuranceCost').textContent = dollar(cost); document.getElementById('costPct').textContent = pct(cost / declaredValue * 100, 2); document.getElementById('freeIncluded').textContent = free > 0 ? dollar(free) + ' included free' : 'No free coverage';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['declaredValue', 'carrier'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
