(function() {
  'use strict';

  var presets = {
    '223':  { name: '.223 Rem',        vel: 3240, wt: 55,  bc: 0.243 },
    '308':  { name: '.308 Win',        vel: 2650, wt: 168, bc: 0.462 },
    '65cm': { name: '6.5 Creedmoor',   vel: 2710, wt: 140, bc: 0.530 },
    '3006': { name: '.30-06',          vel: 2800, wt: 165, bc: 0.477 },
    '300wm':{ name: '.300 Win Mag',    vel: 2960, wt: 180, bc: 0.507 },
    '22lr': { name: '.22 LR',          vel: 1200, wt: 40,  bc: 0.130 },
    '12ga': { name: '12ga Slug',       vel: 1600, wt: 437, bc: 0.065 }
  };

  var calSel = document.getElementById('caliberSelect');
  var velIn = document.getElementById('muzzleVel');
  var wtIn = document.getElementById('bulletWeight');
  var bcIn = document.getElementById('ballisticCoeff');
  var zeroIn = document.getElementById('zeroRange');
  var windIn = document.getElementById('windSpeed');

  calSel.addEventListener('change', function() {
    var p = presets[calSel.value];
    if (p) {
      velIn.value = p.vel;
      wtIn.value = p.wt;
      bcIn.value = p.bc;
    }
  });

  function calculate() {
    var v0 = parseFloat(velIn.value);
    var wt = parseFloat(wtIn.value);
    var bc = parseFloat(bcIn.value);
    var zeroYd = parseFloat(zeroIn.value) || 100;
    var wind = parseFloat(windIn.value) || 0;

    if (isNaN(v0) || isNaN(wt) || isNaN(bc) || v0 <= 0 || wt <= 0 || bc <= 0) return;

    var g = 32.174; // ft/s^2
    var muzzleEnergy = (wt * v0 * v0) / 450437;
    document.getElementById('muzzleEnergy').textContent = muzzleEnergy.toFixed(0) + ' ft-lbs';
    document.getElementById('zeroDisp').textContent = zeroYd + ' yards';

    // Drag deceleration factor (simplified G1 flat-fire model)
    // retardation ~ v^2 / (bc * ballistic_constant)
    var k = 1.0 / (bc * 166.67); // drag coefficient factor

    // Step through in 1-yard increments, record at 50-yard marks
    var dt = 0.001; // time step in seconds
    var x = 0; // range in feet
    var y = 0; // height relative to bore in feet
    var vx = v0;
    var vy = 0;
    var windFps = wind * 1.467; // mph to fps
    var drift = 0;

    // First pass: find sight-line angle for zero range
    var zeroFt = zeroYd * 3;
    var sightAngle = 0;

    // Simulate to find drop at zero range with 0 sight angle
    function simulate(sAngle) {
      var sx = 0, sy = 0, svx = v0, svy = sAngle * v0, sd = 0;
      var results = [];
      var nextMark = 300; // 100 yards = 300 feet
      var t = 0;

      while (sx < 3300) { // up to 1100 yards
        var speed = Math.sqrt(svx * svx + svy * svy);
        var drag = k * speed;
        var ax = -drag * svx;
        var ay = -g - drag * svy;
        var adrift = -drag * (-windFps) * 0.001; // simplified wind drift

        svx += ax * dt;
        svy += ay * dt;
        sx += svx * dt;
        sy += svy * dt;
        sd += windFps * dt - svx * dt * 0; // simplified wind
        t += dt;

        if (sx >= nextMark) {
          var rangeYd = Math.round(nextMark / 3);
          var speed2 = Math.sqrt(svx * svx + svy * svy);
          var energy = (wt * speed2 * speed2) / 450437;
          var dropIn = sy * 12; // feet to inches
          // Wind drift: simplified
          var driftIn = 0.5 * (windFps / svx) * (sx / 3) * (sx / 3) / (v0 / svx) * 0;

          results.push({
            range: rangeYd,
            dropIn: dropIn,
            vel: speed2,
            energy: energy,
            timeFlight: t
          });
          nextMark += 150; // 50 yard increments
        }
      }
      return results;
    }

    // Better simulation with proper wind model
    function simFull(sAngle) {
      var sx = 0, sy = 0, svx = v0, svy = sAngle * v0;
      var results = [];
      var nextMark = 300;
      var t = 0;
      var windDriftFt = 0;

      while (sx < 3300) {
        var speed = Math.sqrt(svx * svx + svy * svy);
        if (speed < 100) break;
        var drag = k * speed;
        var ax = -drag * svx;
        var ay = -g - drag * svy;

        svx += ax * dt;
        svy += ay * dt;
        sx += svx * dt;
        sy += svy * dt;
        t += dt;

        // Wind drift accumulation (simplified lag model)
        windDriftFt += (windFps - 0) * dt - (windFps * svx / v0) * dt;

        if (sx >= nextMark) {
          var rangeYd = Math.round(nextMark / 3);
          var spd = Math.sqrt(svx * svx + svy * svy);
          var energy = (wt * spd * spd) / 450437;
          var dropIn = sy * 12;
          var driftIn = windDriftFt * 12;

          results.push({
            range: rangeYd,
            dropIn: dropIn,
            vel: spd,
            energy: energy,
            driftIn: driftIn
          });
          nextMark += 150;
        }
      }
      return results;
    }

    // Binary search for sight angle that zeros at desired range
    var lo = 0, hi = 0.05;
    for (var i = 0; i < 50; i++) {
      var mid = (lo + hi) / 2;
      var res = simFull(mid);
      var zeroResult = null;
      for (var j = 0; j < res.length; j++) {
        if (res[j].range >= zeroYd) { zeroResult = res[j]; break; }
      }
      if (!zeroResult) { lo = mid; continue; }
      if (zeroResult.dropIn > 0) hi = mid;
      else lo = mid;
    }

    var finalAngle = (lo + hi) / 2;
    var table = simFull(finalAngle);

    var tbody = document.getElementById('dropBody');
    tbody.innerHTML = '';

    for (var r = 0; r < table.length; r++) {
      var d = table[r];
      if (d.range < 100) continue;
      // Holdover: MOA = (drop_inches / range_yards) * 100 / 1.047
      // MIL = (drop_inches / range_yards) * 100 / 3.6
      var moaHold = (-d.dropIn / d.range) * (100 / 1.047);
      var milHold = (-d.dropIn / d.range) * (100 / 3.6);
      if (Math.abs(d.dropIn) < 0.05) { moaHold = 0; milHold = 0; }

      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' + d.range + '</td>' +
        '<td>' + d.dropIn.toFixed(1) + '</td>' +
        '<td>' + Math.round(d.vel) + '</td>' +
        '<td>' + Math.round(d.energy) + '</td>' +
        '<td>' + moaHold.toFixed(1) + '</td>' +
        '<td>' + milHold.toFixed(1) + '</td>';
      tbody.appendChild(tr);
    }

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);

  // Enter key support
  var inputs = document.querySelectorAll('.calc-card input');
  inputs.forEach(function(inp) {
    inp.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });
})();
