(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  function val(id) {
    var v = parseFloat(document.getElementById(id).value);
    return isNaN(v) || v < 0 ? 0 : v;
  }

  function money(n) {
    return '$' + n.toFixed(2);
  }

  function calculate() {
    var annualMiles = val('annualMiles');
    var fuelPrice = val('fuelPrice');
    var mpg = val('mpg');
    var purchasePrice = val('purchasePrice');
    var currentValue = val('currentValue');
    var ownershipYears = val('ownershipYears');
    var insurance = val('insurance');
    var maintenance = val('maintenance');
    var registration = val('registration');

    if (annualMiles <= 0 || mpg <= 0 || ownershipYears <= 0) return;

    var fuelCostPerMile = fuelPrice / mpg;
    var totalDepreciation = purchasePrice - currentValue;
    if (totalDepreciation < 0) totalDepreciation = 0;
    var depPerMile = totalDepreciation / (ownershipYears * annualMiles);
    var fixedPerMile = (insurance + maintenance + registration) / annualMiles;
    var totalPerMile = fuelCostPerMile + depPerMile + fixedPerMile;
    var annualTotal = totalPerMile * annualMiles;
    var monthlyTotal = annualTotal / 12;

    document.getElementById('costPerMile').textContent = money(totalPerMile) + '/mi';
    document.getElementById('annualCost').textContent = money(annualTotal);
    document.getElementById('fuelCostMile').textContent = money(fuelCostPerMile);
    document.getElementById('depCostMile').textContent = money(depPerMile);
    document.getElementById('fixedCostMile').textContent = money(fixedPerMile);
    document.getElementById('monthlyCost').textContent = money(monthlyTotal) + '/mo';

    var annualFuel = (annualMiles / mpg) * fuelPrice;
    document.getElementById('resultTip').textContent =
      'Annual fuel: ' + money(annualFuel) + ' · ' +
      Math.round(annualMiles / mpg) + ' gallons/year';

    result.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  document.querySelectorAll('#result').forEach(function() {});
  document.querySelectorAll('input[type="number"]').forEach(function(el) {
    el.addEventListener('input', calculate);
  });

  calculate();

  // Populate chart
  var tbody = document.querySelector('.chart-table tbody');
  if (tbody) {
    var rows = [
      ['Compact Sedan', '$0.10', '$0.15', '$0.18', '$0.43'],
      ['Midsize Sedan', '$0.12', '$0.20', '$0.20', '$0.52'],
      ['Small SUV', '$0.14', '$0.22', '$0.22', '$0.58'],
      ['Full-Size SUV', '$0.18', '$0.28', '$0.25', '$0.71'],
      ['Pickup Truck', '$0.20', '$0.25', '$0.24', '$0.69'],
      ['Electric Vehicle', '$0.04', '$0.25', '$0.20', '$0.49'],
      ['Hybrid', '$0.07', '$0.20', '$0.20', '$0.47']
    ];
    rows.forEach(function(r) {
      var tr = document.createElement('tr');
      r.forEach(function(c) {
        var td = document.createElement('td');
        td.textContent = c;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }
})();
