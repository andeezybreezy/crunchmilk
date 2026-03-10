(function() {
  'use strict';

  var chartData = [
    ["10' × 10'", '100', '110', '6'],
    ["10' × 12'", '120', '132', '7'],
    ["12' × 12'", '144', '158', '8'],
    ["12' × 15'", '180', '198', '10'],
    ["15' × 15'", '225', '248', '13'],
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
  var layoutType = document.getElementById('layoutType');
  var boxSizeSelect = document.getElementById('boxSize');
  var customBoxWrap = document.getElementById('customBoxWrap');
  var customBoxSize = document.getElementById('customBoxSize');
  var stairTreads = document.getElementById('stairTreads');
  var priceInput = document.getElementById('pricePerSqft');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');
  var rSqft = document.getElementById('rSqft');
  var rBoxes = document.getElementById('rBoxes');
  var resultDetails = document.getElementById('resultDetails');

  boxSizeSelect.addEventListener('change', function() {
    customBoxWrap.style.display = boxSizeSelect.value === 'custom' ? '' : 'none';
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

  function calculate() {
    var len = parseFloat(roomLength.value);
    var wid = parseFloat(roomWidth.value);
    if (isNaN(len) || isNaN(wid) || len <= 0 || wid <= 0) { hideResult(); return; }

    var areaSqft = len * wid;
    var wastePct = parseFloat(layoutType.value) / 100;

    // Stairs
    var treads = parseInt(stairTreads.value) || 0;
    var stairSqft = treads * 3;

    var totalSqft = (areaSqft + stairSqft) * (1 + wastePct);
    var totalRounded = Math.ceil(totalSqft);

    // Box size
    var boxSqft;
    if (boxSizeSelect.value === 'custom') {
      boxSqft = parseFloat(customBoxSize.value);
      if (isNaN(boxSqft) || boxSqft <= 0) boxSqft = 20;
    } else {
      boxSqft = parseFloat(boxSizeSelect.value);
    }
    var boxes = Math.ceil(totalRounded / boxSqft);

    rSqft.textContent = fmt(totalRounded, 0) + ' sq ft';
    rBoxes.textContent = boxes + ' box' + (boxes === 1 ? '' : 'es');

    var d = '';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem">';
    d += '<div><strong>Room Area</strong><br>' + fmt(areaSqft, 1) + ' sq ft</div>';
    d += '<div><strong>Waste Factor</strong><br>' + (wastePct * 100) + '%</div>';
    if (treads > 0) {
      d += '<div><strong>Stair Treads</strong><br>' + treads + ' treads (' + stairSqft + ' sq ft)</div>';
    }
    d += '<div><strong>Total with Waste</strong><br>' + fmt(totalRounded, 0) + ' sq ft</div>';
    d += '<div><strong>Boxes</strong><br>' + boxes + ' × ' + boxSqft + ' sq ft/box</div>';
    d += '<div><strong>Actual Coverage</strong><br>' + fmt(boxes * boxSqft, 0) + ' sq ft (from boxes)</div>';
    d += '</div>';

    var price = parseFloat(priceInput.value);
    if (!isNaN(price) && price > 0) {
      var matCost = totalRounded * price;
      var installLow = totalRounded * 3;
      var installHigh = totalRounded * 7;
      d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
      d += '<strong style="font-size:0.95rem">Cost Estimates</strong>';
      d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem;margin-top:8px">';
      d += '<div><strong>Material</strong><br>' + fmtDollars(matCost) + ' <span style="font-size:0.8rem;color:var(--text-light)">at ' + fmtDollars(price) + '/sq ft</span></div>';
      d += '<div><strong>Installation</strong><br>' + fmtDollars(installLow) + ' – ' + fmtDollars(installHigh) + ' <span style="font-size:0.8rem;color:var(--text-light)">($3-$7/sq ft)</span></div>';
      d += '<div><strong>Total (Material + Install)</strong><br>' + fmtDollars(matCost + installLow) + ' – ' + fmtDollars(matCost + installHigh) + '</div>';
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

  [roomLength, roomWidth, customBoxSize, stairTreads, priceInput].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });
  [layoutType, boxSizeSelect].forEach(function(sel) { sel.addEventListener('change', calculate); });
})();
