(function() {
  'use strict';

  var roomLengthInput = document.getElementById('roomLength');
  var roomWidthInput = document.getElementById('roomWidth');
  var perimeterInput = document.getElementById('perimeter');
  var doorCountInput = document.getElementById('doorCount');
  var baseboardLenSelect = document.getElementById('baseboardLen');
  var includeCasingSelect = document.getElementById('includeCasing');
  var wasteSelect = document.getElementById('wastePercent');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');
  var rFeet = document.getElementById('rFeet');
  var rPieces = document.getElementById('rPieces');
  var resultDetails = document.getElementById('resultDetails');

  var inputMode = 'dims';

  var modeToggle = document.getElementById('modeToggle');
  var toggleBtns = modeToggle.querySelectorAll('button');
  var dimsDiv = document.getElementById('dimsInputs');
  var perimDiv = document.getElementById('perimInput');

  toggleBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      toggleBtns.forEach(function(b) { b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed','true');
      inputMode = btn.dataset.mode;
      dimsDiv.style.display = inputMode === 'dims' ? '' : 'none';
      perimDiv.style.display = inputMode === 'perim' ? '' : 'none';
      calculate();
    });
  });

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 0;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  function calculate() {
    var perim;
    if (inputMode === 'dims') {
      var l = parseFloat(roomLengthInput.value);
      var w = parseFloat(roomWidthInput.value);
      if (isNaN(l) || isNaN(w) || l <= 0 || w <= 0) { hideResult(); return; }
      perim = 2 * (l + w);
    } else {
      perim = parseFloat(perimeterInput.value);
      if (isNaN(perim) || perim <= 0) { hideResult(); return; }
    }

    var doors = parseInt(doorCountInput.value) || 0;
    var pieceLen = parseFloat(baseboardLenSelect.value);
    var includeCasing = includeCasingSelect.value === 'yes';
    var wastePct = parseFloat(wasteSelect.value) / 100;

    // Subtract 3 ft per doorway
    var netPerim = perim - (doors * 3);
    if (netPerim < 0) netPerim = 0;

    var totalFeet = netPerim * (1 + wastePct);
    var pieces = Math.ceil(totalFeet / pieceLen);

    // Door casing: 2 sides (~7ft each) + 1 header (~3ft) = ~17ft per door
    var casingFtPerDoor = 17;
    var casingTotalFt = doors * casingFtPerDoor;
    var casingSidePieces = doors * 2; // typically 7ft pre-cut pieces
    var casingHeadPieces = doors; // typically 3ft head casing

    // Nails: ~2 per foot
    var bradNails = Math.ceil(totalFeet * 2);

    // Adhesive: 1 tube per ~40 linear ft
    var adhesiveTubes = Math.ceil(totalFeet / 40);

    // Inside corners: rough estimate from dims mode
    var insideCorners = 4; // default for rectangular room
    if (inputMode === 'dims') insideCorners = 4;

    rFeet.textContent = fmt(totalFeet, 1) + ' ft';
    rPieces.textContent = pieces + ' pieces';

    var d = '';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem">';
    d += '<div><strong>Room Perimeter</strong><br>' + fmt(perim, 1) + ' ft</div>';
    d += '<div><strong>Doors Subtracted</strong><br>' + doors + ' &times; 3\' = ' + (doors * 3) + ' ft</div>';
    d += '<div><strong>Net Baseboard</strong><br>' + fmt(netPerim, 1) + ' ft</div>';
    d += '<div><strong>With ' + (wastePct * 100) + '% Waste</strong><br>' + fmt(totalFeet, 1) + ' ft</div>';
    d += '</div>';

    d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
    d += '<strong style="font-size:0.95rem">Baseboard Materials</strong>';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 24px;font-size:0.9rem;margin-top:8px">';
    d += '<div>Baseboard pieces: <strong>' + pieces + '</strong> (' + pieceLen + '\' each)</div>';
    d += '<div>Brad nails (2"): <strong>~' + bradNails + '</strong></div>';
    d += '<div>Adhesive tubes: <strong>' + adhesiveTubes + '</strong></div>';
    d += '<div>Inside corners to cope: <strong>~' + insideCorners + '</strong></div>';
    d += '</div></div>';

    if (includeCasing && doors > 0) {
      d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
      d += '<strong style="font-size:0.95rem">Door Casing Materials</strong>';
      d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 24px;font-size:0.9rem;margin-top:8px">';
      d += '<div>Side casing pieces: <strong>' + casingSidePieces + '</strong> (~7\' each)</div>';
      d += '<div>Head casing pieces: <strong>' + casingHeadPieces + '</strong> (~3\' each)</div>';
      d += '<div>Total casing: <strong>' + fmt(casingTotalFt) + ' linear ft</strong></div>';
      d += '<div>Casing nails: <strong>~' + Math.ceil(casingTotalFt * 2) + '</strong></div>';
      d += '</div></div>';
    }

    // Piece comparison
    d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
    d += '<strong style="font-size:0.95rem">Pieces by Length Option</strong>';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 24px;font-size:0.9rem;margin-top:8px">';
    [8, 10, 12, 14, 16].forEach(function(len) {
      var pcs = Math.ceil(totalFeet / len);
      d += '<div>' + len + '\' pieces: <strong>' + pcs + '</strong></div>';
    });
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

  [roomLengthInput, roomWidthInput, perimeterInput, doorCountInput].forEach(function(inp) {
    inp.addEventListener('input', calculate);
    inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });

  [baseboardLenSelect, includeCasingSelect, wasteSelect].forEach(function(sel) { sel.addEventListener('change', calculate); });
})();
