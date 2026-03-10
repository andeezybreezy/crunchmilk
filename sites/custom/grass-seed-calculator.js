(function() {
  'use strict';

  // Seeding rates: [newLawn lbs per 1000sqft, overseed lbs per 1000sqft, label, season]
  var grassRates = {
    'kbg':          [2.5, 1.5, 'Kentucky Bluegrass', 'Cool'],
    'fescue_tall':  [7, 3.5, 'Tall Fescue', 'Cool'],
    'fescue_fine':  [4.5, 2.5, 'Fine Fescue', 'Cool'],
    'perennial_rye':[7, 3.5, 'Perennial Ryegrass', 'Cool'],
    'bermuda':      [1.5, 0.75, 'Bermuda Grass', 'Warm'],
    'zoysia':       [2.5, 1.5, 'Zoysia Grass', 'Warm'],
    'bahia':        [9, 4.5, 'Bahia Grass', 'Warm'],
    'centipede':    [1.5, 0.75, 'Centipede Grass', 'Warm'],
    'buffalo':      [4.5, 2.5, 'Buffalo Grass', 'Warm']
  };

  var chartData = [
    ['Kentucky Bluegrass', '2–3', '1–2', 'Cool'],
    ['Tall Fescue', '6–8', '3–4', 'Cool'],
    ['Fine Fescue', '4–5', '2–3', 'Cool'],
    ['Perennial Ryegrass', '6–8', '3–4', 'Cool'],
    ['Bermuda Grass', '1–2', '0.5–1', 'Warm'],
    ['Zoysia Grass', '2–3', '1–2', 'Warm'],
    ['Bahia Grass', '8–10', '4–5', 'Warm'],
    ['Centipede Grass', '1–2', '0.5–1', 'Warm'],
    ['Buffalo Grass', '3–6', '2–3', 'Warm']
  ];

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 2;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
  function fmtDollars(n) { return '$' + fmt(n, 2); }

  var lawnLength = document.getElementById('lawnLength');
  var lawnWidth = document.getElementById('lawnWidth');
  var areaSqftInput = document.getElementById('areaSqft');
  var grassTypeSelect = document.getElementById('grassType');
  var seedingTypeSelect = document.getElementById('seedingType');
  var rateHint = document.getElementById('rateHint');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');
  var rLbs = document.getElementById('rLbs');
  var rBags = document.getElementById('rBags');
  var resultDetails = document.getElementById('resultDetails');

  var areaMode = 'rect';
  var areaToggle = document.getElementById('areaToggle');
  var areaToggleBtns = areaToggle.querySelectorAll('button');
  var rectInputs = document.getElementById('rectInputs');
  var sqftInputDiv = document.getElementById('sqftInput');

  areaToggleBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      areaToggleBtns.forEach(function(b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      areaMode = btn.dataset.mode;
      rectInputs.style.display = areaMode === 'rect' ? '' : 'none';
      sqftInputDiv.style.display = areaMode === 'sqft' ? '' : 'none';
      calculate();
    });
  });

  seedingTypeSelect.addEventListener('change', function() {
    rateHint.textContent = seedingTypeSelect.value === 'new'
      ? 'New lawns need 2-3x more seed than overseeding'
      : 'Overseeding uses about half the new lawn rate';
    calculate();
  });

  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function calculate() {
    var area;
    if (areaMode === 'rect') {
      var len = parseFloat(lawnLength.value);
      var wid = parseFloat(lawnWidth.value);
      if (isNaN(len) || isNaN(wid) || len <= 0 || wid <= 0) { hideResult(); return; }
      area = len * wid;
    } else {
      area = parseFloat(areaSqftInput.value);
      if (isNaN(area) || area <= 0) { hideResult(); return; }
    }

    var grass = grassRates[grassTypeSelect.value];
    var isNew = seedingTypeSelect.value === 'new';
    var ratePer1000 = isNew ? grass[0] : grass[1];
    var seedLbs = (area / 1000) * ratePer1000;

    // Bags: 5 lb and 25 lb are common
    var bags5 = Math.ceil(seedLbs / 5);
    var bags25 = Math.ceil(seedLbs / 25);
    var bagLabel;
    if (seedLbs <= 15) {
      bagLabel = bags5 + ' × 5-lb bag' + (bags5 > 1 ? 's' : '');
    } else {
      bagLabel = bags25 + ' × 25-lb bag' + (bags25 > 1 ? 's' : '');
    }

    rLbs.textContent = fmt(seedLbs, 1) + ' lbs';
    rBags.textContent = bagLabel;

    var d = '';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem">';
    d += '<div><strong>Lawn Area</strong><br>' + fmt(area, 0) + ' sq ft</div>';
    d += '<div><strong>Grass Type</strong><br>' + grass[2] + ' (' + grass[3] + ' season)</div>';
    d += '<div><strong>Seeding Type</strong><br>' + (isNew ? 'New Lawn' : 'Overseeding') + '</div>';
    d += '<div><strong>Application Rate</strong><br>' + ratePer1000 + ' lbs per 1,000 sq ft</div>';
    d += '<div><strong>Seed Needed</strong><br>' + fmt(seedLbs, 1) + ' lbs</div>';
    d += '<div><strong>Bags</strong><br>' + bagLabel + '</div>';
    d += '</div>';

    // Cost estimate
    var costPerLb = 5; // average
    var seedCost = seedLbs * costPerLb;
    var fertCost = (area / 1000) * 5; // ~$5 per 1000 sqft for starter fert
    d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
    d += '<strong style="font-size:0.95rem">Estimated Costs</strong>';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem;margin-top:8px">';
    d += '<div><strong>Seed</strong><br>' + fmtDollars(seedLbs * 3) + ' – ' + fmtDollars(seedLbs * 8) + ' <span style="font-size:0.8rem;color:var(--text-light)">$3-$8/lb</span></div>';
    d += '<div><strong>Starter Fertilizer</strong><br>~' + fmtDollars(fertCost) + '</div>';
    d += '</div></div>';

    // Timing tip
    var timing = grass[3] === 'Cool'
      ? 'Best time to seed: early fall (September) or early spring.'
      : 'Best time to seed: late spring to early summer when soil is 65°F+.';
    d += '<div style="margin-top:12px;padding:10px 14px;background:#f0fdf4;border-radius:8px;font-size:0.85rem;color:#166534"><strong>Timing Tip:</strong> ' + timing + '</div>';

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
    if (resultEl.classList.contains('visible')) resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  [lawnLength, lawnWidth, areaSqftInput].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });
  [grassTypeSelect, seedingTypeSelect].forEach(function(sel) { sel.addEventListener('change', calculate); });
})();
