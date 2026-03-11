(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var aperture = document.getElementById('aperture').value;
    var shutter = document.getElementById('shutter').value;
    var iso = document.getElementById('iso').value;

    // Calculation logic
    var f = parseFloat(aperture);
    var t = parseFloat(shutter);
    var isoVal = parseFloat(iso);
    var ev100 = Math.log2(f * f / t) - Math.log2(isoVal / 100);
    var luxApprox = Math.pow(2, ev100) * 2.5;
    var scene = 'Unknown';
    if (ev100 >= 15) scene = 'Bright sun on snow/sand';
    else if (ev100 >= 13) scene = 'Bright daylight';
    else if (ev100 >= 11) scene = 'Hazy sun / Overcast bright';
    else if (ev100 >= 9) scene = 'Overcast / Open shade';
    else if (ev100 >= 7) scene = 'Indoor, well-lit';
    else if (ev100 >= 5) scene = 'Indoor, average lighting';
    else if (ev100 >= 3) scene = 'Dim indoor / Dusk';
    else if (ev100 >= 1) scene = 'Twilight / Candle-lit room';
    else scene = 'Night / Very dark';
    document.getElementById('ev').textContent = 'EV ' + fmt(ev100, 1);
    document.getElementById('lux').textContent = fmt(luxApprox, 0) + ' lux';
    document.getElementById('scene').textContent = scene;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['aperture', 'shutter', 'iso'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
