(function() {
  'use strict';

  var totalRise = document.getElementById('totalRise');
  var treadDepth = document.getElementById('treadDepth');
  var stairWidth = document.getElementById('stairWidth');
  var nosing = document.getElementById('nosing');

  var outRisers = document.getElementById('outRisers');
  var outRiserH = document.getElementById('outRiserH');
  var outTreads = document.getElementById('outTreads');
  var outTreadD = document.getElementById('outTreadD');
  var outTotalRun = document.getElementById('outTotalRun');
  var outStringerLen = document.getElementById('outStringerLen');
  var outBoard = document.getElementById('outBoard');
  var outStringerCount = document.getElementById('outStringerCount');
  var outCheck = document.getElementById('outCheck');
  var resultTip = document.getElementById('resultTip');

  function fmtFtIn(inches) {
    var ft = Math.floor(inches / 12);
    var inn = Math.round(inches % 12);
    if (inn === 12) { ft++; inn = 0; }
    return ft + "' " + inn + '"';
  }

  function calculate() {
    var rise = parseFloat(totalRise.value);
    var tread = parseFloat(treadDepth.value);
    var width = parseFloat(stairWidth.value) || 36;
    var nose = parseFloat(nosing.value) || 0;

    if (isNaN(rise) || rise <= 0) {
      outRisers.textContent = '—';
      outRiserH.textContent = '—';
      outTreads.textContent = '—';
      outTreadD.textContent = '—';
      outTotalRun.textContent = '—';
      outStringerLen.textContent = '—';
      outBoard.textContent = '—';
      outStringerCount.textContent = '—';
      outCheck.textContent = '—';
      resultTip.textContent = 'Enter total rise to calculate.';
      return;
    }

    // Calculate optimal number of risers
    var idealRiser = 7.5;
    var numRisers = Math.round(rise / idealRiser);
    if (numRisers < 1) numRisers = 1;

    var riserHeight = rise / numRisers;

    // Adjust if out of code range (7-7.75")
    if (riserHeight > 7.75) {
      numRisers = Math.ceil(rise / 7.75);
      riserHeight = rise / numRisers;
    } else if (riserHeight < 4) {
      numRisers = Math.floor(rise / 4);
      if (numRisers < 1) numRisers = 1;
      riserHeight = rise / numRisers;
    }

    var numTreads = numRisers - 1;
    var totalRun = numTreads * tread;
    var stringerLen = Math.sqrt(rise * rise + totalRun * totalRun);
    var riserPlusTread = riserHeight + tread;

    // Number of stringers based on width
    var stringerCount = 3;
    if (width > 36) stringerCount = Math.max(3, Math.ceil(width / 16) + 1);

    // Board length needed (standard lumber lengths)
    var boardLengths = [8, 10, 12, 14, 16];
    var stringerFt = stringerLen / 12;
    var boardNeeded = '—';
    for (var i = 0; i < boardLengths.length; i++) {
      if (boardLengths[i] >= stringerFt) {
        boardNeeded = '2×12 × ' + boardLengths[i] + "'";
        break;
      }
    }
    if (boardNeeded === '—') boardNeeded = '2×12 × ' + Math.ceil(stringerFt) + "' (special order)";

    outRisers.textContent = numRisers;
    outRiserH.textContent = riserHeight.toFixed(2) + '"';
    outTreads.textContent = numTreads;
    outTreadD.textContent = tread + '"' + (nose > 0 ? ' + ' + nose + '" nosing' : '');
    outTotalRun.textContent = totalRun.toFixed(1) + '" (' + fmtFtIn(totalRun) + ')';
    outStringerLen.textContent = stringerLen.toFixed(1) + '" (' + fmtFtIn(stringerLen) + ')';
    outBoard.textContent = boardNeeded;
    outStringerCount.textContent = stringerCount + ' stringers';

    // Code check
    var checkOk = riserPlusTread >= 17 && riserPlusTread <= 18;
    var checkColor = checkOk ? '#166534' : '#991b1b';
    outCheck.innerHTML = '<span style="color:' + checkColor + '">' + riserPlusTread.toFixed(2) + '"</span>';

    var tips = [];
    if (riserHeight > 7.75) tips.push('Warning: riser exceeds 7.75" code maximum.');
    else if (riserHeight < 7) tips.push('Riser is under 7" — consider fewer risers for comfort.');

    if (riserPlusTread < 17 || riserPlusTread > 18) tips.push('Riser + tread (' + riserPlusTread.toFixed(2) + '") is outside the ideal 17-18" range.');
    else tips.push('Riser + tread = ' + riserPlusTread.toFixed(2) + '" — within the ideal 17-18" comfort range.');

    resultTip.textContent = tips.join(' ');
    document.getElementById('result').classList.add('visible');
  }

  totalRise.addEventListener('input', calculate);
  treadDepth.addEventListener('change', calculate);
  stairWidth.addEventListener('input', calculate);
  nosing.addEventListener('input', calculate);

  calculate();
})();
