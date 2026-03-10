(function() {
  'use strict';

  var densities = { fresh: 5, packed: 15, wet: 25, ice: 57 };

  var roofArea = document.getElementById('roofArea');
  var snowDepth = document.getElementById('snowDepth');
  var snowType = document.getElementById('snowType');
  var roofRating = document.getElementById('roofRating');
  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  function calculate() {
    var area = parseFloat(roofArea.value) || 0;
    var depth = parseFloat(snowDepth.value) || 0;
    var type = snowType.value;
    var rating = parseFloat(roofRating.value) || 30;

    if (area <= 0 || depth <= 0) return;

    var density = densities[type];
    var depthFt = depth / 12;
    var loadPsf = density * depthFt;
    var totalLbs = loadPsf * area;
    var pctRating = (loadPsf / rating) * 100;

    var status, statusColor;
    if (pctRating < 50) {
      status = 'Safe'; statusColor = '#16a34a';
    } else if (pctRating < 75) {
      status = 'Monitor'; statusColor = '#ca8a04';
    } else if (pctRating < 100) {
      status = 'Warning — Consider Removal'; statusColor = '#ea580c';
    } else {
      status = 'DANGER — Exceeds Rating!'; statusColor = '#dc2626';
    }

    document.getElementById('loadPsf').textContent = loadPsf.toFixed(1) + ' psf';
    document.getElementById('totalWeight').textContent = Math.round(totalLbs).toLocaleString() + ' lbs (' + (totalLbs / 2000).toFixed(1) + ' tons)';
    document.getElementById('pctRating').textContent = pctRating.toFixed(0) + '%';
    var statusEl = document.getElementById('status');
    statusEl.textContent = status;
    statusEl.style.color = statusColor;

    var typeNames = { fresh: 'Fresh powder', packed: 'Packed snow', wet: 'Wet snow', ice: 'Ice' };
    document.getElementById('resultTip').textContent = typeNames[type] + ' at ' + depth + '" depth, ' + density + ' lb/cu ft density, ' + area.toLocaleString() + ' sq ft roof';

    result.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  [roofArea, snowDepth, snowType, roofRating].forEach(function(el) {
    el.addEventListener('change', calculate);
    el.addEventListener('input', calculate);
  });

  calculate();
})();
