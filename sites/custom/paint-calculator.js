(function() {
  'use strict';

  var roomLengthInput = document.getElementById('roomLength');
  var roomWidthInput = document.getElementById('roomWidth');
  var wallHeightInput = document.getElementById('wallHeight');
  var wallAreaInput = document.getElementById('wallArea');
  var doorCountInput = document.getElementById('doorCount');
  var windowCountInput = document.getElementById('windowCount');
  var coatsSelect = document.getElementById('coats');
  var coverageSelect = document.getElementById('coverage');
  var ceilingSelect = document.getElementById('paintCeiling');
  var priceInput = document.getElementById('priceGallon');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');
  var rGallons = document.getElementById('rGallons');
  var rCost = document.getElementById('rCost');
  var resultDetails = document.getElementById('resultDetails');

  var inputMode = 'room';

  var modeToggle = document.getElementById('modeToggle');
  var toggleBtns = modeToggle.querySelectorAll('button');
  var roomDiv = document.getElementById('roomInputs');
  var areaDiv = document.getElementById('areaInputs');

  toggleBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      toggleBtns.forEach(function(b) { b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed','true');
      inputMode = btn.dataset.mode;
      roomDiv.style.display = inputMode === 'room' ? '' : 'none';
      areaDiv.style.display = inputMode === 'area' ? '' : 'none';
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
    var wallSqft, ceilingSqft = 0, roomL = 0, roomW = 0;

    if (inputMode === 'room') {
      roomL = parseFloat(roomLengthInput.value);
      roomW = parseFloat(roomWidthInput.value);
      var h = parseFloat(wallHeightInput.value);
      if (isNaN(roomL) || isNaN(roomW) || isNaN(h) || roomL <= 0 || roomW <= 0 || h <= 0) { hideResult(); return; }
      var perimeter = 2 * (roomL + roomW);
      wallSqft = perimeter * h;
      ceilingSqft = roomL * roomW;
    } else {
      wallSqft = parseFloat(wallAreaInput.value);
      if (isNaN(wallSqft) || wallSqft <= 0) { hideResult(); return; }
    }

    var doors = parseInt(doorCountInput.value) || 0;
    var windows = parseInt(windowCountInput.value) || 0;
    var coats = parseInt(coatsSelect.value);
    var coverage = parseFloat(coverageSelect.value);
    var includeCeiling = ceilingSelect.value === 'yes';
    var price = parseFloat(priceInput.value) || 35;

    var openings = (doors * 21) + (windows * 15);
    var netWall = wallSqft - openings;
    if (netWall < 0) netWall = 0;

    var totalPaintable = netWall;
    if (includeCeiling && inputMode === 'room') {
      totalPaintable += ceilingSqft;
    }

    var totalWithCoats = totalPaintable * coats;
    var gallonsExact = totalWithCoats / coverage;
    var gallonsRounded = Math.ceil(gallonsExact);

    // Quarts: if remainder > 0.25 gallon difference
    var quartsNeeded = 0;
    var gallonsBuy = gallonsRounded;
    var remainder = gallonsRounded - gallonsExact;
    if (remainder > 0.6) {
      gallonsBuy = Math.floor(gallonsExact);
      quartsNeeded = Math.ceil((gallonsExact - gallonsBuy) * 4);
    }

    var totalCost = gallonsBuy * price + quartsNeeded * (price * 0.35);

    rGallons.textContent = gallonsBuy + ' gallon' + (gallonsBuy !== 1 ? 's' : '') + (quartsNeeded > 0 ? ' + ' + quartsNeeded + ' qt' : '');
    rCost.textContent = '$' + fmt(totalCost);

    var d = '';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem">';
    d += '<div><strong>Gross Wall Area</strong><br>' + fmt(wallSqft) + ' sq ft</div>';
    d += '<div><strong>Openings Subtracted</strong><br>' + fmt(openings) + ' sq ft</div>';
    d += '<div><strong>Net Wall Area</strong><br>' + fmt(netWall) + ' sq ft</div>';
    if (includeCeiling && inputMode === 'room') {
      d += '<div><strong>Ceiling Area</strong><br>' + fmt(ceilingSqft) + ' sq ft</div>';
    }
    d += '<div><strong>Total Paintable</strong><br>' + fmt(totalPaintable) + ' sq ft</div>';
    d += '<div><strong>With ' + coats + ' Coat' + (coats > 1 ? 's' : '') + '</strong><br>' + fmt(totalWithCoats) + ' sq ft of coverage</div>';
    d += '<div><strong>Coverage Rate</strong><br>' + fmt(coverage) + ' sq ft/gallon</div>';
    d += '<div><strong>Exact Amount</strong><br>' + fmt(gallonsExact, 1) + ' gallons</div>';
    d += '</div>';

    d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
    d += '<strong style="font-size:0.95rem">Purchase Recommendation</strong>';
    d += '<div style="font-size:0.9rem;margin-top:8px">';
    d += 'Buy: <strong>' + gallonsBuy + ' gallon' + (gallonsBuy !== 1 ? 's' : '') + '</strong>';
    if (quartsNeeded > 0) d += ' + <strong>' + quartsNeeded + ' quart' + (quartsNeeded !== 1 ? 's' : '') + '</strong>';
    d += '<br>Estimated cost: <strong>$' + fmt(totalCost) + '</strong>';
    d += '<br><span style="font-size:0.8rem;color:var(--text-light)">At $' + fmt(price, 2) + ' per gallon</span>';
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

  [roomLengthInput, roomWidthInput, wallHeightInput, wallAreaInput, doorCountInput, windowCountInput, priceInput].forEach(function(inp) {
    inp.addEventListener('input', calculate);
    inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });

  [coatsSelect, coverageSelect, ceilingSelect].forEach(function(sel) { sel.addEventListener('change', calculate); });
})();
