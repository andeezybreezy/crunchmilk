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
  var sizeEl = document.getElementById('blockSize');
  var fillEl = document.getElementById('fillCores');
  var priceEl = document.getElementById('blockPrice');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  // Core volume in cubic feet per block by width
  var coreVolumes = { '4': 0.15, '6': 0.30, '8': 0.50, '12': 0.80 };

  var chartData = [
    ['20\' × 4\'', '95', '12', '47', '52'],
    ['30\' × 6\'', '209', '25', '104', '98'],
    ['40\' × 8\'', '378', '45', '189', '168'],
    ['50\' × 8\'', '473', '56', '236', '200'],
    ['60\' × 10\'', '709', '84', '354', '310'],
    ['80\' × 8\'', '756', '89', '378', '320']
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
    var length = getVal(lengthEl);
    var height = getVal(heightEl);
    var blockWidth = sizeEl.value;
    var fillMode = fillEl.value;
    var blockPrice = getVal(priceEl);

    if (length <= 0 || height <= 0) return;

    var area = length * height;
    var blocksPerSqFt = 1.125;
    var rawBlocks = area * blocksPerSqFt;
    var blocks = Math.ceil(rawBlocks * 1.05); // 5% waste

    // Mortar: ~8.5 blocks per 80lb bag
    var mortarBags = Math.ceil(blocks / 8.5);

    // Grout fill
    var coreVol = coreVolumes[blockWidth] || 0.5;
    var groutCuFt = 0;
    if (fillMode === 'all') {
      groutCuFt = rawBlocks * coreVol;
    } else if (fillMode === 'rebar') {
      // Rebar cells every 4 feet
      var rebarCells = Math.ceil(length / 4) + 1;
      var coursesHigh = Math.ceil(height * 12 / 8);
      groutCuFt = rebarCells * coursesHigh * coreVol * 0.5; // half core per rebar cell
    }

    // Rebar: vertical every 48" + horizontal every 48"
    var vertBars = Math.ceil(length / 4) + 1;
    var vertRebarFt = vertBars * height;
    var horizRows = Math.ceil(height / 4);
    var horizRebarFt = horizRows * length;
    var totalRebarFt = Math.ceil(vertRebarFt + horizRebarFt);

    var cost = blocks * blockPrice;

    document.getElementById('rBlocks').textContent = fmt(blocks, 0);
    document.getElementById('rMortar').textContent = fmt(mortarBags, 0);
    document.getElementById('rGrout').textContent = fmt(groutCuFt, 0) + ' cu ft';
    document.getElementById('rRebar').textContent = fmt(totalRebarFt, 0) + ' lin ft';
    document.getElementById('rArea').textContent = fmt(area, 0) + ' sq ft';
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

  [lengthEl, heightEl, sizeEl, fillEl, priceEl].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('change', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

})();
