(function() {
  'use strict';

  var shapeEl = document.getElementById('bedShape');
  var rectInputs = document.getElementById('rectInputs');
  var circInputs = document.getElementById('circInputs');
  var lInputs = document.getElementById('lInputs');

  shapeEl.addEventListener('change', function() {
    rectInputs.style.display = shapeEl.value === 'rectangular' ? '' : 'none';
    circInputs.style.display = shapeEl.value === 'circular' ? '' : 'none';
    lInputs.style.display = shapeEl.value === 'lshaped' ? '' : 'none';
  });

  // Weight per cubic foot in lbs (dry)
  var weightPerCuFt = { soil: 85, compost: 50, mulch: 25, gravel: 100 };
  // Cost per cubic foot (bagged, approximate)
  var costPerCuFt = { soil: 5, compost: 6, mulch: 3.5, gravel: 4 };

  var chartData = [
    ['4x4 ft','8 cu ft','10.7 cu ft','13.3 cu ft','16 cu ft'],
    ['4x8 ft','16 cu ft','21.3 cu ft','26.7 cu ft','32 cu ft'],
    ['4x12 ft','24 cu ft','32 cu ft','40 cu ft','48 cu ft'],
    ['3x6 ft','9 cu ft','12 cu ft','15 cu ft','18 cu ft'],
    ['6x6 ft','18 cu ft','24 cu ft','30 cu ft','36 cu ft'],
    ['2x8 ft','8 cu ft','10.7 cu ft','13.3 cu ft','16 cu ft'],
    ['3x8 ft','12 cu ft','16 cu ft','20 cu ft','24 cu ft'],
    ['5x10 ft','25 cu ft','33.3 cu ft','41.7 cu ft','50 cu ft']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function getVal(id) { var v = parseFloat(document.getElementById(id).value); return isNaN(v) ? 0 : v; }

  function calculate() {
    var shape = shapeEl.value;
    var depthIn = getVal('bedDepth');
    var material = document.getElementById('soilType').value;

    if (depthIn <= 0) return;

    var depthFt = depthIn / 12;
    var areaSqFt = 0;

    if (shape === 'rectangular') {
      var len = getVal('bedLength');
      var wid = getVal('bedWidth');
      if (len <= 0 || wid <= 0) return;
      areaSqFt = len * wid;
    } else if (shape === 'circular') {
      var diam = getVal('bedDiameter');
      if (diam <= 0) return;
      var radius = diam / 2;
      areaSqFt = Math.PI * radius * radius;
    } else if (shape === 'lshaped') {
      var l1 = getVal('lLength1');
      var w1 = getVal('lWidth1');
      var l2 = getVal('lLength2');
      var w2 = getVal('lWidth2');
      if (l1 <= 0 || w1 <= 0 || l2 <= 0 || w2 <= 0) return;
      areaSqFt = (l1 * w1) + (l2 * w2);
    }

    var cubicFeet = areaSqFt * depthFt;
    var cubicYards = cubicFeet / 27;

    var bags1 = Math.ceil(cubicFeet);
    var bags2 = Math.ceil(cubicFeet / 2);

    var weightLbs = cubicFeet * weightPerCuFt[material];
    var costBagged = cubicFeet * costPerCuFt[material];
    var costBulk = cubicYards * 45; // ~$45/cu yd average bulk

    document.getElementById('cubicFeet').textContent = cubicFeet.toFixed(1) + ' cu ft';
    document.getElementById('cubicYards').textContent = cubicYards.toFixed(2) + ' cu yd';
    document.getElementById('bags1').textContent = bags1 + ' bags';
    document.getElementById('bags2').textContent = bags2 + ' bags';
    document.getElementById('weight').textContent = Math.round(weightLbs).toLocaleString() + ' lbs (' + (weightLbs / 2000).toFixed(1) + ' tons)';

    var costStr = 'Bagged: ~$' + Math.round(costBagged).toLocaleString();
    if (cubicYards >= 1) {
      costStr += ' | Bulk: ~$' + Math.round(costBulk).toLocaleString();
    }
    document.getElementById('estCost').textContent = costStr;

    var tip = 'You need ' + cubicFeet.toFixed(1) + ' cubic feet (' + cubicYards.toFixed(2) + ' cu yd) of ' + material + '. ';
    if (cubicYards >= 1) {
      tip += 'At this volume, buying in bulk will save significantly over bagged. ';
    }
    tip += 'Add 10-15% extra for settling.';
    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
})();
