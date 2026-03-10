(function() {
  'use strict';

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 2;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  var foamTypeEl = document.getElementById('foamType');
  var areaEl = document.getElementById('surfaceArea');
  var thicknessEl = document.getElementById('thickness');
  var costEl = document.getElementById('costPerBF');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var chartData = [
    ['500', '500 BF', '1,000 BF', '1,500 BF', 'R-7/R-14/R-21', 'R-3.7/R-7.4/R-11'],
    ['1,000', '1,000 BF', '2,000 BF', '3,000 BF', 'R-7/R-14/R-21', 'R-3.7/R-7.4/R-11'],
    ['1,500', '1,500 BF', '3,000 BF', '4,500 BF', 'R-7/R-14/R-21', 'R-3.7/R-7.4/R-11'],
    ['2,000', '2,000 BF', '4,000 BF', '6,000 BF', 'R-7/R-14/R-21', 'R-3.7/R-7.4/R-11'],
    ['2,500', '2,500 BF', '5,000 BF', '7,500 BF', 'R-7/R-14/R-21', 'R-3.7/R-7.4/R-11'],
    ['3,000', '3,000 BF', '6,000 BF', '9,000 BF', 'R-7/R-14/R-21', 'R-3.7/R-7.4/R-11']
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
    var foamType = foamTypeEl.value;
    var area = getVal(areaEl);
    var thickness = getVal(thicknessEl);
    var costPerBF = getVal(costEl);

    if (area <= 0 || thickness <= 0) return;

    var boardFeet = area * thickness;
    var wasteMultiplier = 1.10; // 10% waste for overspray
    var totalBF = boardFeet * wasteMultiplier;

    var rPerInch = foamType === 'closed' ? 7.0 : 3.7;
    var rValue = rPerInch * thickness;

    // DIY kits: 600 BF standard size
    var kits = Math.ceil(totalBF / 600);

    var cost = totalBF * costPerBF;

    // Coverage at 1 inch
    var cov1 = area; // BF at 1 inch = area

    // Vapor barrier
    var isVaporBarrier = foamType === 'closed' && thickness >= 1.5;
    var vaporText = foamType === 'closed'
      ? (isVaporBarrier ? 'Yes (built-in)' : 'Need 1.5"+ for vapor barrier')
      : 'No — add separate retarder';

    document.getElementById('rBoardFt').textContent = fmt(totalBF, 0) + ' BF';
    document.getElementById('rRValue').textContent = 'R-' + fmt(rValue, 1);
    document.getElementById('rKits').textContent = kits;
    document.getElementById('rCost').textContent = '$' + fmt(cost, 0);
    document.getElementById('rCov1').textContent = fmt(area, 0) + ' sq ft';
    document.getElementById('rVapor').textContent = vaporText;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  [foamTypeEl, areaEl, thicknessEl, costEl].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('change', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

})();
