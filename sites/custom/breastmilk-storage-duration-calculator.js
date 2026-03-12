(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var storage = document.getElementById('storage').value;
    var hoursStored = parseFloat(document.getElementById('hoursStored').value) || 0;

    // Calculation logic
    var maxTimes = {'Room Temperature': 4, 'Insulated Cooler': 24, 'Refrigerator': 96, 'Freezer (attached)': 4320, 'Deep Freezer': 8760}; var maxHours = maxTimes[storage] || 4; var remaining = maxHours - hoursStored; var status = remaining > maxHours * 0.25 ? 'Safe to use' : remaining > 0 ? 'Use soon' : 'Discard - past safe window';     document.getElementById('maxHours').textContent = maxHours <= 96 ? fmt(maxHours,0) : fmt(maxHours/24,0) + ' (' + fmt(maxHours/24,0) + ' days)';
    document.getElementById('remaining').textContent = remaining > 0 ? (remaining <= 96 ? fmt(remaining,0) : fmt(remaining/24,0) + ' days') : '0';
    document.getElementById('status').textContent = status;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['storage', 'hoursStored'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
