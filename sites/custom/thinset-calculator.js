(function() {
  'use strict';

  var tileAreaInput = document.getElementById('tileArea');
  var tileSizeSelect = document.getElementById('tileSize');
  var trowelSelect = document.getElementById('trowelSize');
  var backButterSelect = document.getElementById('backButter');
  var wasteSelect = document.getElementById('wastePercent');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');
  var rBags = document.getElementById('rBags');
  var rWeight = document.getElementById('rWeight');
  var resultDetails = document.getElementById('resultDetails');

  // Auto-select trowel based on tile size
  tileSizeSelect.addEventListener('change', function() {
    var ts = tileSizeSelect.value;
    var trowelMap = { mosaic: '95', small: '95', medium: '70', large: '50', xlarge: '40', plank: '50' };
    if (trowelMap[ts]) trowelSelect.value = trowelMap[ts];
    calculate();
  });

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 0;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  function calculate() {
    var area = parseFloat(tileAreaInput.value);
    if (isNaN(area) || area <= 0) { hideResult(); return; }

    var coveragePerBag = parseFloat(trowelSelect.value); // sq ft per 50lb bag
    var wastePct = parseFloat(wasteSelect.value) / 100;
    var backButter = backButterSelect.value === 'yes';

    var effectiveArea = area * (1 + wastePct);
    if (backButter) effectiveArea *= 1.15;

    var bagsExact = effectiveArea / coveragePerBag;
    var bags = Math.ceil(bagsExact);
    var totalWeight = bags * 50;

    rBags.textContent = bags + ' bag' + (bags !== 1 ? 's' : '');
    rWeight.textContent = fmt(totalWeight) + ' lbs';

    var trowelLabel = trowelSelect.options[trowelSelect.selectedIndex].text.split('—')[0].trim();
    var tileLabel = tileSizeSelect.options[tileSizeSelect.selectedIndex].text;

    var d = '';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem">';
    d += '<div><strong>Tile Area</strong><br>' + fmt(area) + ' sq ft</div>';
    d += '<div><strong>Tile Size</strong><br>' + tileLabel + '</div>';
    d += '<div><strong>Trowel Notch</strong><br>' + trowelLabel + '</div>';
    d += '<div><strong>Coverage per Bag</strong><br>' + fmt(coveragePerBag) + ' sq ft</div>';
    if (backButter) d += '<div><strong>Back-Butter</strong><br>+15% thinset</div>';
    d += '<div><strong>With ' + (wastePct * 100) + '% Waste</strong><br>' + fmt(effectiveArea, 1) + ' sq ft effective</div>';
    d += '<div><strong>Bags (exact)</strong><br>' + fmt(bagsExact, 1) + '</div>';
    d += '<div><strong>Bags (rounded up)</strong><br>' + bags + ' &times; 50 lb = ' + fmt(totalWeight) + ' lbs</div>';
    d += '</div>';

    d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da;font-size:0.85rem;color:var(--text-light)">';
    d += 'Based on standard 50 lb bags of modified thinset mortar. Actual coverage may vary with substrate flatness and application technique.';
    d += '</div>';

    resultDetails.innerHTML = d;
    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  function hideResult() { resultEl.classList.remove('visible'); resultEl.style.display = 'none'; }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  tileAreaInput.addEventListener('input', calculate);
  tileAreaInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });

  [tileSizeSelect, trowelSelect, backButterSelect, wasteSelect].forEach(function(sel) {
    sel.addEventListener('change', calculate);
  });
})();
