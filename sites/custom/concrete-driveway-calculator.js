(function() {
  'use strict';

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 2;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  var lengthEl = document.getElementById('drvLength');
  var widthEl = document.getElementById('drvWidth');
  var thickEl = document.getElementById('drvThickness');
  var priceEl = document.getElementById('concretePrice');
  var reinfEl = document.getElementById('reinforcement');
  var wasteEl = document.getElementById('wastePctDrv');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var CONCRETE_LBS_PER_CUYD = 3700; // approximately

  var chartData = [
    ['10x20 (1-car)', '200', '2.7', '1 (short)', '$405'],
    ['12x30 (1-car long)', '360', '4.9', '1', '$735'],
    ['12x40 (1-car)', '480', '6.5', '1', '$975'],
    ['20x30 (2-car)', '600', '8.1', '1', '$1,215'],
    ['20x40 (2-car)', '800', '10.8', '1-2', '$1,620'],
    ['24x50 (wide 2-car)', '1200', '16.3', '2', '$2,445']
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
    var thick = getVal(thickEl);
    var price = getVal(priceEl);
    var reinf = reinfEl.value;
    var wastePct = getVal(wasteEl) / 100;

    if (len <= 0 || wid <= 0) return;

    var areaSqFt = len * wid;
    var thickFt = thick / 12;

    // Volume in cubic feet, then cubic yards
    var volCuFt = areaSqFt * thickFt;
    var volCuYd = volCuFt / 27;

    // With waste
    var totalCuYd = volCuYd * (1 + wastePct);

    // Truck loads (standard truck = 10 cu yd max)
    var trucks = Math.ceil(totalCuYd / 10);

    // Cost
    var cost = totalCuYd * price;

    // Weight
    var weight = totalCuYd * CONCRETE_LBS_PER_CUYD;

    // Reinforcement calculation
    var reinfText = '';
    if (reinf === 'rebar') {
      // #4 rebar at 18" OC both ways
      var rebarLengthWise = Math.ceil((wid * 12) / 18) + 1; // number of bars running lengthwise
      var rebarWidthWise = Math.ceil((len * 12) / 18) + 1;  // number of bars running widthwise
      var totalRebarFt = (rebarLengthWise * len) + (rebarWidthWise * wid);
      var rebarPieces20 = Math.ceil(totalRebarFt / 20); // 20-foot pieces
      reinfText = rebarPieces20 + ' pcs #4 rebar (' + Math.ceil(totalRebarFt) + ' lin ft)';
    } else if (reinf === 'wire') {
      // Wire mesh sheets: 5x10 ft = 50 sq ft, with 6" overlap
      var meshSheets = Math.ceil(areaSqFt / 40); // ~40 sq ft effective per sheet with overlap
      reinfText = meshSheets + ' sheets wire mesh (5x10 ft)';
    } else if (reinf === 'fiber') {
      // Fiber mesh: 1.5 lbs per cubic yard
      var fiberLbs = totalCuYd * 1.5;
      reinfText = fmt(fiberLbs, 1) + ' lbs fiber mesh';
    } else {
      reinfText = 'None specified';
    }

    document.getElementById('rYards').textContent = fmt(totalCuYd, 1) + ' cu yd';
    document.getElementById('rTrucks').textContent = trucks + (trucks === 1 && totalCuYd < 5 ? ' (short load)' : ' truck' + (trucks > 1 ? 's' : ''));
    document.getElementById('rCost').textContent = '$' + fmt(cost, 0);
    document.getElementById('rArea').textContent = fmt(areaSqFt, 0) + ' sq ft';
    document.getElementById('rReinf').textContent = reinfText;
    document.getElementById('rWeight').textContent = fmt(weight / 2000, 1) + ' tons';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  [lengthEl, widthEl, thickEl, priceEl, reinfEl, wasteEl].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('change', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

})();
