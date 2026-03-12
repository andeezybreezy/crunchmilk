(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var boardWidth = parseFloat(document.getElementById('boardWidth').value) || 0;
    var mcStart = parseFloat(document.getElementById('mcStart').value) || 0;
    var mcEnd = parseFloat(document.getElementById('mcEnd').value) || 0;
    var species = document.getElementById('species').value;

    // Calculation logic
    var tangentialPct = parseFloat(species);
    var mcChange = mcStart - mcEnd;
    var shrinkPct = tangentialPct * (mcChange / 19);
    var shrinkInches = boardWidth * (shrinkPct / 100);
    var newW = boardWidth - shrinkInches;
    var seasonalRange = boardWidth * (tangentialPct / 100) * (4 / 19);
    document.getElementById('shrinkage').textContent = fmt(Math.abs(shrinkInches), 2) + '" (' + fmt(Math.abs(shrinkInches) * 25.4, 2) + ' mm)';
    document.getElementById('newWidth').textContent = fmt(newW, 2) + '"';
    document.getElementById('pctChange').textContent = fmt(Math.abs(shrinkPct), 2) + '% ' + (mcChange > 0 ? 'shrinkage' : 'expansion');
    document.getElementById('gapAdvice').textContent = '±' + fmt(seasonalRange / 2, 2) + '" per ' + fmt(boardWidth, 1) + '" of width';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['boardWidth', 'mcStart', 'mcEnd', 'species'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
