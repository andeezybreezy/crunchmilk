(function() {
  'use strict';

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 2;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  var lengthEl = document.getElementById('wallLength');
  var heightEl = document.getElementById('wallHeight');
  var spacingEl = document.getElementById('studSpacing');
  var cornersEl = document.getElementById('corners');
  var doorsEl = document.getElementById('doors');
  var priceEl = document.getElementById('studPrice');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var chartData = [
    ['8 ft', '12', '24', '64', '$54'],
    ['12 ft', '15', '36', '88', '$68'],
    ['16 ft', '19', '48', '112', '$86'],
    ['20 ft', '22', '60', '136', '$99'],
    ['24 ft', '25', '72', '160', '$113'],
    ['30 ft', '30', '90', '196', '$135']
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
    var wallLen = getVal(lengthEl);
    var wallHt = getVal(heightEl);
    var spacing = getVal(spacingEl);
    var corners = Math.round(getVal(cornersEl));
    var doors = Math.round(getVal(doorsEl));
    var studPrice = getVal(priceEl);

    if (wallLen <= 0 || wallHt <= 0 || spacing <= 0) return;

    var wallLenIn = wallLen * 12;
    // Regular studs
    var regularStuds = Math.ceil(wallLenIn / spacing) + 1;

    // Corner studs: 2 extra per corner
    var cornerStuds = corners * 2;

    // Door framing: each door = 2 king studs + 2 jack studs + 2 cripple studs above header
    // But removes ~2 regular studs from the opening
    var doorStudsAdded = doors * (2 + 2 + 2 - 2); // net +4 per door

    var totalStuds = regularStuds + cornerStuds + doorStudsAdded;
    totalStuds = Math.ceil(totalStuds * 1.10); // 10% waste

    // Plates: 1 bottom + 2 top = 3 runs
    var plateFeet = wallLen * 3;

    // Headers: assume 3' wide door openings, 2x10 headers doubled
    var headerFeet = doors * 3 * 2; // doubled header

    // Total linear feet of lumber
    var studLinFt = totalStuds * wallHt;
    var totalLinFt = studLinFt + plateFeet + headerFeet;

    // Board feet: 2×4 = 0.667 bf per linear foot
    var boardFeet = totalLinFt * 0.667;

    var cost = totalStuds * studPrice;

    document.getElementById('rStuds').textContent = fmt(totalStuds, 0);
    document.getElementById('rPlates').textContent = fmt(plateFeet, 0) + ' lin ft';
    document.getElementById('rHeaders').textContent = doors > 0 ? fmt(headerFeet, 0) + ' lin ft' : 'None';
    document.getElementById('rTotal').textContent = fmt(totalLinFt, 0) + ' lin ft';
    document.getElementById('rBoardFt').textContent = fmt(boardFeet, 0) + ' BF';
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

  [lengthEl, heightEl, spacingEl, cornersEl, doorsEl, priceEl].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('change', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

})();
