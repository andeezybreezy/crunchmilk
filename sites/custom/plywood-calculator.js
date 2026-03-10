(function() {
  'use strict';

  var areaLength = document.getElementById('areaLength');
  var areaWidth = document.getElementById('areaWidth');
  var sheetSize = document.getElementById('sheetSize');
  var thickness = document.getElementById('thickness');
  var wastePct = document.getElementById('wastePct');
  var pricePerSheet = document.getElementById('pricePerSheet');

  var outSheets = document.getElementById('outSheets');
  var outArea = document.getElementById('outArea');
  var outCoverage = document.getElementById('outCoverage');
  var outCost = document.getElementById('outCost');
  var outCostSqFt = document.getElementById('outCostSqFt');
  var costRow = document.getElementById('costRow');
  var resultTip = document.getElementById('resultTip');

  var thicknessNames = {
    '0.25': '1/4"', '0.375': '3/8"', '0.5': '1/2"',
    '0.625': '5/8"', '0.75': '3/4"'
  };

  function calculate() {
    var len = parseFloat(areaLength.value);
    var wid = parseFloat(areaWidth.value);
    var sheet = parseFloat(sheetSize.value);
    var waste = parseFloat(wastePct.value);
    var price = parseFloat(pricePerSheet.value);

    if (isNaN(len) || isNaN(wid) || len <= 0 || wid <= 0) {
      outSheets.textContent = '—';
      outArea.textContent = '—';
      outCoverage.textContent = '—';
      outCost.textContent = '—';
      outCostSqFt.textContent = '—';
      resultTip.textContent = 'Enter dimensions to calculate.';
      return;
    }

    var area = len * wid;
    var sheetsRaw = area / sheet;
    var sheetsWithWaste = sheetsRaw * (1 + waste);
    var sheetsNeeded = Math.ceil(sheetsWithWaste);
    var coverage = sheetsNeeded * sheet;

    var thickLabel = thicknessNames[thickness.value] || thickness.value + '"';

    outSheets.textContent = sheetsNeeded + ' sheets';
    outArea.textContent = area.toFixed(0) + ' sq ft';
    outCoverage.textContent = coverage + ' sq ft (' + thickLabel + ')';

    if (!isNaN(price) && price > 0) {
      var totalCost = sheetsNeeded * price;
      var costPerSqFt = totalCost / area;
      outCost.textContent = '$' + totalCost.toFixed(2);
      outCostSqFt.textContent = '$' + costPerSqFt.toFixed(2) + '/sq ft';
      if (costRow) costRow.style.display = '';
    } else {
      outCost.textContent = '—';
      outCostSqFt.textContent = '—';
    }

    resultTip.textContent = area.toFixed(0) + ' sq ft ÷ ' + sheet + ' sq ft/sheet = ' + sheetsRaw.toFixed(1) + ' + ' + Math.round(waste * 100) + '% waste = ' + sheetsNeeded + ' sheets of ' + thickLabel + ' plywood.';
  }

  areaLength.addEventListener('input', calculate);
  areaWidth.addEventListener('input', calculate);
  sheetSize.addEventListener('change', calculate);
  thickness.addEventListener('change', calculate);
  wastePct.addEventListener('change', calculate);
  pricePerSheet.addEventListener('input', calculate);

  calculate();
})();
