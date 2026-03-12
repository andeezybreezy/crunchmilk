(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var dailyAh = parseFloat(document.getElementById('dailyAh').value) || 0;
    var daysAutonomy = parseFloat(document.getElementById('daysAutonomy').value) || 0;
    var batteryType = document.getElementById('batteryType').value;

    // Calculation logic
    var dod = {'Lead Acid (50% DOD)': 0.5, 'AGM (50% DOD)': 0.5, 'Lithium (80% DOD)': 0.8}; var depth = dod[batteryType] || 0.5; var bankAh = (dailyAh * daysAutonomy) / depth; var batteries = Math.ceil(bankAh / 100);     document.getElementById('bankAh').textContent = fmt(bankAh,0);
    document.getElementById('batteries').textContent = fmt(batteries,0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['dailyAh', 'daysAutonomy', 'batteryType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
