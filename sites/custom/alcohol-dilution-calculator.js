(function() {
  'use strict';

  var volUnit = 'ml';
  var toggleBtns = document.querySelectorAll('.unit-toggle button');
  toggleBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      toggleBtns.forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      volUnit = btn.dataset.unit;
    });
  });

  function toMl(val, u) {
    if (u === 'ml') return val;
    if (u === 'oz') return val * 29.5735;
    if (u === 'liters') return val * 1000;
    return val;
  }

  function fmtVol(ml) {
    if (volUnit === 'oz') return (ml / 29.5735).toFixed(1) + ' fl oz';
    if (volUnit === 'liters') return (ml / 1000).toFixed(3) + ' L';
    return ml.toFixed(1) + ' ml';
  }

  var presets = [
    ['Cask Strength → 43%', 63, 43, 750, 'ml'],
    ['Barrel Proof → 40%', 55, 40, 750, 'ml'],
    ['Overproof Rum → 40%', 75.5, 40, 750, 'ml'],
    ['Moonshine → 45%', 65, 45, 1000, 'ml'],
    ['Limoncello → 28%', 50, 28, 500, 'ml'],
    ['Everclear → 40%', 95, 40, 750, 'ml']
  ];

  var presetGrid = document.getElementById('presetGrid');
  presets.forEach(function(p) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'preset-btn';
    btn.innerHTML = p[0] + '<span>' + p[3] + ' ' + p[4] + '</span>';
    btn.addEventListener('click', function() {
      document.getElementById('currentAbv').value = p[1];
      document.getElementById('targetAbv').value = p[2];
      document.getElementById('volume').value = p[3];
      volUnit = p[4];
      toggleBtns.forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      toggleBtns.forEach(function(b) {
        if (b.dataset.unit === volUnit) {
          b.classList.add('active');
          b.setAttribute('aria-pressed', 'true');
        }
      });
      calculate();
    });
    presetGrid.appendChild(btn);
  });

  function calculate() {
    var currentAbv = parseFloat(document.getElementById('currentAbv').value);
    var targetAbv = parseFloat(document.getElementById('targetAbv').value);
    var volume = parseFloat(document.getElementById('volume').value);

    if (isNaN(currentAbv) || isNaN(targetAbv) || isNaN(volume)) return;
    if (currentAbv <= 0 || targetAbv <= 0 || volume <= 0) return;
    if (targetAbv >= currentAbv) {
      document.getElementById('waterToAdd').textContent = 'Target must be lower than current ABV';
      document.getElementById('finalVolume').textContent = '—';
      document.getElementById('proofInfo').innerHTML = '';
      document.getElementById('resultTip').textContent = '';
      var resultEl = document.getElementById('result');
      resultEl.classList.add('visible');
      return;
    }

    var volMl = toMl(volume, volUnit);

    // Pearson's formula: water = V * (C1/C2 - 1)
    var waterMl = volMl * (currentAbv / targetAbv - 1);
    var finalMl = volMl + waterMl;

    document.getElementById('waterToAdd').innerHTML = fmtVol(waterMl) +
      '<div style="font-size:0.85rem;color:#666;">' + (waterMl / 29.5735).toFixed(1) + ' fl oz / ' + waterMl.toFixed(0) + ' ml</div>';
    document.getElementById('finalVolume').innerHTML = fmtVol(finalMl) +
      '<div style="font-size:0.85rem;color:#666;">' + (finalMl / 29.5735).toFixed(1) + ' fl oz / ' + finalMl.toFixed(0) + ' ml</div>';

    document.getElementById('proofInfo').innerHTML =
      '<div style="padding:10px;background:#f3f4f6;border-radius:8px;font-size:0.9rem;">' +
      '<strong>Current:</strong> ' + currentAbv.toFixed(1) + '% ABV (' + (currentAbv * 2).toFixed(0) + ' proof) &bull; ' +
      '<strong>Target:</strong> ' + targetAbv.toFixed(1) + '% ABV (' + (targetAbv * 2).toFixed(0) + ' proof)' +
      '<br><strong>Pure alcohol:</strong> ' + (volMl * currentAbv / 100).toFixed(1) + ' ml (unchanged)' +
      '</div>';

    document.getElementById('resultTip').textContent =
      'Add distilled water slowly and stir. Let rest 24-48 hours for flavors to integrate. Measure ABV at 60°F (15.6°C) for accuracy.';

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', calculate);
  ['currentAbv', 'targetAbv', 'volume'].forEach(function(id) {
    document.getElementById(id).addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });

})();
