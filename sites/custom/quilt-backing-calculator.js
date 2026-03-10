(function() {
  'use strict';

  function calculate() {
    var qW = parseFloat(document.getElementById('quiltWidth').value);
    var qL = parseFloat(document.getElementById('quiltLength').value);
    var fW = parseFloat(document.getElementById('backingWidth').value);
    var overhang = parseFloat(document.getElementById('overhang').value) || 4;

    if (isNaN(qW) || isNaN(qL) || qW <= 0 || qL <= 0) return;

    // Backing dimensions needed
    var backW = qW + (overhang * 2);
    var backL = qL + (overhang * 2);

    // Usable fabric width (subtract selvages for standard widths)
    var usableW = fW <= 44 ? fW - 2 : fW;

    // Number of widths (panels) needed
    var numPanels = Math.ceil(backW / usableW);
    var seams = numPanels - 1;

    // Each panel must be at least backL inches long
    var totalFabricInches = numPanels * backL;
    var totalYards = totalFabricInches / 36;

    // Round up to nearest 1/8 yard
    totalYards = Math.ceil(totalYards * 8) / 8;

    // Batting size
    var battW = backW;
    var battL = backL;

    // Standard batting sizes
    var battingSizes = [
      ['Crib', 45, 60],
      ['Twin', 72, 90],
      ['Full', 81, 96],
      ['Queen', 90, 108],
      ['King', 120, 120]
    ];
    var recommendedBatt = battW + '" \u00D7 ' + battL + '"';
    for (var i = 0; i < battingSizes.length; i++) {
      if (battingSizes[i][1] >= battW && battingSizes[i][2] >= battL) {
        recommendedBatt = battingSizes[i][0] + ' (' + battingSizes[i][1] + '" \u00D7 ' + battingSizes[i][2] + '")';
        break;
      }
    }

    // Layout description
    var layoutDesc;
    if (numPanels === 1) {
      layoutDesc = 'Single width, no seams';
    } else if (numPanels === 2) {
      layoutDesc = '2 panels, vertical seam';
    } else {
      layoutDesc = numPanels + ' panels, ' + seams + ' vertical seams';
    }

    document.getElementById('backingYards').textContent = totalYards.toFixed(2) + ' yd';
    document.getElementById('seamsNeeded').textContent = seams === 0 ? 'None' : seams + (seams === 1 ? ' seam' : ' seams');
    document.getElementById('battingSize').textContent = recommendedBatt;
    document.getElementById('layout').textContent = layoutDesc;

    var tip = '';
    if (fW <= 44 && numPanels > 1) {
      tip = 'Tip: Use 108" wide backing fabric to avoid seams and save fabric.';
    } else if (fW === 108 && numPanels === 1) {
      tip = 'Wide backing eliminates seams — great choice!';
    } else {
      tip = 'Backing size: ' + backW + '" \u00D7 ' + backL + '" with ' + overhang + '" overhang per side.';
    }
    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);

  var inputs = document.querySelectorAll('#quiltWidth, #quiltLength, #overhang');
  inputs.forEach(function(input) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });
})();
