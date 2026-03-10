(function() {
  'use strict';

  var presets = [
    ['Deck Pier (12" x 48")', 12, 48, 4],
    ['Fence Post (8" x 36")', 8, 36, 10],
    ['Large Pier (18" x 48")', 18, 48, 2],
    ['Porch Column (16" x 42")', 16, 42, 6]
  ];

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 2;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
  function fmtDollars(n) { return '$' + fmt(n, 0).replace(/\..*/, ''); }

  var diameterSelect = document.getElementById('diameter');
  var heightInput = document.getElementById('heightIn');
  var qtyInput = document.getElementById('quantity');
  var priceInput = document.getElementById('priceYard');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');
  var rYards = document.getElementById('rYards');
  var rPerTube = document.getElementById('rPerTube');
  var resultDetails = document.getElementById('resultDetails');

  // Presets
  var presetGrid = document.getElementById('presetGrid');
  presets.forEach(function(p) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'preset-btn';
    btn.innerHTML = p[0] + '<span>' + p[3] + ' tubes</span>';
    btn.addEventListener('click', function() {
      diameterSelect.value = String(p[1]);
      heightInput.value = p[2];
      qtyInput.value = p[3];
      calculate();
    });
    presetGrid.appendChild(btn);
  });

  // Chart
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    var rows = [
      ['6"','0.07','0.10','0.12','1'],['8"','0.12','0.17','0.22','1'],
      ['10"','0.19','0.27','0.34','1'],['12"','0.28','0.39','0.49','1'],
      ['14"','0.37','0.53','0.67','1'],['16"','0.47','0.70','0.87','2'],
      ['18"','0.59','0.88','1.10','2'],['20"','0.73','1.09','1.36','2'],
      ['24"','1.05','1.57','1.96','3']
    ];
    rows.forEach(function(r) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td><td>'+r[3]+'</td><td>'+r[4]+'</td>';
      chartBody.appendChild(tr);
    });
  }

  function calculate() {
    var dia = parseFloat(diameterSelect.value);
    var heightIn = parseFloat(heightInput.value);
    var qty = parseInt(qtyInput.value) || 1;
    var price = parseFloat(priceInput.value) || 125;

    if (isNaN(dia) || isNaN(heightIn) || dia <= 0 || heightIn <= 0) { hideResult(); return; }

    var radiusFt = (dia / 2) / 12;
    var heightFt = heightIn / 12;
    var cuFtEach = Math.PI * radiusFt * radiusFt * heightFt;
    var totalCuFt = cuFtEach * qty;
    var totalCuYd = totalCuFt / 27;
    var totalCuYdExtra = totalCuYd * 1.1;

    var bags60 = Math.ceil(totalCuFt / 0.45);
    var bags80 = Math.ceil(totalCuFt / 0.6);
    var cost = totalCuYdExtra * price;

    rYards.textContent = fmt(totalCuYd) + ' yd\u00B3';
    rPerTube.textContent = fmt(cuFtEach, 2) + ' ft\u00B3';

    var d = '';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem">';
    d += '<div><strong>Per Tube</strong><br>' + fmt(cuFtEach, 2) + ' ft\u00B3 (' + fmt(cuFtEach / 27, 4) + ' yd\u00B3)</div>';
    d += '<div><strong>Quantity</strong><br>' + qty + ' tube' + (qty > 1 ? 's' : '') + '</div>';
    d += '<div><strong>Total Volume</strong><br>' + fmt(totalCuFt, 1) + ' ft\u00B3 (' + fmt(totalCuYd) + ' yd\u00B3)</div>';
    d += '<div><strong>With 10% Overage</strong><br>' + fmt(totalCuYdExtra) + ' yd\u00B3</div>';
    d += '</div>';

    d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
    d += '<strong>Bag Estimates (total)</strong>';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem;margin-top:8px">';
    d += '<div><strong>60-lb Bags</strong><br>' + bags60 + ' bags</div>';
    d += '<div><strong>80-lb Bags</strong><br>' + bags80 + ' bags</div>';
    d += '</div></div>';

    d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
    d += '<strong>Cost Estimate</strong>';
    d += '<div style="font-size:0.9rem;margin-top:8px">' + fmtDollars(cost) + ' <span style="font-size:0.8rem;color:var(--text-light)">ready-mix at $' + price + '/yd\u00B3 (with overage)</span></div>';
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

  [heightInput, qtyInput, priceInput].forEach(function(inp) {
    inp.addEventListener('input', calculate);
    inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
  diameterSelect.addEventListener('change', calculate);
})();
