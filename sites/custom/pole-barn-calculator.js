(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  var pitchMultiplier = { 3: 1.031, 4: 1.054, 6: 1.118 };

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

  function calculate() {
    var length = val('barnLength');
    var width = val('barnWidth');
    var height = val('barnHeight');
    var spacing = parseInt(sel('postSpacing'), 10);
    var pitch = parseInt(sel('roofPitch'), 10);
    var doors = parseInt(document.getElementById('doorCount').value, 10) || 0;

    if (length <= 0 || width <= 0 || height <= 0) return;

    // Posts along perimeter
    var postsLength = Math.ceil(length / spacing) + 1;
    var postsWidth = Math.ceil(width / spacing) + 1;
    var totalPosts = (postsLength * 2) + ((postsWidth - 2) * 2);
    if (totalPosts < 4) totalPosts = 4;

    // Trusses — one at each post along the length
    var trusses = postsLength;

    // Roof calculations
    var rafterLength = (width / 2) * pitchMultiplier[pitch];
    var roofAreaOneSide = rafterLength * length;
    var totalRoofArea = roofAreaOneSide * 2;
    var roofPanels = Math.ceil(totalRoofArea / (3 * rafterLength)) * 1.1; // 3 ft wide panels + 10% overlap
    roofPanels = Math.ceil(roofPanels);

    // Siding
    var perimeter = 2 * (length + width);
    var doorArea = doors * 10 * 10; // assume 10x10 ft doors
    var wallArea = (perimeter * height) - doorArea;
    if (wallArea < 0) wallArea = 0;
    var sidingPanels = Math.ceil(wallArea / (3 * height) * 1.1); // 3 ft wide panels

    // Concrete — 2.5 bags per post (80 lb bags)
    var concreteBags = Math.ceil(totalPosts * 2.5);

    // Cost estimate
    var postCost = totalPosts * 35; // treated 6x6
    var trussCost = trusses * (width <= 30 ? 150 : width <= 40 ? 250 : 400);
    var roofCost = roofPanels * 35;
    var sidingCost = sidingPanels * 30;
    var concreteCost = concreteBags * 7;
    var doorCost = doors * 800;
    var miscCost = 500; // fasteners, trim, etc.
    var totalCost = postCost + trussCost + roofCost + sidingCost + concreteCost + doorCost + miscCost;

    document.getElementById('postCount').textContent = totalPosts + ' posts (6×6 treated)';
    document.getElementById('trussCount').textContent = trusses + ' trusses';
    document.getElementById('roofPanels').textContent = fmt(roofPanels) + ' panels';
    document.getElementById('sidingPanels').textContent = fmt(sidingPanels) + ' panels';
    document.getElementById('concreteBags').textContent = fmt(concreteBags) + ' bags';
    document.getElementById('totalCost').textContent = '$' + fmt(totalCost);

    var sqft = length * width;
    var costPerSqFt = totalCost / sqft;
    var tip = fmt(length) + '×' + fmt(width) + ' ft (' + fmt(sqft) + ' sq ft) at $' + costPerSqFt.toFixed(2) + '/sq ft materials. ';
    tip += 'Roof area: ' + fmt(Math.round(totalRoofArea)) + ' sq ft (' + pitch + '/12 pitch).';
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

  calculate();
})();
