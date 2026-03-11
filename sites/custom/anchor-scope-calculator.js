(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var depth = parseFloat(document.getElementById('depth').value) || 0;
    var tide = parseFloat(document.getElementById('tide').value) || 0;
    var bowHeight = parseFloat(document.getElementById('bowHeight').value) || 0;
    var scope = document.getElementById('scope').value;

    // Calculation logic
    var totalDepth = depth + tide + bowHeight; var ratios = {'5:1 (calm)': 5, '7:1 (standard)': 7, '10:1 (storm)': 10}; var ratio = ratios[scope] || 7; var rodeLength = totalDepth * ratio; return {totalDepth: fmt(totalDepth,0), rodeLength: fmt(rodeLength,0)};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['depth', 'tide', 'bowHeight', 'scope'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
