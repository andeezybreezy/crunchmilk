(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var totalValue = parseFloat(document.getElementById('totalValue').value) || 0;
    var domesticValue = parseFloat(document.getElementById('domesticValue').value) || 0;
    var agreement = document.getElementById('agreement').value;

    // Calculation logic
    var contentPct = (domesticValue / totalValue) * 100; var thresholds = {'USMCA (75% auto, 60% other)': 60, 'EU FTA (varies)': 55, 'CAFTA-DR (35%)': 35, 'General (50%)': 50}; var threshold = thresholds[agreement] || 50; var qualifies = contentPct >= threshold ? 'Yes - qualifies for preferential rate' : 'No - does not meet content threshold';     document.getElementById('contentPct').textContent = fmt(contentPct,1);
    document.getElementById('threshold').textContent = fmt(threshold,0);
    document.getElementById('qualifies').textContent = qualifies;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['totalValue', 'domesticValue', 'agreement'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
