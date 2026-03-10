(function() {
  'use strict';

  var standardTanks = [250, 500, 1000, 2000];

  function calculate() {
    var daily = parseFloat(document.getElementById('dailyUsage').value);
    var vehicles = parseInt(document.getElementById('numVehicles').value) || 1;
    var deliveryFreq = parseFloat(document.getElementById('deliveryFreq').value);
    var reserveDays = parseFloat(document.getElementById('reserveDays').value) || 3;
    var fuelPrice = parseFloat(document.getElementById('fuelPrice').value) || 0;

    if (isNaN(daily) || isNaN(deliveryFreq) || daily <= 0 || deliveryFreq <= 0) return;

    var minCapacity = daily * (deliveryFreq + reserveDays);
    var perVehicleDay = vehicles > 0 ? daily / vehicles : daily;

    // Find recommended standard tank
    var recTank = 0;
    for (var i = 0; i < standardTanks.length; i++) {
      if (standardTanks[i] >= minCapacity) {
        recTank = standardTanks[i];
        break;
      }
    }
    if (recTank === 0) {
      // Need multiple tanks or custom
      recTank = Math.ceil(minCapacity / 1000) * 1000;
    }

    var daysSupply = daily > 0 ? recTank / daily : 0;
    var fillCost = recTank * fuelPrice;
    var annualCost = daily * 365 * fuelPrice;

    document.getElementById('minTank').textContent = Math.ceil(minCapacity).toLocaleString() + ' gallons';
    document.getElementById('recTank').textContent = recTank.toLocaleString() + ' gallons';
    document.getElementById('daysSupply').textContent = daysSupply.toFixed(1) + ' days';
    document.getElementById('perVehicle').textContent = perVehicleDay.toFixed(1) + ' gal/vehicle/day';
    document.getElementById('fillCost').textContent = fuelPrice > 0 ? '$' + fillCost.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}) : '—';
    document.getElementById('annualCost').textContent = fuelPrice > 0 ? '$' + Math.round(annualCost).toLocaleString() : '—';

    // Tank comparison table
    var allTanks = standardTanks.slice();
    if (recTank > 2000 && allTanks.indexOf(recTank) === -1) {
      allTanks.push(recTank);
    }

    var tbody = document.getElementById('tankBody');
    tbody.innerHTML = '';
    for (var t = 0; t < allTanks.length; t++) {
      var size = allTanks[t];
      var days = daily > 0 ? size / daily : 0;
      var cost = size * fuelPrice;
      var fillsYear = daily > 0 ? Math.ceil(365 * daily / size) : 0;
      var fits = size >= minCapacity;

      var tr = document.createElement('tr');
      if (size === recTank) tr.style.fontWeight = 'bold';
      tr.innerHTML =
        '<td>' + size.toLocaleString() + ' gal' + (size === recTank ? ' *' : '') + '</td>' +
        '<td>' + days.toFixed(1) + '</td>' +
        '<td>' + (fuelPrice > 0 ? '$' + Math.round(cost).toLocaleString() : '—') + '</td>' +
        '<td>' + fillsYear + '</td>' +
        '<td style="color:' + (fits ? '#16a34a' : '#dc2626') + ';">' + (fits ? 'Yes' : 'Too small') + '</td>';
      tbody.appendChild(tr);
    }

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);

  var inputs = document.querySelectorAll('.calc-card input');
  inputs.forEach(function(inp) {
    inp.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });
})();
