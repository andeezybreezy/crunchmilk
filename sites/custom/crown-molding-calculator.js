(function() {
  'use strict';

  var roomLengthInput = document.getElementById('roomLength');
  var roomWidthInput = document.getElementById('roomWidth');
  var perimeterInput = document.getElementById('perimeter');
  var insideCornersInput = document.getElementById('insideCorners');
  var outsideCornersInput = document.getElementById('outsideCorners');
  var moldingLenSelect = document.getElementById('moldingLength');
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

    var insideCorners = parseInt(insideCornersInput.value) || 0;
    var outsideCorners = parseInt(outsideCornersInput.value) || 0;
    var moldingLen = parseFloat(moldingLenSelect.value);
    var wastePct = parseFloat(wasteSelect.value) / 100;

    var totalFeet = perim * (1 + wastePct);
    var pieces = Math.ceil(totalFeet / moldingLen);

    // Adhesive tubes: 1 tube per ~30 linear ft
    var adhesiveTubes = Math.ceil(totalFeet / 30);

    // Brad nails: ~2 per foot (one top, one bottom every 12")
    var bradNails = Math.ceil(totalFeet * 2);

    // Corner blocks (if using instead of miter cuts)
    var totalCorners = insideCorners + outsideCorners;

    rFeet.textContent = fmt(totalFeet, 1) + ' ft';
    rPieces.textContent = pieces + ' pieces';

    var d = '';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem">';
    d += '<div><strong>Room Perimeter</strong><br>' + fmt(perim, 1) + ' ft</div>';
    d += '<div><strong>With ' + (wastePct * 100) + '% Waste</strong><br>' + fmt(totalFeet, 1) + ' ft</div>';
    d += '<div><strong>Piece Length</strong><br>' + moldingLen + ' ft</div>';
    d += '<div><strong>Pieces Needed</strong><br>' + pieces + '</div>';
    d += '</div>';

    d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
    d += '<strong style="font-size:0.95rem">Materials List</strong>';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 24px;font-size:0.9rem;margin-top:8px">';
    d += '<div>Molding pieces: <strong>' + pieces + '</strong> (' + moldingLen + '\' each)</div>';
    d += '<div>Inside corners: <strong>' + insideCorners + '</strong> (cope or miter)</div>';
    d += '<div>Outside corners: <strong>' + outsideCorners + '</strong> (miter)</div>';
    d += '<div>Adhesive tubes: <strong>' + adhesiveTubes + '</strong></div>';
    d += '<div>Brad nails (2"): <strong>~' + bradNails + '</strong></div>';
    d += '</div></div>';

    // Alternative piece lengths
    d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
    d += '<strong style="font-size:0.95rem">Pieces by Length</strong>';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 24px;font-size:0.9rem;margin-top:8px">';
    [8, 12, 14, 16].forEach(function(len) {
      var pcs = Math.ceil(totalFeet / len);
      d += '<div>' + len + '\' pieces: <strong>' + pcs + '</strong> (' + fmt(pcs * len, 0) + ' ft total)</div>';
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

  [roomLengthInput, roomWidthInput, perimeterInput, insideCornersInput, outsideCornersInput].forEach(function(inp) {
    inp.addEventListener('input', calculate);
    inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });

  [moldingLenSelect, wasteSelect].forEach(function(sel) { sel.addEventListener('change', calculate); });
})();
