(function() {
  'use strict';

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 2;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  var numStepsEl = document.getElementById('numSteps');
  var riseEl = document.getElementById('riseHeight');
  var runEl = document.getElementById('runDepth');
  var widthEl = document.getElementById('stairWidth');
  var slabEl = document.getElementById('slabThickness');
  var priceEl = document.getElementById('concretePrice');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var chartData = [
    ['3', '22.5"', '33"', '0.35', '$53'],
    ['4', '30"', '44"', '0.55', '$83'],
    ['5', '37.5"', '55"', '0.80', '$120'],
    ['6', '45"', '66"', '1.10', '$165'],
    ['7', '52.5"', '77"', '1.45', '$218'],
    ['8', '60"', '88"', '1.85', '$278']
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
    var steps = Math.round(getVal(numStepsEl));
    var rise = getVal(riseEl);
    var run = getVal(runEl);
    var width = getVal(widthEl);
    var slab = getVal(slabEl);
    var price = getVal(priceEl);

    if (steps <= 0 || rise <= 0 || run <= 0 || width <= 0) return;

    // Convert inches to feet
    var riseF = rise / 12;
    var runF = run / 12;
    var widthF = width / 12;
    var slabF = slab / 12;

    // Calculate stair volume: each step is cumulative
    // Step 1 = rise × run × width
    // Step 2 = 2×rise × run × width (because it sits on step 1)
    // Step n = n×rise × run × width
    var stairVolCuFt = 0;
    for (var i = 1; i <= steps; i++) {
      stairVolCuFt += (i * riseF) * runF * widthF;
    }

    // Base slab volume
    var totalRunF = steps * runF;
    var slabVolCuFt = totalRunF * widthF * slabF;

    var totalCuFt = stairVolCuFt + slabVolCuFt;
    var wasteF = 1.10;
    var totalWithWaste = totalCuFt * wasteF;
    var cuYards = totalWithWaste / 27;

    var totalRise = steps * rise;
    var totalRun = steps * run;

    // Rebar: #4 bars at 12" spacing in slab + longitudinal
    var slopeLen = Math.sqrt(totalRise * totalRise + totalRun * totalRun) / 12; // feet
    var crossBars = Math.ceil((width / 12) * slopeLen); // rough linear feet
    var longBars = Math.ceil(slopeLen * Math.ceil(width / 12));
    var totalRebarFt = crossBars + longBars + Math.ceil(totalRunF * widthF * 2);

    var cost = cuYards * price;

    document.getElementById('rVolume').textContent = fmt(cuYards, 2) + ' cu yd';
    document.getElementById('rCuFt').textContent = fmt(totalWithWaste, 1) + ' cu ft';
    document.getElementById('rTotalRise').textContent = fmt(totalRise, 1) + '"';
    document.getElementById('rTotalRun').textContent = fmt(totalRun, 1) + '"';
    document.getElementById('rRebar').textContent = fmt(totalRebarFt, 0) + ' lin ft (#4)';
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

  [numStepsEl, riseEl, runEl, widthEl, slabEl, priceEl].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

})();
