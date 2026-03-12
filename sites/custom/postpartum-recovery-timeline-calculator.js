(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var delivery = document.getElementById('delivery').value;
    var breastfeeding = document.getElementById('breastfeeding').value;
    var support = document.getElementById('support').value;

    // Calculation logic
    var baseWeeks = {'Vaginal (uncomplicated)': 4, 'Vaginal (with tearing)': 6, 'C-Section': 8}; var physicalRecovery = baseWeeks[delivery] || 6; var exerciseReturn = physicalRecovery + 2; var supportMod = {'Strong support': 0, 'Some help': 1, 'Minimal support': 3}; var fullRecovery = physicalRecovery + 4 + (supportMod[support] || 0);     document.getElementById('physicalRecovery').textContent = fmt(physicalRecovery,0);
    document.getElementById('exerciseReturn').textContent = fmt(exerciseReturn,0);
    document.getElementById('fullRecovery').textContent = fmt(fullRecovery,0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['delivery', 'breastfeeding', 'support'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
