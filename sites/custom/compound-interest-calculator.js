(function() {
  'use strict';

  var principal = document.getElementById('principal');
  var monthlyContribution = document.getElementById('monthlyContribution');
  var interestRate = document.getElementById('interestRate');
  var compoundFreq = document.getElementById('compoundFreq');
  var timePeriod = document.getElementById('timePeriod');
  var calcBtn = document.getElementById('calcBtn');
  var futureValue = document.getElementById('futureValue');
  var totalContributions = document.getElementById('totalContributions');
  var totalInterest = document.getElementById('totalInterest');
  var resultDiv = document.getElementById('result');
  var breakdownWrap = document.getElementById('breakdownWrap');
  var breakdownBody = document.getElementById('breakdownBody');

  function fmt(n) {
    return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function calculate() {
    var P = parseFloat(principal.value) || 0;
    var PMT = parseFloat(monthlyContribution.value) || 0;
    var r = (parseFloat(interestRate.value) || 0) / 100;
    var n = parseInt(compoundFreq.value, 10) || 12;
    var t = parseInt(timePeriod.value, 10) || 1;

    if (P <= 0 && PMT <= 0) return;

    // Year-by-year breakdown
    var rows = '';
    var balance = P;
    var totalContrib = P;
    var prevBalance = P;

    for (var y = 1; y <= t; y++) {
      // Monthly contributions added throughout the year
      for (var m = 1; m <= 12; m++) {
        // Add contribution at start of month
        if (y > 1 || m > 1) {
          balance += PMT;
          totalContrib += PMT;
        } else if (m === 1 && y === 1) {
          // First month of first year, contribution already counted as PMT added after initial
          balance += PMT;
          totalContrib += PMT;
        }
        // Apply compounding for this month
        if (n === 365) {
          // Daily compounding: ~30.4167 days per month
          var daysInMonth = 30.4167;
          for (var d = 0; d < Math.round(daysInMonth); d++) {
            balance *= (1 + r / 365);
          }
        } else if (n >= 12) {
          balance *= (1 + r / 12);
        } else if (n === 4) {
          if (m % 3 === 0) {
            balance *= (1 + r / 4);
          }
        } else if (n === 1) {
          if (m === 12) {
            balance *= (1 + r);
          }
        }
      }

      var yearInterest = balance - totalContrib;
      rows += '<tr><td>' + y + '</td><td>' + fmt(totalContrib) + '</td><td>' + fmt(yearInterest) + '</td><td>' + fmt(balance) + '</td></tr>';
    }

    var finalValue = balance;
    var totalInt = finalValue - totalContrib;

    futureValue.textContent = fmt(finalValue);
    totalContributions.textContent = fmt(totalContrib);
    totalInterest.textContent = fmt(totalInt);

    resultDiv.classList.add('visible');
    breakdownBody.innerHTML = rows;
    breakdownWrap.style.display = 'block';
  }

  calcBtn.addEventListener('click', calculate);

  [principal, monthlyContribution, interestRate, compoundFreq, timePeriod].forEach(function(el) {
    el.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });

  calculate();
})();
