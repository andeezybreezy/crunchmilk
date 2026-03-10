(function() {
  'use strict';

  var projectType = document.getElementById('projectType');
  var projWidth = document.getElementById('projWidth');
  var projLength = document.getElementById('projLength');
  var numPanels = document.getElementById('numPanels');
  var fabricWidth = document.getElementById('fabricWidth');
  var patternRepeat = document.getElementById('patternRepeat');
  var seamAllowance = document.getElementById('seamAllowance');

  // Auto-fill typical dimensions by project type
  projectType.addEventListener('change', function() {
    switch (projectType.value) {
      case 'curtains':
        projWidth.value = 54; projLength.value = 84; numPanels.value = 2; seamAllowance.value = 8; break;
      case 'tablecloth':
        projWidth.value = 60; projLength.value = 102; numPanels.value = 1; seamAllowance.value = 2; break;
      case 'quilt':
        projWidth.value = 86; projLength.value = 96; numPanels.value = 1; seamAllowance.value = 1; break;
      case 'upholstery':
        projWidth.value = 24; projLength.value = 24; numPanels.value = 1; seamAllowance.value = 2; break;
      case 'custom':
        projWidth.value = ''; projLength.value = ''; numPanels.value = 1; seamAllowance.value = 4; break;
    }
  });

  function calculate() {
    var w = parseFloat(projWidth.value);
    var l = parseFloat(projLength.value);
    var panels = parseInt(numPanels.value) || 1;
    var fW = parseFloat(fabricWidth.value);
    var repeat = parseFloat(patternRepeat.value) || 0;
    var seam = parseFloat(seamAllowance.value) || 0;

    if (isNaN(w) || isNaN(l) || w <= 0 || l <= 0) return;

    // How many fabric widths needed to cover project width
    var widthsNeeded = Math.ceil(w / fW);

    // Cut length per panel: project length + seam allowances on both ends
    var cutLength = l + (seam * 2);

    // With pattern repeat: round cut length up to next full repeat
    var cutLengthPattern = cutLength;
    if (repeat > 0) {
      cutLengthPattern = Math.ceil(cutLength / repeat) * repeat;
    }

    // Total fabric inches = widths × cut length × number of panels
    var totalInchesPlain = widthsNeeded * cutLength * panels;
    var totalInchesPattern = widthsNeeded * cutLengthPattern * panels;

    // Convert to yards
    var yardsPlain = totalInchesPlain / 36;
    var yardsPattern = totalInchesPattern / 36;

    // Round up to nearest 1/8 yard
    yardsPlain = Math.ceil(yardsPlain * 8) / 8;
    yardsPattern = Math.ceil(yardsPattern * 8) / 8;

    document.getElementById('yardsPlain').textContent = yardsPlain.toFixed(2) + ' yd';
    document.getElementById('yardsPattern').textContent = repeat > 0 ? yardsPattern.toFixed(2) + ' yd' : 'N/A';
    document.getElementById('widthsNeeded').textContent = widthsNeeded + (widthsNeeded > 1 ? ' widths' : ' width');
    document.getElementById('cutLength').textContent = cutLength.toFixed(1) + '" (' + (cutLength / 36).toFixed(2) + ' yd)';

    var tip = '';
    if (repeat > 0 && yardsPattern > yardsPlain) {
      var extra = (yardsPattern - yardsPlain).toFixed(2);
      tip = 'Pattern matching adds ' + extra + ' yards. Consider buying ' + (yardsPattern * 1.1).toFixed(2) + ' yards for a 10% safety margin.';
    } else {
      tip = 'Consider buying ' + (yardsPlain * 1.1).toFixed(2) + ' yards for a 10% safety margin.';
    }
    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);

  var inputs = document.querySelectorAll('#projWidth, #projLength, #numPanels, #patternRepeat, #seamAllowance');
  inputs.forEach(function(input) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });
})();
