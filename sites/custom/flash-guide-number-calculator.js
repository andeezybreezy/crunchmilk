(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var guideNumber = parseFloat(document.getElementById('guideNumber').value) || 0;
    var aperture = parseFloat(document.getElementById('aperture').value) || 0;
    var iso = document.getElementById('iso').value;

    // Calculation logic
    var isoVal = parseFloat(iso);
    var isoFactor = Math.sqrt(isoVal / 100);
    var effectGN = guideNumber * isoFactor;
    var dist = effectGN / aperture;
    var reqF = effectGN / 5;
    document.getElementById('maxDist').textContent = fmt(dist, 1) + ' m (' + fmt(dist * 3.281, 1) + ' ft)';
    document.getElementById('reqAperture').textContent = 'f/' + fmt(reqF, 1);
    document.getElementById('effectiveGN').textContent = fmt(effectGN, 1) + ' (at ISO ' + isoVal + ')';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['guideNumber', 'aperture', 'iso'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
