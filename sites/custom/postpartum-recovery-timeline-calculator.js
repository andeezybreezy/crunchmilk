(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var delivery = document.getElementById('delivery').value;
    var breastfeeding = document.getElementById('breastfeeding').value;
    var support = document.getElementById('support').value;

    // Calculation logic
    var baseWeeks = {'Vaginal (uncomplicated)': 4, 'Vaginal (with tearing)': 6, 'C-Section': 8}; var physicalRecovery = baseWeeks[delivery] || 6; var exerciseReturn = physicalRecovery + 2; var supportMod = {'Strong support': 0, 'Some help': 1, 'Minimal support': 3}; var fullRecovery = physicalRecovery + 4 + (supportMod[support] || 0); return {physicalRecovery: fmt(physicalRecovery,0), exerciseReturn: fmt(exerciseReturn,0), fullRecovery: fmt(fullRecovery,0)};

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
