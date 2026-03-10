(function() {
  'use strict';

  var wallLength = document.getElementById('wallLength');
  var wallHeight = document.getElementById('wallHeight');
  var blockType = document.getElementById('blockType');
  var blockPrice = document.getElementById('blockPrice');

  var outBlocks = document.getElementById('outBlocks');
  var outCaps = document.getElementById('outCaps');
  var outAdhesive = document.getElementById('outAdhesive');
  var outBackfill = document.getElementById('outBackfill');
  var outBase = document.getElementById('outBase');
  var outCost = document.getElementById('outCost');
  var costItem = document.getElementById('costItem');
  var resultTip = document.getElementById('resultTip');

  // Block data: faceW (in), faceH (in), depth (in), blocksPerSqFt
  var blocks = {
    '6grav':   { faceW: 18, faceH: 6,  depth: 12, perSqFt: 1.33, capLen: 1.5 },
    '8grav':   { faceW: 18, faceH: 8,  depth: 12, perSqFt: 1.00, capLen: 1.5 },
    '12reinf': { faceW: 18, faceH: 8,  depth: 18, perSqFt: 1.00, capLen: 1.5 }
  };

  function calculate() {
    var len = parseFloat(wallLength.value);
    var ht = parseFloat(wallHeight.value);
    var b = blocks[blockType.value];
    var price = parseFloat(blockPrice.value);

    if (isNaN(len) || isNaN(ht) || len <= 0 || ht <= 0) {
      outBlocks.textContent = '—';
      outCaps.textContent = '—';
      outAdhesive.textContent = '—';
      outBackfill.textContent = '—';
      outBase.textContent = '—';
      costItem.style.display = 'none';
      resultTip.textContent = 'Enter wall dimensions to calculate materials.';
      return;
    }

    var wallArea = len * ht;
    var totalBlocks = Math.ceil(wallArea * b.perSqFt * 1.05);
    var capBlocks = Math.ceil(len / b.capLen);
    var adhesiveTubes = Math.ceil(len / 20);

    // Backfill: 12" deep gravel zone behind wall
    var backfillCuYd = (len * ht * 1) / 27;
    // Base gravel: 6" deep under wall footprint
    var baseDepthFt = b.depth / 12;
    var baseCuYd = (len * baseDepthFt * 0.5) / 27;

    outBlocks.textContent = totalBlocks.toLocaleString();
    outCaps.textContent = capBlocks;
    outAdhesive.textContent = adhesiveTubes + (adhesiveTubes === 1 ? ' tube' : ' tubes');
    outBackfill.textContent = backfillCuYd.toFixed(1);
    outBase.textContent = baseCuYd.toFixed(1);

    if (!isNaN(price) && price > 0) {
      var totalCost = (totalBlocks + capBlocks) * price;
      outCost.textContent = '$' + totalCost.toFixed(2);
      costItem.style.display = '';
    } else {
      costItem.style.display = 'none';
    }

    resultTip.textContent = wallArea.toFixed(0) + ' sq ft wall → ' + totalBlocks + ' blocks + ' + capBlocks + ' caps, ' + backfillCuYd.toFixed(1) + ' cu yd backfill, ' + baseCuYd.toFixed(1) + ' cu yd base gravel.';
  }

  wallLength.addEventListener('input', calculate);
  wallHeight.addEventListener('input', calculate);
  blockType.addEventListener('change', calculate);
  blockPrice.addEventListener('input', calculate);

  calculate();
})();
