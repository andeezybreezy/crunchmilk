(function() {
  'use strict';

  // Pipe data: nominal size, ID (inches) by material, max recommended GPM
  var pipeData = [
    { nominal: '3/8"',   copper: 0.430, pex: 0.360, cpvc: 0.400 },
    { nominal: '1/2"',   copper: 0.545, pex: 0.475, cpvc: 0.520 },
    { nominal: '3/4"',   copper: 0.785, pex: 0.671, cpvc: 0.720 },
    { nominal: '1"',     copper: 1.025, pex: 0.862, cpvc: 0.950 },
    { nominal: '1-1/4"', copper: 1.265, pex: 1.050, cpvc: 1.190 },
    { nominal: '1-1/2"', copper: 1.505, pex: 1.250, cpvc: 1.420 },
    { nominal: '2"',     copper: 1.985, pex: 1.650, cpvc: 1.870 }
  ];

  // Fixture units to GPM conversion (IPC Table E103.3 approximation)
  function fixtureUnitsToGPM(fu) {
    if (fu <= 0) return 0;
    if (fu <= 1) return 3;
    if (fu <= 2) return 5;
    if (fu <= 5) return 7;
    if (fu <= 10) return 10;
    if (fu <= 20) return 15;
    if (fu <= 40) return 25;
    if (fu <= 75) return 35;
    if (fu <= 150) return 55;
    return 55 + (fu - 150) * 0.25;
  }

  // Hazen-Williams C values
  var cValues = { copper: 140, pex: 150, cpvc: 150 };

  var inputMethod = document.getElementById('inputMethod');
  var fixtureWrap = document.getElementById('fixtureWrap');
  var gpmWrap = document.getElementById('gpmWrap');
  var fixtureUnits = document.getElementById('fixtureUnits');
  var flowGPM = document.getElementById('flowGPM');
  var pipeLength = document.getElementById('pipeLength');
  var material = document.getElementById('material');
  var supplyPressure = document.getElementById('supplyPressure');
  var calcBtn = document.getElementById('calcBtn');
  var rPipe = document.getElementById('rPipe');
  var rVelocity = document.getElementById('rVelocity');
  var rGPM = document.getElementById('rGPM');
  var rPressure = document.getElementById('rPressure');
  var resultDetails = document.getElementById('resultDetails');

  inputMethod.addEventListener('change', function() {
    if (inputMethod.value === 'fixture') {
      fixtureWrap.style.display = '';
      gpmWrap.style.display = 'none';
    } else {
      fixtureWrap.style.display = 'none';
      gpmWrap.style.display = '';
    }
  });

  function getGPM() {
    if (inputMethod.value === 'fixture') {
      var fu = parseFloat(fixtureUnits.value);
      return isNaN(fu) || fu <= 0 ? NaN : fixtureUnitsToGPM(fu);
    }
    var g = parseFloat(flowGPM.value);
    return isNaN(g) || g <= 0 ? NaN : g;
  }

  function calculate() {
    var gpm = getGPM();
    var length = parseFloat(pipeLength.value);
    var psi = parseFloat(supplyPressure.value);
    var mat = material.value;

    if (isNaN(gpm) || isNaN(length) || length <= 0) {
      rPipe.textContent = '—';
      rVelocity.textContent = '—';
      rGPM.textContent = '—';
      rPressure.textContent = '—';
      resultDetails.innerHTML = '';
      return;
    }

    if (isNaN(psi) || psi <= 0) psi = 60;

    var C = cValues[mat];
    var matLabel = mat === 'copper' ? 'Copper (Type L)' : mat === 'pex' ? 'PEX' : 'CPVC';

    // Find smallest pipe where velocity <= 8 fps
    var bestIdx = -1;
    for (var i = 0; i < pipeData.length; i++) {
      var id = pipeData[i][mat];
      var area = Math.PI * (id / 2) * (id / 2); // sq inches
      var areaSqFt = area / 144;
      // velocity = Q / A; Q in cfs = GPM / 448.8
      var velocity = (gpm / 448.8) / areaSqFt;
      if (velocity <= 8) {
        bestIdx = i;
        break;
      }
    }

    if (bestIdx === -1) {
      rPipe.textContent = '> 2"';
      rPipe.style.color = '#dc2626';
      rVelocity.textContent = '—';
      rGPM.textContent = gpm.toFixed(1) + ' GPM';
      rPressure.textContent = '—';
      resultDetails.innerHTML = '<p style="color:#dc2626;margin:0">Flow exceeds 2" pipe capacity. Consider parallel runs or larger commercial pipe.</p>';
      return;
    }

    var best = pipeData[bestIdx];
    var id = best[mat];
    var area = Math.PI * (id / 2) * (id / 2);
    var areaSqFt = area / 144;
    var velocity = (gpm / 448.8) / areaSqFt;

    // Hazen-Williams friction loss (PSI per 100 ft)
    // HL = 10.67 × Q^1.852 / (C^1.852 × d^4.87) where Q in m³/s and d in meters
    // Simplified for US units: PSI/100ft = 4.52 × Q^1.852 / (C^1.852 × d^4.87) × (100 / 2.31)
    // Using practical formula: PSI_per_100ft ≈ (gpm / (0.442 × C × d^2.63))^1.852 × 0.2083 × (100/d)^...
    // Simplified empirical: friction_psi = 0.2083 * (100/C)^1.852 * (gpm^1.852) / (id^4.8655) per 100ft
    var frictionPer100 = 0.2083 * Math.pow(100 / C, 1.852) * Math.pow(gpm, 1.852) / Math.pow(id, 4.8655);
    var totalFriction = frictionPer100 * length / 100;

    var pressureAtEnd = psi - totalFriction;

    rPipe.textContent = best.nominal + ' ' + matLabel;
    rPipe.style.color = '';
    rVelocity.textContent = velocity.toFixed(1) + ' ft/s';
    rVelocity.style.color = velocity > 5 ? '#ca8a04' : '#16a34a';
    rGPM.textContent = gpm.toFixed(1) + ' GPM';
    rPressure.textContent = totalFriction.toFixed(1) + ' PSI loss';

    var html = '';

    if (inputMethod.value === 'fixture') {
      var fu = parseFloat(fixtureUnits.value);
      html += '<p style="margin:0 0 8px"><strong>Fixture units:</strong> ' + fu + ' WSFU → ' + gpm.toFixed(1) + ' GPM estimated demand</p>';
    }

    html += '<p style="margin:0 0 8px"><strong>Pipe:</strong> ' + best.nominal + ' ' + matLabel + ' (ID: ' + id + '")</p>';
    html += '<p style="margin:0 0 8px"><strong>Velocity:</strong> ' + velocity.toFixed(1) + ' ft/sec';
    if (velocity > 8) html += ' <span style="color:#dc2626">(over 8 fps limit!)</span>';
    else if (velocity > 5) html += ' <span style="color:#ca8a04">(moderate — watch for noise in hot lines)</span>';
    else html += ' <span style="color:#16a34a">(good)</span>';
    html += '</p>';

    html += '<p style="margin:0 0 8px"><strong>Friction loss:</strong> ' + frictionPer100.toFixed(2) + ' PSI per 100 ft × ' + length + ' ft = ' + totalFriction.toFixed(1) + ' PSI total</p>';
    html += '<p style="margin:0 0 8px"><strong>Pressure at end:</strong> ' + pressureAtEnd.toFixed(1) + ' PSI';
    if (pressureAtEnd < 20) html += ' <span style="color:#dc2626">(too low — need larger pipe or booster)</span>';
    else if (pressureAtEnd < 35) html += ' <span style="color:#ca8a04">(marginal)</span>';
    else html += ' <span style="color:#16a34a">(adequate)</span>';
    html += '</p>';

    // Show next size up comparison
    if (bestIdx + 1 < pipeData.length) {
      var next = pipeData[bestIdx + 1];
      var nextID = next[mat];
      var nextArea = Math.PI * (nextID / 2) * (nextID / 2) / 144;
      var nextVel = (gpm / 448.8) / nextArea;
      var nextFriction = 0.2083 * Math.pow(100 / C, 1.852) * Math.pow(gpm, 1.852) / Math.pow(nextID, 4.8655);
      var nextTotal = nextFriction * length / 100;
      html += '<p style="margin:0;color:var(--text-light)"><strong>Upsizing to ' + next.nominal + ':</strong> ' + nextVel.toFixed(1) + ' ft/s, ' + nextTotal.toFixed(1) + ' PSI loss, ' + (psi - nextTotal).toFixed(1) + ' PSI at end</p>';
    }

    resultDetails.innerHTML = html;
  }

  calcBtn.addEventListener('click', calculate);

  [inputMethod, fixtureUnits, flowGPM, pipeLength, material, supplyPressure].forEach(function(el) {
    el.addEventListener('change', calculate);
    el.addEventListener('input', calculate);
  });

})();
