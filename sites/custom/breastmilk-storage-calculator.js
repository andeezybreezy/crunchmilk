(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var storageType = document.getElementById('storageType').value;
    var pumpDate = parseFloat(document.getElementById('pumpDate').value) || 0;

    // Calculation logic
    var limits = {counter:{max:4,unit:'hours',best:'Use within 2 hours'},cooler:{max:24,unit:'hours',best:'Transfer to fridge ASAP'},fridge:{max:4,unit:'days',best:'Use within 3 days for best quality'},freezer:{max:180,unit:'days',best:'Use within 3 months for best quality'},deepfreeze:{max:365,unit:'days',best:'Use within 6 months for best quality'}}; var info = limits[storageType]; var expired = false; if (info.unit === 'hours') expired = pumpDate * 24 > info.max; else expired = pumpDate > info.max; document.getElementById('maxTime').textContent = info.max + ' ' + info.unit; document.getElementById('status').textContent = expired ? 'EXPIRED — discard this milk' : 'Safe to use (' + pumpDate + ' days stored)'; document.getElementById('bestPractice').textContent = info.best;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['storageType', 'pumpDate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
