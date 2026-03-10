(function() {
  'use strict';

  var wallLen = document.getElementById('wallLen');
  var wallHt = document.getElementById('wallHt');
  var brickSize = document.getElementById('brickSize');
  var mortarJoint = document.getElementById('mortarJoint');
  var openingsArea = document.getElementById('openingsArea');
  var brickWaste = document.getElementById('brickWaste');
  var brickPrice = document.getElementById('brickPrice');

  var outBricks = document.getElementById('outBricks');
  var outMortar = document.getElementById('outMortar');
  var outTies = document.getElementById('outTies');
  var outNetArea = document.getElementById('outNetArea');
  var outPerSqFt = document.getElementById('outPerSqFt');
  var outCost = document.getElementById('outCost');
  var costItem = document.getElementById('costItem');
  var resultTip = document.getElementById('resultTip');

  // Brick data: [width, height, length] in inches
  var brickData = {
    standard: { w: 3.625, h: 2.25, l: 8 },
    queen:    { w: 3.125, h: 2.75, l: 9.625 },
    king:     { w: 3, h: 2.75, l: 9.75 },
    utility:  { w: 3.625, h: 3.625, l: 11.625 }
  };

  function bricksPerSqFt(brick, joint) {
    // Area covered by one brick including mortar on one side and top
    var brickAreaSqIn = (brick.l + joint) * (brick.h + joint);
    return 144 / brickAreaSqIn;
  }

  function calculate() {
    var len = parseFloat(wallLen.value);
    var ht = parseFloat(wallHt.value);
    var brick = brickData[brickSize.value];
    var joint = parseFloat(mortarJoint.value);
    var openings = parseFloat(openingsArea.value) || 0;
    var waste = parseFloat(brickWaste.value);
    var price = parseFloat(brickPrice.value);

    if (isNaN(len) || isNaN(ht) || len <= 0 || ht <= 0) {
      outBricks.textContent = '—';
      outMortar.textContent = '—';
      outTies.textContent = '—';
      outNetArea.textContent = '—';
      outPerSqFt.textContent = '—';
      costItem.style.display = 'none';
      return;
    }

    var grossArea = len * ht;
    var netArea = Math.max(0, grossArea - openings);
    var perSqFt = bricksPerSqFt(brick, joint);
    var bricksRaw = netArea * perSqFt;
    var totalBricks = Math.ceil(bricksRaw * (1 + waste));

    // Mortar: ~35-40 bricks per 80lb bag with 3/8" joint, ~30 with 1/2"
    var bricksPerBag = joint <= 0.375 ? 37 : 30;
    var mortarBags = Math.ceil(totalBricks / bricksPerBag);

    // Wall ties: 1 per 2.67 sq ft
    var wallTies = Math.ceil(netArea / 2.67);

    outBricks.textContent = totalBricks.toLocaleString();
    outMortar.textContent = mortarBags + ' bags';
    outTies.textContent = wallTies;
    outNetArea.textContent = netArea.toFixed(0) + ' sq ft';
    outPerSqFt.textContent = perSqFt.toFixed(2);

    if (!isNaN(price) && price > 0) {
      var totalCost = totalBricks * price;
      outCost.textContent = '$' + totalCost.toFixed(2);
      costItem.style.display = '';
    } else {
      costItem.style.display = 'none';
    }

    resultTip.textContent = netArea.toFixed(0) + ' sq ft × ' + perSqFt.toFixed(2) + ' bricks/sq ft = ' + Math.ceil(bricksRaw) + ' + ' + Math.round(waste * 100) + '% waste = ' + totalBricks + ' bricks, ' + mortarBags + ' bags mortar.';
  }

  wallLen.addEventListener('input', calculate);
  wallHt.addEventListener('input', calculate);
  brickSize.addEventListener('change', calculate);
  mortarJoint.addEventListener('change', calculate);
  openingsArea.addEventListener('input', calculate);
  brickWaste.addEventListener('change', calculate);
  brickPrice.addEventListener('input', calculate);

  calculate();
})();
