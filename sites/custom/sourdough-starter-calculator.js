(function() {
  'use strict';

  var chartData = [
    ['1:1:1', '4-6 hours', 'Tangy, strong', 'Daily baking, quick turnaround'],
    ['1:2:2', '6-8 hours', 'Mildly tangy', 'Twice-daily feeding, evening levain'],
    ['1:3:3', '7-10 hours', 'Balanced', 'Overnight levain build'],
    ['1:5:5', '8-12 hours', 'Mild, complex', 'Overnight levain, artisan bread'],
    ['1:8:8', '10-14 hours', 'Very mild', 'Cold kitchen, slow fermentation'],
    ['1:10:10', '12-16 hours', 'Mild, wheaty', 'Very slow builds, stiff starters'],
    ['1:1:1 (cold)', '12-24 hours', 'Tangy', 'Fridge retard after feeding'],
    ['1:5:5 (cold)', '24-48 hours', 'Complex, mild', 'Multi-day cold fermentation']
  ];

  var chartBody = document.getElementById('chartBody');
  if (chartBody && chartBody.children.length === 0) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function calculate() {
    var starterAmount = parseFloat(document.getElementById('starterAmount').value);
    var flourRatio = parseFloat(document.getElementById('flourRatio').value) || 1;
    var waterRatio = parseFloat(document.getElementById('waterRatio').value) || 1;
    var targetTotalRaw = document.getElementById('targetTotal').value;
    var hydration = parseFloat(document.getElementById('hydration').value) || 100;

    if (isNaN(starterAmount) || starterAmount <= 0) return;

    var keepStarter, addFlour, addWater;

    if (targetTotalRaw && parseFloat(targetTotalRaw) > 0) {
      // Target mode: figure out amounts to hit a total weight
      var targetTotal = parseFloat(targetTotalRaw);
      var totalParts = 1 + flourRatio + waterRatio;
      keepStarter = Math.round(targetTotal / totalParts);
      addFlour = Math.round(keepStarter * flourRatio);
      addWater = Math.round(keepStarter * waterRatio);
    } else {
      // Standard ratio mode
      keepStarter = Math.round(starterAmount);
      addFlour = Math.round(starterAmount * flourRatio);
      addWater = Math.round(starterAmount * waterRatio);
    }

    // Adjust water for target hydration if not 100%
    // At 100% hydration, flour = water. At other hydrations, water = flour * (hydration/100)
    if (hydration !== 100) {
      var totalFlourWater = addFlour + addWater;
      addFlour = Math.round(totalFlourWater / (1 + hydration / 100));
      addWater = Math.round(addFlour * (hydration / 100));
    }

    var totalAfter = keepStarter + addFlour + addWater;

    // Effective hydration of the fed starter
    // Existing starter at ~100% hydration has equal flour and water
    var existingFlour = keepStarter / 2;
    var existingWater = keepStarter / 2;
    var totalFlour = existingFlour + addFlour;
    var totalWater = existingWater + addWater;
    var effectiveHydration = totalFlour > 0 ? (totalWater / totalFlour * 100) : 100;

    // Estimate rise time based on ratio
    var ratio = Math.max(flourRatio, waterRatio);
    var riseTime = '';
    if (ratio <= 1) riseTime = '4-6 hours at 75°F';
    else if (ratio <= 2) riseTime = '6-8 hours at 75°F';
    else if (ratio <= 3) riseTime = '7-10 hours at 75°F';
    else if (ratio <= 5) riseTime = '8-12 hours at 75°F';
    else if (ratio <= 8) riseTime = '10-14 hours at 75°F';
    else riseTime = '12-16 hours at 75°F';

    document.getElementById('keepStarter').textContent = keepStarter + ' g';
    document.getElementById('addFlour').textContent = addFlour + ' g';
    document.getElementById('addWater').textContent = addWater + ' g';
    document.getElementById('totalAfter').textContent = totalAfter + ' g';
    document.getElementById('ratioDisplay').textContent = '1:' + flourRatio + ':' + waterRatio;
    document.getElementById('effectiveHydration').textContent = effectiveHydration.toFixed(0) + '%';
    document.getElementById('schedule').textContent = 'Estimated peak rise: ' + riseTime + '. Feed when starter has doubled and begins to recede.';

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', calculate);

  var inputs = ['starterAmount', 'flourRatio', 'waterRatio', 'targetTotal'];
  inputs.forEach(function(id) {
    document.getElementById(id).addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });

})();
