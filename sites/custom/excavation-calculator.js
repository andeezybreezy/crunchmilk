(function() {
  'use strict';

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 2;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  var lengthEl = document.getElementById('excLength');
  var widthEl = document.getElementById('excWidth');
  var depthEl = document.getElementById('excDepth');
  var soilEl = document.getElementById('soilType');
  var truckEl = document.getElementById('truckSize');
  var haulEl = document.getElementById('haulPrice');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var soilData = {
    clay:   { swell: 1.30, density: 1.5 },
    loam:   { swell: 1.25, density: 1.3 },
    sand:   { swell: 1.15, density: 1.4 },
    gravel: { swell: 1.15, density: 1.5 },
    rock:   { swell: 1.40, density: 1.8 }
  };

  var chartData = [
    ['10\u00d710\u00d72\'', '7.4', '9.3', '9.6', '1'],
    ['20\u00d720\u00d73\'', '44.4', '55.6', '57.8', '4'],
    ['30\u00d720\u00d73\'', '66.7', '83.3', '86.7', '6'],
    ['40\u00d720\u00d73\'', '88.9', '111.1', '115.6', '8'],
    ['50\u00d730\u00d74\'', '222.2', '277.8', '288.9', '20'],
    ['60\u00d740\u00d74\'', '355.6', '444.4', '462.2', '32']
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
    var len = getVal(lengthEl);
    var wid = getVal(widthEl);
    var dep = getVal(depthEl);
    var soil = soilData[soilEl.value] || soilData.loam;
    var truckCap = getVal(truckEl);
    var haulPrice = getVal(haulEl);

    if (len <= 0 || wid <= 0 || dep <= 0) return;

    var bankCuFt = len * wid * dep;
    var bankCuYd = bankCuFt / 27;
    var looseCuYd = bankCuYd * soil.swell;
    var weightTons = bankCuYd * soil.density;
    var loads = Math.ceil(looseCuYd / truckCap);
    var totalHaul = loads * haulPrice;
    var areaSqFt = len * wid;

    document.getElementById('rBank').textContent = fmt(bankCuYd, 1) + ' cu yd';
    document.getElementById('rSwell').textContent = fmt(looseCuYd, 1) + ' cu yd (loose)';
    document.getElementById('rWeight').textContent = fmt(weightTons, 1) + ' tons';
    document.getElementById('rLoads').textContent = loads + ' loads';
    document.getElementById('rHaulCost').textContent = '$' + fmt(totalHaul, 0);
    document.getElementById('rArea').textContent = fmt(areaSqFt, 0) + ' sq ft';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  [lengthEl, widthEl, depthEl, soilEl, truckEl, haulEl].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('change', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

})();
