(function() {
  'use strict';

  var presets = [
    ['Sandbox (8\' x 8\')', 'rect', 8, 8, 8, 'at 8" deep'],
    ['Paver Base (10\' x 12\')', 'rect', 12, 10, 1, 'at 1" deep'],
    ['Leveling (20\' x 20\')', 'rect', 20, 20, 2, 'at 2" deep'],
    ['Volleyball Court', 'rect', 60, 30, 12, '30\' x 60\' at 12"']
  ];

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 2;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
  function fmtDollars(n) { return '$' + fmt(n, 0).replace(/\..*/, ''); }

  var areaMode = 'rect';
  var areaToggle = document.getElementById('areaToggle');
  var areaToggleBtns = areaToggle.querySelectorAll('button');
  var rectInputs = document.getElementById('rectInputs');
  var circleInputs = document.getElementById('circleInputs');
  var sqftInputDiv = document.getElementById('sqftInput');
  var lengthInput = document.getElementById('lengthFt');
  var widthInput = document.getElementById('widthFt');
  var diaInput = document.getElementById('diaFt');
  var areaSqftInput = document.getElementById('areaSqft');
  var depthInput = document.getElementById('depthIn');
  var sandType = document.getElementById('sandType');
  var priceInput = document.getElementById('priceTon');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');
  var rYards = document.getElementById('rYards');
  var rTons = document.getElementById('rTons');
  var resultDetails = document.getElementById('resultDetails');

  areaToggleBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      areaToggleBtns.forEach(function(b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active'); btn.setAttribute('aria-pressed', 'true');
      areaMode = btn.dataset.mode;
      rectInputs.style.display = areaMode === 'rect' ? '' : 'none';
      circleInputs.style.display = areaMode === 'circle' ? '' : 'none';
      sqftInputDiv.style.display = areaMode === 'sqft' ? '' : 'none';
      calculate();
    });
  });

  var presetGrid = document.getElementById('presetGrid');
  presets.forEach(function(p) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'preset-btn';
    btn.innerHTML = p[0] + '<span>' + p[5] + '</span>';
    btn.addEventListener('click', function() {
      areaMode = p[1];
      areaToggleBtns.forEach(function(b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      areaToggleBtns.forEach(function(b) { if (b.dataset.mode === areaMode) { b.classList.add('active'); b.setAttribute('aria-pressed', 'true'); } });
      rectInputs.style.display = areaMode === 'rect' ? '' : 'none';
      circleInputs.style.display = areaMode === 'circle' ? '' : 'none';
      sqftInputDiv.style.display = areaMode === 'sqft' ? '' : 'none';
      if (areaMode === 'rect') { lengthInput.value = p[2]; widthInput.value = p[3]; }
      else if (areaMode === 'circle') { diaInput.value = p[2]; }
      depthInput.value = p[4];
      calculate();
    });
    presetGrid.appendChild(btn);
  });

  // Chart
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    var rows = [
      ['36 (6x6)','0.44','0.60','0.89','24'],['64 (8x8)','0.79','1.07','1.58','43'],
      ['100 (10x10)','1.23','1.67','2.47','67'],['200','2.47','3.33','4.94','133'],
      ['500','6.17','8.33','12.35','333'],['1,000','12.35','16.67','24.69','667']
    ];
    rows.forEach(function(r) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td><td>'+r[3]+'</td><td>'+r[4]+'</td>';
      chartBody.appendChild(tr);
    });
  }

  function getArea() {
    if (areaMode === 'rect') {
      var l = parseFloat(lengthInput.value), w = parseFloat(widthInput.value);
      if (isNaN(l) || isNaN(w) || l <= 0 || w <= 0) return NaN;
      return l * w;
    } else if (areaMode === 'circle') {
      var d = parseFloat(diaInput.value);
      if (isNaN(d) || d <= 0) return NaN;
      return Math.PI * (d / 2) * (d / 2);
    } else {
      var a = parseFloat(areaSqftInput.value);
      return (isNaN(a) || a <= 0) ? NaN : a;
    }
  }

  function calculate() {
    var area = getArea();
    if (isNaN(area)) { hideResult(); return; }

    var depthIn = parseFloat(depthInput.value);
    if (isNaN(depthIn) || depthIn <= 0) { hideResult(); return; }

    var density = parseFloat(sandType.value);
    var price = parseFloat(priceInput.value) || 30;

    var cuFt = area * depthIn / 12;
    var cuYd = cuFt / 27;
    var weightLbs = cuYd * density;
    var tons = weightLbs / 2000;
    var bags50 = Math.ceil(cuFt / 0.5); // 50lb bag ≈ 0.5 cu ft
    var cost = tons * price;
    var bagCost = bags50 * 5;

    rYards.textContent = fmt(cuYd) + ' yd\u00B3';
    rTons.textContent = fmt(tons) + ' tons';

    var d = '';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem">';
    d += '<div><strong>Area</strong><br>' + fmt(area, 0) + ' sq ft</div>';
    d += '<div><strong>Depth</strong><br>' + fmt(depthIn, 1).replace(/\.0$/, '') + ' inches</div>';
    d += '<div><strong>Volume</strong><br>' + fmt(cuFt, 1) + ' ft\u00B3 (' + fmt(cuYd) + ' yd\u00B3)</div>';
    d += '<div><strong>Weight</strong><br>' + fmt(weightLbs, 0) + ' lbs (' + fmt(tons) + ' tons)</div>';
    d += '<div><strong>50-lb Bags</strong><br>' + fmt(bags50, 0) + ' bags</div>';
    d += '<div><strong>Density</strong><br>' + fmt(density, 0) + ' lbs/yd\u00B3</div>';
    d += '</div>';

    d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
    d += '<strong>Cost Estimates</strong>';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem;margin-top:8px">';
    d += '<div><strong>Bulk Delivery</strong><br>' + fmtDollars(cost) + ' <span style="font-size:0.8rem;color:var(--text-light)">at $' + price + '/ton</span></div>';
    d += '<div><strong>Bagged (~$5/bag)</strong><br>' + fmtDollars(bagCost) + '</div>';
    d += '</div></div>';

    resultDetails.innerHTML = d;
    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  function hideResult() { resultEl.classList.remove('visible'); resultEl.style.display = 'none'; }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  [lengthInput, widthInput, diaInput, areaSqftInput, depthInput, priceInput].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });
  sandType.addEventListener('change', calculate);
})();
