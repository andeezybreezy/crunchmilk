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
  var rainEl = document.getElementById('rainfall');
  var materialEl = document.getElementById('gutterMaterial');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  // Gutter capacity in sq ft of roof at 1 in/hr
  var gutterCapacity = { '5': 5520, '6': 7960 };

  var chartData = [
    ['5" K-Style', '2,760', '1,380', '920', '690'],
    ['6" K-Style', '3,980', '1,990', '1,327', '995'],
    ['5" Half-Round', '2,500', '1,250', '833', '625'],
    ['6" Half-Round', '3,600', '1,800', '1,200', '900'],
    ['7" Box (commercial)', '5,600', '2,800', '1,867', '1,400']
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
    var roofLen = getVal(lengthEl);
    var roofW = getVal(widthEl);
    var pitchFactor = getVal(pitchEl);
    var rainfall = getVal(rainEl);

    if (roofLen <= 0 || roofW <= 0) return;

    var effectiveArea = roofLen * roofW * pitchFactor;
    var adjustedArea = effectiveArea * rainfall; // sq ft × in/hr

    // Check if 5" is sufficient
    var gutterSize, dsSize;
    if (adjustedArea <= gutterCapacity['5']) {
      gutterSize = '5" K-Style';
      dsSize = '2×3" rectangular';
    } else {
      gutterSize = '6" K-Style';
      dsSize = '3×4" rectangular';
    }

    // Downspout count: 1 per 600 sq ft of effective area for 2×3, 1 per 1200 for 3×4
    var downspouts;
    if (gutterSize === '5" K-Style') {
      downspouts = Math.max(2, Math.ceil(effectiveArea / 600));
    } else {
      downspouts = Math.max(2, Math.ceil(effectiveArea / 1200));
    }

    // Also ensure max 40' gutter run between downspouts
    var dsFromLength = Math.max(2, Math.ceil(roofLen / 40));
    downspouts = Math.max(downspouts, dsFromLength);

    // Peak water volume: area × rainfall / 96.23 = GPM
    var gpm = (effectiveArea * rainfall) / 96.23;

    document.getElementById('rGutterSize').textContent = gutterSize;
    document.getElementById('rDownspouts').textContent = downspouts;
    document.getElementById('rArea').textContent = fmt(effectiveArea, 0) + ' sq ft';
    document.getElementById('rWater').textContent = fmt(gpm, 1) + ' GPM';
    document.getElementById('rLength').textContent = fmt(roofLen, 0) + ' lin ft';
    document.getElementById('rDSSize').textContent = dsSize;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  [lengthEl, widthEl, pitchEl, rainEl, materialEl].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('change', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

})();
