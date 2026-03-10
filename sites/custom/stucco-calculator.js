(function() {
  'use strict';

  var wallAreaInput = document.getElementById('wallArea');
  var windowCountInput = document.getElementById('windowCount');
  var doorCountInput = document.getElementById('doorCount');
  var coatTypeSelect = document.getElementById('coatType');
  var bagCostInput = document.getElementById('bagCost');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');
  var rArea = document.getElementById('rArea');
  var rBags = document.getElementById('rBags');
  var resultDetails = document.getElementById('resultDetails');

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 0;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  function calculate() {
    var grossArea = parseFloat(wallAreaInput.value);
    if (isNaN(grossArea) || grossArea <= 0) { hideResult(); return; }

    var windows = parseInt(windowCountInput.value) || 0;
    var doors = parseInt(doorCountInput.value) || 0;
    var coatType = coatTypeSelect.value;
    var bagCost = parseFloat(bagCostInput.value) || 10;

    var netArea = grossArea - (windows * 15) - (doors * 21);
    if (netArea <= 0) { hideResult(); return; }

    var wasteMult = 1.10; // 10% waste

    // Coverage per 80lb bag
    var scratchBags = 0, brownBags = 0, finishBags = 0;

    if (coatType === 'all' || coatType === 'scratch') {
      scratchBags = Math.ceil((netArea / 100) * wasteMult);
    }
    if (coatType === 'all' || coatType === 'brown') {
      brownBags = Math.ceil((netArea / 100) * wasteMult);
    }
    if (coatType === 'all' || coatType === 'finish') {
      finishBags = Math.ceil((netArea / 300) * wasteMult);
    }

    var totalBags = scratchBags + brownBags + finishBags;
    var totalWeight = totalBags * 80;
    var totalCost = totalBags * bagCost;

    // Metal lath: ~1 sheet (2.5' x 8' = 20sqft) per 20 sqft, with overlap need ~10% more
    var lathSheets = Math.ceil((netArea / 20) * 1.1);

    // Wire/lath ties: ~1 per sqft
    var lathFasteners = Math.ceil(netArea * 0.5);

    // Weep screed: perimeter - assume sqrt(area)*4 rough estimate
    var weepScreedFt = Math.ceil(Math.sqrt(netArea) * 2);

    rArea.textContent = fmt(netArea) + ' sq ft';
    rBags.textContent = totalBags + ' bags';

    var d = '';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem">';
    d += '<div><strong>Gross Wall Area</strong><br>' + fmt(grossArea) + ' sq ft</div>';
    d += '<div><strong>Subtracted</strong><br>' + (windows * 15 + doors * 21) + ' sq ft (' + windows + ' win, ' + doors + ' door)</div>';
    d += '<div><strong>Net Wall Area</strong><br>' + fmt(netArea) + ' sq ft</div>';
    d += '<div><strong>Total Weight</strong><br>' + fmt(totalWeight) + ' lbs</div>';
    d += '</div>';

    d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
    d += '<strong style="font-size:0.95rem">Bags by Coat</strong>';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 24px;font-size:0.9rem;margin-top:8px">';
    if (scratchBags > 0) d += '<div>Scratch coat (3/8"): <strong>' + scratchBags + ' bags</strong></div>';
    if (brownBags > 0) d += '<div>Brown coat (3/8"): <strong>' + brownBags + ' bags</strong></div>';
    if (finishBags > 0) d += '<div>Finish coat (1/8"): <strong>' + finishBags + ' bags</strong></div>';
    d += '<div>Total bags: <strong>' + totalBags + '</strong> (80 lb each)</div>';
    d += '</div></div>';

    if (coatType === 'all' || coatType === 'scratch') {
      d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
      d += '<strong style="font-size:0.95rem">Additional Materials</strong>';
      d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 24px;font-size:0.9rem;margin-top:8px">';
      d += '<div>Metal lath sheets: <strong>' + lathSheets + '</strong></div>';
      d += '<div>Lath fasteners: <strong>~' + fmt(lathFasteners) + '</strong></div>';
      d += '<div>Weep screed: <strong>~' + weepScreedFt + ' linear ft</strong></div>';
      d += '</div></div>';
    }

    d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
    d += '<strong style="font-size:0.95rem">Cost Estimate</strong>';
    d += '<div style="font-size:0.9rem;margin-top:8px">';
    d += 'Stucco mix: <strong>$' + fmt(totalCost) + '</strong> (' + totalBags + ' bags &times; $' + fmt(bagCost, 2) + ')<br>';
    d += '<span style="font-size:0.8rem;color:var(--text-light)">Does not include lath, fasteners, or labor.</span>';
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

  [wallAreaInput, windowCountInput, doorCountInput, bagCostInput].forEach(function(inp) {
    inp.addEventListener('input', calculate);
    inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });

  coatTypeSelect.addEventListener('change', calculate);
})();
