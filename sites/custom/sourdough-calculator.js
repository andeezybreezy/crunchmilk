(function() {
  'use strict';

  function calculate() {
    var totalFlour = parseFloat(document.getElementById('totalFlour').value);
    var hydration = parseFloat(document.getElementById('hydration').value);
    var starterPct = parseFloat(document.getElementById('starterPct').value);
    var starterHydration = parseFloat(document.getElementById('starterHydration').value);
    var saltPct = parseFloat(document.getElementById('saltPct').value);

    if (isNaN(totalFlour) || totalFlour <= 0) return;

    // Total water needed based on baker's percentage
    var totalWater = totalFlour * hydration / 100;
    var totalSalt = totalFlour * saltPct / 100;

    // Starter weight
    var starterWeight = totalFlour * starterPct / 100;

    // Flour and water IN the starter
    // starter hydration = water_in_starter / flour_in_starter * 100
    // starterWeight = flour_in_starter + water_in_starter
    // flour_in_starter = starterWeight / (1 + starterHydration/100)
    var flourInStarter = starterWeight / (1 + starterHydration / 100);
    var waterInStarter = starterWeight - flourInStarter;

    // Final amounts to add
    var flourToAdd = totalFlour - flourInStarter;
    var waterToAdd = totalWater - waterInStarter;

    if (flourToAdd < 0) flourToAdd = 0;
    if (waterToAdd < 0) waterToAdd = 0;

    var totalDough = totalFlour + totalWater + totalSalt + (starterWeight - flourInStarter - waterInStarter);
    // Actually total dough = flourToAdd + waterToAdd + starterWeight + totalSalt
    totalDough = flourToAdd + waterToAdd + starterWeight + totalSalt;

    // Main recipe output
    var html = '<div style="display:grid;gap:4px;">';
    html += row('Flour (to add)', flourToAdd.toFixed(0) + 'g');
    html += row('Water (to add)', waterToAdd.toFixed(0) + 'g');
    html += row('Starter', starterWeight.toFixed(0) + 'g');
    html += row('Salt', totalSalt.toFixed(1) + 'g');
    html += '</div>';
    html += '<div style="margin-top:8px;padding:10px;background:#f3f4f6;border-radius:8px;font-size:0.9rem;">';
    html += '<strong>Total dough weight:</strong> ' + totalDough.toFixed(0) + 'g';
    html += '</div>';

    document.getElementById('doughOutput').innerHTML = html;

    // Breakdown
    var bk = '<div style="padding:12px;background:#fefce8;border:1px solid #fde68a;border-radius:8px;">';
    bk += '<strong>Starter Breakdown (' + starterWeight.toFixed(0) + 'g at ' + starterHydration + '% hydration):</strong><br>';
    bk += 'Flour in starter: ' + flourInStarter.toFixed(0) + 'g<br>';
    bk += 'Water in starter: ' + waterInStarter.toFixed(0) + 'g<br>';
    bk += '<br><strong>True Totals:</strong><br>';
    bk += 'Total flour (added + in starter): ' + totalFlour.toFixed(0) + 'g<br>';
    bk += 'Total water (added + in starter): ' + totalWater.toFixed(0) + 'g<br>';
    bk += 'Actual hydration: ' + (totalWater / totalFlour * 100).toFixed(1) + '%';
    bk += '</div>';

    document.getElementById('breakdownOutput').innerHTML = bk;

    // Levain build calculator
    // Build enough levain: need starterWeight of ripe starter
    // Typical 1:5:5 build means seedAmount = starterWeight / 11, flour = water = starterWeight * 5/11
    var seedAmount = Math.ceil(starterWeight / 11);
    var levainFlour = Math.ceil(starterWeight * 5 / 11);
    var levainWater = Math.ceil(starterWeight * 5 / 11);

    var lv = '<div style="padding:12px;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:8px;">';
    lv += '<strong>Levain Build (night before):</strong><br>';
    lv += 'Ripe starter (seed): ' + seedAmount + 'g<br>';
    lv += 'Flour: ' + levainFlour + 'g<br>';
    lv += 'Water: ' + levainWater + 'g<br>';
    lv += '<span style="color:#666;font-size:0.85rem;">Mix and let ferment 8-12 hours at room temp. Use when doubled and domed.</span>';
    lv += '</div>';

    document.getElementById('levainOutput').innerHTML = lv;

    document.getElementById('resultTip').textContent = 'Use a kitchen scale for best results. Autolyse flour and water 30-60 min before adding starter and salt.';

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function row(label, value) {
    return '<div style="display:flex;justify-content:space-between;padding:10px;border-bottom:1px solid #e5e7eb;">' +
      '<span style="font-weight:600;">' + label + '</span>' +
      '<span>' + value + '</span></div>';
  }

  document.getElementById('convertBtn').addEventListener('click', calculate);

})();
