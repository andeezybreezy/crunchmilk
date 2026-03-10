(function() {
  'use strict';

  // Dressing recommendations: [primary, changesPerDay, secondary]
  var recommendations = {
    surgical: {
      shallow: ['Transparent film or adhesive strips', 0.15, 'None needed'],
      moderate: ['Foam dressing', 0.5, 'Medical tape'],
      deep: ['Alginate packing + foam cover', 1, 'Foam secondary + tape']
    },
    pressure: {
      shallow: ['Hydrocolloid dressing', 0.2, 'None (self-adhesive)'],
      moderate: ['Foam dressing (bordered)', 0.33, 'Medical tape if unbordered'],
      deep: ['Alginate rope/packing', 1, 'Foam secondary + tape']
    },
    burn: {
      shallow: ['Non-adherent gauze (Adaptic/Telfa)', 1, 'Gauze wrap + tape'],
      moderate: ['Foam dressing or silver-impregnated', 0.5, 'Gauze wrap + tape'],
      deep: ['Alginate or specialty burn dressing', 1, 'Gauze wrap + elastic bandage']
    },
    laceration: {
      shallow: ['Adhesive strips (Steri-Strips) or transparent film', 0.15, 'None needed'],
      moderate: ['Non-adherent gauze + tape', 1, 'Gauze pad + tape'],
      deep: ['Gauze packing (moist)', 1.5, 'ABD pad + tape']
    },
    abrasion: {
      shallow: ['Transparent film or hydrocolloid', 0.2, 'None (self-adhesive)'],
      moderate: ['Hydrocolloid dressing', 0.25, 'None (self-adhesive)'],
      deep: ['Foam dressing', 0.5, 'Medical tape']
    }
  };

  // Standard dressing sizes (cm)
  var standardSizes = [
    [5, 5], [7.5, 7.5], [10, 10], [10, 12], [15, 15], [15, 20], [20, 20]
  ];

  function findDressingSize(needL, needW) {
    for (var i = 0; i < standardSizes.length; i++) {
      if (standardSizes[i][0] >= needL && standardSizes[i][1] >= needW) {
        return standardSizes[i][0] + ' × ' + standardSizes[i][1] + ' cm';
      }
    }
    return needL.toFixed(0) + ' × ' + needW.toFixed(0) + ' cm (custom/cut to size)';
  }

  function calculate() {
    var length = parseFloat(document.getElementById('woundLength').value);
    var width = parseFloat(document.getElementById('woundWidth').value);
    var depth = document.getElementById('woundDepth').value;
    var woundType = document.getElementById('woundType').value;

    if (isNaN(length) || length <= 0 || isNaN(width) || width <= 0) return;

    var rec = recommendations[woundType][depth];
    var dressingType = rec[0];
    var changesPerDay = rec[1];
    var secondary = rec[2];

    // Dressing should extend 2-3 cm beyond wound on each side
    var margin = 2.5;
    var needL = length + (margin * 2);
    var needW = width + (margin * 2);
    var dressingSize = findDressingSize(needL, needW);

    var area = (length * width).toFixed(1);

    // Format changes per day
    var changesText;
    if (changesPerDay >= 1) {
      changesText = changesPerDay === 1 ? '1 time/day' : changesPerDay.toFixed(1) + ' times/day';
    } else if (changesPerDay >= 0.5) {
      changesText = 'Every 2–3 days';
    } else if (changesPerDay >= 0.25) {
      changesText = 'Every 3–5 days';
    } else if (changesPerDay >= 0.15) {
      changesText = 'Every 5–7 days';
    } else {
      changesText = 'Every 5–7 days';
    }

    var weeklyCount = Math.ceil(changesPerDay * 7);
    if (weeklyCount < 1) weeklyCount = 1;

    document.getElementById('dressingType').textContent = dressingType;
    document.getElementById('dressingSize').textContent = dressingSize;
    document.getElementById('changesDay').textContent = changesText;
    document.getElementById('weeklySupply').textContent = weeklyCount + ' dressing' + (weeklyCount !== 1 ? 's' : '') + '/week';
    document.getElementById('woundArea').textContent = area + ' cm²';
    document.getElementById('secondary').textContent = secondary;

    document.getElementById('resultTip').textContent = 'Change dressing immediately if soaked through, loosened, or soiled. Wound ' + length + ' × ' + width + ' cm requires dressing with 2.5 cm margins.';

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
})();
