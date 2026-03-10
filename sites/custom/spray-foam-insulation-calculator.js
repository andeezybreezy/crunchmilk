(function() {
  'use strict';

  var sfArea = document.getElementById('sfArea');
  var sfType = document.getElementById('sfType');
  var sfRvalue = document.getElementById('sfRvalue');
  var sfCostPerBf = document.getElementById('sfCostPerBf');

  var outThickness = document.getElementById('outThickness');
  var outBoardFt = document.getElementById('outBoardFt');
  var outKits = document.getElementById('outKits');
  var outType = document.getElementById('outType');
  var outRval = document.getElementById('outRval');
  var outCost = document.getElementById('outCost');
  var costItem = document.getElementById('costItem');
  var resultTip = document.getElementById('resultTip');

  var rPerInch = { open: 3.5, closed: 6.5 };
  var typeLabel = { open: 'Open-Cell', closed: 'Closed-Cell' };
  var kitSize = 600; // board feet per large DIY kit

  function calculate() {
    var area = parseFloat(sfArea.value);
    var type = sfType.value;
    var rVal = parseFloat(sfRvalue.value);
    var costBf = parseFloat(sfCostPerBf.value);

    if (isNaN(area) || area <= 0 || isNaN(rVal) || rVal <= 0) {
      outThickness.textContent = '—';
      outBoardFt.textContent = '—';
      outKits.textContent = '—';
      outType.textContent = '—';
      outRval.textContent = '—';
      costItem.style.display = 'none';
      resultTip.textContent = 'Enter area and foam type to calculate insulation needs.';
      return;
    }

    var rpi = rPerInch[type];
    var thickness = rVal / rpi;
    var boardFeet = Math.ceil(area * thickness * 1.10); // 10% waste
    var kits = Math.ceil(boardFeet / kitSize);

    outThickness.textContent = thickness.toFixed(1) + '"';
    outBoardFt.textContent = boardFeet.toLocaleString();
    outKits.textContent = kits;
    outType.textContent = typeLabel[type];
    outRval.textContent = 'R-' + rVal;

    if (!isNaN(costBf) && costBf > 0) {
      outCost.textContent = '$' + (boardFeet * costBf).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      costItem.style.display = '';
    } else {
      costItem.style.display = 'none';
    }

    resultTip.textContent = area.toLocaleString() + ' sq ft × ' + thickness.toFixed(1) + '" thick = ' + boardFeet.toLocaleString() + ' board feet (' + typeLabel[type] + ', R-' + rVal + ') → ' + kits + ' DIY kit' + (kits !== 1 ? 's' : '') + '.';
  }

  sfArea.addEventListener('input', calculate);
  sfType.addEventListener('change', calculate);
  sfRvalue.addEventListener('change', calculate);
  sfCostPerBf.addEventListener('input', calculate);

  calculate();
})();
