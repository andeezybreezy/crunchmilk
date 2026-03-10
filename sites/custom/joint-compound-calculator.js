(function() {
  'use strict';

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 2;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  var sheetEl = document.getElementById('sheetCount');
  var areaEl = document.getElementById('totalArea');
  var levelEl = document.getElementById('finishLevel');
  var cornerEl = document.getElementById('cornerFeet');
  var priceEl = document.getElementById('mudPrice');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  // Level multipliers: compound coverage per sq ft in gallons
  // Level 4 base: ~1 gallon per 80 sq ft = 0.0125 gal/sqft
  var levelMultipliers = { '3': 0.60, '4': 1.0, '5': 1.50 };

  var chartData = [
    ['10', '320', '4.0', '1', '1'],
    ['20', '640', '8.0', '2', '1'],
    ['30', '960', '12.0', '3', '1'],
    ['50', '1,600', '20.0', '4', '2'],
    ['75', '2,400', '30.0', '6', '2'],
    ['100', '3,200', '40.0', '8', '3']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function getVal(el) { var v = parseFloat(el.value); return isNaN(v) ? 0 : v; }

  function calculate() {
    var sheets = getVal(sheetEl);
    var areaOverride = getVal(areaEl);
    var level = levelEl.value;
    var cornerFt = getVal(cornerEl);
    var bucketPrice = getVal(priceEl);

    // Calculate area from sheets or use override
    var area = areaOverride > 0 ? areaOverride : sheets * 32; // 4×8 = 32 sq ft
    if (area <= 0) return;

    var multiplier = levelMultipliers[level] || 1.0;
    var baseGalPerSqFt = 0.0125; // Level 4 baseline
    var gallons = area * baseGalPerSqFt * multiplier;

    // Add mud for corner bead: ~0.05 gal per linear foot
    gallons += cornerFt * 0.05;

    var buckets = Math.ceil(gallons / 5);

    // Tape: ~370 ft per 1000 sq ft
    var tapeFt = area * 0.37;
    var tapeRolls = Math.ceil(tapeFt / 500);

    // Corner bead pieces (8' lengths)
    var cornerPieces = cornerFt > 0 ? Math.ceil(cornerFt / 8) : 0;

    // Sandpaper sheets: ~1 per 50 sq ft for Level 4
    var sandSheets = Math.ceil(area / 50 * multiplier);

    var cost = buckets * bucketPrice;

    document.getElementById('rMud').textContent = buckets + ' bucket' + (buckets !== 1 ? 's' : '') + ' (5-gal)';
    document.getElementById('rTape').textContent = tapeRolls + ' roll' + (tapeRolls !== 1 ? 's' : '') + ' (500 ft)';
    document.getElementById('rCorner').textContent = cornerPieces > 0 ? cornerPieces + ' pcs (8 ft)' : 'None';
    document.getElementById('rSand').textContent = fmt(sandSheets, 0);
    document.getElementById('rGallons').textContent = fmt(gallons, 1) + ' gal';
    document.getElementById('rCost').textContent = '$' + fmt(cost, 0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  [sheetEl, areaEl, levelEl, cornerEl, priceEl].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('change', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

})();
