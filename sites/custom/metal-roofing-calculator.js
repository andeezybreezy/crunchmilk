(function() {
  'use strict';

  var pitchSelect = document.getElementById('roofPitch');
  var lengthInput = document.getElementById('roofLength');
  var widthInput = document.getElementById('roofWidth');
  var panelWidthSelect = document.getElementById('panelWidth');
  var wasteSelect = document.getElementById('wastePercent');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');
  var rArea = document.getElementById('rArea');
  var rPanels = document.getElementById('rPanels');
  var resultDetails = document.getElementById('resultDetails');

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 0;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  function calculate() {
    var len = parseFloat(lengthInput.value);
    var wid = parseFloat(widthInput.value);
    var pitchMult = parseFloat(pitchSelect.value);
    var panelW = parseFloat(panelWidthSelect.value);
    var wastePct = parseFloat(wasteSelect.value) / 100;

    if (isNaN(len) || isNaN(wid) || len <= 0 || wid <= 0) { hideResult(); return; }

    var flatArea = len * wid;
    var adjArea = flatArea * pitchMult;
    var adjAreaWaste = adjArea * (1 + wastePct);

    // Panels: roof length / panel coverage width (in feet)
    var panelCovFt = panelW / 12;
    var panelsAcross = Math.ceil(wid / panelCovFt);
    var panelsWithWaste = Math.ceil(panelsAcross * (1 + wastePct));

    // Ridge cap: length of ridge = roof length; pieces are 10ft with 6" overlap
    var ridgeLinFt = len;
    var ridgeCapPieces = Math.ceil(ridgeLinFt / 9.5);

    // Trim: eave trim (2 x width), gable trim (2 x roof slope length)
    var slopeLen = len * pitchMult;
    var eaveTrimFt = wid * 2;
    var gableTrimFt = slopeLen * 2;
    var totalTrimFt = eaveTrimFt + gableTrimFt;
    var trimPieces = Math.ceil(totalTrimFt / 10); // 10ft pieces

    // Screws: ~80 per 100 sqft
    var screws = Math.ceil(adjAreaWaste / 100 * 80);

    // Underlayment: 1 roll = ~1000 sqft
    var underlaymentRolls = Math.ceil(adjAreaWaste / 1000);

    // Closure strips: 2 per panel (top and bottom)
    var closureStrips = panelsWithWaste * 2;

    rArea.textContent = fmt(adjArea) + ' sq ft';
    rPanels.textContent = panelsWithWaste + ' panels';

    var d = '';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem">';
    d += '<div><strong>Flat Area</strong><br>' + fmt(flatArea) + ' sq ft</div>';
    d += '<div><strong>Adjusted for Pitch</strong><br>' + fmt(adjArea) + ' sq ft</div>';
    d += '<div><strong>With ' + (wastePct * 100) + '% Waste</strong><br>' + fmt(adjAreaWaste) + ' sq ft</div>';
    d += '<div><strong>Panels Needed</strong><br>' + panelsWithWaste + ' panels (' + panelW + '" wide)</div>';
    d += '<div><strong>Ridge Cap</strong><br>' + fmt(ridgeLinFt) + ' linear ft (' + ridgeCapPieces + ' pieces)</div>';
    d += '<div><strong>Trim Pieces</strong><br>' + trimPieces + ' pieces (10\' lengths)</div>';
    d += '<div><strong>Screws</strong><br>' + fmt(screws) + ' screws</div>';
    d += '<div><strong>Underlayment</strong><br>' + underlaymentRolls + ' roll' + (underlaymentRolls !== 1 ? 's' : '') + '</div>';
    d += '<div><strong>Closure Strips</strong><br>' + closureStrips + ' strips</div>';
    d += '</div>';

    d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
    d += '<strong style="font-size:0.95rem">Trim Breakdown</strong>';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 24px;font-size:0.9rem;margin-top:8px">';
    d += '<div>Eave trim: ' + fmt(eaveTrimFt) + ' linear ft</div>';
    d += '<div>Gable trim: ' + fmt(gableTrimFt, 1) + ' linear ft</div>';
    d += '</div></div>';

    resultDetails.innerHTML = d;
    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  function hideResult() {
    resultEl.classList.remove('visible');
    resultEl.style.display = 'none';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  [lengthInput, widthInput].forEach(function(inp) {
    inp.addEventListener('input', calculate);
    inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });

  [pitchSelect, panelWidthSelect, wasteSelect].forEach(function(sel) {
    sel.addEventListener('change', calculate);
  });
})();
