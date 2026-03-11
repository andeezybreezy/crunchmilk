(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var totalReports = parseFloat(document.getElementById('totalReports').value) || 0;
    var fullMoonReports = parseFloat(document.getElementById('fullMoonReports').value) || 0;
    var daysInPeriod = parseFloat(document.getElementById('daysInPeriod').value) || 0;

    // Calculation logic
    var fullMoonDays = Math.round(daysInPeriod / 29.5) * 5; var expectedPct = (fullMoonDays / daysInPeriod) * 100; var actualPct = (fullMoonReports / totalReports) * 100; var ratio = actualPct / expectedPct; var correlation = ratio > 1.5 ? 'Strong lunar correlation' : ratio > 1.1 ? 'Slight correlation' : ratio < 0.7 ? 'Inverse correlation' : 'No significant correlation'; return {expectedPct: fmt(expectedPct,1), actualPct: fmt(actualPct,1), correlation: correlation};

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
