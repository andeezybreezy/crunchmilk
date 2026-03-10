(function() {
  'use strict';

  var chartData = [
    ['4" × 4"', '1/4"', '18.8', '1'],
    ['6" × 6"', '1/4"', '12.5', '1'],
    ['12" × 12"', '3/8"', '9.4', '1'],
    ['12" × 24"', '3/8"', '7.0', '1'],
    ['18" × 18"', '3/8"', '6.3', '1'],
    ['24" × 24"', '3/8"', '4.7', '1']
  ];

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 2;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  var tileWidthInput = document.getElementById('tileWidth');
  var tileHeightInput = document.getElementById('tileHeight');
  var tileThicknessSelect = document.getElementById('tileThickness');
  var groutWidthSelect = document.getElementById('groutWidth');
  var areaLength = document.getElementById('areaLength');
  var areaWidth = document.getElementById('areaWidth');
  var wastePctSelect = document.getElementById('wastePct');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');
  var rLbs = document.getElementById('rLbs');
  var rBags = document.getElementById('rBags');
  var resultDetails = document.getElementById('resultDetails');

  // Chart
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function calculate() {
    var tW = parseFloat(tileWidthInput.value);
    var tH = parseFloat(tileHeightInput.value);
    var aL = parseFloat(areaLength.value);
    var aW = parseFloat(areaWidth.value);
    if (isNaN(tW) || isNaN(tH) || isNaN(aL) || isNaN(aW) || tW <= 0 || tH <= 0 || aL <= 0 || aW <= 0) {
      hideResult(); return;
    }

    var tileThickness = parseFloat(tileThicknessSelect.value); // inches (= grout depth)
    var groutWidth = parseFloat(groutWidthSelect.value); // inches
    var wastePct = parseFloat(wastePctSelect.value) / 100;

    var areaSqft = aL * aW;
    var areaSqIn = areaSqft * 144;

    // Tile area in sq inches
    var tileAreaSqIn = tW * tH;
    var numTiles = areaSqIn / tileAreaSqIn;

    // Grout joint volume per tile:
    // Each tile has perimeter/2 of grout joints (shared edges)
    // Volume per tile = (perimeter / 2) * groutWidth * tileThickness
    var perimeter = 2 * (tW + tH);
    var groutVolPerTile = (perimeter / 2) * groutWidth * tileThickness; // cubic inches

    var totalGroutVolCuIn = groutVolPerTile * numTiles;
    var totalGroutVolCuFt = totalGroutVolCuIn / 1728;

    // Grout density ~100 lbs per cubic foot
    var groutLbs = totalGroutVolCuFt * 100;
    var groutLbsWithWaste = groutLbs * (1 + wastePct);
    var bags25 = Math.ceil(groutLbsWithWaste / 25);
    if (bags25 < 1) bags25 = 1;

    var groutType = groutWidth >= 0.125 ? 'Sanded' : 'Unsanded';

    rLbs.textContent = fmt(groutLbsWithWaste, 1) + ' lbs';
    rBags.textContent = bags25 + ' bag' + (bags25 > 1 ? 's' : '');

    var d = '';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem">';
    d += '<div><strong>Total Area</strong><br>' + fmt(areaSqft, 1) + ' sq ft</div>';
    d += '<div><strong>Tile Size</strong><br>' + tW + '" × ' + tH + '"</div>';
    d += '<div><strong>Number of Tiles</strong><br>~' + fmt(Math.ceil(numTiles), 0) + '</div>';
    d += '<div><strong>Joint Width × Depth</strong><br>' + groutWidth + '" × ' + tileThickness + '"</div>';
    d += '<div><strong>Grout (no waste)</strong><br>' + fmt(groutLbs, 1) + ' lbs</div>';
    d += '<div><strong>With ' + (wastePct * 100) + '% Waste</strong><br>' + fmt(groutLbsWithWaste, 1) + ' lbs</div>';
    d += '<div><strong>25-lb Bags</strong><br>' + bags25 + '</div>';
    d += '<div><strong>Recommended Type</strong><br>' + groutType + '</div>';
    d += '</div>';

    resultDetails.innerHTML = d;
    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  function hideResult() {
    resultEl.classList.remove('visible');
    resultEl.style.display = 'none';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  [tileWidthInput, tileHeightInput, areaLength, areaWidth].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });
  [tileThicknessSelect, groutWidthSelect, wastePctSelect].forEach(function(sel) {
    sel.addEventListener('change', calculate);
  });
})();
