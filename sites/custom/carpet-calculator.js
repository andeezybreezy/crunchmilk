(function() {
  'use strict';

  var chartData = [
    ["10' × 10'", '100', '11.1', "10'"],
    ["10' × 12'", '120', '13.3', "10'"],
    ["12' × 12'", '144', '16.0', "12'"],
    ["12' × 15'", '180', '20.0', "15'"],
    ["15' × 15'", '225', '25.0', "15'"],
    ["15' × 20'", '300', '33.3', "20'"],
    ["20' × 20'", '400', '44.4', "20'"]
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
  var rollWidthSelect = document.getElementById('rollWidth');
  var seamAllowanceSelect = document.getElementById('seamAllowance');
  var priceInput = document.getElementById('pricePerYard');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');
  var rSqYards = document.getElementById('rSqYards');
  var rLinFt = document.getElementById('rLinFt');
  var resultDetails = document.getElementById('resultDetails');

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

    var rollWidth = parseFloat(rollWidthSelect.value); // feet
    var seamAllowanceIn = parseFloat(seamAllowanceSelect.value); // inches per seam
    var seamAllowanceFt = seamAllowanceIn / 12;

    // Determine carpet orientation: run carpet along the longer dimension
    // Roll width covers one direction; linear feet covers the other
    var carpetWidth, carpetRunLength;
    if (wid <= rollWidth) {
      // No seam needed across width
      carpetWidth = rollWidth;
      carpetRunLength = len;
    } else {
      // Need seams: how many strips?
      carpetWidth = rollWidth;
      carpetRunLength = len;
    }

    var numStrips = Math.ceil(wid / rollWidth);
    var seams = numStrips - 1;
    var totalSeamAllowance = seams * seamAllowanceFt;

    // Total carpet width needed with seam allowances
    var effectiveWidth = wid + totalSeamAllowance;
    var actualStrips = Math.ceil(effectiveWidth / rollWidth);

    // Linear feet of carpet needed (each strip is roomLength long)
    var linearFt = actualStrips * len;

    // Total area in sq ft
    var totalSqft = actualStrips * rollWidth * len;
    var roomSqft = len * wid;
    var sqYards = totalSqft / 9;
    var padSqft = roomSqft * 1.05; // 5% overage for pad

    rSqYards.textContent = fmt(Math.ceil(sqYards * 10) / 10, 1) + ' sq yd';
    rLinFt.textContent = fmt(linearFt, 1) + ' ft';

    var d = '';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem">';
    d += '<div><strong>Room Area</strong><br>' + fmt(roomSqft, 1) + ' sq ft</div>';
    d += '<div><strong>Roll Width</strong><br>' + rollWidth + ' ft</div>';
    d += '<div><strong>Strips Needed</strong><br>' + actualStrips + '</div>';
    d += '<div><strong>Seams</strong><br>' + (seams > 0 ? seams + ' seam' + (seams > 1 ? 's' : '') : 'None') + '</div>';
    d += '<div><strong>Total Carpet Area</strong><br>' + fmt(totalSqft, 1) + ' sq ft (' + fmt(sqYards, 1) + ' sq yd)</div>';
    d += '<div><strong>Linear Feet off Roll</strong><br>' + fmt(linearFt, 1) + ' ft</div>';
    d += '<div><strong>Carpet Pad</strong><br>' + fmt(Math.ceil(padSqft), 0) + ' sq ft (' + fmt(Math.ceil(padSqft) / 9, 1) + ' sq yd)</div>';
    var waste = totalSqft - roomSqft;
    if (waste > 0) {
      d += '<div><strong>Waste</strong><br>' + fmt(waste, 1) + ' sq ft (' + fmt(waste / totalSqft * 100, 0) + '%)</div>';
    }
    d += '</div>';

    var price = parseFloat(priceInput.value);
    if (!isNaN(price) && price > 0) {
      var carpetCost = sqYards * price;
      var padCost = (padSqft / 9) * 5; // ~$5/sq yd average
      var installCost = sqYards * 4.5; // ~$4.50/sq yd average
      d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
      d += '<strong style="font-size:0.95rem">Cost Estimates</strong>';
      d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem;margin-top:8px">';
      d += '<div><strong>Carpet</strong><br>' + fmtDollars(carpetCost) + ' <span style="font-size:0.8rem;color:var(--text-light)">at ' + fmtDollars(price) + '/sq yd</span></div>';
      d += '<div><strong>Padding</strong><br>~' + fmtDollars(padCost) + ' <span style="font-size:0.8rem;color:var(--text-light)">~$5/sq yd</span></div>';
      d += '<div><strong>Installation</strong><br>~' + fmtDollars(installCost) + ' <span style="font-size:0.8rem;color:var(--text-light)">~$4.50/sq yd</span></div>';
      d += '<div><strong>Total Estimate</strong><br>' + fmtDollars(carpetCost + padCost + installCost) + '</div>';
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

  [roomLength, roomWidth, priceInput].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });
  [rollWidthSelect, seamAllowanceSelect].forEach(function(sel) { sel.addEventListener('change', calculate); });
})();
