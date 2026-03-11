(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var volume = parseFloat(document.getElementById('volume').value) || 0;
    var infill = parseFloat(document.getElementById('infill').value) || 0;
    var wallThickness = parseFloat(document.getElementById('wallThickness').value) || 0;

    // Calculation logic
    var density = 1.24; var solidFraction = 0.3 + (infill / 100) * 0.7; var weight = volume * density * solidFraction; var filamentLength = weight / 3; var printTime = (volume * solidFraction) / 15;     document.getElementById('weight').textContent = fmt(weight,1);
    document.getElementById('filamentLength').textContent = fmt(filamentLength,1);
    document.getElementById('printTime').textContent = fmt(printTime,1);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['volume', 'infill', 'wallThickness'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
