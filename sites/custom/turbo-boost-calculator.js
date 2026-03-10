(function() {
  'use strict';

  function calculate() {
    var naHP = parseFloat(document.getElementById('naHP').value);
    var boost = parseFloat(document.getElementById('boostPSI').value);
    var atm = parseFloat(document.getElementById('atmPressure').value) || 14.7;
    var eff = parseFloat(document.getElementById('intercoolerEff').value);

    if (isNaN(naHP) || isNaN(boost) || isNaN(eff) || naHP <= 0 || boost <= 0) return;

    var effDecimal = eff / 100;
    var boostedHP = naHP * (1 + (boost * effDecimal) / atm);
    var hpGain = boostedHP - naHP;
    var pressureRatio = (atm + boost) / atm;
    var pctIncrease = (hpGain / naHP) * 100;

    document.getElementById('totalHP').textContent = Math.round(boostedHP) + ' HP';
    document.getElementById('hpGain').textContent = '+' + Math.round(hpGain) + ' HP';
    document.getElementById('pressureRatio').textContent = pressureRatio.toFixed(2) + ':1';
    document.getElementById('pctIncrease').textContent = pctIncrease.toFixed(0) + '%';

    var tip = '';
    if (pressureRatio > 2.5) {
      tip = 'High pressure ratio — built engine internals and proper fuel system strongly recommended.';
    } else if (pressureRatio > 1.8) {
      tip = 'Moderate boost — ensure fuel system and tuning can support this level safely.';
    } else {
      tip = 'Mild boost — typically safe for stock internals with a proper tune.';
    }
    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);

  var inputs = document.querySelectorAll('.calc-card input');
  inputs.forEach(function(inp) {
    inp.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });
})();
