(function() {
  'use strict';

  var totalRiseInput = document.getElementById('totalRise');
  var treadDepthSelect = document.getElementById('treadDepth');
  var stairWidthSelect = document.getElementById('stairWidth');
  var openRisersSelect = document.getElementById('openRisers');
  var treadStyleSelect = document.getElementById('treadStyle');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');
  var rRisers = document.getElementById('rRisers');
  var rRiserH = document.getElementById('rRiserH');
  var resultDetails = document.getElementById('resultDetails');

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 1;
    return n.toFixed(d);
  }

  function calculate() {
    var totalRise = parseFloat(totalRiseInput.value);
    if (isNaN(totalRise) || totalRise <= 0) { hideResult(); return; }

    var treadDepth = parseFloat(treadDepthSelect.value);
    var stairWidth = parseFloat(stairWidthSelect.value);
    var openRisers = openRisersSelect.value === 'open';
    var doubleTread = treadStyleSelect.value === 'double';

    // Calculate risers: target 7.5" riser height
    var risersExact = totalRise / 7.5;
    var risers = Math.round(risersExact);
    if (risers < 1) risers = 1;

    var riserHeight = totalRise / risers;

    // Check code compliance (max 7.75")
    var codeOk = riserHeight >= 4 && riserHeight <= 7.75;

    // Treads = risers - 1 (deck is top, ground is bottom)
    var treads = risers - 1;

    // Total run
    var totalRun = treads * treadDepth;

    // Stringer length (diagonal)
    var stringerLen = Math.sqrt(totalRise * totalRise + totalRun * totalRun);

    // Number of stringers: every 16" + 1
    var stringers = Math.ceil(stairWidth / 16) + 1;
    if (stringers < 3) stringers = 3;

    // Stringer lumber: need 2x12 long enough
    var stringerBoardFt = Math.ceil(stringerLen / 12); // in feet
    // Standard lumber lengths: 8, 10, 12, 14, 16
    var lumberLen = 8;
    if (stringerBoardFt > 8) lumberLen = 10;
    if (stringerBoardFt > 10) lumberLen = 12;
    if (stringerBoardFt > 12) lumberLen = 14;
    if (stringerBoardFt > 14) lumberLen = 16;

    // Tread boards
    var treadBoardWidth = stairWidth; // in inches
    var treadBoards;
    if (doubleTread) {
      treadBoards = treads * 2; // two 2x6 per tread
    } else {
      treadBoards = treads; // one 2x12 per tread
    }

    // Riser boards (if closed)
    var riserBoards = openRisers ? 0 : risers;

    // Screws: ~8 per tread (4 per board x 2 boards), 6 per riser
    var screws = treadBoards * 4 * stringers;
    if (!openRisers) screws += riserBoards * 6;

    // Tread board length (need to match stair width)
    var treadBoardLen = Math.ceil(stairWidth / 12); // ft
    var treadLumber = 6;
    if (treadBoardLen > 3) treadLumber = 4;
    if (treadBoardLen > 4) treadLumber = 6;

    rRisers.textContent = risers;
    rRiserH.textContent = fmt(riserHeight, 2) + '"';

    var d = '';
    if (!codeOk) {
      d += '<div style="background:#fef2f2;border:1px solid #fca5a5;border-radius:8px;padding:12px;margin-bottom:16px;font-size:0.9rem;color:#991b1b">';
      d += '<strong>Warning:</strong> Riser height of ' + fmt(riserHeight, 2) + '" is outside IRC code limits (4" min, 7.75" max). Adjust total rise or number of steps.';
      d += '</div>';
    }

    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem">';
    d += '<div><strong>Total Rise</strong><br>' + fmt(totalRise, 1) + '"</div>';
    d += '<div><strong>Risers</strong><br>' + risers + ' @ ' + fmt(riserHeight, 2) + '" each</div>';
    d += '<div><strong>Treads</strong><br>' + treads + ' @ ' + fmt(treadDepth, 1) + '" deep</div>';
    d += '<div><strong>Total Run</strong><br>' + fmt(totalRun, 1) + '" (' + fmt(totalRun / 12, 1) + ' ft)</div>';
    d += '<div><strong>Stringer Length</strong><br>' + fmt(stringerLen, 1) + '" (' + fmt(stringerLen / 12, 1) + ' ft)</div>';
    d += '<div><strong>Stair Width</strong><br>' + fmt(stairWidth) + '"</div>';
    d += '</div>';

    d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
    d += '<strong style="font-size:0.95rem">Materials List</strong>';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 24px;font-size:0.9rem;margin-top:8px">';
    d += '<div>Stringers (2&times;12): <strong>' + stringers + '</strong> @ ' + lumberLen + '\' each</div>';
    if (doubleTread) {
      d += '<div>Tread boards (2&times;6): <strong>' + treadBoards + '</strong></div>';
    } else {
      d += '<div>Tread boards (2&times;12): <strong>' + treadBoards + '</strong></div>';
    }
    if (!openRisers) {
      d += '<div>Riser boards (1&times;8): <strong>' + riserBoards + '</strong></div>';
    }
    d += '<div>Deck screws: <strong>~' + screws + '</strong></div>';
    d += '<div>Stringer hangers: <strong>' + stringers + '</strong></div>';
    d += '</div></div>';

    d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
    d += '<strong style="font-size:0.95rem">Code Compliance Check</strong>';
    d += '<div style="font-size:0.9rem;margin-top:8px">';
    d += 'Riser height: ' + fmt(riserHeight, 2) + '" ' + (codeOk ? '&#10003; within code' : '&#10007; outside code limits') + '<br>';
    d += 'Tread depth: ' + fmt(treadDepth, 1) + '" ' + (treadDepth >= 10 ? '&#10003; meets 10" minimum' : '&#10007; below 10" minimum') + '<br>';
    d += 'Stair width: ' + fmt(stairWidth) + '" ' + (stairWidth >= 36 ? '&#10003; meets 36" minimum' : '&#10007; below 36" minimum') + '';
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

  totalRiseInput.addEventListener('input', calculate);
  totalRiseInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });

  [treadDepthSelect, stairWidthSelect, openRisersSelect, treadStyleSelect].forEach(function(sel) {
    sel.addEventListener('change', calculate);
  });
})();
