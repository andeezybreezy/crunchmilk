(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var area = parseFloat(document.getElementById('area').value) || 0;
    var tileWidth = parseFloat(document.getElementById('tileWidth').value) || 0;
    var tileLength = parseFloat(document.getElementById('tileLength').value) || 0;
    var jointWidth = parseFloat(document.getElementById('jointWidth').value) || 0;

    // Calculation logic
    var tileArea = tileWidth * tileLength; var jointLengthPerTile = 2 * (tileWidth + tileLength); var tilesNeeded = area * 144 / tileArea; var totalJointLength = tilesNeeded * jointLengthPerTile / 2; var groutVolume = totalJointLength * jointWidth * 0.375; var groutLbs = groutVolume / 144 * 100; var bags25 = Math.ceil(groutLbs / 25);     document.getElementById('groutLbs').textContent = fmt(Math.max(groutLbs, 2),0);
    document.getElementById('bags25').textContent = fmt(Math.max(bags25,1),0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['area', 'tileWidth', 'tileLength', 'jointWidth'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
