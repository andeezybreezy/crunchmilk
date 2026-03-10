(function() {
  'use strict';

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 2;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  var lengthEl = document.getElementById('roofLength');
  var widthEl = document.getElementById('roofWidth');
  var pitchEl = document.getElementById('roofPitch');
  var wasteEl = document.getElementById('wasteFactor');
  var ridgeEl = document.getElementById('ridgeLength');
  var priceEl = document.getElementById('shinglePrice');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var chartData = [
    ['1,000 sq ft', '1,054 sq ft', '11', '33', '$1,155'],
    ['1,500 sq ft', '1,581 sq ft', '16', '48', '$1,680'],
    ['2,000 sq ft', '2,108 sq ft', '22', '66', '$2,310'],
    ['2,500 sq ft', '2,635 sq ft', '27', '81', '$2,835'],
    ['3,000 sq ft', '3,162 sq ft', '33', '99', '$3,465'],
    ['3,500 sq ft', '3,689 sq ft', '38', '114', '$3,990']
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
    var width = getVal(widthEl);
    var pitchMultiplier = getVal(pitchEl);
    var waste = getVal(wasteEl) / 100;
    var ridgeLen = getVal(ridgeEl);
    var bundlePrice = getVal(priceEl);

    if (length <= 0 || width <= 0) return;

    var footprint = length * width;
    var actualArea = footprint * pitchMultiplier;
    var areaWithWaste = actualArea * (1 + waste);

    var squares = areaWithWaste / 100;
    var bundles = Math.ceil(squares * 3);

    // Underlayment: synthetic rolls cover ~1000 sq ft
    var underlaymentRolls = Math.ceil(areaWithWaste / 1000);

    // Ridge caps: ~35 linear feet per bundle
    var ridgeBundles = ridgeLen > 0 ? Math.ceil(ridgeLen / 35) : 0;

    // Nails: ~320 nails per square, ~140 nails per lb
    var nailLbs = Math.ceil((squares * 320) / 140);

    var cost = bundles * bundlePrice;

    document.getElementById('rBundles').textContent = fmt(bundles, 0);
    document.getElementById('rSquares').textContent = fmt(squares, 1);
    document.getElementById('rUnderlayment').textContent = fmt(underlaymentRolls, 0);
    document.getElementById('rRidge').textContent = fmt(ridgeBundles, 0);
    document.getElementById('rNails').textContent = fmt(nailLbs, 0) + ' lbs';
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

  [lengthEl, widthEl, pitchEl, wasteEl, ridgeEl, priceEl].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('change', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

})();
