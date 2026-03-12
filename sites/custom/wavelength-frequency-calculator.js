(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var wavelength = parseFloat(document.getElementById('wavelength').value) || 0;
    var direction = document.getElementById('direction').value;

    // Calculation logic
    var c = 2.998e8; var h = 6.626e-34; var wlM, freq; if (direction === 'wl') { wlM = wavelength * 1e-9; freq = c / wlM; } else { freq = wavelength * 1e12; wlM = c / freq; } var E = h * (c / wlM); var wlNm = wlM * 1e9; var region = wlNm < 10 ? 'X-Ray / Gamma' : wlNm < 380 ? 'Ultraviolet' : wlNm < 450 ? 'Violet' : wlNm < 495 ? 'Blue' : wlNm < 570 ? 'Green' : wlNm < 590 ? 'Yellow' : wlNm < 620 ? 'Orange' : wlNm < 750 ? 'Red' : wlNm < 1e6 ? 'Infrared' : 'Microwave / Radio'; document.getElementById('freqResult').textContent = (c/wlM).toExponential(3) + ' Hz'; document.getElementById('wlResult').textContent = fmt(wlNm, 2) + ' nm'; document.getElementById('energy').textContent = E.toExponential(3) + ' J (' + fmt(E * 6.242e18, 2) + ' eV)'; document.getElementById('spectrum').textContent = region;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['wavelength', 'direction'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
