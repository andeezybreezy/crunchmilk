(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var lineVoltage = parseFloat(document.getElementById('lineVoltage').value) || 0;
    var lineCurrent = parseFloat(document.getElementById('lineCurrent').value) || 0;
    var powerFactor = parseFloat(document.getElementById('powerFactor').value) || 0;

    // Calculation logic
    var apparentP = (1.732 * lineVoltage * lineCurrent) / 1000;
    var realP = apparentP * powerFactor;
    var reactiveP = apparentP * Math.sin(Math.acos(powerFactor));
    var phaseV = lineVoltage / 1.732;
    document.getElementById('realPower').textContent = fmt(realP, 2) + ' kW';
    document.getElementById('apparentPower').textContent = fmt(apparentP, 2) + ' kVA';
    document.getElementById('reactivePower').textContent = fmt(reactiveP, 2) + ' kVAR';
    document.getElementById('phaseVoltage').textContent = fmt(phaseV, 1) + ' V';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['lineVoltage', 'lineCurrent', 'powerFactor'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
