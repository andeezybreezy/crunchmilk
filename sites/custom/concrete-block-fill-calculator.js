(function() {
  'use strict';

  // Core volumes in cubic feet per block
  var coreVolumes = { '8': 0.187, '10': 0.250, '12': 0.312 };
  // Blocks per square foot of wall face (8x16 with 3/8" mortar)
  var blocksPerSqFt = 1.125;

  var presets = [
    ['Small Wall (20\' x 4\')', 20, 4, '8', 100],
    ['Basement Wall (40\' x 8\')', 40, 8, '8', 100],
    ['Retaining Wall (30\' x 4\')', 30, 4, '12', 100],
    ['Garage Wall (60\' x 8\')', 60, 8, '8', 100]
  ];

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 2;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  var mode = 'wall';
  var modeToggle = document.getElementById('modeToggle');
  var modeBtns = modeToggle.querySelectorAll('button');
  var wallInputsDiv = document.getElementById('wallInputs');
  var countInputsDiv = document.getElementById('countInputs');
  var wallLength = document.getElementById('wallLength');
  var wallHeight = document.getElementById('wallHeight');
  var blockCount = document.getElementById('blockCount');
  var blockSize = document.getElementById('blockSize');
  var fillPercent = document.getElementById('fillPercent');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');
  var rYards = document.getElementById('rYards');
  var rBlocks = document.getElementById('rBlocks');
  var resultDetails = document.getElementById('resultDetails');

  modeBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      modeBtns.forEach(function(b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active'); btn.setAttribute('aria-pressed', 'true');
      mode = btn.dataset.mode;
      wallInputsDiv.style.display = mode === 'wall' ? '' : 'none';
      countInputsDiv.style.display = mode === 'count' ? '' : 'none';
      calculate();
    });
  });

  // Presets
  var presetGrid = document.getElementById('presetGrid');
  presets.forEach(function(p) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'preset-btn';
    btn.innerHTML = p[0];
    btn.addEventListener('click', function() {
      mode = 'wall';
      modeBtns.forEach(function(b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      modeBtns[0].classList.add('active'); modeBtns[0].setAttribute('aria-pressed', 'true');
      wallInputsDiv.style.display = '';
      countInputsDiv.style.display = 'none';
      wallLength.value = p[1];
      wallHeight.value = p[2];
      blockSize.value = p[3];
      fillPercent.value = String(p[4]);
      calculate();
    });
    presetGrid.appendChild(btn);
  });

  // Chart
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    var rows = [
      ['8" CMU','0.187','0.0069','0.69','34'],
      ['10" CMU','0.250','0.0093','0.93','45'],
      ['12" CMU','0.312','0.0116','1.16','56']
    ];
    rows.forEach(function(r) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td><td>'+r[3]+'</td><td>'+r[4]+'</td>';
      chartBody.appendChild(tr);
    });
  }

  function calculate() {
    var size = blockSize.value;
    var volPerBlock = coreVolumes[size];
    var fillPct = parseFloat(fillPercent.value) / 100;
    var numBlocks;

    if (mode === 'wall') {
      var len = parseFloat(wallLength.value);
      var ht = parseFloat(wallHeight.value);
      if (isNaN(len) || isNaN(ht) || len <= 0 || ht <= 0) { hideResult(); return; }
      numBlocks = Math.ceil(len * ht * blocksPerSqFt);
    } else {
      numBlocks = parseInt(blockCount.value);
      if (isNaN(numBlocks) || numBlocks <= 0) { hideResult(); return; }
    }

    var totalCuFt = numBlocks * volPerBlock * fillPct;
    var totalCuYd = totalCuFt / 27;
    var totalCuYdExtra = totalCuYd * 1.1;
    var bags80 = Math.ceil(totalCuFt / 0.6);

    rYards.textContent = fmt(totalCuYd) + ' yd\u00B3';
    rBlocks.textContent = fmt(numBlocks, 0) + ' blocks';

    var d = '';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem">';
    d += '<div><strong>Block Size</strong><br>' + size + '" CMU</div>';
    d += '<div><strong>Fill Level</strong><br>' + (fillPct * 100) + '%</div>';
    d += '<div><strong>Total Fill Volume</strong><br>' + fmt(totalCuFt, 1) + ' ft\u00B3</div>';
    d += '<div><strong>With 10% Overage</strong><br>' + fmt(totalCuYdExtra) + ' yd\u00B3</div>';
    d += '</div>';

    d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
    d += '<strong>Material Estimates</strong>';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem;margin-top:8px">';
    d += '<div><strong>80-lb Bags Grout</strong><br>' + bags80 + ' bags</div>';
    d += '<div><strong>Weight (approx)</strong><br>' + fmt(totalCuFt * 150, 0) + ' lbs</div>';
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

  [wallLength, wallHeight, blockCount].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });
  [blockSize, fillPercent].forEach(function(sel) { sel.addEventListener('change', calculate); });
})();
