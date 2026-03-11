(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var importValue = parseFloat(document.getElementById('importValue').value) || 0;
    var dutyRate = parseFloat(document.getElementById('dutyRate').value) || 0;
    var reexportPct = parseFloat(document.getElementById('reexportPct').value) || 0;
    var warehouseMonths = parseFloat(document.getElementById('warehouseMonths').value) || 0;

    // Calculation logic
    var normalDuty = importValue * (dutyRate/100); var reexportSavings = normalDuty * (reexportPct/100); var deferralSavings = normalDuty * 0.05 * (warehouseMonths/12); var ftzDuty = normalDuty - reexportSavings - deferralSavings; var savings = normalDuty - ftzDuty; return {normalDuty: dollar(normalDuty), ftzDuty: dollar(ftzDuty), savings: dollar(savings)};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['importValue', 'dutyRate', 'reexportPct', 'warehouseMonths'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
