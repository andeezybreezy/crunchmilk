(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var annual = parseFloat(document.getElementById('annual').value) || 0;
    var years = parseFloat(document.getElementById('years').value) || 0;
    var tuition = parseFloat(document.getElementById('tuition').value) || 0;

    // Calculation logic
    var totalValue = annual * years; var coveragePct = Math.min((annual / tuition) * 100, 100); var remaining = Math.max(tuition - annual, 0);     document.getElementById('totalValue').textContent = dollar(totalValue);
    document.getElementById('coveragePct').textContent = fmt(coveragePct,1);
    document.getElementById('remaining').textContent = dollar(remaining);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['annual', 'years', 'tuition'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
