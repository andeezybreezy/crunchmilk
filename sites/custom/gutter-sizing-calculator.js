(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var roofArea = parseFloat(document.getElementById('roofArea').value) || 0;
    var rainfall = parseFloat(document.getElementById('rainfall').value) || 0;
    var runLength = parseFloat(document.getElementById('runLength').value) || 0;

    // Calculation logic
    var flowRate = roofArea * rainfall * 0.0104; var gutterSize = flowRate > 7.5 ? '6-inch K-style' : '5-inch K-style'; var downspoutSpacing = flowRate > 5 ? 30 : 40; var downspouts = Math.max(Math.ceil(runLength / downspoutSpacing), 1);     document.getElementById('gutterSize').textContent = gutterSize;
    document.getElementById('downspouts').textContent = fmt(downspouts,0);
    document.getElementById('flowRate').textContent = fmt(flowRate,1);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['roofArea', 'rainfall', 'runLength'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
