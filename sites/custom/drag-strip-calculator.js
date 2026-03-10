(function() {
  'use strict';

  var carPresets = {
    'mustang':    { weight: 4100, hp: 480 },
    'camaro':     { weight: 3950, hp: 455 },
    'civic':      { weight: 2950, hp: 200 },
    'tesla3':     { weight: 4100, hp: 346 },
    'wrx':        { weight: 3500, hp: 271 },
    'challenger': { weight: 4300, hp: 485 },
    'corvette':   { weight: 3650, hp: 490 },
    'supra':      { weight: 3500, hp: 382 }
  };

  var presetSel = document.getElementById('presetCar');
  var weightIn = document.getElementById('vehicleWeight');
  var hpIn = document.getElementById('vehicleHP');

  presetSel.addEventListener('change', function() {
    var p = carPresets[presetSel.value];
    if (p) {
      weightIn.value = p.weight;
      hpIn.value = p.hp;
    }
  });

  function calculate() {
    var weight = parseFloat(weightIn.value);
    var hp = parseFloat(hpIn.value);

    if (isNaN(weight) || isNaN(hp) || weight <= 0 || hp <= 0) return;

    // Brock's formulas
    var ratio = weight / hp;
    var quarterET = 5.825 * Math.pow(ratio, 1 / 3);
    var quarterMPH = 234 * Math.pow(hp / weight, 1 / 3);

    // 1/8 mile approximations
    var eighthET = quarterET * 0.653;
    var eighthMPH = quarterMPH * 0.813;

    document.getElementById('quarterET').textContent = quarterET.toFixed(2) + ' seconds';
    document.getElementById('quarterMPH').textContent = quarterMPH.toFixed(1) + ' mph';
    document.getElementById('eighthET').textContent = eighthET.toFixed(2) + ' seconds';
    document.getElementById('eighthMPH').textContent = eighthMPH.toFixed(1) + ' mph';
    document.getElementById('wtPower').textContent = ratio.toFixed(1) + ' lbs/HP';

    var tip = '';
    if (quarterET < 10) {
      tip = 'Sub-10 second territory. Roll cage and safety equipment likely required by NHRA rules.';
    } else if (quarterET < 11.5) {
      tip = 'Very fast. NHRA requires a roll bar for cars running 11.49 or quicker.';
    } else if (quarterET < 13) {
      tip = 'Quick street car range. Traction and driver consistency are key at this level.';
    } else {
      tip = 'Good starting point. Focus on consistent launches and full-throttle shifts for best results.';
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
