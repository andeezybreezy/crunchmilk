(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var totalReports = parseFloat(document.getElementById('totalReports').value) || 0;
    var fullMoonReports = parseFloat(document.getElementById('fullMoonReports').value) || 0;
    var daysInPeriod = parseFloat(document.getElementById('daysInPeriod').value) || 0;

    // Calculation logic
    var fullMoonDays = Math.round(daysInPeriod / 29.5) * 5; var expectedPct = (fullMoonDays / daysInPeriod) * 100; var actualPct = (fullMoonReports / totalReports) * 100; var ratio = actualPct / expectedPct; var correlation = ratio > 1.5 ? 'Strong lunar correlation' : ratio > 1.1 ? 'Slight correlation' : ratio < 0.7 ? 'Inverse correlation' : 'No significant correlation';     document.getElementById('expectedPct').textContent = fmt(expectedPct,1);
    document.getElementById('actualPct').textContent = fmt(actualPct,1);
    document.getElementById('correlation').textContent = correlation;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['totalReports', 'fullMoonReports', 'daysInPeriod'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
