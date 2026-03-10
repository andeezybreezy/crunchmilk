(function() {
  'use strict';

  var wallArea = document.getElementById('wallArea');
  var unitType = document.getElementById('unitType');
  var jointThick = document.getElementById('jointThick');
  var mortarPrice = document.getElementById('mortarPrice');

  var outBags = document.getElementById('outBags');
  var outSand = document.getElementById('outSand');
  var outWater = document.getElementById('outWater');
  var outUnits = document.getElementById('outUnits');
  var outCoverage = document.getElementById('outCoverage');
  var outCost = document.getElementById('outCost');
  var costItem = document.getElementById('costItem');
  var resultTip = document.getElementById('resultTip');

  // Coverage in sq ft per 80lb bag, and units per sq ft
  var data = {
    stdbrick:  { thin: 35, thick: 25, unitsPerSqFt: 6.75, waterPerBag: 1.25, label: 'bricks' },
    modbrick:  { thin: 33, thick: 23, unitsPerSqFt: 7.00, waterPerBag: 1.25, label: 'bricks' },
    cmu8:      { thin: 12, thick: 10, unitsPerSqFt: 1.125, waterPerBag: 1.25, label: 'blocks' },
    cmu12:     { thin: 10, thick: 8,  unitsPerSqFt: 1.125, waterPerBag: 1.50, label: 'blocks' }
  };

  function calculate() {
    var area = parseFloat(wallArea.value);
    var unit = data[unitType.value];
    var joint = parseFloat(jointThick.value);
    var price = parseFloat(mortarPrice.value);

    if (isNaN(area) || area <= 0) {
      outBags.textContent = '—';
      outSand.textContent = '—';
      outWater.textContent = '—';
      outUnits.textContent = '—';
      outCoverage.textContent = '—';
      costItem.style.display = 'none';
      resultTip.textContent = 'Enter wall area to calculate mortar needed.';
      return;
    }

    var coveragePerBag = joint <= 0.375 ? unit.thin : unit.thick;
    var bags = Math.ceil((area / coveragePerBag) * 1.10); // 10% waste
    var sand = (bags * 0.5).toFixed(1);
    var water = (bags * unit.waterPerBag).toFixed(1);
    var units = Math.ceil(area * unit.unitsPerSqFt);

    outBags.textContent = bags + ' bags';
    outSand.textContent = sand + ' cu ft';
    outWater.textContent = water + ' gal';
    outUnits.textContent = units.toLocaleString() + ' ' + unit.label;
    outCoverage.textContent = coveragePerBag + ' sq ft/bag';

    if (!isNaN(price) && price > 0) {
      outCost.textContent = '$' + (bags * price).toFixed(2);
      costItem.style.display = '';
    } else {
      costItem.style.display = 'none';
    }

    resultTip.textContent = area + ' sq ft ÷ ' + coveragePerBag + ' sq ft/bag × 1.10 waste = ' + bags + ' bags, ' + sand + ' cu ft sand, ' + water + ' gal water.';
  }

  wallArea.addEventListener('input', calculate);
  unitType.addEventListener('change', calculate);
  jointThick.addEventListener('change', calculate);
  mortarPrice.addEventListener('input', calculate);

  calculate();
})();
