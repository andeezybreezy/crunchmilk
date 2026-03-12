(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var bushels = parseFloat(document.getElementById('bushels').value) || 0;
    var months = parseFloat(document.getElementById('months').value) || 0;
    var storageRate = parseFloat(document.getElementById('storageRate').value) || 0;
    var dryingCost = parseFloat(document.getElementById('dryingCost').value) || 0;
    var moisturePoints = parseFloat(document.getElementById('moisturePoints').value) || 0;

    // Calculation logic
    var sc = bushels * storageRate * months; var dc = bushels * dryingCost * moisturePoints; var tc = sc + dc; var cpb = tc / bushels; document.getElementById('storageCost').textContent = dollar(sc); document.getElementById('dryingTotal').textContent = dollar(dc); document.getElementById('totalCost').textContent = dollar(tc); document.getElementById('costPerBu').textContent = dollar(cpb);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['bushels', 'months', 'storageRate', 'dryingCost', 'moisturePoints'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
