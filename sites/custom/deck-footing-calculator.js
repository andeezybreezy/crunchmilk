(function() {
  'use strict';

  var deckL = document.getElementById('deckL');
  var deckW = document.getElementById('deckW');
  var postSpacing = document.getElementById('postSpacing');
  var frostDepth = document.getElementById('frostDepth');
  var tubeSize = document.getElementById('tubeSize');
  var hasLedger = document.getElementById('hasLedger');

  var outFootings = document.getElementById('outFootings');
  var outBeams = document.getElementById('outBeams');
  var outPostsPerBeam = document.getElementById('outPostsPerBeam');
  var outConcreteEach = document.getElementById('outConcreteEach');
  var outConcreteTotal = document.getElementById('outConcreteTotal');
  var outBags = document.getElementById('outBags');
  var outDepth = document.getElementById('outDepth');
  var outDiameter = document.getElementById('outDiameter');
  var resultTip = document.getElementById('resultTip');

  function calculate() {
    var dL = parseFloat(deckL.value);
    var dW = parseFloat(deckW.value);
    var pSpace = parseFloat(postSpacing.value);
    var frost = parseFloat(frostDepth.value);
    var tube = parseFloat(tubeSize.value);
    var ledger = hasLedger.value === 'yes';

    if (isNaN(dL) || isNaN(dW) || dL <= 0 || dW <= 0) {
      outFootings.textContent = '—';
      outBeams.textContent = '—';
      outPostsPerBeam.textContent = '—';
      outConcreteEach.textContent = '—';
      outConcreteTotal.textContent = '—';
      outBags.textContent = '—';
      outDepth.textContent = '—';
      outDiameter.textContent = '—';
      return;
    }

    // Beam lines along the length (perpendicular to joists)
    // Beams run across the width; spaced along the length
    var beamLines = Math.floor(dL / pSpace) + 1;
    if (ledger) {
      // One beam line is replaced by ledger
      beamLines = Math.max(1, beamLines - 1);
    }

    // Posts per beam line (across the width)
    var postsPerBeam = Math.floor(dW / pSpace) + 1;
    if (postsPerBeam < 2) postsPerBeam = 2;

    var totalFootings = beamLines * postsPerBeam;

    // Footing depth: frost + 6 inches below frost line
    var footingDepthIn = frost + 6;

    // Concrete per footing: pi * r^2 * depth (in cubic inches) / 1728 = cu ft
    var radiusIn = tube / 2;
    var volumeCuIn = Math.PI * radiusIn * radiusIn * footingDepthIn;
    var volumeCuFt = volumeCuIn / 1728;

    var totalConcrete = volumeCuFt * totalFootings;

    // 60 lb bag = ~0.45 cu ft
    var bagsPerFooting = Math.ceil(volumeCuFt / 0.45);
    var totalBags = bagsPerFooting * totalFootings;

    outFootings.textContent = totalFootings;
    outBeams.textContent = beamLines + (ledger ? ' (+ ledger at house)' : '');
    outPostsPerBeam.textContent = postsPerBeam;
    outConcreteEach.textContent = volumeCuFt.toFixed(2) + ' cu ft (' + bagsPerFooting + ' bags)';
    outConcreteTotal.textContent = totalConcrete.toFixed(1) + ' cu ft';
    outBags.textContent = totalBags + ' bags (60 lb)';
    outDepth.textContent = footingDepthIn + '" (' + (footingDepthIn / 12).toFixed(1) + ' ft)';
    outDiameter.textContent = tube + '"';

    resultTip.textContent = totalFootings + ' footings: ' + beamLines + ' beam lines × ' + postsPerBeam + ' posts each. ' + totalBags + ' bags of concrete total.';
    document.getElementById('result').classList.add('visible');
  }

  deckL.addEventListener('input', calculate);
  deckW.addEventListener('input', calculate);
  postSpacing.addEventListener('change', calculate);
  frostDepth.addEventListener('change', calculate);
  tubeSize.addEventListener('change', calculate);
  hasLedger.addEventListener('change', calculate);

  calculate();
})();
