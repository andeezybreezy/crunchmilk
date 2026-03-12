(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var boxL = parseFloat(document.getElementById('boxL').value) || 0;
    var boxW = parseFloat(document.getElementById('boxW').value) || 0;
    var boxH = parseFloat(document.getElementById('boxH').value) || 0;
    var boxWt = parseFloat(document.getElementById('boxWt').value) || 0;
    var palletL = parseFloat(document.getElementById('palletL').value) || 0;
    var palletW = parseFloat(document.getElementById('palletW').value) || 0;
    var maxStackH = parseFloat(document.getElementById('maxStackH').value) || 0;
    var maxWeight = parseFloat(document.getElementById('maxWeight').value) || 0;

    // Calculation logic
    var a1 = Math.floor(palletL/boxL) * Math.floor(palletW/boxW); var a2 = Math.floor(palletL/boxW) * Math.floor(palletW/boxL); var pl = Math.max(a1, a2); var ly = Math.floor(maxStackH / boxH); var byVol = pl * ly; var byWt = Math.floor(maxWeight / boxWt); var actual = Math.min(byVol, byWt); document.getElementById('perLayer').textContent = pl + ' boxes'; document.getElementById('layers').textContent = ly; document.getElementById('byVolume').textContent = byVol + ' boxes'; document.getElementById('byWeight').textContent = byWt + ' boxes'; document.getElementById('actual').textContent = actual + ' boxes (' + fmt(actual * boxWt, 0) + ' lbs)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['boxL', 'boxW', 'boxH', 'boxWt', 'palletL', 'palletW', 'maxStackH', 'maxWeight'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
