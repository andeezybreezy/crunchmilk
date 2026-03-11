(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var mass = parseFloat(document.getElementById('mass').value) || 0;
    var molarMass = parseFloat(document.getElementById('molarMass').value) || 0;
    var volume = parseFloat(document.getElementById('volume').value) || 0;

    // Calculation logic
    var moles = mass / molarMass; var volumeL = volume / 1000; var molarity = moles / volumeL; var normality = molarity;     document.getElementById('moles').textContent = fmt(moles,4);
    document.getElementById('molarity').textContent = fmt(molarity,4);
    document.getElementById('normality').textContent = fmt(normality,4);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['mass', 'molarMass', 'volume'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
