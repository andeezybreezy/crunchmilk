(function() {
  'use strict';

  var chartData = [
    ['50-55%', 'Very stiff, easy to shape', 'Bagels, pretzels', 'Beginner'],
    ['56-60%', 'Firm, smooth', 'Sandwich bread, rolls', 'Beginner'],
    ['61-65%', 'Slightly tacky, workable', 'French bread, pizza', 'Beginner'],
    ['66-70%', 'Tacky, moderate stickiness', 'Country bread, sourdough', 'Intermediate'],
    ['71-75%', 'Sticky, extensible', 'Artisan sourdough, batard', 'Intermediate'],
    ['76-80%', 'Very sticky, slack', 'Ciabatta, focaccia', 'Advanced'],
    ['81-85%', 'Extremely wet, batter-like', 'High-hydration ciabatta', 'Advanced'],
    ['86-90%+', 'Pourable, very wet', 'Focaccia, pan breads', 'Expert']
  ];

  var chartBody = document.getElementById('chartBody');
  if (chartBody && chartBody.children.length === 0) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function getCharacter(pct) {
    if (pct <= 55) return 'Very stiff';
    if (pct <= 60) return 'Firm';
    if (pct <= 65) return 'Slightly tacky';
    if (pct <= 70) return 'Tacky';
    if (pct <= 75) return 'Sticky';
    if (pct <= 80) return 'Very sticky';
    if (pct <= 85) return 'Extremely wet';
    return 'Pourable';
  }

  function calculate() {
    var flour = parseFloat(document.getElementById('flour').value) || 0;
    var water = parseFloat(document.getElementById('water').value) || 0;
    var starterWeight = parseFloat(document.getElementById('starterWeight').value) || 0;
    var starterHydration = parseFloat(document.getElementById('starterHydration').value) || 100;
    var milk = parseFloat(document.getElementById('milk').value) || 0;
    var eggs = parseFloat(document.getElementById('eggs').value) || 0;

    if (flour <= 0 && starterWeight <= 0) return;

    // Starter breakdown: starter hydration % means water = starter * (hydration / (100 + hydration))
    // For 100% hydration starter: 50% flour, 50% water
    var starterFlour = starterWeight * (100 / (100 + starterHydration));
    var starterWater = starterWeight * (starterHydration / (100 + starterHydration));

    // Milk is ~87% water
    var milkWater = milk * 0.87;

    // Eggs are ~75% water
    var eggWater = eggs * 0.75;

    var totalFlour = flour + starterFlour;
    var totalLiquid = water + starterWater + milkWater + eggWater;

    if (totalFlour <= 0) return;

    var hydration = (totalLiquid / totalFlour) * 100;

    document.getElementById('hydration').textContent = hydration.toFixed(1) + '%';
    document.getElementById('totalFlour').textContent = Math.round(totalFlour) + ' g';
    document.getElementById('totalLiquid').textContent = Math.round(totalLiquid) + ' g';
    document.getElementById('character').textContent = getCharacter(hydration);

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', calculate);

  var inputs = ['flour', 'water', 'starterWeight', 'starterHydration', 'milk', 'eggs'];
  inputs.forEach(function(id) {
    document.getElementById(id).addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });

})();
