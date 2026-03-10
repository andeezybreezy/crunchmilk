(function() {
  'use strict';

  var LBS_PER_YARD = 2200;
  var presets = [
    ['Garden Bed (10\' x 20\')', 20, 10, 4],
    ['New Lawn (30\' x 50\')', 50, 30, 6],
    ['Raised Bed (4\' x 8\')', 8, 4, 12],
    ['Topdressing (20\' x 40\')', 40, 20, 2]
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
  var sqftInputDiv = document.getElementById('sqftInput');
  var lengthInput = document.getElementById('lengthFt');
  var widthInput = document.getElementById('widthFt');
  var areaSqftInput = document.getElementById('areaSqft');
  var depthSelect = document.getElementById('depthIn');
  var customDepthWrap = document.getElementById('customDepthWrap');
  var customDepthInput = document.getElementById('customDepth');
  var priceInput = document.getElementById('priceYard');
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
    btn.innerHTML = p[0];
    btn.addEventListener('click', function() {
      areaMode = 'rect';
      areaToggleBtns.forEach(function(b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      areaToggleBtns[0].classList.add('active'); areaToggleBtns[0].setAttribute('aria-pressed', 'true');
      rectInputs.style.display = ''; sqftInputDiv.style.display = 'none';
      lengthInput.value = p[1]; widthInput.value = p[2];
      var dv = String(p[3]);
      var found = false;
      for (var i = 0; i < depthSelect.options.length; i++) {
        if (depthSelect.options[i].value === dv) { depthSelect.value = dv; found = true; break; }
      }
      if (!found) { depthSelect.value = 'custom'; customDepthWrap.style.display = ''; customDepthInput.value = p[3]; }
      else { customDepthWrap.style.display = 'none'; }
      calculate();
    });
    presetGrid.appendChild(btn);
  });

  // Chart
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    var rows = [
      ['100','1.23','1.85','2.04','1'],['250','3.09','4.63','5.09','1'],
      ['500','6.17','9.26','10.19','1'],['1,000','12.35','18.52','20.37','2'],
      ['2,500','30.86','46.30','50.93','5'],['5,000','61.73','92.59','101.85','10']
    ];
    rows.forEach(function(r) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td><td>'+r[3]+'</td><td>'+r[4]+'</td>';
      chartBody.appendChild(tr);
    });
  }

  function calculate() {
    var area;
    if (areaMode === 'rect') {
      var l = parseFloat(lengthInput.value), w = parseFloat(widthInput.value);
      if (isNaN(l) || isNaN(w) || l <= 0 || w <= 0) { hideResult(); return; }
      area = l * w;
    } else {
      area = parseFloat(areaSqftInput.value);
      if (isNaN(area) || area <= 0) { hideResult(); return; }
    }

    var depthIn = depthSelect.value === 'custom' ? parseFloat(customDepthInput.value) : parseFloat(depthSelect.value);
    if (isNaN(depthIn) || depthIn <= 0) { hideResult(); return; }

    var price = parseFloat(priceInput.value) || 35;

    var cuFt = area * depthIn / 12;
    var cuYd = cuFt / 27;
    var weightLbs = cuYd * LBS_PER_YARD;
    var tons = weightLbs / 2000;
    var bags40lb = Math.ceil(cuFt / 0.75); // 40lb bag ≈ 0.75 cu ft
    var truckloads = Math.ceil(cuYd / 10);
    var cost = cuYd * price;

    rYards.textContent = fmt(cuYd) + ' yd\u00B3';
    rTons.textContent = fmt(tons) + ' tons';

    var d = '';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem">';
    d += '<div><strong>Area</strong><br>' + fmt(area, 0) + ' sq ft</div>';
    d += '<div><strong>Depth</strong><br>' + fmt(depthIn, 1).replace(/\.0$/, '') + ' inches</div>';
    d += '<div><strong>Volume</strong><br>' + fmt(cuFt, 1) + ' ft\u00B3 (' + fmt(cuYd) + ' yd\u00B3)</div>';
    d += '<div><strong>Weight</strong><br>' + fmt(weightLbs, 0) + ' lbs (' + fmt(tons) + ' tons)</div>';
    d += '<div><strong>40-lb Bags</strong><br>' + fmt(bags40lb, 0) + ' bags</div>';
    d += '<div><strong>Truckloads</strong><br>' + truckloads + ' <span style="font-size:0.8rem;color:var(--text-light)">(10 yd\u00B3 trucks)</span></div>';
    d += '</div>';

    d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
    d += '<strong>Cost Estimate</strong>';
    d += '<div style="font-size:0.9rem;margin-top:8px">';
    d += '<div><strong>Bulk Delivery</strong><br>' + fmtDollars(cost) + ' <span style="font-size:0.8rem;color:var(--text-light)">at $' + price + '/yd\u00B3</span></div>';
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

  [lengthInput, widthInput, areaSqftInput, customDepthInput, priceInput].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });
  depthSelect.addEventListener('change', calculate);
})();
