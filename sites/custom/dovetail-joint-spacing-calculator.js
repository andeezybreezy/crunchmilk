(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var boardWidth = parseFloat(document.getElementById('boardWidth').value) || 0;
    var numTails = parseFloat(document.getElementById('numTails').value) || 0;
    var pinWidth = parseFloat(document.getElementById('pinWidth').value) || 0;
    var tailRatio = document.getElementById('tailRatio').value;

    // Calculation logic
    var ratio = parseInt(tailRatio); var angle = Math.atan(1/ratio) * 180 / Math.PI; var usableWidth = boardWidth - (2 * pinWidth); var tailW = usableWidth / numTails; var pinCenter = tailW; document.getElementById('tailWidth').textContent = fmt(tailW, 2) + ' in'; document.getElementById('pinSpacing').textContent = fmt(pinCenter, 2) + ' in on center'; document.getElementById('angle').textContent = fmt(angle, 1) + '° (1:' + ratio + ')'; document.getElementById('layout').textContent = numTails + ' tails + ' + (numTails + 1) + ' half-pins across ' + fmt(boardWidth, 2) + ' in';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['boardWidth', 'numTails', 'pinWidth', 'tailRatio'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
