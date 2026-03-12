(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var pressure = parseFloat(document.getElementById('pressure').value) || 0;
    var moles = parseFloat(document.getElementById('moles').value) || 0;
    var temperature = parseFloat(document.getElementById('temperature').value) || 0;

    // Calculation logic
    var R = 0.08206; var tempK = temperature + 273.15; var volume = (moles * R * tempK) / pressure; var volumeM3 = volume / 1000;     document.getElementById('volume').textContent = fmt(volume,3);
    document.getElementById('volumeM3').textContent = fmt(volumeM3,5);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['pressure', 'moles', 'temperature'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
