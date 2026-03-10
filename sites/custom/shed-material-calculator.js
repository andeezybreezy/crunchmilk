(function() {
  'use strict';

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 0;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  var lengthEl = document.getElementById('shedLength');
  var widthEl = document.getElementById('shedWidth');
  var heightEl = document.getElementById('wallHeight');
  var roofEl = document.getElementById('roofStyle');
  var pitchEl = document.getElementById('roofPitch');
  var doorsEl = document.getElementById('numDoorsShed');
  var windowsEl = document.getElementById('numWindowsShed');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  // Pitch multiplier: rise/12, rafter length = run / cos(atan(rise/12))
  // Simpler: rafter multiplier for common pitches
  var pitchMultiplier = { '4': 1.054, '6': 1.118, '8': 1.202 };

  var chartData = [
    ['8x8', '38', '7', '9', '14', '4'],
    ['8x10', '42', '7', '11', '16', '5'],
    ['8x12', '46', '7', '13', '18', '5'],
    ['10x12', '50', '10', '13', '21', '6'],
    ['12x16', '62', '13', '17', '30', '9'],
    ['12x20', '70', '13', '21', '36', '11']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function getVal(el) { var v = parseFloat(el.value); return isNaN(v) ? 0 : v; }

  function calculate() {
    var len = getVal(lengthEl);   // along the ridge (length)
    var wid = getVal(widthEl);    // gable end / span
    var wallHt = getVal(heightEl);
    var roofStyle = roofEl.value;
    var pitch = getVal(pitchEl);
    var doors = parseInt(doorsEl.value, 10) || 0;
    var windows = parseInt(windowsEl.value, 10) || 0;

    if (len <= 0 || wid <= 0) return;

    var perimeter = 2 * (len + wid);
    var floorArea = len * wid;

    // --- Wall studs ---
    // Studs at 16" OC around perimeter
    var studCount = Math.ceil((perimeter * 12) / 16) + 1;
    // Corner assemblies: 4 corners x 3 studs each = 12 extra
    studCount += 12;
    // Each door: 2 king studs + 2 jack studs + 2 cripples = 6, minus the 2 studs displaced
    studCount += doors * 4;
    // Each window: 2 king + 2 jack + 2 header cripples + 2 sill cripples = 8, minus 2 displaced
    studCount += windows * 6;
    // Top and bottom plates: perimeter in 8ft boards
    var plateBoards = Math.ceil(perimeter / 8) * 3; // bottom plate + double top plate
    studCount += plateBoards;

    // --- Floor joists (2x6 at 16" OC, spanning the width) ---
    var joistCount = Math.ceil((len * 12) / 16) + 1;
    // Rim joists (2 along the length)
    joistCount += 2;

    // --- Rafters ---
    var pMult = pitchMultiplier[String(pitch)] || 1.118;
    var overhang = 1; // 1 ft overhang per side
    var rafterCount;
    var roofAreaSqFt;

    if (roofStyle === 'gable') {
      // Rafters on each side at 24" OC along the length
      var raftersPerSide = Math.ceil((len * 12) / 24) + 1;
      rafterCount = raftersPerSide * 2;
      // Rafter length: half the width + overhang, adjusted for pitch
      var rafterRun = (wid / 2) + overhang;
      var rafterLen = rafterRun * pMult;
      roofAreaSqFt = rafterLen * (len + 2 * overhang) * 2;
    } else {
      // Lean-to: single slope
      rafterCount = Math.ceil((len * 12) / 24) + 1;
      var leanRun = wid + overhang;
      var leanLen = leanRun * pMult;
      roofAreaSqFt = leanLen * (len + 2 * overhang);
    }

    // --- Floor sheathing (3/4" plywood, 4x8 = 32 sq ft) ---
    var floorSheets = Math.ceil(floorArea / 32);

    // --- Roof sheathing (1/2" plywood, 4x8 = 32 sq ft) ---
    var roofSheets = Math.ceil(roofAreaSqFt / 32);

    // --- Wall sheathing (7/16" OSB, 4x8 = 32 sq ft) ---
    var wallArea = perimeter * wallHt;
    // Subtract openings: door ~21 sq ft, window ~12 sq ft
    wallArea -= (doors * 21) + (windows * 12);
    if (wallArea < 0) wallArea = 0;
    // Add gable triangles for gable roof
    if (roofStyle === 'gable') {
      var gableHeight = (wid / 2) * (pitch / 12);
      var gableArea = 2 * (0.5 * wid * gableHeight);
      wallArea += gableArea;
    }
    var wallSheets = Math.ceil(wallArea / 32);

    // --- Roofing shingles (3 bundles per 100 sq ft) ---
    var shingleBundles = Math.ceil((roofAreaSqFt / 100) * 3 * 1.1); // 10% waste

    // --- Siding (T1-11, 4x8 sheets) ---
    var sidingSheets = wallSheets; // same as wall sheathing or can use siding directly

    document.getElementById('rStuds').textContent = studCount + ' studs';
    document.getElementById('rJoists').textContent = joistCount + ' joists';
    document.getElementById('rRafters').textContent = rafterCount + ' rafters';
    document.getElementById('rFloorSheath').textContent = floorSheets + ' sheets';
    document.getElementById('rRoofSheath').textContent = roofSheets + ' sheets';
    document.getElementById('rWallSheath').textContent = wallSheets + ' sheets';
    document.getElementById('rShingles').textContent = shingleBundles + ' bundles';
    document.getElementById('rSiding').textContent = sidingSheets + ' sheets';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  [lengthEl, widthEl, heightEl, roofEl, pitchEl, doorsEl, windowsEl].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('change', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

})();
