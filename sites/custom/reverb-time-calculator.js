(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var roomLength = parseFloat(document.getElementById('roomLength').value) || 0;
    var roomWidth = parseFloat(document.getElementById('roomWidth').value) || 0;
    var roomHeight = parseFloat(document.getElementById('roomHeight').value) || 0;
    var roomType = document.getElementById('roomType').value;

    // Calculation logic
    var vol = roomLength * roomWidth * roomHeight;
    var avgAlpha = parseFloat(roomType);
    var surfArea = 2 * (roomLength * roomWidth + roomLength * roomHeight + roomWidth * roomHeight);
    var totalAbs = surfArea * avgAlpha;
    var rt60 = 0.049 * vol / totalAbs;
    var idealRT = 0.3 + 0.002 * Math.pow(vol, 0.5);
    document.getElementById('rt60').textContent = fmt(rt60, 2) + ' seconds';
    document.getElementById('roomVolume').textContent = fmt(vol, 0) + ' cu ft (' + fmt(vol * 0.0283, 0) + ' m³)';
    document.getElementById('totalAbsorption').textContent = fmt(totalAbs, 0) + ' sabins';
    document.getElementById('ideal').textContent = fmt(idealRT, 2) + 's (music studio) / ' + fmt(idealRT * 0.6, 2) + 's (speech)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['roomLength', 'roomWidth', 'roomHeight', 'roomType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
