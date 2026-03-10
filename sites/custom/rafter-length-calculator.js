(function() {
  'use strict';

  var roofSpan = document.getElementById('roofSpan');
  var roofPitch = document.getElementById('roofPitch');
  var overhang = document.getElementById('overhang');
  var wallHeight = document.getElementById('wallHeight');

  var outRafterLen = document.getElementById('outRafterLen');
  var outRafterNoOH = document.getElementById('outRafterNoOH');
  var outRidgeHeight = document.getElementById('outRidgeHeight');
  var outRun = document.getElementById('outRun');
  var outSeatCut = document.getElementById('outSeatCut');
  var outPlumbCut = document.getElementById('outPlumbCut');
  var resultTip = document.getElementById('resultTip');
  var rafterSizeRec = document.getElementById('rafterSizeRec');

  // Rafter span limits (16" OC, #2 lumber, 30psf live + 10psf dead)
  var rafterSizes = [
    { name: '2×6', depth: 5.5, maxSpan: 10.5 },
    { name: '2×8', depth: 7.25, maxSpan: 14.17 },
    { name: '2×10', depth: 9.25, maxSpan: 18 },
    { name: '2×12', depth: 11.25, maxSpan: 22 }
  ];

  function fmtFtIn(totalFt) {
    var ft = Math.floor(totalFt);
    var inches = Math.round((totalFt - ft) * 12);
    if (inches === 12) { ft++; inches = 0; }
    return ft + "' " + inches + '"';
  }

  function calculate() {
    var span = parseFloat(roofSpan.value);
    var pitch = parseFloat(roofPitch.value);
    var oh = parseFloat(overhang.value) || 0;
    var wh = parseFloat(wallHeight.value) || 0;

    if (isNaN(span) || span <= 0 || isNaN(pitch)) {
      outRafterLen.textContent = '—';
      outRafterNoOH.textContent = '—';
      outRidgeHeight.textContent = '—';
      outRun.textContent = '—';
      outSeatCut.textContent = '—';
      outPlumbCut.textContent = '—';
      return;
    }

    var runFt = span / 2;
    var angleRad = Math.atan(pitch / 12);
    var angleDeg = angleRad * 180 / Math.PI;
    var rafterNoOH = runFt / Math.cos(angleRad);
    var ohFt = oh / 12;
    var rafterTotal = rafterNoOH + ohFt;
    var riseFt = runFt * pitch / 12;
    var ridgeHeight = wh + riseFt;

    // Birdsmouth: seat cut = wall plate width (3.5" for 2x4 wall)
    var seatCut = 3.5;
    var plumbCut = seatCut * Math.tan(angleRad);

    outRun.textContent = runFt.toFixed(1) + ' ft';
    outRafterNoOH.textContent = fmtFtIn(rafterNoOH) + ' (' + rafterNoOH.toFixed(2) + ' ft)';
    outRafterLen.textContent = fmtFtIn(rafterTotal) + ' (' + rafterTotal.toFixed(2) + ' ft)';

    if (wh > 0) {
      outRidgeHeight.textContent = fmtFtIn(ridgeHeight) + ' (' + ridgeHeight.toFixed(2) + ' ft)';
    } else {
      outRidgeHeight.textContent = riseFt.toFixed(2) + ' ft above plate';
    }

    outSeatCut.textContent = seatCut.toFixed(1) + '" (for 2×4 wall)';
    outPlumbCut.textContent = plumbCut.toFixed(2) + '"';

    resultTip.textContent = 'Pitch: ' + pitch + '/12 (' + angleDeg.toFixed(1) + '°) — Rise: ' + fmtFtIn(riseFt);

    // Recommend rafter size
    var rec = '';
    for (var i = 0; i < rafterSizes.length; i++) {
      var s = rafterSizes[i];
      var ok = runFt <= s.maxSpan;
      rec += '<div style="padding:4px 0;' + (ok ? 'color:#166534' : 'color:#991b1b') + '">';
      rec += '<strong>' + s.name + '</strong> — max span ' + s.maxSpan + ' ft at 16" OC — ';
      rec += ok ? '✓ OK for ' + runFt.toFixed(1) + ' ft run' : '✗ Too short for ' + runFt.toFixed(1) + ' ft run';
      rec += '</div>';
    }
    rafterSizeRec.innerHTML = rec;
  }

  roofSpan.addEventListener('input', calculate);
  roofPitch.addEventListener('change', calculate);
  overhang.addEventListener('input', calculate);
  wallHeight.addEventListener('input', calculate);

  calculate();
})();
