(function() {
  'use strict';

  var lengthInput = document.getElementById('roofLength');
  var widthInput = document.getElementById('roofWidth');
  var areaInput = document.getElementById('roofArea');
  var pitchSelect = document.getElementById('roofPitch');
  var wasteSelect = document.getElementById('wastePercent');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');
  var rSquares = document.getElementById('rSquares');
  var rBundles = document.getElementById('rBundles');
  var resultDetails = document.getElementById('resultDetails');

  var areaMode = 'dims';

  // Toggle
  var areaToggle = document.getElementById('areaToggle');
  var toggleBtns = areaToggle.querySelectorAll('button');
  var dimsDiv = document.getElementById('dimsInputs');
  var sqftDiv = document.getElementById('sqftInput');

  toggleBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      toggleBtns.forEach(function(b) { b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed','true');
      areaMode = btn.dataset.mode;
      dimsDiv.style.display = areaMode === 'dims' ? '' : 'none';
      sqftDiv.style.display = areaMode === 'sqft' ? '' : 'none';
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
    var flatArea;
    if (areaMode === 'dims') {
      var l = parseFloat(lengthInput.value);
      var w = parseFloat(widthInput.value);
      if (isNaN(l) || isNaN(w) || l <= 0 || w <= 0) { hideResult(); return; }
      flatArea = l * w;
    } else {
      flatArea = parseFloat(areaInput.value);
      if (isNaN(flatArea) || flatArea <= 0) { hideResult(); return; }
    }

    var pitchMult = parseFloat(pitchSelect.value);
    var wastePct = parseFloat(wasteSelect.value) / 100;

    var adjArea = flatArea * pitchMult;
    var totalArea = adjArea * (1 + wastePct);

    var squares = totalArea / 100;
    var bundles = Math.ceil(squares * 3);
    var squaresRound = Math.ceil(squares);

    // Underlayment: 1 roll ~400 sqft (15lb felt) or ~1000 sqft (synthetic)
    var feltRolls = Math.ceil(totalArea / 400);
    var syntheticRolls = Math.ceil(totalArea / 1000);

    // Ridge cap: assume ridge = roof length (or sqrt of area for sqft mode)
    var ridgeFt = areaMode === 'dims' ? parseFloat(lengthInput.value) : Math.sqrt(flatArea);
    var ridgeCapBundles = Math.ceil(ridgeFt / 25); // 1 bundle ~25 linear ft

    // Nails: ~2.5 lbs per square
    var nailsLbs = Math.ceil(squares * 2.5);

    // Drip edge: perimeter. dims mode: 2*(l+w), sqft: 4*sqrt(area)
    var perimeterFt = areaMode === 'dims' ? 2 * (parseFloat(lengthInput.value) + parseFloat(widthInput.value)) : 4 * Math.sqrt(flatArea);
    var dripEdgePieces = Math.ceil(perimeterFt / 10); // 10ft pieces

    // Starter strip: eave length = width * 2 sides for gable
    var starterFt = areaMode === 'dims' ? parseFloat(widthInput.value) * 2 : 2 * Math.sqrt(flatArea);
    var starterBundles = Math.ceil(starterFt / 100); // ~100 linear ft per bundle

    rSquares.textContent = squaresRound + ' squares';
    rBundles.textContent = bundles + ' bundles';

    var d = '';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem">';
    d += '<div><strong>Flat Area</strong><br>' + fmt(flatArea) + ' sq ft</div>';
    d += '<div><strong>Pitch-Adjusted Area</strong><br>' + fmt(adjArea) + ' sq ft</div>';
    d += '<div><strong>With ' + (wastePct*100) + '% Waste</strong><br>' + fmt(totalArea) + ' sq ft</div>';
    d += '<div><strong>Squares</strong><br>' + fmt(squares, 1) + ' (' + bundles + ' bundles)</div>';
    d += '</div>';

    d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
    d += '<strong style="font-size:0.95rem">Full Materials List</strong>';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 24px;font-size:0.9rem;margin-top:8px">';
    d += '<div>Shingle bundles: <strong>' + bundles + '</strong></div>';
    d += '<div>Ridge cap bundles: <strong>' + ridgeCapBundles + '</strong></div>';
    d += '<div>Starter strip bundles: <strong>' + starterBundles + '</strong></div>';
    d += '<div>Felt underlayment: <strong>' + feltRolls + ' roll' + (feltRolls !== 1 ? 's' : '') + '</strong></div>';
    d += '<div>Synthetic underlayment: <strong>' + syntheticRolls + ' roll' + (syntheticRolls !== 1 ? 's' : '') + '</strong></div>';
    d += '<div>Roofing nails: <strong>' + nailsLbs + ' lbs</strong></div>';
    d += '<div>Drip edge pieces: <strong>' + dripEdgePieces + '</strong> (10\' each)</div>';
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

  [lengthInput, widthInput, areaInput].forEach(function(inp) {
    inp.addEventListener('input', calculate);
    inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });

  [pitchSelect, wasteSelect].forEach(function(sel) { sel.addEventListener('change', calculate); });
})();
