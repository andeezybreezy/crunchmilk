(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var phaseALoad = parseFloat(document.getElementById('phaseALoad').value) || 0;
    var phaseBLoad = parseFloat(document.getElementById('phaseBLoad').value) || 0;
    var panelRating = parseFloat(document.getElementById('panelRating').value) || 0;
    var newLoad = parseFloat(document.getElementById('newLoad').value) || 0;

    // Calculation logic
    var diff = Math.abs(phaseALoad - phaseBLoad);
    var imbalPct = ((phaseALoad + phaseBLoad) > 0) ? (diff / ((phaseALoad + phaseBLoad) / 2)) * 100 : 0;
    var addToPhase = phaseALoad <= phaseBLoad ? 'A' : 'B';
    var newA = addToPhase === 'A' ? phaseALoad + newLoad : phaseALoad;
    var newB = addToPhase === 'B' ? phaseBLoad + newLoad : phaseBLoad;
    var newDiff = Math.abs(newA - newB);
    var totalLoad = newA + newB;
    var util = (Math.max(newA, newB) / panelRating) * 100;
    document.getElementById('imbalance').textContent = fmt(diff, 0) + ' A difference (' + fmt(imbalPct, 1) + '% imbalance)';
    document.getElementById('recommendation').textContent = 'Phase ' + addToPhase + ' (currently lower at ' + fmt(addToPhase === 'A' ? phaseALoad : phaseBLoad, 0) + ' A)';
    document.getElementById('afterBalance').textContent = 'A: ' + fmt(newA, 0) + ' A / B: ' + fmt(newB, 0) + ' A (diff: ' + fmt(newDiff, 0) + ' A)';
    document.getElementById('utilization').textContent = fmt(util, 1) + '% of ' + fmt(panelRating, 0) + ' A panel' + (util > 80 ? ' — WARNING: Consider upgrading panel' : '');

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['phaseALoad', 'phaseBLoad', 'panelRating', 'newLoad'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
