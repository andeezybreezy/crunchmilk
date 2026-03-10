(function() {
  'use strict';

  var cityIndices = {
    sf:  { name: 'San Francisco', col: 179, housing: 267, tax: 0.133 },
    nyc: { name: 'New York City',  col: 187, housing: 282, tax: 0.109 },
    sea: { name: 'Seattle',        col: 149, housing: 205, tax: 0 },
    bos: { name: 'Boston',         col: 152, housing: 210, tax: 0.05 },
    la:  { name: 'Los Angeles',    col: 146, housing: 208, tax: 0.133 },
    den: { name: 'Denver',         col: 128, housing: 155, tax: 0.044 },
    chi: { name: 'Chicago',        col: 107, housing: 115, tax: 0.0495 },
    aus: { name: 'Austin',         col: 111, housing: 125, tax: 0 },
    atl: { name: 'Atlanta',        col: 102, housing: 98,  tax: 0.055 },
    mia: { name: 'Miami',          col: 123, housing: 160, tax: 0 },
    nas: { name: 'Nashville',      col: 100, housing: 100, tax: 0 },
    dal: { name: 'Dallas',         col: 97,  housing: 88,  tax: 0 },
    hou: { name: 'Houston',        col: 94,  housing: 78,  tax: 0 },
    phx: { name: 'Phoenix',        col: 103, housing: 108, tax: 0.025 },
    ral: { name: 'Raleigh',        col: 98,  housing: 95,  tax: 0.0475 },
    min: { name: 'Minneapolis',    col: 105, housing: 108, tax: 0.0985 },
    det: { name: 'Detroit',        col: 89,  housing: 72,  tax: 0.0425 },
    slc: { name: 'Salt Lake City', col: 104, housing: 110, tax: 0.0465 },
    por: { name: 'Portland',       col: 130, housing: 162, tax: 0.099 },
    nat: { name: 'National Avg',   col: 100, housing: 100, tax: 0.05 }
  };

  var baseSalary = document.getElementById('baseSalary');
  var employerCity = document.getElementById('employerCity');
  var remoteCity = document.getElementById('remoteCity');
  var adjustPct = document.getElementById('adjustPct');
  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  function calculate() {
    var salary = parseFloat(baseSalary.value);
    var emp = cityIndices[employerCity.value];
    var rem = cityIndices[remoteCity.value];
    var adjFactor = parseFloat(adjustPct.value);

    if (isNaN(salary) || salary <= 0 || !emp || !rem) return;

    var colRatio = rem.col / emp.col;
    // Adjusted salary based on policy
    var adjustedSalary;
    if (adjFactor === 0) {
      adjustedSalary = salary; // No adjustment
    } else {
      adjustedSalary = Math.round(salary * (1 - adjFactor * (1 - colRatio)));
    }

    var salaryChange = adjustedSalary - salary;
    var colDiff = ((rem.col - emp.col) / emp.col) * 100;

    // Purchasing power: adjusted salary in remote city vs base salary in employer city
    var ppBase = salary / emp.col;
    var ppRemote = adjustedSalary / rem.col;
    var ppChange = ((ppRemote - ppBase) / ppBase) * 100;

    // Monthly housing savings estimate (using avg $2000/mo baseline at index 100)
    var baseMonthlyHousing = 2000 * (emp.housing / 100);
    var remoteMonthlyHousing = 2000 * (rem.housing / 100);
    var housingSavings = Math.round(baseMonthlyHousing - remoteMonthlyHousing);

    var hourlyRate = (adjustedSalary / 2080).toFixed(2);

    document.getElementById('rAdjusted').textContent = '$' + adjustedSalary.toLocaleString();
    var changeSign = salaryChange >= 0 ? '+' : '';
    document.getElementById('rChange').textContent = changeSign + '$' + Math.abs(Math.round(salaryChange)).toLocaleString() + '/yr (' + changeSign + ((salaryChange / salary) * 100).toFixed(1) + '%)';
    document.getElementById('rChange').style.color = salaryChange >= 0 ? '#16a34a' : '#dc2626';
    document.getElementById('rCOLDiff').textContent = (colDiff >= 0 ? '+' : '') + colDiff.toFixed(1) + '%';
    document.getElementById('rCOLDiff').style.color = colDiff <= 0 ? '#16a34a' : '#dc2626';

    var ppSign = ppChange >= 0 ? '+' : '';
    document.getElementById('rPurchasing').textContent = ppSign + ppChange.toFixed(1) + '%';
    document.getElementById('rPurchasing').style.color = ppChange >= 0 ? '#16a34a' : '#dc2626';

    document.getElementById('rHousingSave').textContent = housingSavings >= 0 ? '$' + housingSavings.toLocaleString() + '/mo saved' : '-$' + Math.abs(housingSavings).toLocaleString() + '/mo more';
    document.getElementById('rHousingSave').style.color = housingSavings >= 0 ? '#16a34a' : '#dc2626';
    document.getElementById('rHourly').textContent = '$' + hourlyRate + '/hr';

    var policyLabel = adjFactor === 1 ? 'full' : adjFactor === 0.75 ? '75%' : adjFactor === 0.5 ? '50%' : 'no';
    document.getElementById('resultTip').textContent = 'With ' + policyLabel + ' COL adjustment from ' + emp.name + ' to ' + rem.name + '. ' + (ppChange >= 0 ? 'Your purchasing power increases despite any pay change.' : 'Consider negotiating — your purchasing power decreases.');

    result.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  [baseSalary, employerCity, remoteCity, adjustPct].forEach(function(el) {
    el.addEventListener('change', calculate);
    el.addEventListener('input', calculate);
  });

  calculate();
})();
