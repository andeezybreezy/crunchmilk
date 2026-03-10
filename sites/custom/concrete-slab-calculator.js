(function() {
  'use strict';

  var presets = [
    ['Sidewalk', 20, 4, 4, '4\' x 20\' at 4"'],
    ['Patio', 12, 12, 4, '12\' x 12\' at 4"'],
    ['Garage Floor', 24, 20, 6, '20\' x 24\' at 6"'],
    ['Driveway', 40, 10, 4, '10\' x 40\' at 4"']
  ];

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 2;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  function fmtDollars(n) { return '$' + fmt(n, 0).replace(/\..*/, ''); }

  var lengthInput = document.getElementById('lengthFt');
  var widthInput = document.getElementById('widthFt');
  var depthSelect = document.getElementById('depthIn');
  var customDepthWrap = document.getElementById('customDepthWrap');
  var customDepthInput = document.getElementById('customDepth');
  var priceInput = document.getElementById('priceYard');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');
  var rYards = document.getElementById('rYards');
  var rFeet = document.getElementById('rFeet');
  var resultDetails = document.getElementById('resultDetails');

  depthSelect.addEventListener('change', function() {
    if (depthSelect.value === 'custom') {
      customDepthWrap.style.display = '';
      customDepthInput.focus();
    } else {
      customDepthWrap.style.display = 'none';
    }
    calculate();
  });

  // Render presets
  var presetGrid = document.getElementById('presetGrid');
  presets.forEach(function(p) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'preset-btn';
    btn.innerHTML = p[0] + '<span>' + p[4] + '</span>';
    btn.addEventListener('click', function() {
      lengthInput.value = p[1];
      widthInput.value = p[2];
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

  // Render chart
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    var chartData = [
      ['4\' x 20\'', '0.99', '1.48', '45'],
      ['10\' x 10\'', '1.24', '1.85', '56'],
      ['10\' x 20\'', '2.47', '3.70', '111'],
      ['12\' x 12\'', '1.78', '2.67', '80'],
      ['12\' x 24\'', '3.56', '5.33', '160'],
      ['20\' x 24\'', '5.93', '8.89', '267'],
      ['10\' x 40\'', '4.94', '7.41', '222']
    ];
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function calculate() {
    var len = parseFloat(lengthInput.value);
    var wid = parseFloat(widthInput.value);
    if (isNaN(len) || isNaN(wid) || len <= 0 || wid <= 0) { hideResult(); return; }

    var depthIn = depthSelect.value === 'custom' ? parseFloat(customDepthInput.value) : parseFloat(depthSelect.value);
    if (isNaN(depthIn) || depthIn <= 0) { hideResult(); return; }

    var price = parseFloat(priceInput.value) || 125;

    var area = len * wid;
    var cuFt = area * depthIn / 12;
    var cuYd = cuFt / 27;
    var cuYdExtra = cuYd * 1.1; // 10% overage

    var bags60 = Math.ceil(cuFt / 0.45); // 60lb bag = 0.45 cu ft
    var bags80 = Math.ceil(cuFt / 0.6);  // 80lb bag = 0.6 cu ft

    var cost = cuYdExtra * price;

    rYards.textContent = fmt(cuYd) + ' yd\u00B3';
    rFeet.textContent = fmt(cuFt, 1) + ' ft\u00B3';

    var d = '';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem">';
    d += '<div><strong>Area</strong><br>' + fmt(area, 0) + ' sq ft</div>';
    d += '<div><strong>Depth</strong><br>' + fmt(depthIn, 1).replace(/\.0$/, '') + ' inches</div>';
    d += '<div><strong>With 10% Overage</strong><br>' + fmt(cuYdExtra) + ' yd\u00B3</div>';
    d += '<div><strong>Weight (approx)</strong><br>' + fmt(cuYd * 4050, 0) + ' lbs</div>';
    d += '</div>';

    d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
    d += '<strong>Bag Estimates</strong>';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem;margin-top:8px">';
    d += '<div><strong>60-lb Bags</strong><br>' + bags60 + ' bags</div>';
    d += '<div><strong>80-lb Bags</strong><br>' + bags80 + ' bags</div>';
    d += '</div></div>';

    d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
    d += '<strong>Cost Estimate</strong>';
    d += '<div style="font-size:0.9rem;margin-top:8px">';
    d += '<div><strong>Ready-Mix (with overage)</strong><br>' + fmtDollars(cost) + ' <span style="font-size:0.8rem;color:var(--text-light)">at $' + price + '/yd\u00B3</span></div>';
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

  [lengthInput, widthInput, customDepthInput, priceInput].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });
  depthSelect.addEventListener('change', calculate);
})();
