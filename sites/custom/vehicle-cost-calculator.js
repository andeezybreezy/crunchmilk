(function() {
  'use strict';

  // Depreciation rates by year (cumulative percentage of value lost)
  var depRates = [0.20, 0.15, 0.12, 0.10, 0.08, 0.07, 0.06, 0.05, 0.04, 0.03];

  function calculate() {
    var price = parseFloat(document.getElementById('purchasePrice').value) || 0;
    var rate = parseFloat(document.getElementById('loanInterest').value) || 0;
    var term = parseFloat(document.getElementById('loanTerm').value) || 60;
    var down = parseFloat(document.getElementById('downPayment').value) || 0;
    var insurance = parseFloat(document.getElementById('insuranceMonth').value) || 0;
    var fuelPrice = parseFloat(document.getElementById('fuelCost').value) || 0;
    var mpg = parseFloat(document.getElementById('mpg').value) || 1;
    var maint = parseFloat(document.getElementById('maintYear').value) || 0;
    var milesYear = parseFloat(document.getElementById('milesYear').value) || 12000;
    var age = parseInt(document.getElementById('vehicleAge').value) || 0;

    if (price <= 0 && fuelPrice <= 0) return;

    // Loan calculation
    var loanAmount = price - down;
    var monthlyRate = rate / 100 / 12;
    var monthlyPayment = 0;
    var totalInterest = 0;

    if (loanAmount > 0 && monthlyRate > 0 && term > 0) {
      monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
      totalInterest = (monthlyPayment * term) - loanAmount;
    } else if (loanAmount > 0) {
      monthlyPayment = loanAmount / term;
    }

    // Annual costs
    var annualLoan = monthlyPayment * 12;
    var annualInsurance = insurance * 12;
    var annualFuel = milesYear > 0 && mpg > 0 ? (milesYear / mpg) * fuelPrice : 0;

    // Depreciation (average annual over next 5 years)
    var currentValue = price;
    if (age > 0) {
      for (var y = 0; y < age && y < depRates.length; y++) {
        currentValue *= (1 - depRates[y]);
      }
      if (age >= depRates.length) {
        currentValue *= Math.pow(0.97, age - depRates.length);
      }
    }
    var depYear = age < depRates.length ? depRates[age] : 0.03;
    var annualDep = currentValue * depYear;

    var annualTotal = annualDep + annualFuel + annualInsurance + maint + (totalInterest / (term / 12));

    // Costs
    var costPerMile = milesYear > 0 ? annualTotal / milesYear : 0;
    var monthlyCost = annualTotal / 12;
    var dailyCost = annualTotal / 365;
    var fiveYear = annualTotal * 5;

    document.getElementById('costPerMile').textContent = '$' + costPerMile.toFixed(2);
    document.getElementById('monthlyCost').textContent = '$' + Math.round(monthlyCost).toLocaleString();
    document.getElementById('dailyCost').textContent = '$' + dailyCost.toFixed(2);
    document.getElementById('yearlyCost').textContent = '$' + Math.round(annualTotal).toLocaleString();
    document.getElementById('fiveYearCost').textContent = '$' + Math.round(fiveYear).toLocaleString();
    document.getElementById('totalInterest').textContent = totalInterest > 0 ? '$' + Math.round(totalInterest).toLocaleString() : '$0';

    // Breakdown table
    var annualInterest = term > 0 ? totalInterest / (term / 12) : 0;
    var categories = [
      { name: 'Depreciation', annual: annualDep },
      { name: 'Fuel', annual: annualFuel },
      { name: 'Insurance', annual: annualInsurance },
      { name: 'Maintenance/Repair', annual: maint },
      { name: 'Loan Interest', annual: annualInterest }
    ];

    var tbody = document.getElementById('breakdownBody');
    tbody.innerHTML = '';
    for (var i = 0; i < categories.length; i++) {
      var c = categories[i];
      var perMile = milesYear > 0 ? c.annual / milesYear : 0;
      var pct = annualTotal > 0 ? (c.annual / annualTotal * 100) : 0;
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' + c.name + '</td>' +
        '<td>$' + Math.round(c.annual).toLocaleString() + '</td>' +
        '<td>$' + perMile.toFixed(3) + '</td>' +
        '<td>' + pct.toFixed(0) + '%</td>';
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
