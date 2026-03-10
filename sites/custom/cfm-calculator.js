(function() {
  'use strict';

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 2;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  var modeEl = document.getElementById('calcMode');
  var lengthEl = document.getElementById('roomLength');
  var widthEl = document.getElementById('roomWidth');
  var heightEl = document.getElementById('roomHeight');
  var achEl = document.getElementById('achRate');
  var ductEl = document.getElementById('ductDiameter');
  var velocityEl = document.getElementById('airVelocity');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var chartData = [
    ['4"', '12.6', '61', '79'],
    ['6"', '28.3', '137', '177'],
    ['8"', '50.3', '244', '314'],
    ['10"', '78.5', '381', '491'],
    ['12"', '113.1', '549', '707'],
    ['14"', '153.9', '747', '961']
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

  // Update ACH defaults based on mode
  modeEl.addEventListener('change', function() {
    var mode = modeEl.value;
    if (mode === 'bath') achEl.value = 8;
    else if (mode === 'range') achEl.value = 15;
    else if (mode === 'room') achEl.value = 6;
    else achEl.value = 6;
  });

  function calculate() {
    var mode = modeEl.value;
    var length = getVal(lengthEl);
    var width = getVal(widthEl);
    var height = getVal(heightEl);
    var ach = getVal(achEl);
    var ductDiam = getVal(ductEl);
    var velocity = getVal(velocityEl);

    var volume = length * width * height;
    var cfm = 0;

    if (mode === 'room' || mode === 'bath' || mode === 'range') {
      if (volume <= 0 || ach <= 0) return;
      cfm = (volume * ach) / 60;

      // Bathroom minimum: 1 CFM per sq ft, min 50
      if (mode === 'bath') {
        var floorArea = length * width;
        var bathMin = Math.max(50, floorArea);
        cfm = Math.max(cfm, bathMin);
      }

      // Range hood minimum: 100 CFM per foot of range width
      if (mode === 'range') {
        var rangeMin = width * 100; // width as range width
        cfm = Math.max(cfm, rangeMin);
      }
    } else if (mode === 'duct') {
      if (ductDiam <= 0 || velocity <= 0) return;
      // Duct area in sq ft
      var radiusIn = ductDiam / 2;
      var areaSqIn = Math.PI * radiusIn * radiusIn;
      var areaSqFt = areaSqIn / 144;
      cfm = areaSqFt * velocity;
    }

    // Determine duct size needed for this CFM at 700 FPM
    var neededAreaSqFt = cfm / 700;
    var neededAreaSqIn = neededAreaSqFt * 144;
    var neededDiameter = Math.sqrt(neededAreaSqIn / Math.PI) * 2;
    // Round up to standard sizes
    var stdDucts = [4, 5, 6, 7, 8, 10, 12, 14, 16, 18, 20];
    var recommendedDuct = stdDucts[stdDucts.length - 1];
    for (var i = 0; i < stdDucts.length; i++) {
      if (stdDucts[i] >= neededDiameter) {
        recommendedDuct = stdDucts[i];
        break;
      }
    }

    // Fan recommendation
    var fanSizes = [50, 80, 110, 150, 200, 300, 400, 600, 800, 1000, 1200];
    var recommendedFan = fanSizes[fanSizes.length - 1];
    for (var j = 0; j < fanSizes.length; j++) {
      if (fanSizes[j] >= cfm) {
        recommendedFan = fanSizes[j];
        break;
      }
    }

    document.getElementById('rCFM').textContent = fmt(cfm, 0) + ' CFM';
    document.getElementById('rVolume').textContent = fmt(volume, 0) + ' cu ft';
    document.getElementById('rDuct').textContent = recommendedDuct + '" round';
    document.getElementById('rFan').textContent = recommendedFan + ' CFM fan';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  [modeEl, lengthEl, widthEl, heightEl, achEl, ductEl, velocityEl].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('change', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

})();
