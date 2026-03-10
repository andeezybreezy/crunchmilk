(function() {
  'use strict';

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 2;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  var lengthEl = document.getElementById('drainLength');
  var widthEl = document.getElementById('trenchWidth');
  var depthEl = document.getElementById('trenchDepth');
  var pipeEl = document.getElementById('pipeSize');
  var priceEl = document.getElementById('gravelPrice');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var chartData = [
    ['25 ft', '0.9', '25', '88', '$41'],
    ['50 ft', '1.8', '50', '175', '$81'],
    ['75 ft', '2.6', '75', '263', '$117'],
    ['100 ft', '3.5', '100', '350', '$158'],
    ['150 ft', '5.3', '150', '525', '$239'],
    ['200 ft', '7.0', '200', '700', '$315']
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
    var drainLen = getVal(lengthEl);
    var trenchW = getVal(widthEl) / 12; // convert to feet
    var trenchD = getVal(depthEl) / 12;
    var pipeDiam = getVal(pipeEl);
    var gravelPrice = getVal(priceEl);

    if (drainLen <= 0 || trenchW <= 0 || trenchD <= 0) return;

    // Trench volume in cubic feet
    var trenchVolCuFt = drainLen * trenchW * trenchD;
    var trenchVolCuYd = trenchVolCuFt / 27;

    // Pipe volume displacement (~10%)
    var pipeRadiusFt = (pipeDiam / 2) / 12;
    var pipeVolCuFt = Math.PI * pipeRadiusFt * pipeRadiusFt * drainLen;

    // Gravel volume
    var gravelVolCuFt = trenchVolCuFt - pipeVolCuFt;
    var gravelVolCuYd = gravelVolCuFt / 27;
    var gravelTons = gravelVolCuYd * 1.4;

    // Pipe length (add 5% for fittings)
    var pipeLength = Math.ceil(drainLen * 1.05);

    // Landscape fabric: line bottom + both sides + overlap
    // Width needed: trench bottom + 2 × depth + 12" overlap
    var fabricWidthFt = trenchW + (2 * trenchD) + 1;
    var fabricSqFt = fabricWidthFt * drainLen;

    // Minimum slope: 1% = 1/8" per foot
    var totalDrop = drainLen * (1/8);

    var gravelCost = gravelTons * gravelPrice;

    document.getElementById('rGravel').textContent = fmt(gravelTons, 1) + ' tons (' + fmt(gravelVolCuYd, 1) + ' cu yd)';
    document.getElementById('rPipe').textContent = fmt(pipeLength, 0) + ' ft (' + pipeDiam + '" perf.)';
    document.getElementById('rFabric').textContent = fmt(fabricSqFt, 0) + ' sq ft';
    document.getElementById('rExcavation').textContent = fmt(trenchVolCuYd, 1) + ' cu yd';
    document.getElementById('rGravelCost').textContent = '$' + fmt(gravelCost, 0);
    document.getElementById('rSlope').textContent = fmt(totalDrop, 1) + '" drop (1% min)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  [lengthEl, widthEl, depthEl, pipeEl, priceEl].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('change', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

})();
