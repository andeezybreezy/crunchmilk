(function() {
  'use strict';

  // Paver sizes: [widthIn, lengthIn, paversPerPallet]
  var paverSizes = {
    '4x8':   [4, 8, 450],
    '6x6':   [6, 6, 350],
    '6x9':   [6, 9, 275],
    '8x8':   [8, 8, 225],
    '12x12': [12, 12, 110]
  };

  var chartData = [
    ['4" × 8"', '4.5', '473', '400–500'],
    ['6" × 6"', '4.0', '420', '300–400'],
    ['6" × 9"', '2.7', '280', '250–300'],
    ['8" × 8"', '2.3', '236', '200–250'],
    ['12" × 12"', '1.0', '105', '100–120']
  ];

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 2;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
  function fmtDollars(n) { return '$' + fmt(n, 2); }

  var areaLength = document.getElementById('areaLength');
  var areaWidth = document.getElementById('areaWidth');
  var paverSizeSelect = document.getElementById('paverSize');
  var customPaverWrap = document.getElementById('customPaverWrap');
  var customPaverW = document.getElementById('customPaverW');
  var customPaverL = document.getElementById('customPaverL');
  var patternSelect = document.getElementById('pattern');
  var baseDepthSelect = document.getElementById('baseDepth');
  var priceInput = document.getElementById('pricePerPaver');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');
  var rPavers = document.getElementById('rPavers');
  var rPallets = document.getElementById('rPallets');
  var resultDetails = document.getElementById('resultDetails');

  paverSizeSelect.addEventListener('change', function() {
    customPaverWrap.style.display = paverSizeSelect.value === 'custom' ? '' : 'none';
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

  function getPaver() {
    var val = paverSizeSelect.value;
    if (val === 'custom') {
      var w = parseFloat(customPaverW.value);
      var l = parseFloat(customPaverL.value);
      if (isNaN(w) || isNaN(l) || w <= 0 || l <= 0) return null;
      return { w: w, l: l, perPallet: 200 };
    }
    var s = paverSizes[val];
    return { w: s[0], l: s[1], perPallet: s[2] };
  }

  function calculate() {
    var len = parseFloat(areaLength.value);
    var wid = parseFloat(areaWidth.value);
    if (isNaN(len) || isNaN(wid) || len <= 0 || wid <= 0) { hideResult(); return; }

    var paver = getPaver();
    if (!paver) { hideResult(); return; }

    var areaSqft = len * wid;
    var paverSqft = (paver.w * paver.l) / 144;
    var wastePct = parseFloat(patternSelect.value) / 100;
    var baseDepthIn = parseFloat(baseDepthSelect.value);

    var paversExact = areaSqft / paverSqft;
    var paversNeeded = Math.ceil(paversExact * (1 + wastePct));
    var pallets = Math.ceil(paversNeeded / paver.perPallet);

    // Base material: crushed gravel
    var baseVolCuFt = areaSqft * (baseDepthIn / 12);
    var baseTons = (baseVolCuFt * 105) / 2000; // ~105 lbs/cu ft compacted

    // Bedding sand: 1 inch
    var sandVolCuFt = areaSqft * (1 / 12);
    var sandTons = (sandVolCuFt * 100) / 2000;

    // Polymeric sand: ~50 lb bag covers 30-50 sqft
    var polySandBags = Math.ceil(areaSqft / 40);

    rPavers.textContent = fmt(paversNeeded, 0) + ' pavers';
    rPallets.textContent = pallets + ' pallet' + (pallets === 1 ? '' : 's');

    var d = '';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem">';
    d += '<div><strong>Project Area</strong><br>' + fmt(areaSqft, 1) + ' sq ft</div>';
    d += '<div><strong>Paver Size</strong><br>' + paver.w + '" × ' + paver.l + '" (' + fmt(paverSqft, 2) + ' sq ft each)</div>';
    d += '<div><strong>Pattern Waste</strong><br>' + (wastePct * 100) + '%</div>';
    d += '<div><strong>Pavers (no waste)</strong><br>' + fmt(Math.ceil(paversExact), 0) + '</div>';
    d += '<div><strong>Pavers (with waste)</strong><br>' + fmt(paversNeeded, 0) + '</div>';
    d += '<div><strong>Pallets</strong><br>' + pallets + ' (~' + paver.perPallet + '/pallet)</div>';
    d += '</div>';

    // Base materials section
    d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
    d += '<strong style="font-size:0.95rem">Base Materials</strong>';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem;margin-top:8px">';
    d += '<div><strong>Gravel Base (' + baseDepthIn + '")</strong><br>' + fmt(baseTons, 1) + ' tons (' + fmt(baseVolCuFt / 27, 1) + ' cu yd)</div>';
    d += '<div><strong>Bedding Sand (1")</strong><br>' + fmt(sandTons, 1) + ' tons (' + fmt(sandVolCuFt / 27, 1) + ' cu yd)</div>';
    d += '<div><strong>Polymeric Sand</strong><br>' + polySandBags + ' × 50-lb bag' + (polySandBags > 1 ? 's' : '') + '</div>';
    d += '<div><strong>Edge Restraint</strong><br>~' + fmt((len + wid) * 2, 0) + ' linear ft</div>';
    d += '</div></div>';

    var price = parseFloat(priceInput.value);
    if (!isNaN(price) && price > 0) {
      var paverCost = paversNeeded * price;
      d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
      d += '<strong style="font-size:0.95rem">Cost Estimates</strong>';
      d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem;margin-top:8px">';
      d += '<div><strong>Pavers</strong><br>' + fmtDollars(paverCost) + ' <span style="font-size:0.8rem;color:var(--text-light)">at ' + fmtDollars(price) + ' each</span></div>';
      d += '<div><strong>Base Materials (est.)</strong><br>' + fmtDollars(baseTons * 35 + sandTons * 40 + polySandBags * 25) + '</div>';
      d += '<div><strong>Installation (est.)</strong><br>' + fmtDollars(areaSqft * 8) + ' – ' + fmtDollars(areaSqft * 15) + ' <span style="font-size:0.8rem;color:var(--text-light)">$8-$15/sq ft</span></div>';
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

  [areaLength, areaWidth, customPaverW, customPaverL, priceInput].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });
  [paverSizeSelect, patternSelect, baseDepthSelect].forEach(function(sel) { sel.addEventListener('change', calculate); });
})();
