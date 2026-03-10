(function() {
  'use strict';

  var PIECES_PER_PALLET = 45;
  var SQFT_PER_PALLET = 450;

  var chartData = [
    ['500 sq ft', '53', '2', '$150–$450'],
    ['1,000 sq ft', '105', '3', '$350–$850'],
    ['2,000 sq ft', '210', '5', '$700–$1,700'],
    ['3,000 sq ft', '315', '7', '$1,050–$2,500'],
    ['5,000 sq ft', '525', '12', '$1,800–$4,200'],
    ['10,000 sq ft', '1,050', '24', '$3,500–$8,500']
  ];

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 2;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
  function fmtDollars(n) { return '$' + fmt(n, 0).replace(/\..*/, ''); }

  var lawnLength = document.getElementById('lawnLength');
  var lawnWidth = document.getElementById('lawnWidth');
  var areaSqftInput = document.getElementById('areaSqft');
  var sodSizeSelect = document.getElementById('sodSize');
  var wastePctSelect = document.getElementById('wastePct');
  var priceInput = document.getElementById('pricePerPallet');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');
  var rPieces = document.getElementById('rPieces');
  var rPallets = document.getElementById('rPallets');
  var resultDetails = document.getElementById('resultDetails');

  var areaMode = 'rect';
  var areaToggle = document.getElementById('areaToggle');
  var areaToggleBtns = areaToggle.querySelectorAll('button');
  var rectInputs = document.getElementById('rectInputs');
  var sqftInputDiv = document.getElementById('sqftInput');

  areaToggleBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      areaToggleBtns.forEach(function(b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      areaMode = btn.dataset.mode;
      rectInputs.style.display = areaMode === 'rect' ? '' : 'none';
      sqftInputDiv.style.display = areaMode === 'sqft' ? '' : 'none';
      calculate();
    });
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
    var area;
    if (areaMode === 'rect') {
      var len = parseFloat(lawnLength.value);
      var wid = parseFloat(lawnWidth.value);
      if (isNaN(len) || isNaN(wid) || len <= 0 || wid <= 0) { hideResult(); return; }
      area = len * wid;
    } else {
      area = parseFloat(areaSqftInput.value);
      if (isNaN(area) || area <= 0) { hideResult(); return; }
    }

    var sodPieceSqft = parseFloat(sodSizeSelect.value);
    var wastePct = parseFloat(wastePctSelect.value) / 100;
    var totalSqft = area * (1 + wastePct);
    var pieces = Math.ceil(totalSqft / sodPieceSqft);

    // For standard 10 sqft pieces: 45 per pallet (450 sqft)
    // For other sizes, calculate based on area per pallet
    var piecesPerPallet;
    if (sodPieceSqft === 10) piecesPerPallet = 45;
    else if (sodPieceSqft === 6) piecesPerPallet = 75;
    else if (sodPieceSqft === 9) piecesPerPallet = 50;
    else piecesPerPallet = Math.floor(450 / sodPieceSqft); // big rolls

    var pallets = Math.ceil(pieces / piecesPerPallet);

    rPieces.textContent = fmt(pieces, 0) + ' pieces';
    rPallets.textContent = pallets + ' pallet' + (pallets === 1 ? '' : 's');

    var d = '';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem">';
    d += '<div><strong>Lawn Area</strong><br>' + fmt(area, 0) + ' sq ft</div>';
    d += '<div><strong>With ' + (wastePct * 100) + '% Waste</strong><br>' + fmt(totalSqft, 0) + ' sq ft</div>';
    d += '<div><strong>Sod Piece Size</strong><br>' + sodPieceSqft + ' sq ft each</div>';
    d += '<div><strong>Pieces Needed</strong><br>' + fmt(pieces, 0) + '</div>';
    d += '<div><strong>Pallets</strong><br>' + pallets + ' (' + piecesPerPallet + ' pieces/pallet)</div>';
    d += '<div><strong>Pallet Coverage</strong><br>' + fmt(pallets * piecesPerPallet * sodPieceSqft, 0) + ' sq ft total</div>';
    d += '</div>';

    var pricePerPallet = parseFloat(priceInput.value);
    if (!isNaN(pricePerPallet) && pricePerPallet > 0) {
      var totalCost = pallets * pricePerPallet;
      var perSqft = totalCost / area;
      d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
      d += '<strong style="font-size:0.95rem">Cost Estimates</strong>';
      d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem;margin-top:8px">';
      d += '<div><strong>Sod Material</strong><br>' + fmtDollars(totalCost) + ' <span style="font-size:0.8rem;color:var(--text-light)">' + pallets + ' pallets × ' + fmtDollars(pricePerPallet) + '</span></div>';
      d += '<div><strong>Per Sq Ft</strong><br>' + '$' + fmt(perSqft, 2) + '/sq ft</div>';
      d += '<div><strong>Delivery (est.)</strong><br>' + fmtDollars(75) + ' – ' + fmtDollars(150) + '</div>';
      d += '<div><strong>Installation (est.)</strong><br>' + fmtDollars(area * 1) + ' – ' + fmtDollars(area * 2) + ' <span style="font-size:0.8rem;color:var(--text-light)">$1-$2/sq ft</span></div>';
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

  [lawnLength, lawnWidth, areaSqftInput, priceInput].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });
  [sodSizeSelect, wastePctSelect].forEach(function(sel) { sel.addEventListener('change', calculate); });
})();
