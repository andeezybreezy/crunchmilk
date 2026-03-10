(function() {
  'use strict';

  // Tile sizes: [widthIn, heightIn, tilesPerBox]
  var tileSizes = {
    '3x6':  [3, 6, 80],
    '4x4':  [4, 4, 90],
    '4x12': [4, 12, 36],
    '6x6':  [6, 6, 48],
    '3x12': [3, 12, 50],
    '2x4':  [2, 4, 120]
  };

  var chartData = [
    ['6 ft', '9.0', '80', '1'],
    ['8 ft', '12.0', '106', '2'],
    ['10 ft', '15.0', '132', '2'],
    ['12 ft', '18.0', '158', '2'],
    ['15 ft', '22.5', '198', '3'],
    ['20 ft', '30.0', '264', '4']
  ];

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 2;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
  function fmtDollars(n) { return '$' + fmt(n, 2); }

  var counterLength = document.getElementById('counterLength');
  var bsHeightSelect = document.getElementById('bsHeight');
  var customHeightWrap = document.getElementById('customHeightWrap');
  var customHeightInput = document.getElementById('customHeight');
  var tileSizeSelect = document.getElementById('tileSize');
  var customTileWrap = document.getElementById('customTileWrap');
  var customTileW = document.getElementById('customTileW');
  var customTileH = document.getElementById('customTileH');
  var numOutlets = document.getElementById('numOutlets');
  var windowSqft = document.getElementById('windowSqft');
  var wastePctSelect = document.getElementById('wastePct');
  var tilePriceInput = document.getElementById('tilePrice');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');
  var rTiles = document.getElementById('rTiles');
  var rBoxes = document.getElementById('rBoxes');
  var resultDetails = document.getElementById('resultDetails');

  bsHeightSelect.addEventListener('change', function() {
    customHeightWrap.style.display = bsHeightSelect.value === 'custom' ? '' : 'none';
    calculate();
  });

  tileSizeSelect.addEventListener('change', function() {
    customTileWrap.style.display = tileSizeSelect.value === 'custom' ? '' : 'none';
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

  function getTile() {
    var val = tileSizeSelect.value;
    if (val === 'custom') {
      var w = parseFloat(customTileW.value);
      var h = parseFloat(customTileH.value);
      if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return null;
      return { w: w, h: h, perBox: 50 };
    }
    var s = tileSizes[val];
    return { w: s[0], h: s[1], perBox: s[2] };
  }

  function calculate() {
    var cLen = parseFloat(counterLength.value);
    if (isNaN(cLen) || cLen <= 0) { hideResult(); return; }

    var heightIn;
    if (bsHeightSelect.value === 'custom') {
      heightIn = parseFloat(customHeightInput.value);
    } else {
      heightIn = parseFloat(bsHeightSelect.value);
    }
    if (isNaN(heightIn) || heightIn <= 0) { hideResult(); return; }

    var tile = getTile();
    if (!tile) { hideResult(); return; }

    var heightFt = heightIn / 12;
    var grossSqft = cLen * heightFt;

    // Deductions
    var outlets = parseInt(numOutlets.value) || 0;
    var winSqft = parseFloat(windowSqft.value) || 0;
    var outletSqft = outlets * 0.1; // ~0.1 sq ft per outlet/switch
    var netSqft = grossSqft - outletSqft - winSqft;
    if (netSqft < 0) netSqft = 0;

    var wastePct = parseFloat(wastePctSelect.value) / 100;
    var totalSqft = netSqft * (1 + wastePct);

    var tileSqft = (tile.w * tile.h) / 144;
    var tilesNeeded = Math.ceil(totalSqft / tileSqft);
    var boxes = Math.ceil(tilesNeeded / tile.perBox);
    if (boxes < 1) boxes = 1;

    rTiles.textContent = fmt(tilesNeeded, 0) + ' tiles';
    rBoxes.textContent = boxes + ' box' + (boxes === 1 ? '' : 'es');

    var d = '';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem">';
    d += '<div><strong>Counter Length</strong><br>' + fmt(cLen, 1) + ' ft</div>';
    d += '<div><strong>Backsplash Height</strong><br>' + heightIn + ' inches</div>';
    d += '<div><strong>Gross Area</strong><br>' + fmt(grossSqft, 1) + ' sq ft</div>';
    if (outletSqft > 0 || winSqft > 0) {
      d += '<div><strong>Deductions</strong><br>';
      if (outletSqft > 0) d += outlets + ' outlet' + (outlets > 1 ? 's' : '') + ' (-' + fmt(outletSqft, 1) + ' sq ft)';
      if (outletSqft > 0 && winSqft > 0) d += ', ';
      if (winSqft > 0) d += 'windows (-' + fmt(winSqft, 1) + ' sq ft)';
      d += '</div>';
    }
    d += '<div><strong>Net Area</strong><br>' + fmt(netSqft, 1) + ' sq ft</div>';
    d += '<div><strong>With ' + (wastePct * 100) + '% Waste</strong><br>' + fmt(totalSqft, 1) + ' sq ft</div>';
    d += '<div><strong>Tile Size</strong><br>' + tile.w + '" × ' + tile.h + '"</div>';
    d += '<div><strong>Boxes</strong><br>' + boxes + ' (' + tile.perBox + ' tiles/box)</div>';
    d += '</div>';

    var price = parseFloat(tilePriceInput.value);
    if (!isNaN(price) && price > 0) {
      var matCost = totalSqft * price;
      var installLow = totalSqft * 10;
      var installHigh = totalSqft * 20;
      d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
      d += '<strong style="font-size:0.95rem">Cost Estimates</strong>';
      d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem;margin-top:8px">';
      d += '<div><strong>Tile Material</strong><br>' + fmtDollars(matCost) + ' <span style="font-size:0.8rem;color:var(--text-light)">at ' + fmtDollars(price) + '/sq ft</span></div>';
      d += '<div><strong>Installation</strong><br>' + fmtDollars(installLow) + ' – ' + fmtDollars(installHigh) + ' <span style="font-size:0.8rem;color:var(--text-light)">$10-$20/sq ft</span></div>';
      d += '<div><strong>Grout + Supplies</strong><br>~' + fmtDollars(30 + totalSqft * 0.5) + '</div>';
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

  [counterLength, customHeightInput, customTileW, customTileH, numOutlets, windowSqft, tilePriceInput].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });
  [bsHeightSelect, tileSizeSelect, wastePctSelect].forEach(function(sel) { sel.addEventListener('change', calculate); });
})();
