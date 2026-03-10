(function() {
  'use strict';

  var biArea = document.getElementById('biArea');
  var biType = document.getElementById('biType');
  var biTargetR = document.getElementById('biTargetR');
  var biExistingR = document.getElementById('biExistingR');
  var biBagCost = document.getElementById('biBagCost');

  var outBags = document.getElementById('outBags');
  var outDepth = document.getElementById('outDepth');
  var outRAdded = document.getElementById('outRAdded');
  var outInsType = document.getElementById('outInsType');
  var outTotalR = document.getElementById('outTotalR');
  var outCost = document.getElementById('outCost');
  var costItem = document.getElementById('costItem');
  var resultTip = document.getElementById('resultTip');

  // R-value per inch and coverage per bag (sq ft) at various depths
  var insData = {
    fiberglass: {
      rPerInch: 2.7,
      label: 'Fiberglass',
      // Coverage per bag in sq ft at given R-value (approximate for standard bags)
      coverageAtR: function(rNeeded) {
        var depth = rNeeded / 2.7;
        // ~0.91 cu ft per bag, coverage = 0.91 * 12 / depth sq ft
        return (0.91 * 12) / depth;
      }
    },
    cellulose: {
      rPerInch: 3.5,
      label: 'Cellulose',
      coverageAtR: function(rNeeded) {
        var depth = rNeeded / 3.5;
        // ~0.78 cu ft per bag, coverage = 0.78 * 12 / depth sq ft
        return (0.78 * 12) / depth;
      }
    }
  };

  function calculate() {
    var area = parseFloat(biArea.value);
    var type = biType.value;
    var targetR = parseFloat(biTargetR.value);
    var existR = parseFloat(biExistingR.value);
    var bagCost = parseFloat(biBagCost.value);
    var ins = insData[type];

    if (isNaN(area) || area <= 0) {
      clearResults();
      return;
    }

    var rNeeded = Math.max(0, targetR - existR);
    if (rNeeded <= 0) {
      outBags.textContent = '0';
      outDepth.textContent = '0"';
      outRAdded.textContent = 'R-0';
      outInsType.textContent = ins.label;
      outTotalR.textContent = 'R-' + existR + ' (already met)';
      costItem.style.display = 'none';
      resultTip.textContent = 'Existing insulation (R-' + existR + ') already meets or exceeds R-' + targetR + ' target.';
      return;
    }

    var depth = rNeeded / ins.rPerInch;
    var coveragePerBag = ins.coverageAtR(rNeeded);
    var bags = Math.ceil(area / coveragePerBag);

    outBags.textContent = bags;
    outDepth.textContent = depth.toFixed(1) + '"';
    outRAdded.textContent = 'R-' + rNeeded;
    outInsType.textContent = ins.label;
    outTotalR.textContent = 'R-' + targetR;

    if (!isNaN(bagCost) && bagCost > 0) {
      outCost.textContent = '$' + (bags * bagCost).toFixed(2);
      costItem.style.display = '';
    } else {
      costItem.style.display = 'none';
    }

    resultTip.textContent = area.toLocaleString() + ' sq ft, adding R-' + rNeeded + ' (' + ins.label + ') = ' + depth.toFixed(1) + '" deep → ' + bags + ' bags needed.';
  }

  function clearResults() {
    outBags.textContent = '—';
    outDepth.textContent = '—';
    outRAdded.textContent = '—';
    outInsType.textContent = '—';
    outTotalR.textContent = '—';
    costItem.style.display = 'none';
    resultTip.textContent = 'Enter area and insulation details to calculate bags needed.';
  }

  biArea.addEventListener('input', calculate);
  biType.addEventListener('change', calculate);
  biTargetR.addEventListener('change', calculate);
  biExistingR.addEventListener('change', calculate);
  biBagCost.addEventListener('input', calculate);

  calculate();
})();
