(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var wavelength = parseFloat(document.getElementById('wavelength').value) || 0;

    // Calculation logic
    var freqHz = 3e17 / wavelength; var frequency = freqHz / 1e12; var energy = 1240 / wavelength; var spectrum = wavelength < 10 ? 'X-ray' : wavelength < 400 ? 'Ultraviolet' : wavelength < 700 ? 'Visible Light' : wavelength < 1000 ? 'Near Infrared' : 'Infrared'; return {frequency: fmt(frequency,2), energy: fmt(energy,3), spectrum: spectrum};

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
