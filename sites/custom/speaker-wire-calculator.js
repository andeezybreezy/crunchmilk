(function() {
  'use strict';

  // Resistance per foot (ohms) for copper wire by AWG
  var resistancePerFoot = {
    '12': 0.00162,
    '14': 0.00257,
    '16': 0.00409,
    '18': 0.00651
  };

  function calculate() {
    var impedance = parseFloat(document.getElementById('impedance').value);
    var runLength = parseFloat(document.getElementById('wireLength').value);
    var gauge = document.getElementById('wireGauge').value;

    if (isNaN(runLength) || runLength <= 0) return;

    var rPerFoot = resistancePerFoot[gauge];
    // Total wire length = 2× run (out and back)
    var totalLength = runLength * 2;
    var totalResistance = rPerFoot * totalLength;

    // Signal loss percentage
    var signalLossPct = (totalResistance / (impedance + totalResistance)) * 100;

    // Power loss at 100W
    var powerLoss = signalLossPct; // Same percentage applies to power

    // dB loss: 10 * log10(1 - loss fraction)
    var lossFraction = totalResistance / (impedance + totalResistance);
    var dbLoss = -10 * Math.log10(1 - lossFraction);

    // Pass/fail at 5%
    var maxResistance = impedance * 0.05;
    var pass = totalResistance <= maxResistance;

    // Find recommended gauge
    var recommended = gauge;
    var gauges = ['18', '16', '14', '12'];
    for (var i = 0; i < gauges.length; i++) {
      var testR = resistancePerFoot[gauges[i]] * totalLength;
      if (testR <= maxResistance) {
        recommended = gauges[i];
        break;
      }
    }
    // If even 12 AWG doesn't pass
    if (resistancePerFoot['12'] * totalLength > maxResistance) {
      recommended = '10 AWG or thicker';
    }

    document.getElementById('resistance').textContent = totalResistance.toFixed(4) + ' \u03A9';
    document.getElementById('signalLoss').textContent = signalLossPct.toFixed(2) + '%';
    document.getElementById('passFail').textContent = pass ? '\u2705 PASS' : '\u274C FAIL';
    document.getElementById('passFail').style.color = pass ? '#16a34a' : '#dc2626';
    document.getElementById('powerLoss').textContent = powerLoss.toFixed(2) + ' W lost';
    document.getElementById('recommended').textContent = recommended + ' AWG';
    document.getElementById('dbLoss').textContent = dbLoss.toFixed(3) + ' dB';

    var tip = '';
    if (pass) {
      tip = gauge + ' AWG is suitable for this run. Signal loss of ' + signalLossPct.toFixed(2) + '% is within the 5% threshold (max ' + maxResistance.toFixed(3) + ' \u03A9).';
    } else {
      tip = gauge + ' AWG has too much resistance for this run. Upgrade to ' + recommended + ' AWG to stay within the 5% rule. Max allowable resistance: ' + maxResistance.toFixed(3) + ' \u03A9.';
    }
    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
  document.getElementById('wireLength').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') calculate();
  });
})();
