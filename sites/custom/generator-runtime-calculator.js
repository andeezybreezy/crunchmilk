(function() {
  'use strict';

  // Fuel efficiency: gal/hr per 1000W at 50% load
  // These are baseline rates that scale with load
  var FUEL_RATES = {
    gas: { baseGPH_per1kW: 0.15, pricePerGal: 3.50, name: 'Gasoline' },
    propane: { baseGPH_per1kW: 0.19, pricePerGal: 3.00, name: 'Propane' },
    diesel: { baseGPH_per1kW: 0.12, pricePerGal: 4.00, name: 'Diesel' }
  };

  // Load factor: how consumption scales with load %
  function loadFactor(pct) {
    // Generators are not linear — at 25% load they use ~60% of fuel vs 50% load
    // Approximate curve: factor = 0.4 + 0.6 * (load/100)
    return 0.4 + 0.6 * (pct / 100);
  }

  var APPLIANCES = [
    { name: 'Refrigerator', watts: 300 },
    { name: 'Freezer', watts: 200 },
    { name: 'Sump Pump (1/2 HP)', watts: 800 },
    { name: 'Window AC (10K BTU)', watts: 1200 },
    { name: 'Space Heater', watts: 1500 },
    { name: 'Microwave', watts: 1000 },
    { name: 'LED Lights (10 bulbs)', watts: 100 },
    { name: 'Phone Charger', watts: 25 },
    { name: 'Laptop', watts: 60 },
    { name: 'TV', watts: 150 },
    { name: 'Well Pump (1/2 HP)', watts: 750 },
    { name: 'Electric Stove Burner', watts: 1500 }
  ];

  // Render load slider label
  var loadSlider = document.getElementById('loadPct');
  var loadLabel = document.getElementById('loadLabel');
  loadSlider.addEventListener('input', function() {
    loadLabel.textContent = loadSlider.value + '%';
  });

  // Render appliance checkboxes
  var appDiv = document.getElementById('appliances');
  APPLIANCES.forEach(function(a, i) {
    var label = document.createElement('label');
    label.style.cssText = 'display:flex;align-items:center;gap:0.5rem;margin-bottom:0.4rem;cursor:pointer;';
    label.innerHTML = '<input type="checkbox" class="app-check" data-watts="' + a.watts + '"> ' + a.name + ' <span style="color:#888;">(' + a.watts + 'W)</span>';
    appDiv.appendChild(label);
  });

  function updateApplianceTotal() {
    var checks = document.querySelectorAll('.app-check');
    var total = 0;
    checks.forEach(function(c) {
      if (c.checked) total += parseInt(c.dataset.watts);
    });
    document.getElementById('applianceTotal').textContent = total.toLocaleString();
  }

  document.querySelectorAll('.app-check').forEach(function(c) {
    c.addEventListener('change', updateApplianceTotal);
  });

  function calculate() {
    var genWatts = parseInt(document.getElementById('genWatts').value) || 5000;
    var tankSize = parseFloat(document.getElementById('tankSize').value) || 5;
    var fuelType = document.getElementById('fuelType').value;
    var loadPct = parseInt(document.getElementById('loadPct').value) || 50;

    var fuel = FUEL_RATES[fuelType];
    var genKW = genWatts / 1000;

    // Fuel consumption at the given load
    var baseGPH = fuel.baseGPH_per1kW * genKW; // GPH at 50% load
    var factor = loadFactor(loadPct) / loadFactor(50); // Normalize to 50% baseline
    var actualGPH = baseGPH * factor;

    var runtime = tankSize / actualGPH;
    var costPerHr = actualGPH * fuel.pricePerGal;
    var dailyFuel = actualGPH * 24;

    var hrs = Math.floor(runtime);
    var mins = Math.round((runtime - hrs) * 60);

    document.getElementById('runtime').textContent = hrs + 'h ' + mins + 'm';
    document.getElementById('fuelRate').textContent = actualGPH.toFixed(2) + ' gal/hr';
    document.getElementById('costHr').textContent = '$' + costPerHr.toFixed(2) + '/hr';
    document.getElementById('dailyFuel').textContent = dailyFuel.toFixed(1) + ' gal';

    // Additional info
    var loadWatts = genWatts * loadPct / 100;
    var html = '<div style="background:rgba(245,158,11,0.08);padding:0.75rem;border-radius:8px;">';
    html += '<strong>At ' + loadPct + '% load (' + Math.round(loadWatts).toLocaleString() + 'W):</strong><br>';
    html += 'Fuel type: ' + fuel.name + ' at $' + fuel.pricePerGal.toFixed(2) + '/gal<br>';
    html += 'Daily cost (24hr): $' + (costPerHr * 24).toFixed(2) + '<br>';
    html += 'Weekly fuel: ' + (dailyFuel * 7).toFixed(0) + ' gal ($' + (costPerHr * 168).toFixed(0) + ')<br>';
    html += 'Tanks per day: ' + (dailyFuel / tankSize).toFixed(1);
    html += '</div>';

    document.getElementById('loadCalc').innerHTML = html;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
  document.getElementById('loadPct').addEventListener('input', function() { document.getElementById('loadPctVal').textContent = this.value + '%'; });
})();
