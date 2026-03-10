(function() {
  'use strict';

  function calculate() {
    var hp = parseFloat(document.getElementById('engineHP').value);
    var numEngines = parseInt(document.getElementById('numEngines').value);
    var fuelType = document.getElementById('fuelType').value;
    var throttle = parseFloat(document.getElementById('throttle').value);
    var distance = parseFloat(document.getElementById('distance').value);
    var speed = parseFloat(document.getElementById('speed').value);
    var fuelPrice = parseFloat(document.getElementById('fuelPrice').value);

    if (isNaN(hp) || isNaN(distance) || isNaN(speed) || hp <= 0 || distance <= 0 || speed <= 0) return;

    // GPH per engine at full throttle
    var gphFactor = fuelType === 'gas' ? 0.10 : 0.055;
    var gphPerEngine = hp * gphFactor * throttle;
    var totalGPH = gphPerEngine * numEngines;

    // Trip time in hours
    var tripHours = distance / speed;

    // Fuel needed
    var fuelNeeded = totalGPH * tripHours;
    var fuelWithReserve = fuelNeeded * 1.10;

    // Cost
    var cost = fuelWithReserve * fuelPrice;

    // Nautical miles per gallon
    var nmpg = distance / fuelNeeded;

    // Format trip time
    var hours = Math.floor(tripHours);
    var minutes = Math.round((tripHours - hours) * 60);
    var timeStr = hours + 'h ' + minutes + 'm';

    document.getElementById('fuelNeeded').textContent = fuelNeeded.toFixed(1) + ' gal';
    document.getElementById('fuelReserve').textContent = fuelWithReserve.toFixed(1) + ' gal';
    document.getElementById('tripTime').textContent = timeStr;
    document.getElementById('fuelCost').textContent = '$' + cost.toFixed(2);
    document.getElementById('gph').textContent = totalGPH.toFixed(1) + ' GPH';
    document.getElementById('nmpg').textContent = nmpg.toFixed(2) + ' NMPG';

    var tip = 'At ' + (throttle * 100) + '% throttle with ' + numEngines + '\u00D7' + hp + 'HP ' + fuelType + ': ' + totalGPH.toFixed(1) + ' GPH. Consider the 1/3 rule for offshore trips (33% reserve instead of 10%).';
    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);

  var inputs = document.querySelectorAll('#engineHP, #distance, #speed, #fuelPrice');
  inputs.forEach(function(input) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });
})();
