(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var importValue = parseFloat(document.getElementById('importValue').value) || 0;
    var dutyPaid = parseFloat(document.getElementById('dutyPaid').value) || 0;
    var exportPct = parseFloat(document.getElementById('exportPct').value) || 0;
    var drawbackType = document.getElementById('drawbackType').value;

    // Calculation logic
    var eligibleDuty = dutyPaid * (exportPct / 100);
    var refundRate = drawbackType === 'lesser' ? 0.95 : 0.99;
    var refund = eligibleDuty * refundRate;
    var netDuty = dutyPaid - refund;
    var effectiveRate = (netDuty / importValue) * 100;
    document.getElementById('eligibleDuty').textContent = dollar(eligibleDuty);
    document.getElementById('refundAmount').textContent = dollar(refund);
    document.getElementById('netDuty').textContent = dollar(netDuty);
    document.getElementById('effectiveRate').textContent = fmt(effectiveRate, 2) + '%';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['importValue', 'dutyPaid', 'exportPct', 'drawbackType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
