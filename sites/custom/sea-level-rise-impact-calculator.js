(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var elevation = parseFloat(document.getElementById('elevation').value) || 0;
    var distance = parseFloat(document.getElementById('distance').value) || 0;
    var timeframe = parseFloat(document.getElementById('timeframe').value) || 0;

    // Calculation logic
    var annualRise = 0.013; var projected = (annualRise * timeframe) + (timeframe > 30 ? timeframe * 0.005 : 0); var safetyMargin = elevation - projected; var riskLevel = safetyMargin < 0 ? 'Extreme' : safetyMargin < 3 ? 'High' : safetyMargin < 10 ? 'Moderate' : 'Low';     document.getElementById('projected').textContent = fmt(projected,1);
    document.getElementById('riskLevel').textContent = riskLevel;
    document.getElementById('safetyMargin').textContent = fmt(safetyMargin,1);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['elevation', 'distance', 'timeframe'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
