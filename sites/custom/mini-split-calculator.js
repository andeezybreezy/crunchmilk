(function() {
  'use strict';

  // Standard mini-split sizes (BTU)
  var stdSizes = [9000, 12000, 18000, 24000, 36000, 48000];

  var roomLength = document.getElementById('roomLength');
  var roomWidth = document.getElementById('roomWidth');
  var ceilingHeight = document.getElementById('ceilingHeight');
  var insulation = document.getElementById('insulation');
  var climate = document.getElementById('climate');
  var sunExposure = document.getElementById('sunExposure');
  var numZones = document.getElementById('numZones');
  var calcBtn = document.getElementById('calcBtn');
  var rBTU = document.getElementById('rBTU');
  var rUnit = document.getElementById('rUnit');
  var rSystem = document.getElementById('rSystem');
  var rCost = document.getElementById('rCost');
  var resultDetails = document.getElementById('resultDetails');

  var insulationMult = { poor: 1.3, average: 1.0, good: 0.8 };
  var climateMult = { hot: 1.25, warm: 1.1, moderate: 1.0, cold: 1.15, 'very-cold': 1.3 };
  var sunMult = { shaded: 0.9, average: 1.0, sunny: 1.15 };

  // Cost estimates per zone (installed)
  var costPerZone = { 1: [3000, 5000], 2: [5000, 8000], 3: [7000, 11000], 4: [9000, 14000] };

  function formatNum(n) {
    return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function formatK(btu) {
    return (btu / 1000) + 'K BTU';
  }

  function calculate() {
    var L = parseFloat(roomLength.value);
    var W = parseFloat(roomWidth.value);
    var H = parseFloat(ceilingHeight.value);

    if (isNaN(L) || isNaN(W) || L <= 0 || W <= 0) {
      rBTU.textContent = '—';
      rUnit.textContent = '—';
      rSystem.textContent = '—';
      rCost.textContent = '—';
      resultDetails.innerHTML = '';
      return;
    }

    var sqft = L * W;
    var zones = parseInt(numZones.value, 10) || 1;
    var ceilingMult = H / 8;

    var baseBTU = sqft * 25;
    var totalBTU = baseBTU * ceilingMult * insulationMult[insulation.value] * climateMult[climate.value] * sunMult[sunExposure.value];

    // Find standard unit size
    var unitSize = stdSizes[stdSizes.length - 1];
    for (var i = 0; i < stdSizes.length; i++) {
      if (stdSizes[i] >= totalBTU) {
        unitSize = stdSizes[i];
        break;
      }
    }

    var systemType;
    var totalSystemBTU;

    if (zones === 1) {
      systemType = 'Single-Zone';
      totalSystemBTU = unitSize;
    } else {
      systemType = 'Multi-Zone (' + zones + ' heads)';
      // Per-zone BTU (divide total by zones, round to standard)
      var perZoneBTU = totalBTU / zones;
      var perZoneUnit = stdSizes[0];
      for (var j = 0; j < stdSizes.length; j++) {
        if (stdSizes[j] >= perZoneBTU) {
          perZoneUnit = stdSizes[j];
          break;
        }
      }
      totalSystemBTU = perZoneUnit * zones;
      unitSize = perZoneUnit;
    }

    // Outdoor unit sizing (110-130% of total indoor capacity)
    var outdoorBTU = totalSystemBTU;
    var outdoorUnit = stdSizes[stdSizes.length - 1];
    for (var k = 0; k < stdSizes.length; k++) {
      if (stdSizes[k] >= outdoorBTU) {
        outdoorUnit = stdSizes[k];
        break;
      }
    }

    // Cost estimate
    var costKey = Math.min(zones, 4);
    var costs = costPerZone[costKey] || [9000, 15000];
    if (zones > 4) {
      costs = [costs[0] + (zones - 4) * 2000, costs[1] + (zones - 4) * 3000];
    }

    rBTU.textContent = formatNum(totalBTU) + ' BTU';
    rUnit.textContent = zones > 1 ? zones + ' × ' + formatK(unitSize) : formatK(unitSize);
    rSystem.textContent = systemType;
    rCost.textContent = '$' + formatNum(costs[0]) + '–$' + formatNum(costs[1]);

    var html = '<p style="margin:0 0 8px"><strong>Room:</strong> ' + formatNum(sqft) + ' sq ft × ' + H + ' ft ceiling</p>';
    html += '<p style="margin:0 0 8px"><strong>Calculated need:</strong> ' + formatNum(totalBTU) + ' BTU (' + (totalBTU / 12000).toFixed(1) + ' tons)</p>';

    if (zones > 1) {
      html += '<p style="margin:0 0 8px"><strong>Per zone:</strong> ' + formatNum(totalBTU / zones) + ' BTU → ' + formatK(unitSize) + ' indoor head</p>';
      html += '<p style="margin:0 0 8px"><strong>Outdoor unit:</strong> ' + formatK(outdoorUnit) + ' condenser (' + zones + '-port)</p>';
    }

    html += '<p style="margin:0 0 8px"><strong>Tonnage:</strong> ' + (unitSize / 12000).toFixed(1) + ' tons per zone</p>';

    // Electrical requirement
    var amps;
    if (totalSystemBTU <= 12000) amps = '15A/120V';
    else if (totalSystemBTU <= 18000) amps = '20A/240V';
    else if (totalSystemBTU <= 24000) amps = '25A/240V';
    else amps = '30-40A/240V';

    html += '<p style="margin:0"><strong>Electrical:</strong> Dedicated ' + amps + ' circuit required</p>';

    resultDetails.innerHTML = html;
  }

  calcBtn.addEventListener('click', calculate);

  [roomLength, roomWidth, ceilingHeight, insulation, climate, sunExposure, numZones].forEach(function(el) {
    el.addEventListener('change', calculate);
    el.addEventListener('input', calculate);
  });

})();
