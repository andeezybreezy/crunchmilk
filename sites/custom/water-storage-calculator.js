(function() {
  'use strict';

  var CONTAINERS = [
    { name: 'Cases of bottled water (24-pack)', gal: 3.17, weight: 30, cuft: 0.93, cost: 5 },
    { name: '5-Gallon jugs', gal: 5, weight: 42, cuft: 1.33, cost: 12 },
    { name: '55-Gallon drums', gal: 55, weight: 459, cuft: 10.9, cost: 65 },
    { name: '275-Gallon IBC totes', gal: 275, weight: 2294, cuft: 51.1, cost: 150 }
  ];

  var WATER_LB_PER_GAL = 8.34;

  function calculate() {
    var people = parseInt(document.getElementById('household').value) || 4;
    var days = parseInt(document.getElementById('duration').value) || 14;
    var galPerDay = parseInt(document.getElementById('usage').value) || 2;

    var totalGal = people * days * galPerDay;
    var totalWeight = totalGal * WATER_LB_PER_GAL;

    // Estimate storage space: 1 gallon ~ 0.134 cu ft
    var totalCuFt = totalGal * 0.134;

    document.getElementById('totalGallons').textContent = totalGal.toLocaleString() + ' gal';
    document.getElementById('totalWeight').textContent = Math.round(totalWeight).toLocaleString() + ' lbs';
    document.getElementById('storageSpace').textContent = totalCuFt.toFixed(1) + ' cu ft';

    // Container options
    var html = '<h3 style="margin-bottom:0.75rem;">Container Options</h3>';
    html += '<p style="font-size:0.9rem;color:#666;margin-bottom:0.75rem;">Each option shows how many containers you would need to store ' + totalGal + ' gallons:</p>';

    CONTAINERS.forEach(function(c) {
      var qty = Math.ceil(totalGal / c.gal);
      var actualGal = qty * c.gal;
      var weight = qty * c.weight;
      var space = qty * c.cuft;
      var cost = qty * c.cost;

      html += '<div style="background:rgba(3,105,161,0.06);padding:0.75rem;border-radius:8px;margin-bottom:0.5rem;">';
      html += '<strong>' + c.name + '</strong><br>';
      html += 'Quantity: <strong>' + qty + '</strong> | ';
      html += 'Actual capacity: ' + actualGal.toFixed(0) + ' gal | ';
      html += 'Weight: ' + weight.toLocaleString() + ' lbs<br>';
      html += 'Space: ' + space.toFixed(1) + ' cu ft | ';
      html += 'Est. cost: $' + cost.toLocaleString();
      html += '</div>';
    });

    // Usage breakdown
    html += '<h3 style="margin:1rem 0 0.5rem;">Daily Breakdown</h3>';
    html += '<div style="font-size:0.9rem;">';
    if (galPerDay >= 1) html += 'Drinking & cooking: ' + (people * 0.5).toFixed(1) + ' gal/day<br>';
    if (galPerDay >= 1) html += 'Basic hydration: ' + (people * 0.5).toFixed(1) + ' gal/day<br>';
    if (galPerDay >= 2) html += 'Hygiene (sponge bath, teeth): ' + (people * 1).toFixed(1) + ' gal/day<br>';
    if (galPerDay >= 3) html += 'Cleaning & extra cooking: ' + (people * 1).toFixed(1) + ' gal/day<br>';
    html += '<strong>Total daily: ' + (people * galPerDay) + ' gal/day</strong>';
    html += '</div>';

    document.getElementById('containers').innerHTML = html;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
})();
