(function() {
  'use strict';

  var origShape = document.getElementById('origShape');
  var targetShape = document.getElementById('targetShape');
  var origDim1 = document.getElementById('origDim1');
  var origDim2 = document.getElementById('origDim2');
  var targetDim1 = document.getElementById('targetDim1');
  var targetDim2 = document.getElementById('targetDim2');

  function toggleDim2(shapeEl, dim2El) {
    if (shapeEl.value === 'rectangle') {
      dim2El.style.display = '';
      dim2El.placeholder = 'Length (in)';
      dim2El.parentElement.querySelector('[aria-label*="dimension 1"]') && (dim2El.previousElementSibling.placeholder = 'Width (in)');
    } else {
      dim2El.style.display = 'none';
      dim2El.value = '';
      var d1 = dim2El.previousElementSibling || dim2El.parentElement.querySelector('input');
      if (shapeEl.value === 'round') d1.placeholder = 'Diameter (in)';
      else d1.placeholder = 'Side length (in)';
    }
  }

  origShape.addEventListener('change', function() {
    toggleDim2(origShape, origDim2);
    if (origShape.value === 'round') origDim1.placeholder = 'Diameter (in)';
    else if (origShape.value === 'square') origDim1.placeholder = 'Side length (in)';
    else origDim1.placeholder = 'Width (in)';
  });

  targetShape.addEventListener('change', function() {
    toggleDim2(targetShape, targetDim2);
    if (targetShape.value === 'round') targetDim1.placeholder = 'Diameter (in)';
    else if (targetShape.value === 'square') targetDim1.placeholder = 'Side length (in)';
    else targetDim1.placeholder = 'Width (in)';
  });

  function getArea(shape, d1, d2) {
    if (shape === 'round') return Math.PI * (d1 / 2) * (d1 / 2);
    if (shape === 'square') return d1 * d1;
    return d1 * d2;
  }

  var presets = [
    ['8" Round → 9" Round', 'round', 8, 0, 'round', 9, 0],
    ['8" Round → 8" Square', 'round', 8, 0, 'square', 8, 0],
    ['9" Round → 9×13 Rect', 'round', 9, 0, 'rectangle', 9, 13],
    ['8" Square → 9" Round', 'square', 8, 0, 'round', 9, 0],
    ['9×13 → Two 9" Rounds', 'rectangle', 9, 13, 'round', 9, 0],
    ['10" Round → 8" Square', 'round', 10, 0, 'square', 8, 0]
  ];

  var presetGrid = document.getElementById('presetGrid');
  presets.forEach(function(p) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'preset-btn';
    btn.textContent = p[0];
    btn.addEventListener('click', function() {
      origShape.value = p[1];
      origDim1.value = p[2];
      origDim2.value = p[3] || '';
      targetShape.value = p[4];
      targetDim1.value = p[5];
      targetDim2.value = p[6] || '';
      toggleDim2(origShape, origDim2);
      toggleDim2(targetShape, targetDim2);
      if (origShape.value === 'round') origDim1.placeholder = 'Diameter (in)';
      else if (origShape.value === 'square') origDim1.placeholder = 'Side length (in)';
      else origDim1.placeholder = 'Width (in)';
      if (targetShape.value === 'round') targetDim1.placeholder = 'Diameter (in)';
      else if (targetShape.value === 'square') targetDim1.placeholder = 'Side length (in)';
      else targetDim1.placeholder = 'Width (in)';
      calculate();
    });
    presetGrid.appendChild(btn);
  });

  function calculate() {
    var os = origShape.value;
    var ts = targetShape.value;
    var od1 = parseFloat(origDim1.value);
    var od2 = parseFloat(origDim2.value);
    var td1 = parseFloat(targetDim1.value);
    var td2 = parseFloat(targetDim2.value);

    if (isNaN(od1) || od1 <= 0 || isNaN(td1) || td1 <= 0) return;
    if (os === 'rectangle' && (isNaN(od2) || od2 <= 0)) return;
    if (ts === 'rectangle' && (isNaN(td2) || td2 <= 0)) return;

    var origArea = getArea(os, od1, od2);
    var targetArea = getArea(ts, td1, td2);
    var factor = targetArea / origArea;

    document.getElementById('scaleFactor').textContent = factor.toFixed(2) + '×';
    document.getElementById('areaRatio').innerHTML =
      targetArea.toFixed(1) + ' / ' + origArea.toFixed(1) + ' sq in';

    var examples = [
      ['1 cup flour', (1 * factor).toFixed(2) + ' cups flour'],
      ['1 cup sugar', (1 * factor).toFixed(2) + ' cups sugar'],
      ['2 eggs', (2 * factor).toFixed(1) + ' eggs'],
      ['1 tsp vanilla', (1 * factor).toFixed(2) + ' tsp vanilla'],
      ['½ cup butter', (0.5 * factor).toFixed(2) + ' cups butter']
    ];

    var html = '<h4 style="margin:8px 0 4px;">Example Scaling (per original amount):</h4>';
    examples.forEach(function(ex) {
      html += '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #e5e7eb;">' +
        '<span>' + ex[0] + '</span><span style="font-weight:600;">' + ex[1] + '</span></div>';
    });

    document.getElementById('detailOutput').innerHTML = html;

    var tip = '';
    if (factor > 1.3) tip = 'Larger pan — batter will be thinner. Reduce baking time by 5-10 minutes and check early.';
    else if (factor < 0.7) tip = 'Smaller pan — batter will be thicker. Increase baking time by 5-15 minutes and reduce temp 25°F.';
    else tip = 'Similar size — baking time should be about the same.';

    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', calculate);

})();
