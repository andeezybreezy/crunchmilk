(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var origWidth = parseFloat(document.getElementById('origWidth').value) || 0;
    var origAspect = parseFloat(document.getElementById('origAspect').value) || 0;
    var origRim = parseFloat(document.getElementById('origRim').value) || 0;
    var newWidth = parseFloat(document.getElementById('newWidth').value) || 0;
    var newAspect = parseFloat(document.getElementById('newAspect').value) || 0;
    var newRim = parseFloat(document.getElementById('newRim').value) || 0;

    // Calculation logic
    var origSidewall = origWidth * origAspect / 100 / 25.4; var origDia = (origRim + 2 * origSidewall); var newSidewall = newWidth * newAspect / 100 / 25.4; var newDia = (newRim + 2 * newSidewall); var speedoError = ((newDia - origDia) / origDia) * 100;     document.getElementById('origDia').textContent = fmt(origDia,1);
    document.getElementById('newDia').textContent = fmt(newDia,1);
    document.getElementById('speedoError').textContent = fmt(speedoError,1);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['origWidth', 'origAspect', 'origRim', 'newWidth', 'newAspect', 'newRim'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
