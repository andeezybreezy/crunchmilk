(function() {
  'use strict';

  var presets = {
    '223':  { vel: 3240, wt: 55,  bc: 0.243 },
    '308':  { vel: 2650, wt: 168, bc: 0.462 },
    '65cm': { vel: 2710, wt: 140, bc: 0.530 },
    '3006': { vel: 2800, wt: 165, bc: 0.477 },
    '300wm':{ vel: 2960, wt: 180, bc: 0.507 },
    '270':  { vel: 3060, wt: 130, bc: 0.433 },
    '243':  { vel: 2960, wt: 100, bc: 0.395 }
  };

  var energyThresholds = {
    'deer': 1000,
    'elk': 1500,
    'varmint': 200
  };

  var calSel = document.getElementById('caliberSelect');
  var velIn = document.getElementById('muzzleVel');
  var wtIn = document.getElementById('bulletWeight');
  var bcIn = document.getElementById('ballisticCoeff');
  var gameType = document.getElementById('gameType');
  var customEnergyGroup = document.getElementById('customEnergyGroup');

  calSel.addEventListener('change', function() {
    var p = presets[calSel.value];
    if (p) {
      velIn.value = p.vel;
      wtIn.value = p.wt;
      bcIn.value = p.bc;
    }
  });

  gameType.addEventListener('change', function() {
    customEnergyGroup.style.display = gameType.value === 'custom_energy' ? '' : 'none';
  });

  function calculate() {
    var v0 = parseFloat(velIn.value);
    var wt = parseFloat(wtIn.value);
    var bc = parseFloat(bcIn.value);
    var shooterMOA = parseFloat(document.getElementById('shooterMOA').value) || 2;
    var targetSize = parseFloat(document.getElementById('targetSize').value) || 10;

    if (isNaN(v0) || isNaN(wt) || isNaN(bc) || v0 <= 0 || wt <= 0 || bc <= 0) return;

    var minEnergy;
    if (gameType.value === 'custom_energy') {
      minEnergy = parseFloat(document.getElementById('customEnergy').value);
      if (isNaN(minEnergy) || minEnergy <= 0) return;
    } else {
      minEnergy = energyThresholds[gameType.value];
    }

    // Accuracy-limited range: group size in inches at range
    // MOA_group * 1.047 * (range/100) = target_size
    // range = target_size / (MOA * 1.047) * 100
    var accuracyRange = Math.floor(targetSize / (shooterMOA * 1.047) * 100);

    // Ballistic simulation to find energy-limited range
    var g = 32.174;
    var k = 1.0 / (bc * 166.67);
    var dt = 0.001;
    var vx = v0;
    var vy = 0;
    var sx = 0, sy = 0;

    // Simulate with a zero angle of ~0 (just tracking energy vs range)
    var sightAngle = 0.002; // rough approximation for 100yd zero

    var energyRangeYd = 0;
    var dropAtEnergyRange = 0;
    var energyAtRange = 0;
    var lastRangeYd = 0;
    var lastDrop = 0;
    var lastEnergy = (wt * v0 * v0) / 450437;

    vx = v0;
    vy = sightAngle * v0;
    sx = 0;
    sy = 0;

    while (sx < 4500) { // up to 1500 yards
      var speed = Math.sqrt(vx * vx + vy * vy);
      if (speed < 100) break;
      var drag = k * speed;
      vx += -drag * vx * dt;
      vy += (-g - drag * vy) * dt;
      sx += vx * dt;
      sy += vy * dt;

      var rangeYd = sx / 3;
      var energy = (wt * speed * speed) / 450437;

      if (energy < minEnergy && energyRangeYd === 0) {
        energyRangeYd = Math.floor(rangeYd);
        dropAtEnergyRange = sy * 12; // inches
        energyAtRange = energy;
        break;
      }
      lastRangeYd = rangeYd;
      lastDrop = sy * 12;
      lastEnergy = energy;
    }

    if (energyRangeYd === 0) {
      energyRangeYd = Math.floor(lastRangeYd);
      dropAtEnergyRange = lastDrop;
      energyAtRange = lastEnergy;
    }

    var effectiveRange = Math.min(energyRangeYd, accuracyRange);
    var limitingFactor = energyRangeYd <= accuracyRange ? 'Bullet energy' : 'Shooter accuracy';

    // Get energy and drop at the effective range
    vx = v0; vy = sightAngle * v0; sx = 0; sy = 0;
    var effEnergy = lastEnergy;
    var effDrop = lastDrop;
    while (sx < effectiveRange * 3 + 3) {
      var spd = Math.sqrt(vx * vx + vy * vy);
      if (spd < 100) break;
      var dr = k * spd;
      vx += -dr * vx * dt;
      vy += (-g - dr * vy) * dt;
      sx += vx * dt;
      sy += vy * dt;
      effEnergy = (wt * spd * spd) / 450437;
      effDrop = sy * 12;
    }

    document.getElementById('maxRange').textContent = effectiveRange + ' yards';
    document.getElementById('limitFactor').textContent = limitingFactor;
    document.getElementById('energyAtMax').textContent = Math.round(effEnergy) + ' ft-lbs';
    document.getElementById('dropAtMax').textContent = effDrop.toFixed(1) + ' inches';
    document.getElementById('energyRange').textContent = energyRangeYd + ' yards';
    document.getElementById('accuracyRange').textContent = accuracyRange + ' yards';

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
