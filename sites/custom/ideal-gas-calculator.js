(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var pressure = parseFloat(document.getElementById('pressure').value) || 0;
    var volume = parseFloat(document.getElementById('volume').value) || 0;
    var moles = parseFloat(document.getElementById('moles').value) || 0;
    var tempC = parseFloat(document.getElementById('tempC').value) || 0;

    // Calculation logic
    var R = 0.08206; var T = tempC + 273.15; if (moles === 0 && pressure > 0 && volume > 0) { var n = (pressure * volume) / (R * T); document.getElementById('solvedVar').textContent = 'n = ' + fmt(n, 4) + ' mol'; } else if (pressure === 0 && moles > 0 && volume > 0) { var P = (moles * R * T) / volume; document.getElementById('solvedVar').textContent = 'P = ' + fmt(P, 4) + ' atm'; } else if (volume === 0 && moles > 0 && pressure > 0) { var V = (moles * R * T) / pressure; document.getElementById('solvedVar').textContent = 'V = ' + fmt(V, 4) + ' L'; } else { var n2 = (pressure * volume) / (R * T); document.getElementById('solvedVar').textContent = 'n = ' + fmt(n2, 4) + ' mol'; } document.getElementById('tempK').textContent = fmt(T, 2) + ' K'; var densAir = (pressure * 28.97) / (R * T); document.getElementById('densityEst').textContent = fmt(densAir, 4) + ' g/L';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['pressure', 'volume', 'moles', 'tempC'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
