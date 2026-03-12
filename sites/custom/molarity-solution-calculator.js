(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var mass = parseFloat(document.getElementById('mass').value) || 0;
    var molarMass = parseFloat(document.getElementById('molarMass').value) || 0;
    var volume = parseFloat(document.getElementById('volume').value) || 0;

    // Calculation logic
    var moles = mass / molarMass; var volumeL = volume / 1000; var molarity = moles / volumeL; var normality = molarity;     document.getElementById('moles').textContent = fmt(moles, 2);
    document.getElementById('molarity').textContent = fmt(molarity, 2);
    document.getElementById('normality').textContent = fmt(normality, 2);

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
