(function() {
  'use strict';

  var presets = [
    ['Flower Bed', 'rect', 20, 4, 3, '4\' x 20\' at 3"'],
    ['Tree Ring', 'circle', 6, 0, 3, '6\' diameter at 3"'],
    ['Garden', 'rect', 20, 10, 3, '10\' x 20\' at 3"'],
    ['Large Bed', 'rect', 40, 6, 3, '6\' x 40\' at 3"']
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
  var depthSelect = document.getElementById('depthIn');
  var customDepthWrap = document.getElementById('customDepthWrap');
  var customDepthInput = document.getElementById('customDepth');
  var priceInput = document.getElementById('priceYard');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');
  var rYards = document.getElementById('rYards');
  var rBags = document.getElementById('rBags');
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

  depthSelect.addEventListener('change', function() {
    customDepthWrap.style.display = depthSelect.value === 'custom' ? '' : 'none';
    calculate();
  });

  // Presets
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

      var dv = String(p[4]);
      var found = false;
      for (var i = 0; i < depthSelect.options.length; i++) {
        if (depthSelect.options[i].value === dv) { depthSelect.value = dv; found = true; break; }
      }
      if (!found) { depthSelect.value = 'custom'; customDepthWrap.style.display = ''; customDepthInput.value = p[4]; }
      else { customDepthWrap.style.display = 'none'; }
      calculate();
    });
    presetGrid.appendChild(btn);
  });

  // Chart
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    var rows = [
      ['50','0.31','0.46','0.62','7'],['100','0.62','0.93','1.23','14'],
      ['200','1.23','1.85','2.47','28'],['500','3.09','4.63','6.17','69'],
      ['1,000','6.17','9.26','12.35','139'],['2,000','12.35','18.52','24.69','278']
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
      if (isNaN(a) || a <= 0) return NaN;
      return a;
    }
  }

  function calculate() {
    var area = getArea();
    if (isNaN(area)) { hideResult(); return; }

    var depthIn = depthSelect.value === 'custom' ? parseFloat(customDepthInput.value) : parseFloat(depthSelect.value);
    if (isNaN(depthIn) || depthIn <= 0) { hideResult(); return; }

    var price = parseFloat(priceInput.value) || 40;

    var cuFt = area * depthIn / 12;
    var cuYd = cuFt / 27;
    var bags = Math.ceil(cuFt / 2); // 2 cu ft bags
    var cost = cuYd * price;
    var bagCost = bags * 5.50; // ~$5.50 per bag avg

    rYards.textContent = fmt(cuYd) + ' yd\u00B3';
    rBags.textContent = bags + ' bags';

    var d = '';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem">';
    d += '<div><strong>Area</strong><br>' + fmt(area, 0) + ' sq ft</div>';
    d += '<div><strong>Depth</strong><br>' + fmt(depthIn, 1).replace(/\.0$/, '') + ' inches</div>';
    d += '<div><strong>Volume</strong><br>' + fmt(cuFt, 1) + ' ft\u00B3 (' + fmt(cuYd) + ' yd\u00B3)</div>';
    d += '<div><strong>Bags (2 cu ft)</strong><br>' + bags + ' bags</div>';
    d += '</div>';

    d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
    d += '<strong>Cost Estimates</strong>';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem;margin-top:8px">';
    d += '<div><strong>Bulk Delivery</strong><br>' + fmtDollars(cost) + ' <span style="font-size:0.8rem;color:var(--text-light)">at $' + price + '/yd\u00B3</span></div>';
    d += '<div><strong>Bagged (~$5.50/bag)</strong><br>' + fmtDollars(bagCost) + '</div>';
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

  [lengthInput, widthInput, diaInput, areaSqftInput, customDepthInput, priceInput].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });
  depthSelect.addEventListener('change', calculate);
})();
