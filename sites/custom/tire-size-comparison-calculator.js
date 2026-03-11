(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
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
    var origSidewall = origWidth * origAspect / 100 / 25.4; var origDia = (origRim + 2 * origSidewall); var newSidewall = newWidth * newAspect / 100 / 25.4; var newDia = (newRim + 2 * newSidewall); var speedoError = ((newDia - origDia) / origDia) * 100; return {origDia: fmt(origDia,1), newDia: fmt(newDia,1), speedoError: fmt(speedoError,1)};

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
