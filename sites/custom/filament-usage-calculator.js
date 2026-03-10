(function() {
  'use strict';

  function calculate() {
    var diameter = parseFloat(document.getElementById('filamentDiameter').value);
    var density = parseFloat(document.getElementById('filamentType').value);
    var pW = parseFloat(document.getElementById('printWidth').value);
    var pD = parseFloat(document.getElementById('printDepth').value);
    var pH = parseFloat(document.getElementById('printHeight').value);
    var infill = parseFloat(document.getElementById('infill').value) / 100;
    var wall = parseFloat(document.getElementById('wallThickness').value);
    var costPerKg = parseFloat(document.getElementById('spoolCost').value);

    if (isNaN(pW) || isNaN(pD) || isNaN(pH) || pW <= 0 || pD <= 0 || pH <= 0) return;

    // Bounding box volume in mm³
    var outerVolume = pW * pD * pH;

    // Inner dimensions (subtract walls from each side)
    var innerW = Math.max(pW - (wall * 2), 0);
    var innerD = Math.max(pD - (wall * 2), 0);
    var innerH = Math.max(pH - (wall * 2), 0);
    var innerVolume = innerW * innerD * innerH;

    // Shell volume (outer - inner)
    var shellVolume = outerVolume - innerVolume;

    // Infill volume
    var infillVolume = innerVolume * infill;

    // Top and bottom solid layers (~1.2mm each = wall thickness)
    // Already accounted for in shell since we subtracted wall from height too

    // Total plastic volume in mm³
    var totalVolumeMM3 = shellVolume + infillVolume;

    // Convert to cm³
    var totalVolumeCM3 = totalVolumeMM3 / 1000;

    // Weight in grams: volume (cm³) × density (g/cm³)
    var weightG = totalVolumeCM3 * density;

    // Filament cross-section area in mm²
    var radius = diameter / 2;
    var crossSection = Math.PI * radius * radius;

    // Filament length in mm: volume / cross-section
    var lengthMM = totalVolumeMM3 / crossSection;
    var lengthM = lengthMM / 1000;

    // Cost
    var cost = (weightG / 1000) * costPerKg;

    document.getElementById('weight').textContent = weightG.toFixed(1) + ' g';
    document.getElementById('length').textContent = lengthM.toFixed(1) + ' m';
    document.getElementById('cost').textContent = '$' + cost.toFixed(2);
    document.getElementById('volume').textContent = totalVolumeCM3.toFixed(1) + ' cm\u00B3';

    var spoolPct = (weightG / 1000 * 100).toFixed(1);
    var tip = 'This uses about ' + spoolPct + '% of a 1 kg spool. Actual usage may vary \u00B120% depending on model geometry and supports.';
    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);

  var inputs = document.querySelectorAll('#printWidth, #printDepth, #printHeight, #infill, #wallThickness, #spoolCost');
  inputs.forEach(function(input) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });
})();
