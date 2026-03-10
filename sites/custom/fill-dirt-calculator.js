(function() {
  'use strict';

  var LBS_PER_YARD = 2000;
  var presets = [
    ['Grade Around House', 60, 6, 6, 20],
    ['Fill Low Spot (10\' x 10\')', 10, 10, 12, 20],
    ['Raise Yard (20\' x 40\')', 40, 20, 6, 20],
    ['Trench Backfill (2\' x 30\')', 30, 2, 24, 15]
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
  var depthInput = document.getElementById('depthIn');
  var compactionSelect = document.getElementById('compaction');
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
      depthInput.value = p[3];
      compactionSelect.value = String(p[4]);
      calculate();
    });
    presetGrid.appendChild(btn);
  });

  // Chart
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    var rows = [
      ['100','1.85','2.22','2.22','1'],['250','4.63','5.56','5.56','1'],
      ['500','9.26','11.11','11.11','2'],['1,000','18.52','22.22','22.22','3'],
      ['2,500','46.30','55.56','55.56','6'],['5,000','92.59','111.11','111.11','12']
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

    var depthIn = parseFloat(depthInput.value);
    if (isNaN(depthIn) || depthIn <= 0) { hideResult(); return; }

    var compactPct = parseFloat(compactionSelect.value) / 100;
    var price = parseFloat(priceInput.value) || 15;

    var cuFt = area * depthIn / 12;
    var cuYdCompacted = cuFt / 27;
    var cuYdOrder = cuYdCompacted * (1 + compactPct);
    var weightLbs = cuYdOrder * LBS_PER_YARD;
    var tons = weightLbs / 2000;
    var truckloads = Math.ceil(cuYdOrder / 10);
    var cost = cuYdOrder * price;

    rYards.textContent = fmt(cuYdOrder) + ' yd\u00B3';
    rTons.textContent = fmt(tons) + ' tons';

    var d = '';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem">';
    d += '<div><strong>Area</strong><br>' + fmt(area, 0) + ' sq ft</div>';
    d += '<div><strong>Depth</strong><br>' + fmt(depthIn, 1).replace(/\.0$/, '') + ' inches</div>';
    d += '<div><strong>Compacted Volume</strong><br>' + fmt(cuYdCompacted) + ' yd\u00B3</div>';
    d += '<div><strong>Order Volume (+' + (compactPct * 100) + '%)</strong><br>' + fmt(cuYdOrder) + ' yd\u00B3</div>';
    d += '<div><strong>Weight</strong><br>' + fmt(weightLbs, 0) + ' lbs (' + fmt(tons) + ' tons)</div>';
    d += '<div><strong>Truckloads</strong><br>' + truckloads + ' <span style="font-size:0.8rem;color:var(--text-light)">(10 yd\u00B3 trucks)</span></div>';
    d += '</div>';

    d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
    d += '<strong>Cost Estimate</strong>';
    d += '<div style="font-size:0.9rem;margin-top:8px">';
    d += fmtDollars(cost) + ' <span style="font-size:0.8rem;color:var(--text-light)">at $' + price + '/yd\u00B3 (+ delivery)</span>';
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

  [lengthInput, widthInput, areaSqftInput, depthInput, priceInput].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });
  compactionSelect.addEventListener('change', calculate);
})();
