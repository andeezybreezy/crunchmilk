(function() {
  'use strict';

  var roomLength = document.getElementById('roomLength');
  var roomWidth = document.getElementById('roomWidth');
  var ceilingHeight = document.getElementById('ceilingHeight');
  var insulation = document.getElementById('insulation');
  var climate = document.getElementById('climate');
  var sunExposure = document.getElementById('sunExposure');
  var occupants = document.getElementById('occupants');
  var calcBtn = document.getElementById('calcBtn');
  var rCooling = document.getElementById('rCooling');
  var rHeating = document.getElementById('rHeating');
  var rTonnage = document.getElementById('rTonnage');
  var rFurnace = document.getElementById('rFurnace');
  var resultDetails = document.getElementById('resultDetails');

  // Adjustment factors
  var insulationFactors = { poor: { cool: 1.3, heat: 1.4 }, average: { cool: 1.0, heat: 1.0 }, good: { cool: 0.8, heat: 0.75 } };
  var climateFactors = { hot: { cool: 1.3, heat: 0.7 }, warm: { cool: 1.15, heat: 0.85 }, moderate: { cool: 1.0, heat: 1.0 }, cold: { cool: 0.85, heat: 1.3 }, 'very-cold': { cool: 0.7, heat: 1.6 } };
  var sunFactors = { shaded: { cool: 0.9, heat: 1.05 }, average: { cool: 1.0, heat: 1.0 }, sunny: { cool: 1.15, heat: 0.95 } };

  // Base BTU per sq ft
  var baseCoolPerSqFt = 22;
  var baseHeatPerSqFt = 40;

  // Standard furnace sizes
  var furnaceSizes = [40000, 60000, 80000, 100000, 120000];

  function formatNum(n) {
    return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function calculate() {
    var L = parseFloat(roomLength.value);
    var W = parseFloat(roomWidth.value);
    var H = parseFloat(ceilingHeight.value);

    if (isNaN(L) || isNaN(W) || L <= 0 || W <= 0) {
      rCooling.textContent = '—';
      rHeating.textContent = '—';
      rTonnage.textContent = '—';
      rFurnace.textContent = '—';
      resultDetails.innerHTML = '';
      return;
    }

    var sqft = L * W;
    var occ = parseInt(occupants.value, 10) || 2;

    // Ceiling height multiplier (baseline 8ft)
    var ceilingMult = H / 8;

    var insFactor = insulationFactors[insulation.value];
    var climFactor = climateFactors[climate.value];
    var sunFactor = sunFactors[sunExposure.value];

    // Cooling
    var coolingBTU = sqft * baseCoolPerSqFt * ceilingMult * insFactor.cool * climFactor.cool * sunFactor.cool;
    // Add occupant heat (600 BTU per person beyond the first 2)
    coolingBTU += Math.max(0, occ - 2) * 600;
    // Base occupant load
    coolingBTU += occ * 400;

    // Heating
    var heatingBTU = sqft * baseHeatPerSqFt * ceilingMult * insFactor.heat * climFactor.heat * sunFactor.heat;

    var tonnage = coolingBTU / 12000;

    // Round to standard AC sizes
    var stdTons = [1, 1.5, 2, 2.5, 3, 3.5, 4, 5];
    var recTon = stdTons[stdTons.length - 1];
    for (var i = 0; i < stdTons.length; i++) {
      if (stdTons[i] * 12000 >= coolingBTU * 0.95) {
        recTon = stdTons[i];
        break;
      }
    }

    // Find furnace size
    var furnace = furnaceSizes[furnaceSizes.length - 1];
    for (var j = 0; j < furnaceSizes.length; j++) {
      if (furnaceSizes[j] * 0.96 >= heatingBTU) {
        furnace = furnaceSizes[j];
        break;
      }
    }

    rCooling.textContent = formatNum(coolingBTU) + ' BTU';
    rHeating.textContent = formatNum(heatingBTU) + ' BTU';
    rTonnage.textContent = recTon + ' ton' + (recTon !== 1 ? 's' : '');
    rFurnace.textContent = formatNum(furnace) + ' BTU';

    var html = '<p style="margin:0 0 8px"><strong>Room:</strong> ' + formatNum(sqft) + ' sq ft × ' + H + ' ft ceiling = ' + formatNum(sqft * H) + ' cu ft</p>';
    html += '<p style="margin:0 0 8px"><strong>Exact cooling:</strong> ' + formatNum(coolingBTU) + ' BTU (' + tonnage.toFixed(2) + ' tons)</p>';
    html += '<p style="margin:0 0 8px"><strong>Recommended AC:</strong> ' + recTon + '-ton unit (' + formatNum(recTon * 12000) + ' BTU)</p>';
    html += '<p style="margin:0 0 8px"><strong>Furnace (96% AFUE):</strong> ' + formatNum(furnace) + ' BTU input delivers ~' + formatNum(furnace * 0.96) + ' BTU</p>';

    var adjustments = [];
    if (insulation.value !== 'average') adjustments.push('Insulation: ' + insulation.value);
    if (climate.value !== 'moderate') adjustments.push('Climate: ' + climate.value.replace('-', ' '));
    if (sunExposure.value !== 'average') adjustments.push('Sun: ' + sunExposure.value);
    if (H !== 8) adjustments.push('Ceiling: ' + H + 'ft (+' + Math.round((ceilingMult - 1) * 100) + '%)');

    if (adjustments.length > 0) {
      html += '<p style="margin:0"><strong>Adjustments applied:</strong> ' + adjustments.join(', ') + '</p>';
    }

    resultDetails.innerHTML = html;
  }

  calcBtn.addEventListener('click', calculate);

  [roomLength, roomWidth, ceilingHeight, insulation, climate, sunExposure, occupants].forEach(function(el) {
    el.addEventListener('change', calculate);
    el.addEventListener('input', calculate);
  });

})();
