(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');
  var acreageInput = document.getElementById('acreage');
  var perimeterInput = document.getElementById('perimeter');

  var fenceTypes = {
    barbed:      { postSpacing: 8,  strands: 4, label: '4-strand barbed wire', costPerFt: 2.25, postCost: 4.50, cornerPostCost: 25 },
    hightensile: { postSpacing: 12, strands: 5, label: '5-strand high-tensile', costPerFt: 1.75, postCost: 4.50, cornerPostCost: 25 },
    board:       { postSpacing: 8,  strands: 3, label: '3-rail board fence', costPerFt: 9.00, postCost: 12, cornerPostCost: 30 },
    electric:    { postSpacing: 30, strands: 3, label: '3-strand electric', costPerFt: 1.00, postCost: 3.00, cornerPostCost: 25 }
  };

  function val(id) {
    var v = parseFloat(document.getElementById(id).value);
    return isNaN(v) || v <= 0 ? 0 : v;
  }

  function sel(id) {
    return document.getElementById(id).value;
  }

  function fmt(n) {
    return Math.round(n).toLocaleString('en-US');
  }

  // Auto-calculate perimeter when acreage changes
  acreageInput.addEventListener('input', function() {
    var acres = val('acreage');
    if (acres > 0) {
      var side = Math.sqrt(acres * 43560);
      perimeterInput.placeholder = fmt(Math.round(side * 4)) + ' ft (square)';
    }
  });

  function calculate() {
    var acres = val('acreage');
    var fenceType = sel('fenceType');
    var gateCount = parseInt(document.getElementById('gateCount').value, 10) || 0;

    if (acres <= 0) return;

    var perimeter = val('perimeter');
    if (perimeter <= 0) {
      perimeter = 4 * Math.sqrt(acres * 43560);
    }

    var fence = fenceTypes[fenceType];
    var gateWidth = 12; // ft per gate
    var fenceLength = perimeter - (gateCount * gateWidth);
    if (fenceLength < 0) fenceLength = 0;

    // Posts
    var corners = 4;
    var gatePosts = gateCount * 2;
    var linePosts = Math.ceil(fenceLength / fence.postSpacing) - corners;
    if (linePosts < 0) linePosts = 0;

    // Wire or rails
    var wireDesc;
    if (fenceType === 'board') {
      var totalBoardFt = fenceLength * fence.strands;
      var boards16 = Math.ceil(totalBoardFt / 16);
      wireDesc = fmt(boards16) + ' boards (16 ft) — ' + fence.strands + ' rails';
    } else {
      var totalWireFt = fenceLength * fence.strands;
      var rolls = Math.ceil(totalWireFt / 1320); // 1320 ft per roll (1/4 mile)
      wireDesc = rolls + ' rolls — ' + fence.strands + ' strands × ' + fmt(Math.round(fenceLength)) + ' ft';
    }

    // Cost estimate
    var wireCost = fenceLength * fence.costPerFt;
    var postCost = (linePosts * fence.postCost) + (corners * fence.cornerPostCost) + (gatePosts * fence.cornerPostCost);
    var gateCost = gateCount * 250;
    var totalCost = wireCost + postCost + gateCost;

    document.getElementById('perimeterOut').textContent = fmt(Math.round(perimeter)) + ' ft';
    document.getElementById('cornerPosts').textContent = corners + ' corner + ' + gatePosts + ' gate posts';
    document.getElementById('linePosts').textContent = fmt(linePosts);
    document.getElementById('wireRolls').textContent = wireDesc;
    document.getElementById('gatesOut').textContent = gateCount + ' × 12 ft gates';
    document.getElementById('totalCost').textContent = '$' + fmt(totalCost);

    var tip = fmt(Math.round(acres)) + ' acres (' + fmt(Math.round(perimeter)) + ' ft perimeter) with ' + fence.label + '. ';
    tip += 'Materials only — add 50-100% for professional installation.';
    document.getElementById('resultTip').textContent = tip;

    result.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  document.querySelectorAll('input[type="number"]').forEach(function(el) {
    el.addEventListener('input', calculate);
  });
  document.querySelectorAll('select').forEach(function(el) {
    el.addEventListener('change', calculate);
  });

  // Trigger placeholder update
  acreageInput.dispatchEvent(new Event('input'));
  calculate();
})();
