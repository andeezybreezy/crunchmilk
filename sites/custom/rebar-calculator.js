(function() {
  'use strict';

  var slabLen = document.getElementById('slabLen');
  var slabWid = document.getElementById('slabWid');
  var rebarSpacing = document.getElementById('rebarSpacing');
  var rebarSize = document.getElementById('rebarSize');

  var outBars = document.getElementById('outBars');
  var outLinFt = document.getElementById('outLinFt');
  var outSticks = document.getElementById('outSticks');
  var outWeight = document.getElementById('outWeight');
  var outChairs = document.getElementById('outChairs');
  var outArea = document.getElementById('outArea');
  var resultTip = document.getElementById('resultTip');

  var weightPerFt = { '3': 0.376, '4': 0.668, '5': 1.043 };

  function calculate() {
    var l = parseFloat(slabLen.value);
    var w = parseFloat(slabWid.value);
    var spacing = parseFloat(rebarSpacing.value) / 12; // convert to feet
    var size = rebarSize.value;

    if (isNaN(l) || isNaN(w) || l <= 0 || w <= 0) {
      outBars.textContent = '—';
      outLinFt.textContent = '—';
      outSticks.textContent = '—';
      outWeight.textContent = '—';
      outChairs.textContent = '—';
      outArea.textContent = '—';
      resultTip.textContent = 'Enter slab dimensions to calculate rebar needed.';
      return;
    }

    // Bars running along the length (spaced across width)
    var barsAlongLength = Math.floor(w / spacing) + 1;
    // Bars running along the width (spaced across length)
    var barsAlongWidth = Math.floor(l / spacing) + 1;

    var totalBars = barsAlongLength + barsAlongWidth;
    var linFtRaw = (barsAlongLength * l) + (barsAlongWidth * w);
    var linFtWithOverlap = linFtRaw * 1.10; // 10% for overlaps
    var sticks = Math.ceil(linFtWithOverlap / 20);
    var weight = linFtWithOverlap * weightPerFt[size];
    var area = l * w;
    var chairs = Math.ceil(area / 4);

    outBars.textContent = totalBars;
    outLinFt.textContent = Math.ceil(linFtWithOverlap).toLocaleString() + ' ft';
    outSticks.textContent = sticks;
    outWeight.textContent = Math.ceil(weight).toLocaleString() + ' lbs';
    outChairs.textContent = chairs;
    outArea.textContent = area.toFixed(0) + ' sq ft';

    resultTip.textContent = barsAlongLength + ' bars along length + ' + barsAlongWidth + ' bars along width = ' + totalBars + ' bars, ' + Math.ceil(linFtWithOverlap).toLocaleString() + ' linear ft (incl. 10% overlap), ' + Math.ceil(weight).toLocaleString() + ' lbs.';
  }

  slabLen.addEventListener('input', calculate);
  slabWid.addEventListener('input', calculate);
  rebarSpacing.addEventListener('change', calculate);
  rebarSize.addEventListener('change', calculate);

  calculate();
})();
