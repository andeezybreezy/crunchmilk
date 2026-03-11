(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var torque = parseFloat(document.getElementById('torque').value) || 0;
    var rpm = parseFloat(document.getElementById('rpm').value) || 0;
    var efficiency = parseFloat(document.getElementById('efficiency').value) || 0;

    // Calculation logic
    var mechHP = (torque * rpm) / 5252;
    var elecHP = mechHP / (efficiency / 100);
    var watts = elecHP * 746;
    document.getElementById('mechHP').textContent = fmt(mechHP, 2) + ' HP';
    document.getElementById('elecHP').textContent = fmt(elecHP, 2) + ' HP (accounting for ' + fmt(efficiency, 0) + '% efficiency)';
    document.getElementById('watts').textContent = fmt(watts, 0) + ' W (' + fmt(watts / 1000, 2) + ' kW)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['torque', 'rpm', 'efficiency'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
