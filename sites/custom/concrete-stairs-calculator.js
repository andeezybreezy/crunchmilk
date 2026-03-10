(function() {
  'use strict';

  var numStepsInput = document.getElementById('numSteps');
  var riserHeightInput = document.getElementById('riserHeight');
  var treadDepthInput = document.getElementById('treadDepth');
  var stairWidthInput = document.getElementById('stairWidth');
  var hasPlatformSelect = document.getElementById('hasPlatform');
  var wasteSelect = document.getElementById('wastePercent');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');
  var rVolume = document.getElementById('rVolume');
  var rBags = document.getElementById('rBags');
  var resultDetails = document.getElementById('resultDetails');

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 2;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  function calculate() {
    var steps = parseInt(numStepsInput.value);
    var riserH = parseFloat(riserHeightInput.value);
    var treadD = parseFloat(treadDepthInput.value);
    var width = parseFloat(stairWidthInput.value);
    var wastePct = parseFloat(wasteSelect.value) / 100;

    if (isNaN(steps) || steps <= 0 || isNaN(riserH) || riserH <= 0 ||
        isNaN(treadD) || treadD <= 0 || isNaN(width) || width <= 0) {
      hideResult(); return;
    }

    // Convert all to feet for volume calc
    var riserFt = riserH / 12;
    var treadFt = treadD / 12;
    var widthFt = width / 12;

    // Each step i (1 = bottom, N = top) has:
    // - depth = treadFt
    // - height = (steps - i + 1) * riserFt (solid concrete from ground up)
    // - width = widthFt
    // Volume of step i = treadFt * ((steps - i + 1) * riserFt) * widthFt
    var totalCuFt = 0;
    for (var i = 1; i <= steps; i++) {
      var stepHeight = (steps - i + 1) * riserFt;
      totalCuFt += treadFt * stepHeight * widthFt;
    }

    // Platform at top
    var platformDepth = parseFloat(hasPlatformSelect.value) || 0;
    var platformCuFt = 0;
    if (platformDepth > 0) {
      // Platform is at full stair height (steps * riserFt)
      // Assume 4" thick slab on top of filled area
      // Actually, the platform is a solid block: platformDepth x fullHeight x width
      // But more realistically, it's on the same fill, so it's platform depth x (steps * riser) x width
      // For simplicity: solid concrete platform
      var platformDepthFt = platformDepth / 12;
      var fullHeight = steps * riserFt;
      platformCuFt = platformDepthFt * fullHeight * widthFt;
      totalCuFt += platformCuFt;
    }

    var totalWithWaste = totalCuFt * (1 + wastePct);
    var cuYd = totalWithWaste / 27;

    // Bags: 80lb = 0.6 cu ft, 60lb = 0.45 cu ft
    var bags80 = Math.ceil(totalWithWaste / 0.6);
    var bags60 = Math.ceil(totalWithWaste / 0.45);

    // Total rise and run
    var totalRise = steps * riserH;
    var totalRun = steps * treadD;

    // Rebar: #4 rebar horizontal every 12" across width, plus vertical through each riser
    var rebarHorizontal = steps * Math.ceil(width / 12);
    // Each horizontal bar length ~ totalRun (inches), so in linear feet:
    var rebarHorizFt = rebarHorizontal * (totalRun / 12);
    // Vertical bars: every 12" across width, through all risers
    var rebarVertBars = Math.ceil(width / 12);
    var rebarVertFt = rebarVertBars * (totalRise / 12);
    var totalRebarFt = Math.ceil(rebarHorizFt + rebarVertFt);

    // Forms: plywood for sides and risers
    var sideFormSqFt = 2 * (totalRun / 12) * (totalRise / 12); // two sides, triangular but use rectangle estimate
    var riserFormSqFt = steps * (width / 12) * riserFt;

    // Code check
    var riserOk = riserH >= 4 && riserH <= 7.75;
    var treadOk = treadD >= 10;

    rVolume.textContent = fmt(totalWithWaste, 1) + ' cu ft';
    rBags.textContent = bags80 + ' bags';

    var d = '';

    if (!riserOk || !treadOk) {
      d += '<div style="background:#fef2f2;border:1px solid #fca5a5;border-radius:8px;padding:12px;margin-bottom:16px;font-size:0.9rem;color:#991b1b">';
      if (!riserOk) d += '<strong>Warning:</strong> Riser height ' + fmt(riserH, 1) + '" is outside code limits (4-7.75").<br>';
      if (!treadOk) d += '<strong>Warning:</strong> Tread depth ' + fmt(treadD, 1) + '" is below 10" code minimum.';
      d += '</div>';
    }

    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem">';
    d += '<div><strong>Steps</strong><br>' + steps + '</div>';
    d += '<div><strong>Total Rise</strong><br>' + fmt(totalRise, 1) + '" (' + fmt(totalRise / 12, 1) + ' ft)</div>';
    d += '<div><strong>Total Run</strong><br>' + fmt(totalRun, 1) + '" (' + fmt(totalRun / 12, 1) + ' ft)</div>';
    d += '<div><strong>Stair Width</strong><br>' + fmt(width, 0) + '"</div>';
    d += '<div><strong>Volume (no waste)</strong><br>' + fmt(totalCuFt, 1) + ' cu ft</div>';
    d += '<div><strong>With ' + (wastePct * 100) + '% Waste</strong><br>' + fmt(totalWithWaste, 1) + ' cu ft (' + fmt(cuYd, 2) + ' cu yd)</div>';
    d += '</div>';

    if (platformCuFt > 0) {
      d += '<div style="margin-top:12px;font-size:0.9rem"><strong>Landing platform:</strong> ' + fmt(platformCuFt, 1) + ' cu ft (included above)</div>';
    }

    d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
    d += '<strong style="font-size:0.95rem">Concrete Needed</strong>';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 24px;font-size:0.9rem;margin-top:8px">';
    d += '<div>Cubic yards: <strong>' + fmt(cuYd, 2) + '</strong></div>';
    d += '<div>Cubic feet: <strong>' + fmt(totalWithWaste, 1) + '</strong></div>';
    d += '<div>80 lb bags: <strong>' + bags80 + '</strong></div>';
    d += '<div>60 lb bags: <strong>' + bags60 + '</strong></div>';
    d += '</div></div>';

    d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
    d += '<strong style="font-size:0.95rem">Rebar Recommendation</strong>';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 24px;font-size:0.9rem;margin-top:8px">';
    d += '<div>#4 rebar (1/2"): <strong>~' + totalRebarFt + ' linear ft</strong></div>';
    d += '<div>Rebar ties: <strong>~' + Math.ceil(totalRebarFt / 2) + '</strong></div>';
    d += '</div>';
    d += '<div style="font-size:0.8rem;color:var(--text-light);margin-top:4px">Place horizontal bars every 12" across width, vertical bars through risers every 12".</div>';
    d += '</div>';

    d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
    d += '<strong style="font-size:0.95rem">Recommendation</strong>';
    d += '<div style="font-size:0.9rem;margin-top:8px">';
    if (cuYd >= 1) {
      d += 'Order <strong>ready-mix concrete</strong> — ' + fmt(cuYd, 2) + ' cubic yards is too much to mix by hand efficiently. ';
      d += 'Minimum order from most ready-mix plants is 1 cubic yard.';
    } else {
      d += 'This project can be done with <strong>bagged concrete mix</strong> — ' + bags80 + ' bags of 80 lb mix. ';
      d += 'A mixer or mixing tub will speed up the process significantly.';
    }
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

  [numStepsInput, riserHeightInput, treadDepthInput, stairWidthInput].forEach(function(inp) {
    inp.addEventListener('input', calculate);
    inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });

  [hasPlatformSelect, wasteSelect].forEach(function(sel) { sel.addEventListener('change', calculate); });
})();
