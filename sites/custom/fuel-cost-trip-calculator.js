(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  function val(id) {
    var v = parseFloat(document.getElementById(id).value);
    return isNaN(v) || v < 0 ? 0 : v;
  }

  function calculate() {
    var distance = val('distance');
    var mpg = val('mpg');
    var fuelPrice = val('fuelPrice');
    var passengers = Math.max(1, Math.round(val('passengers')));
    var roundTrip = document.getElementById('roundTrip').value === 'yes';

    if (distance <= 0 || mpg <= 0) return;

    var totalMiles = roundTrip ? distance * 2 : distance;
    var gallons = totalMiles / mpg;
    var totalCost = gallons * fuelPrice;
    var costPerPerson = totalCost / passengers;
    var costPerMile = fuelPrice / mpg;

    // Fuel stops assuming 15-gallon tank, fill at 1/4 remaining
    var range = mpg * 15;
    var usableRange = range * 0.75;
    var stops = Math.ceil(totalMiles / usableRange) - 1;
    if (stops < 0) stops = 0;

    // Drive time at ~55 mph average
    var hours = totalMiles / 55;
    var h = Math.floor(hours);
    var m = Math.round((hours - h) * 60);

    document.getElementById('totalCost').textContent = '$' + totalCost.toFixed(2);
    document.getElementById('gallons').textContent = gallons.toFixed(1) + ' gal';
    document.getElementById('costPerPerson').textContent = '$' + costPerPerson.toFixed(2);
    document.getElementById('costPerMile').textContent = '$' + costPerMile.toFixed(2) + '/mi';
    document.getElementById('fuelStops').textContent = stops === 0 ? 'None needed' : stops + ' stop' + (stops > 1 ? 's' : '');
    document.getElementById('driveTime').textContent = h + 'h ' + m + 'm';

    var label = roundTrip ? 'Round trip' : 'One way';
    document.getElementById('resultTip').textContent = label + ': ' + totalMiles.toLocaleString() + ' miles total';

    result.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  document.querySelectorAll('input[type="number"]').forEach(function(el) {
    el.addEventListener('input', calculate);
  });
  document.getElementById('roundTrip').addEventListener('change', calculate);

  calculate();

  // Populate chart
  var tbody = document.querySelector('.chart-table tbody');
  if (tbody) {
    var distances = [100, 250, 500, 750, 1000, 1500];
    var mpgs = [20, 25, 30, 35];
    var price = 3.50;
    distances.forEach(function(d) {
      var tr = document.createElement('tr');
      var td0 = document.createElement('td');
      td0.textContent = d.toLocaleString() + ' miles';
      tr.appendChild(td0);
      mpgs.forEach(function(m) {
        var cost = (d * 2 / m) * price;
        var td = document.createElement('td');
        td.textContent = '$' + cost.toFixed(2);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }
})();
