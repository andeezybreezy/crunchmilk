(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var boxL = parseFloat(document.getElementById('boxL').value) || 0;
    var boxW = parseFloat(document.getElementById('boxW').value) || 0;
    var boxH = parseFloat(document.getElementById('boxH').value) || 0;
    var palletL = parseFloat(document.getElementById('palletL').value) || 0;
    var palletW = parseFloat(document.getElementById('palletW').value) || 0;
    var maxHeight = parseFloat(document.getElementById('maxHeight').value) || 0;

    // Calculation logic
    var across = Math.floor(palletL / boxL) * Math.floor(palletW / boxW); var rotated = Math.floor(palletL / boxW) * Math.floor(palletW / boxL); var perLayer = Math.max(across, rotated); var numLayers = Math.floor(maxHeight / boxH); var total = perLayer * numLayers; var palletVol = palletL * palletW * maxHeight; var usedVol = total * boxL * boxW * boxH; var eff = (usedVol / palletVol) * 100; document.getElementById('perLayer').textContent = perLayer; document.getElementById('layers').textContent = numLayers; document.getElementById('totalBoxes').textContent = total; document.getElementById('efficiency').textContent = pct(eff);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['boxL', 'boxW', 'boxH', 'palletL', 'palletW', 'maxHeight'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
