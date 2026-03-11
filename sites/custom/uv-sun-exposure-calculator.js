(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var uvIndex = parseFloat(document.getElementById('uvIndex').value) || 0;
    var skinType = document.getElementById('skinType').value;
    var spf = parseFloat(document.getElementById('spf').value) || 0;

    // Calculation logic
    var burnTimes = {'Type I (very fair)': 67, 'Type II (fair)': 100, 'Type III (medium)': 200, 'Type IV (olive)': 300, 'Type V (brown)': 400, 'Type VI (dark)': 500}; var base = burnTimes[skinType] || 100; var unprotected = base / uvIndex; var withSpf = spf > 0 ? unprotected * spf * 0.6 : unprotected;     document.getElementById('unprotected').textContent = fmt(unprotected,0);
    document.getElementById('withSpf').textContent = fmt(Math.min(withSpf, 480),0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['uvIndex', 'skinType', 'spf'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
