(function() {
  'use strict';

  // Tile size map: [widthIn, heightIn, tilesPerBox]
  var tileSizes = {
    '4x4':   [4, 4, 90],
    '6x6':   [6, 6, 48],
    '12x12': [12, 12, 12],
    '12x24': [12, 24, 7],
    '18x18': [18, 18, 5],
    '24x24': [24, 24, 4]
  };

  var chartData = [
    ['4" × 4"', '0.11', '900', '80–100'],
    ['6" × 6"', '0.25', '400', '44–50'],
    ['12" × 12"', '1.00', '100', '10–14'],
    ['12" × 24"', '2.00', '50', '6–8'],
    ['18" × 18"', '2.25', '45', '5–6'],
    ['24" × 24"', '4.00', '25', '3–4']
  ];

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 2;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  function fmtDollars(n) { return '$' + fmt(n, 2); }

  // DOM refs
  var roomLength = document.getElementById('roomLength');
  var roomWidth = document.getElementById('roomWidth');
  var tileSizeSelect = document.getElementById('tileSize');
  var customTileWrap = document.getElementById('customTileWrap');
  var customTileW = document.getElementById('customTileW');
  var customTileH = document.getElementById('customTileH');
  var wastePctSelect = document.getElementById('wastePct');
  var tilePriceInput = document.getElementById('tilePrice');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');
  var rTiles = document.getElementById('rTiles');
  var rBoxes = document.getElementById('rBoxes');
  var resultDetails = document.getElementById('resultDetails');

  tileSizeSelect.addEventListener('change', function() {
    customTileWrap.style.display = tileSizeSelect.value === 'custom' ? '' : 'none';
    calculate();
  });

  // Chart
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function getTileDims() {
    var val = tileSizeSelect.value;
    if (val === 'custom') {
      var w = parseFloat(customTileW.value);
      var h = parseFloat(customTileH.value);
      if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return null;
      return { w: w, h: h, perBox: 10 };
    }
    var s = tileSizes[val];
    return { w: s[0], h: s[1], perBox: s[2] };
  }

  function calculate() {
    var len = parseFloat(roomLength.value);
    var wid = parseFloat(roomWidth.value);
    if (isNaN(len) || isNaN(wid) || len <= 0 || wid <= 0) { hideResult(); return; }

    var tile = getTileDims();
    if (!tile) { hideResult(); return; }

    var areaSqft = len * wid;
    var tileAreaSqft = (tile.w * tile.h) / 144;
    var wastePct = parseFloat(wastePctSelect.value) / 100;

    var tilesExact = areaSqft / tileAreaSqft;
    var tilesWithWaste = Math.ceil(tilesExact * (1 + wastePct));
    var boxes = Math.ceil(tilesWithWaste / tile.perBox);

    // Grout estimate: rough formula based on joint volume
    // lbs = (area_sqft * grout_factor). Factor depends on tile size.
    var perimeterPerTile = 2 * (tile.w + tile.h); // inches
    var groutLineWidth = 0.125; // 1/8 inch typical
    var tileThickness = 0.25; // 1/4 inch typical
    var groutVolPerTile = perimeterPerTile * groutLineWidth * tileThickness; // cubic inches
    var totalGroutVolCuIn = groutVolPerTile * tilesWithWaste;
    var groutLbs = totalGroutVolCuIn * 0.0434; // ~density factor
    var groutBags = Math.ceil(groutLbs / 25);
    if (groutBags < 1) groutBags = 1;

    rTiles.textContent = fmt(tilesWithWaste, 0) + ' tiles';
    rBoxes.textContent = boxes + (boxes === 1 ? ' box' : ' boxes');

    var d = '';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem">';
    d += '<div><strong>Room Area</strong><br>' + fmt(areaSqft, 1) + ' sq ft</div>';
    d += '<div><strong>Tile Size</strong><br>' + tile.w + '" × ' + tile.h + '" (' + fmt(tileAreaSqft, 2) + ' sq ft each)</div>';
    d += '<div><strong>Tiles (no waste)</strong><br>' + Math.ceil(tilesExact) + ' tiles</div>';
    d += '<div><strong>Tiles (with ' + (wastePct * 100) + '% waste)</strong><br>' + tilesWithWaste + ' tiles</div>';
    d += '<div><strong>Boxes</strong><br>' + boxes + ' boxes (' + tile.perBox + ' tiles/box)</div>';
    d += '<div><strong>Grout Estimate</strong><br>' + fmt(groutLbs, 1) + ' lbs (~' + groutBags + ' × 25-lb bag' + (groutBags > 1 ? 's' : '') + ')</div>';
    d += '</div>';

    var price = parseFloat(tilePriceInput.value);
    if (!isNaN(price) && price > 0) {
      d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
      d += '<strong style="font-size:0.95rem">Cost Estimate</strong>';
      d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem;margin-top:8px">';
      d += '<div><strong>Tile Cost</strong><br>' + fmtDollars(tilesWithWaste * price) + ' <span style="font-size:0.8rem;color:var(--text-light)">at ' + fmtDollars(price) + '/tile</span></div>';
      d += '<div><strong>Per Sq Ft</strong><br>' + fmtDollars((tilesWithWaste * price) / areaSqft) + '/sq ft</div>';
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
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  [roomLength, roomWidth, customTileW, customTileH, tilePriceInput].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });
  [tileSizeSelect, wastePctSelect].forEach(function(sel) { sel.addEventListener('change', calculate); });
})();
