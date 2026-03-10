(function() {
  'use strict';

  // [name, shape, dim1, dim2, depth, qty, desc]
  // round: dim1=diameter(in), dim2=unused; rect: dim1=width(in), dim2=length(ft)
  var presets = [
    ['Deck Footing', 'round', 12, 0, 42, 1, '12" dia x 42" deep'],
    ['Fence Post', 'round', 8, 0, 36, 1, '8" dia x 36" deep'],
    ['Wall Footing', 'rect', 16, 20, 8, 1, '16"W x 8"D x 20\'L'],
    ['Large Pier', 'round', 18, 0, 48, 1, '18" dia x 48" deep']
  ];

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 2;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
  function fmtDollars(n) { return '$' + fmt(n, 0).replace(/\..*/, ''); }

  var shape = 'round';
  var shapeToggle = document.getElementById('shapeToggle');
  var shapeBtns = shapeToggle.querySelectorAll('button');
  var roundInputs = document.getElementById('roundInputs');
  var rectInputs = document.getElementById('rectInputs');

  var diameterSelect = document.getElementById('diameter');
  var customDiaWrap = document.getElementById('customDiaWrap');
  var customDiaInput = document.getElementById('customDia');
  var footingW = document.getElementById('footingW');
  var footingL = document.getElementById('footingL');
  var depthInput = document.getElementById('depthIn');
  var qtyInput = document.getElementById('quantity');
  var priceInput = document.getElementById('priceYard');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');
  var rYards = document.getElementById('rYards');
  var rFeet = document.getElementById('rFeet');
  var resultDetails = document.getElementById('resultDetails');

  shapeBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      shapeBtns.forEach(function(b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active'); btn.setAttribute('aria-pressed', 'true');
      shape = btn.dataset.mode;
      roundInputs.style.display = shape === 'round' ? '' : 'none';
      rectInputs.style.display = shape === 'rect' ? '' : 'none';
      calculate();
    });
  });

  diameterSelect.addEventListener('change', function() {
    customDiaWrap.style.display = diameterSelect.value === 'custom' ? '' : 'none';
    calculate();
  });

  // Presets
  var presetGrid = document.getElementById('presetGrid');
  presets.forEach(function(p) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'preset-btn';
    btn.innerHTML = p[0] + '<span>' + p[6] + '</span>';
    btn.addEventListener('click', function() {
      // Set shape
      shape = p[1];
      shapeBtns.forEach(function(b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      shapeBtns.forEach(function(b) { if (b.dataset.mode === shape) { b.classList.add('active'); b.setAttribute('aria-pressed', 'true'); } });
      roundInputs.style.display = shape === 'round' ? '' : 'none';
      rectInputs.style.display = shape === 'rect' ? '' : 'none';

      if (shape === 'round') {
        var dv = String(p[2]);
        var found = false;
        for (var i = 0; i < diameterSelect.options.length; i++) {
          if (diameterSelect.options[i].value === dv) { diameterSelect.value = dv; found = true; break; }
        }
        if (!found) { diameterSelect.value = 'custom'; customDiaWrap.style.display = ''; customDiaInput.value = p[2]; }
        else { customDiaWrap.style.display = 'none'; }
      } else {
        footingW.value = p[2];
        footingL.value = p[3] || 20;
      }
      depthInput.value = p[4];
      qtyInput.value = p[5];
      calculate();
    });
    presetGrid.appendChild(btn);
  });

  // Chart
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    var rows = [
      ['8"','0.12','0.14','0.17'],['10"','0.18','0.21','0.27'],['12"','0.26','0.33','0.39'],
      ['14"','0.36','0.45','0.53'],['16"','0.47','0.58','0.70'],['18"','0.59','0.74','0.88'],
      ['24"','1.05','1.31','1.57']
    ];
    rows.forEach(function(r) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td><td>'+r[3]+'</td>';
      chartBody.appendChild(tr);
    });
  }

  function calculate() {
    var depthIn = parseFloat(depthInput.value);
    var qty = parseInt(qtyInput.value) || 1;
    var price = parseFloat(priceInput.value) || 125;
    if (isNaN(depthIn) || depthIn <= 0) { hideResult(); return; }

    var cuFtEach;
    if (shape === 'round') {
      var dia = diameterSelect.value === 'custom' ? parseFloat(customDiaInput.value) : parseFloat(diameterSelect.value);
      if (isNaN(dia) || dia <= 0) { hideResult(); return; }
      var radiusFt = (dia / 2) / 12;
      var depthFt = depthIn / 12;
      cuFtEach = Math.PI * radiusFt * radiusFt * depthFt;
    } else {
      var w = parseFloat(footingW.value);
      var l = parseFloat(footingL.value);
      if (isNaN(w) || isNaN(l) || w <= 0 || l <= 0) { hideResult(); return; }
      cuFtEach = (w / 12) * l * (depthIn / 12);
    }

    var totalCuFt = cuFtEach * qty;
    var totalCuYd = totalCuFt / 27;
    var totalCuYdExtra = totalCuYd * 1.1;
    var bags60 = Math.ceil(totalCuFt / 0.45);
    var bags80 = Math.ceil(totalCuFt / 0.6);
    var cost = totalCuYdExtra * price;

    rYards.textContent = fmt(totalCuYd) + ' yd\u00B3';
    rFeet.textContent = fmt(totalCuFt, 1) + ' ft\u00B3';

    var d = '';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem">';
    d += '<div><strong>Per Footing</strong><br>' + fmt(cuFtEach, 2) + ' ft\u00B3</div>';
    d += '<div><strong>Quantity</strong><br>' + qty + ' footing' + (qty > 1 ? 's' : '') + '</div>';
    d += '<div><strong>With 10% Overage</strong><br>' + fmt(totalCuYdExtra) + ' yd\u00B3</div>';
    d += '<div><strong>Weight (approx)</strong><br>' + fmt(totalCuFt * 150, 0) + ' lbs</div>';
    d += '</div>';

    d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
    d += '<strong>Bag Estimates</strong>';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem;margin-top:8px">';
    d += '<div><strong>60-lb Bags</strong><br>' + bags60 + ' bags</div>';
    d += '<div><strong>80-lb Bags</strong><br>' + bags80 + ' bags</div>';
    d += '</div></div>';

    d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
    d += '<strong>Cost Estimate (with overage)</strong>';
    d += '<div style="font-size:0.9rem;margin-top:8px">' + fmtDollars(cost) + ' <span style="font-size:0.8rem;color:var(--text-light)">at $' + price + '/yd\u00B3</span></div>';
    d += '</div>';

    resultDetails.innerHTML = d;
    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  function hideResult() { resultEl.classList.remove('visible'); resultEl.style.display = 'none'; }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  [depthInput, qtyInput, priceInput, customDiaInput, footingW, footingL].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });
  diameterSelect.addEventListener('change', calculate);
})();
