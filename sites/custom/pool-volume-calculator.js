(function() {
  'use strict';

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 0;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  var shapeEl = document.getElementById('poolShape');
  var lengthEl = document.getElementById('poolLength');
  var widthEl = document.getElementById('poolWidth');
  var shallowEl = document.getElementById('shallowDepth');
  var deepEl = document.getElementById('deepDepth');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var GALLONS_PER_CUFT = 7.48052;
  var LITERS_PER_GALLON = 3.78541;
  var LBS_PER_GALLON = 8.34;

  var chartData = [
    ['12x24 ft rect', '5 ft', '10,778', '40,800', '89,893'],
    ['16x32 ft rect', '5.5 ft', '21,067', '79,750', '175,697'],
    ['18x36 ft rect', '5.5 ft', '26,658', '100,918', '222,325'],
    ['15 ft round', '4 ft', '5,288', '20,019', '44,100'],
    ['18 ft round', '4 ft', '7,614', '28,824', '63,501'],
    ['24 ft round', '4 ft', '13,536', '51,243', '112,890']
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
    var shape = shapeEl.value;
    var len = getVal(lengthEl);
    var wid = getVal(widthEl);
    var shallow = getVal(shallowEl);
    var deep = getVal(deepEl);

    if (shallow <= 0 && deep <= 0) return;

    var avgDepth = (shallow + deep) / 2;
    var surfaceArea = 0;
    var volumeCuFt = 0;

    if (shape === 'rect') {
      if (len <= 0 || wid <= 0) return;
      surfaceArea = len * wid;
      volumeCuFt = len * wid * avgDepth;
    } else if (shape === 'round') {
      // Use width as diameter
      if (wid <= 0) return;
      var radius = wid / 2;
      surfaceArea = Math.PI * radius * radius;
      volumeCuFt = Math.PI * radius * radius * avgDepth;
    } else if (shape === 'oval') {
      if (len <= 0 || wid <= 0) return;
      surfaceArea = Math.PI * (len / 2) * (wid / 2);
      volumeCuFt = Math.PI * (len / 2) * (wid / 2) * avgDepth;
    }

    var gallons = volumeCuFt * GALLONS_PER_CUFT;
    var liters = gallons * LITERS_PER_GALLON;
    var weightLbs = gallons * LBS_PER_GALLON;

    document.getElementById('rGallons').textContent = fmt(gallons) + ' gal';
    document.getElementById('rCuFt').textContent = fmt(volumeCuFt, 1) + ' cu ft';
    document.getElementById('rLiters').textContent = fmt(liters) + ' L';
    document.getElementById('rAvgDepth').textContent = fmt(avgDepth, 1) + ' ft';
    document.getElementById('rSurface').textContent = fmt(surfaceArea) + ' sq ft';
    document.getElementById('rWeight').textContent = fmt(weightLbs) + ' lbs';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  [shapeEl, lengthEl, widthEl, shallowEl, deepEl].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('change', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

})();
