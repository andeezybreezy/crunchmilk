(function() {
  'use strict';

  // plankSize: [widthIn, lengthIn, planksPerBox, sqftPerBox]
  var plankSizes = {
    '5x48':  [5, 48, 8, 13.3],
    '7x48':  [7, 48, 8, 18.7],
    '8x48':  [8, 48, 7, 18.7],
    '5x36':  [5, 36, 10, 12.5],
    '7x60':  [7, 60, 6, 17.5]
  };

  var chartData = [
    ["8' × 10'", '80', '88', '5'],
    ["10' × 12'", '120', '132', '7'],
    ["12' × 12'", '144', '158', '8'],
    ["12' × 14'", '168', '185', '10'],
    ["14' × 16'", '224', '246', '13'],
    ["15' × 20'", '300', '330', '17'],
    ["20' × 20'", '400', '440', '22']
  ];

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 2;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
  function fmtDollars(n) { return '$' + fmt(n, 2); }

  var roomLength = document.getElementById('roomLength');
  var roomWidth = document.getElementById('roomWidth');
  var plankSizeSelect = document.getElementById('plankSize');
  var customPlankWrap = document.getElementById('customPlankWrap');
  var customPlankW = document.getElementById('customPlankW');
  var customPlankL = document.getElementById('customPlankL');
  var wastePctSelect = document.getElementById('wastePct');
  var priceInput = document.getElementById('pricePerSqft');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');
  var rSqft = document.getElementById('rSqft');
  var rBoxes = document.getElementById('rBoxes');
  var resultDetails = document.getElementById('resultDetails');

  plankSizeSelect.addEventListener('change', function() {
    customPlankWrap.style.display = plankSizeSelect.value === 'custom' ? '' : 'none';
    calculate();
  });

  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function getPlank() {
    var val = plankSizeSelect.value;
    if (val === 'custom') {
      var w = parseFloat(customPlankW.value);
      var l = parseFloat(customPlankL.value);
      if (isNaN(w) || isNaN(l) || w <= 0 || l <= 0) return null;
      var plankSqft = (w * l) / 144;
      var ppb = Math.round(20 / plankSqft);
      return { w: w, l: l, perBox: ppb, sqftPerBox: ppb * plankSqft, plankSqft: plankSqft };
    }
    var s = plankSizes[val];
    var plankSqft = (s[0] * s[1]) / 144;
    return { w: s[0], l: s[1], perBox: s[2], sqftPerBox: s[3], plankSqft: plankSqft };
  }

  function calculate() {
    var len = parseFloat(roomLength.value);
    var wid = parseFloat(roomWidth.value);
    if (isNaN(len) || isNaN(wid) || len <= 0 || wid <= 0) { hideResult(); return; }

    var plank = getPlank();
    if (!plank) { hideResult(); return; }

    var areaSqft = len * wid;
    var wastePct = parseFloat(wastePctSelect.value) / 100;
    var totalSqft = Math.ceil(areaSqft * (1 + wastePct));
    var totalPlanks = Math.ceil(totalSqft / plank.plankSqft);
    var boxes = Math.ceil(totalPlanks / plank.perBox);

    rSqft.textContent = fmt(totalSqft, 0) + ' sq ft';
    rBoxes.textContent = boxes + ' box' + (boxes === 1 ? '' : 'es');

    var d = '';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem">';
    d += '<div><strong>Room Area</strong><br>' + fmt(areaSqft, 1) + ' sq ft</div>';
    d += '<div><strong>Plank Size</strong><br>' + plank.w + '" × ' + plank.l + '" (' + fmt(plank.plankSqft, 2) + ' sq ft each)</div>';
    d += '<div><strong>Waste Factor</strong><br>' + (wastePct * 100) + '%</div>';
    d += '<div><strong>Total Sq Ft</strong><br>' + fmt(totalSqft, 0) + ' sq ft</div>';
    d += '<div><strong>Total Planks</strong><br>' + fmt(totalPlanks, 0) + '</div>';
    d += '<div><strong>Boxes</strong><br>' + boxes + ' (' + plank.perBox + ' planks/box, ~' + fmt(plank.sqftPerBox, 1) + ' sq ft/box)</div>';
    d += '</div>';

    var price = parseFloat(priceInput.value);
    if (!isNaN(price) && price > 0) {
      var matCost = totalSqft * price;
      var installLow = totalSqft * 2;
      var installHigh = totalSqft * 4;
      d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
      d += '<strong style="font-size:0.95rem">Cost Estimates</strong>';
      d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem;margin-top:8px">';
      d += '<div><strong>Material</strong><br>' + fmtDollars(matCost) + ' <span style="font-size:0.8rem;color:var(--text-light)">at ' + fmtDollars(price) + '/sq ft</span></div>';
      d += '<div><strong>Installation</strong><br>' + fmtDollars(installLow) + ' – ' + fmtDollars(installHigh) + ' <span style="font-size:0.8rem;color:var(--text-light)">($2-$4/sq ft)</span></div>';
      d += '<div><strong>Underlayment</strong><br>' + fmtDollars(totalSqft * 0.30) + ' <span style="font-size:0.8rem;color:var(--text-light)">~$0.30/sq ft</span></div>';
      d += '</div></div>';
    }

    resultDetails.innerHTML = d;
    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  function hideResult() {
    resultEl.classList.remove('visible');
    resultEl.style.display = 'none';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  [roomLength, roomWidth, customPlankW, customPlankL, priceInput].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });
  [plankSizeSelect, wastePctSelect].forEach(function(sel) { sel.addEventListener('change', calculate); });
})();
