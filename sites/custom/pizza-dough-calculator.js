(function() {
  'use strict';

  // Ball weight in grams by pizza size (inches) — Neapolitan-ish
  var ballWeights = { 10: 190, 12: 270, 14: 350, 16: 440 };

  var presets = [
    { name: 'Neapolitan', hydration: 62, salt: 2.8, yeast: 0.15, oil: 0 },
    { name: 'New York Style', hydration: 67, salt: 2.5, yeast: 0.5, oil: 3 },
    { name: 'Same-Day Quick', hydration: 65, salt: 2.5, yeast: 1.2, oil: 2 },
    { name: 'Detroit / Pan', hydration: 72, salt: 2.5, yeast: 0.8, oil: 4 },
    { name: '72-Hour Cold Ferment', hydration: 63, salt: 2.8, yeast: 0.1, oil: 0 },
    { name: 'Thin & Crispy', hydration: 58, salt: 2.5, yeast: 0.5, oil: 3 }
  ];

  var presetGrid = document.getElementById('presetGrid');
  presets.forEach(function(p) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'preset-btn';
    btn.innerHTML = p.name + '<span>' + p.hydration + '% hydration</span>';
    btn.addEventListener('click', function() {
      document.getElementById('hydration').value = p.hydration;
      document.getElementById('saltPct').value = p.salt;
      document.getElementById('yeastPct').value = p.yeast;
      document.getElementById('oilPct').value = p.oil;
      calculate();
    });
    presetGrid.appendChild(btn);
  });

  function fermentationNote(yeastPct) {
    if (yeastPct <= 0.15) return 'Recommended: 24-72 hour cold ferment in refrigerator.';
    if (yeastPct <= 0.3) return 'Recommended: 16-24 hour cold ferment or 6-8 hours at room temp.';
    if (yeastPct <= 0.8) return 'Recommended: 4-8 hours at room temperature.';
    return 'Recommended: 1.5-3 hours at room temperature (same-day dough).';
  }

  function calculate() {
    var numPizzas = parseInt(document.getElementById('numPizzas').value) || 1;
    var size = parseInt(document.getElementById('pizzaSize').value) || 12;
    var hydration = parseFloat(document.getElementById('hydration').value) || 63;
    var saltPct = parseFloat(document.getElementById('saltPct').value) || 2.8;
    var yeastPct = parseFloat(document.getElementById('yeastPct').value) || 0.2;
    var oilPct = parseFloat(document.getElementById('oilPct').value) || 0;

    var ballWeight = ballWeights[size] || 270;
    var totalDough = ballWeight * numPizzas;

    // total dough = flour + water + salt + yeast + oil
    // flour = totalDough / (1 + hydration/100 + salt/100 + yeast/100 + oil/100)
    var divisor = 1 + hydration / 100 + saltPct / 100 + yeastPct / 100 + oilPct / 100;
    var flour = totalDough / divisor;
    var water = flour * hydration / 100;
    var salt = flour * saltPct / 100;
    var yeast = flour * yeastPct / 100;
    var oil = flour * oilPct / 100;

    var html = '<div style="display:grid;gap:8px;">';
    html += resultRow('Flour', flour.toFixed(0) + 'g', '100%');
    html += resultRow('Water', water.toFixed(0) + 'g', hydration + '%');
    html += resultRow('Salt', salt.toFixed(1) + 'g', saltPct + '%');
    html += resultRow('Yeast (instant)', yeast.toFixed(2) + 'g', yeastPct + '%');
    if (oil > 0) {
      html += resultRow('Olive Oil', oil.toFixed(1) + 'g', oilPct + '%');
    }
    html += '</div>';
    html += '<div style="margin-top:12px;padding:10px;background:#f3f4f6;border-radius:8px;font-size:0.9rem;">';
    html += '<strong>Total dough:</strong> ' + totalDough.toFixed(0) + 'g &bull; ';
    html += '<strong>Per ball:</strong> ' + ballWeight + 'g &bull; ';
    html += numPizzas + ' × ' + size + '" pizzas';
    html += '</div>';

    document.getElementById('doughOutput').innerHTML = html;
    document.getElementById('resultTip').textContent = fermentationNote(yeastPct);

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function resultRow(label, value, pct) {
    return '<div style="display:flex;justify-content:space-between;padding:10px;border-bottom:1px solid #e5e7eb;">' +
      '<span style="font-weight:600;">' + label + '</span>' +
      '<span>' + value + ' <span style="color:#888;font-size:0.85rem;">(' + pct + ')</span></span>' +
      '</div>';
  }

  document.getElementById('convertBtn').addEventListener('click', calculate);

})();
