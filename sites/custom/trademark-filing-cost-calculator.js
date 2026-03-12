(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var classes = parseFloat(document.getElementById('classes').value) || 0;
    var filingType = document.getElementById('filingType').value;
    var attorney = document.getElementById('attorney').value;

    // Calculation logic
    var perClass = filingType === 'TEAS Plus ($250/class)' ? 250 : 350; var filingFee = perClass * classes; var attorneyFee = attorney === 'Yes' ? 500 + (classes - 1) * 200 : 0; var totalCost = filingFee + attorneyFee;     document.getElementById('filingFee').textContent = dollar(filingFee);
    document.getElementById('attorneyFee').textContent = dollar(attorneyFee);
    document.getElementById('totalCost').textContent = dollar(totalCost);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['classes', 'filingType', 'attorney'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
