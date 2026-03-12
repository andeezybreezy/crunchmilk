(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var wavelength = parseFloat(document.getElementById('wavelength').value) || 0;

    // Calculation logic
    var freqHz = 3e17 / wavelength; var frequency = freqHz / 1e12; var energy = 1240 / wavelength; var spectrum = wavelength < 10 ? 'X-ray' : wavelength < 400 ? 'Ultraviolet' : wavelength < 700 ? 'Visible Light' : wavelength < 1000 ? 'Near Infrared' : 'Infrared';     document.getElementById('frequency').textContent = fmt(frequency,2);
    document.getElementById('energy').textContent = fmt(energy,3);
    document.getElementById('spectrum').textContent = spectrum;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['wavelength'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
