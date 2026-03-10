(function() {
  'use strict';

  var unit = 'cups';

  // Butter: 1 cup = 16 tbsp = 2 sticks = 227 grams
  function toTbsp(amount, u) {
    switch (u) {
      case 'cups': return amount * 16;
      case 'tbsp': return amount;
      case 'sticks': return amount * 8;
      case 'grams': return amount / 14.175;
      default: return amount;
    }
  }

  function fmtAmount(tbsp) {
    var cups = tbsp / 16;
    if (cups >= 1) return cups.toFixed(2).replace(/\.?0+$/, '') + ' cups (' + tbsp.toFixed(1).replace(/\.0$/, '') + ' tbsp)';
    if (tbsp >= 1) return tbsp.toFixed(1).replace(/\.0$/, '') + ' tbsp';
    var tsp = tbsp * 3;
    return tsp.toFixed(1).replace(/\.0$/, '') + ' tsp';
  }

  function fmtGrams(tbsp) {
    return (tbsp * 14.175).toFixed(0) + 'g';
  }

  var toggleBtns = document.querySelectorAll('.unit-toggle button');
  toggleBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      toggleBtns.forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      unit = btn.dataset.unit;
    });
  });

  var presets = [
    ['1 Tbsp', 1, 'tbsp'],
    ['¼ Cup', 0.25, 'cups'],
    ['½ Cup (1 stick)', 0.5, 'cups'],
    ['1 Cup (2 sticks)', 1, 'cups'],
    ['1½ Cups', 1.5, 'cups'],
    ['2 Cups (1 lb)', 2, 'cups']
  ];

  var presetGrid = document.getElementById('presetGrid');
  presets.forEach(function(p) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'preset-btn';
    btn.textContent = p[0];
    btn.addEventListener('click', function() {
      document.getElementById('butterAmount').value = p[1];
      unit = p[2];
      toggleBtns.forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      toggleBtns.forEach(function(b) {
        if (b.dataset.unit === unit) {
          b.classList.add('active');
          b.setAttribute('aria-pressed', 'true');
        }
      });
      calculate();
    });
    presetGrid.appendChild(btn);
  });

  function calculate() {
    var amount = parseFloat(document.getElementById('butterAmount').value);
    if (isNaN(amount) || amount <= 0) return;

    var butterTbsp = toTbsp(amount, unit);
    var butterGrams = butterTbsp * 14.175;

    var substitutes = [
      { name: 'Vegetable / Canola Oil', ratio: 0.75, note: 'Best all-purpose substitute. Add 1 tbsp water per ¼ cup replaced.' },
      { name: 'Olive Oil', ratio: 0.75, note: 'Use light/mild for baking. Extra-virgin for savory recipes.' },
      { name: 'Coconut Oil', ratio: 1.0, note: 'Melt for liquid recipes. 1:1 replacement. Adds slight coconut flavor.' },
      { name: 'Applesauce (unsweetened)', ratio: 0.5, note: 'Reduces fat/calories. Best for muffins, quick breads. Makes items more moist.' },
      { name: 'Greek Yogurt', ratio: 0.5, note: 'Adds protein and tang. Works well in cakes and muffins.' },
      { name: 'Avocado (mashed)', ratio: 1.0, note: '1:1 replacement. Adds healthy fats. May tint batter green.' }
    ];

    var html = '';
    substitutes.forEach(function(sub) {
      var subTbsp = butterTbsp * sub.ratio;
      html += '<div style="padding:12px;border-bottom:1px solid #e5e7eb;">' +
        '<div style="display:flex;justify-content:space-between;align-items:baseline;">' +
        '<span style="font-weight:600;">' + sub.name + '</span>' +
        '<span style="font-weight:700;font-size:1.1rem;">' + fmtAmount(subTbsp) + '</span>' +
        '</div>' +
        '<div style="font-size:0.85rem;color:#666;margin-top:4px;">' + fmtGrams(subTbsp) + ' &bull; ' + sub.note + '</div>' +
        '</div>';
    });

    // Show original butter in all units
    html += '<div style="padding:12px;background:#f3f4f6;border-radius:8px;margin-top:8px;">' +
      '<strong>Original butter:</strong> ' +
      (butterTbsp / 16).toFixed(2).replace(/\.?0+$/, '') + ' cups = ' +
      butterTbsp.toFixed(1).replace(/\.0$/, '') + ' tbsp = ' +
      (butterTbsp / 8).toFixed(2).replace(/\.?0+$/, '') + ' sticks = ' +
      butterGrams.toFixed(0) + 'g' +
      '</div>';

    document.getElementById('substituteOutput').innerHTML = html;
    document.getElementById('resultTip').textContent = 'For best results, substitute only half the butter at first and adjust in future batches.';

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', calculate);
  document.getElementById('butterAmount').addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });

})();
