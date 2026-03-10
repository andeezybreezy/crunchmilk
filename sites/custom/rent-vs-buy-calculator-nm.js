(function() {
  'use strict';

  function fmt(n) {
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  function fmtD(n) {
    return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function calcMortgagePayment(principal, annualRate, years) {
    var r = annualRate / 100 / 12;
    var n = years * 12;
    if (r === 0) return principal / n;
    return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  function calculate() {
    var homePrice = parseFloat(document.getElementById('homePrice').value) || 0;
    var downPct = parseFloat(document.getElementById('downPayment').value) || 20;
    var mortRate = parseFloat(document.getElementById('mortgageRate').value) || 7;
    var loanTerm = parseInt(document.getElementById('loanTerm').value) || 30;
    var propTaxRate = parseFloat(document.getElementById('propTaxRate').value) || 1.2;
    var insurance = parseFloat(document.getElementById('insurance').value) || 1800;
    var maintPct = parseFloat(document.getElementById('maintenance').value) || 1;
    var monthlyRent = parseFloat(document.getElementById('monthlyRent').value) || 0;
    var rentIncrease = parseFloat(document.getElementById('rentIncrease').value) || 3;
    var investReturn = parseFloat(document.getElementById('investReturn').value) || 7;
    var years = parseInt(document.getElementById('compareYears').value) || 10;

    if (homePrice <= 0 || monthlyRent <= 0) return;

    var downPayment = homePrice * (downPct / 100);
    var loanAmount = homePrice - downPayment;
    var monthlyMortgage = calcMortgagePayment(loanAmount, mortRate, loanTerm);
    var monthlyPropTax = (homePrice * propTaxRate / 100) / 12;
    var monthlyInsurance = insurance / 12;
    var monthlyMaint = (homePrice * maintPct / 100) / 12;
    var totalMonthlyBuy = monthlyMortgage + monthlyPropTax + monthlyInsurance + monthlyMaint;

    // Year-by-year calculation
    var totalBuyCost = downPayment;
    var totalRentCost = 0;
    var balance = loanAmount;
    var monthlyR = mortRate / 100 / 12;
    var investBalance = downPayment; // Renter invests down payment
    var monthlyInvestR = investReturn / 100 / 12;
    var currentRent = monthlyRent;
    var breakEvenYear = 0;

    var tbody = document.getElementById('yearlyBody');
    tbody.innerHTML = '';

    for (var y = 1; y <= years; y++) {
      var yearBuyCost = 0;
      var yearRentCost = 0;

      for (var m = 0; m < 12; m++) {
        // Buy side
        var interestPayment = balance * monthlyR;
        var principalPayment = monthlyMortgage - interestPayment;
        if (principalPayment > balance) principalPayment = balance;
        balance -= principalPayment;
        yearBuyCost += monthlyMortgage + monthlyPropTax + monthlyInsurance + monthlyMaint;

        // Rent side
        yearRentCost += currentRent;

        // Renter invests the monthly difference
        var monthlySavings = totalMonthlyBuy - currentRent;
        if (monthlySavings > 0) {
          investBalance = investBalance * (1 + monthlyInvestR) + monthlySavings;
        } else {
          investBalance = investBalance * (1 + monthlyInvestR);
        }
      }

      totalBuyCost += yearBuyCost;
      totalRentCost += yearRentCost;
      currentRent *= (1 + rentIncrease / 100);

      var equity = homePrice - balance - (homePrice - downPayment - (loanAmount - balance));
      equity = downPayment + (loanAmount - balance);

      // Check break-even (net cost of buying < net cost of renting)
      var netBuy = totalBuyCost - equity;
      var netRent = totalRentCost - (investBalance - downPayment);
      if (breakEvenYear === 0 && netBuy <= netRent) {
        breakEvenYear = y;
      }

      var tr = document.createElement('tr');
      tr.innerHTML = '<td style="padding:6px;border-bottom:1px solid #eee">' + y + '</td>' +
        '<td style="padding:6px;border-bottom:1px solid #eee;text-align:right">' + fmt(totalBuyCost) + '</td>' +
        '<td style="padding:6px;border-bottom:1px solid #eee;text-align:right">' + fmt(totalRentCost) + '</td>' +
        '<td style="padding:6px;border-bottom:1px solid #eee;text-align:right">' + fmt(equity) + '</td>';
      tbody.appendChild(tr);
    }

    var finalEquity = downPayment + (loanAmount - balance);
    var netBuyFinal = totalBuyCost - finalEquity;
    var netRentFinal = totalRentCost;
    var advantage = netRentFinal - netBuyFinal;
    var advantageLabel = advantage > 0 ? 'Buying saves ' + fmt(Math.abs(advantage)) : 'Renting saves ' + fmt(Math.abs(advantage));

    document.getElementById('mortgagePayment').textContent = fmtD(totalMonthlyBuy);
    document.getElementById('rentPayment').textContent = fmtD(monthlyRent);
    document.getElementById('totalBuy').textContent = fmt(totalBuyCost);
    document.getElementById('totalRent').textContent = fmt(totalRentCost);
    document.getElementById('equityBuilt').textContent = fmt(finalEquity);
    document.getElementById('investValue').textContent = fmt(investBalance);
    document.getElementById('netAdvantage').textContent = advantageLabel;
    document.getElementById('breakEven').textContent = breakEvenYear > 0 ? 'Year ' + breakEvenYear : 'Not within ' + years + ' years';
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);

  var inputs = document.querySelectorAll('input[type="number"]');
  inputs.forEach(function(input) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });
})();
