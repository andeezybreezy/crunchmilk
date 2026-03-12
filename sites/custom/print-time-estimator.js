(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var volume = parseFloat(document.getElementById('volume').value) || 0;
    var layerHeight = parseFloat(document.getElementById('layerHeight').value) || 0;
    var printSpeed = parseFloat(document.getElementById('printSpeed').value) || 0;
    var infillPct = parseFloat(document.getElementById('infillPct').value) || 0;

    // Calculation logic
    var sideLen = Math.pow(volume, 1/3) * 10;
    var heightMM = sideLen;
    var layers = Math.ceil(heightMM / layerHeight);
    var effectiveInfill = infillPct / 100;
    var shellPerimeter = sideLen * 4;
    var infillPerLayer = sideLen * sideLen * effectiveInfill / (0.4);
    var totalPathLength = layers * (shellPerimeter + infillPerLayer);
    var timeSeconds = totalPathLength / printSpeed;
    var timeMinutes = timeSeconds / 60;
    var hours = Math.floor(timeMinutes / 60);
    var mins = Math.round(timeMinutes % 60);
    var filGrams = volume * 1.24 * (0.3 + effectiveInfill * 0.7);
    document.getElementById('totalLayers').textContent = fmt(layers, 0);
    document.getElementById('estTime').textContent = hours + 'h ' + mins + 'm';
    document.getElementById('filamentUsed').textContent = fmt(filGrams, 1) + ' g';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['volume', 'layerHeight', 'printSpeed', 'infillPct'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
