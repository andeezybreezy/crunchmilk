(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var storage = document.getElementById('storage').value;
    var hoursStored = parseFloat(document.getElementById('hoursStored').value) || 0;

    // Calculation logic
    var maxTimes = {'Room Temperature': 4, 'Insulated Cooler': 24, 'Refrigerator': 96, 'Freezer (attached)': 4320, 'Deep Freezer': 8760}; var maxHours = maxTimes[storage] || 4; var remaining = maxHours - hoursStored; var status = remaining > maxHours * 0.25 ? 'Safe to use' : remaining > 0 ? 'Use soon' : 'Discard - past safe window'; return {maxHours: maxHours <= 96 ? fmt(maxHours,0) : fmt(maxHours/24,0) + ' (' + fmt(maxHours/24,0) + ' days)', remaining: remaining > 0 ? (remaining <= 96 ? fmt(remaining,0) : fmt(remaining/24,0) + ' days') : '0', status: status};

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
