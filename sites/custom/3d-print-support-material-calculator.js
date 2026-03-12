(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var partWeight = parseFloat(document.getElementById('partWeight').value) || 0;
    var overhangPct = parseFloat(document.getElementById('overhangPct').value) || 0;
    var supportDensity = parseFloat(document.getElementById('supportDensity').value) || 0;

    // Calculation logic
    var supportWeight = partWeight * (overhangPct / 100) * (supportDensity / 100) * 2; var totalWeight = partWeight + supportWeight; var wastePct = (supportWeight / totalWeight) * 100;     document.getElementById('supportWeight').textContent = fmt(supportWeight,1);
    document.getElementById('totalWeight').textContent = fmt(totalWeight,1);
    document.getElementById('wastePct').textContent = fmt(wastePct,1);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['partWeight', 'overhangPct', 'supportDensity'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
