(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var importValue = parseFloat(document.getElementById('importValue').value) || 0;
    var dutyRate = parseFloat(document.getElementById('dutyRate').value) || 0;
    var reexportPct = parseFloat(document.getElementById('reexportPct').value) || 0;
    var warehouseMonths = parseFloat(document.getElementById('warehouseMonths').value) || 0;

    // Calculation logic
    var normalDuty = importValue * (dutyRate/100); var reexportSavings = normalDuty * (reexportPct/100); var deferralSavings = normalDuty * 0.05 * (warehouseMonths/12); var ftzDuty = normalDuty - reexportSavings - deferralSavings; var savings = normalDuty - ftzDuty;     document.getElementById('normalDuty').textContent = dollar(normalDuty);
    document.getElementById('ftzDuty').textContent = dollar(ftzDuty);
    document.getElementById('savings').textContent = dollar(savings);

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
