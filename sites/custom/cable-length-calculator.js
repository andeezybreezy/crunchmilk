(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var cableType = document.getElementById('cableType').value;
    var length = parseFloat(document.getElementById('length').value) || 0;
    var gauge = document.getElementById('gauge').value;
    var impedance = parseFloat(document.getElementById('impedance').value) || 0;

    // Calculation logic
    var awg = parseInt(gauge);
    var resistancePerFt = {12: 0.00162, 14: 0.00258, 16: 0.00409, 18: 0.00651, 22: 0.0165, 24: 0.0262};
    var rPerFt = resistancePerFt[awg] || 0.00651;
    var totalR = rPerFt * length * 2;
    var maxLen, loss, pwrLoss;
    if (cableType === 'balanced') {
      maxLen = 1000;
      loss = length * 0.01;
      pwrLoss = 'N/A (line level)';
    } else if (cableType === 'unbalanced') {
      maxLen = 25;
      loss = length * 0.05;
      pwrLoss = 'N/A (line level)';
    } else if (cableType === 'speaker') {
      maxLen = impedance / (rPerFt * 2 * 0.05);
      loss = (totalR / (totalR + impedance)) * 100;
      var dampingFactor = impedance / totalR;
      pwrLoss = fmt(loss, 2) + '% (Damping factor: ' + fmt(dampingFactor, 0) + ')';
    } else {
      maxLen = 30;
      loss = length > 30 ? 'Risk of data errors' : 0;
      pwrLoss = 'N/A (digital)';
    }
    document.getElementById('signalLoss').textContent = typeof loss === 'string' ? loss : fmt(loss, 2) + ' dB';
    document.getElementById('maxRecommended').textContent = fmt(maxLen, 0) + ' feet';
    document.getElementById('resistance').textContent = fmt(totalR, 3) + ' ohms';
    document.getElementById('powerLoss').textContent = pwrLoss;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['cableType', 'length', 'gauge', 'impedance'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
