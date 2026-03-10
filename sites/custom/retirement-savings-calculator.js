(function() {
  'use strict';

  var chartData = [
    ['25', '40 years', '$240,000', '$1,197,811', '$957,811'],
    ['30', '35 years', '$210,000', '$830,421', '$620,421'],
    ['35', '30 years', '$180,000', '$567,452', '$387,452'],
    ['40', '25 years', '$150,000', '$380,613', '$230,613'],
    ['45', '20 years', '$120,000', '$248,033', '$128,033'],
    ['50', '15 years', '$90,000', '$153,720', '$63,720'],
    ['55', '10 years', '$60,000', '$86,543', '$26,543']
  ];

  function fmt(n) {
    if (n >= 1000000) return '$' + (n / 1000000).toFixed(2) + 'M';
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  function calculate() {
    var currentAge = parseInt(document.getElementById('currentAge').value);
    var retireAge = parseInt(document.getElementById('retireAge').value);
    var currentSavings = parseFloat(document.getElementById('currentSavings').value) || 0;
    var monthlyContrib = parseFloat(document.getElementById('monthlyContrib').value) || 0;
    var employerMatch = parseFloat(document.getElementById('employerMatch').value) || 0;
    var annualReturn = parseFloat(document.getElementById('annualReturn').value) / 100;
    var goal = parseFloat(document.getElementById('retireGoal').value) || 0;

    if (isNaN(currentAge) || isNaN(retireAge) || currentAge >= retireAge) return;

    var years = retireAge - currentAge;
    var monthlyReturn = Math.pow(1 + annualReturn, 1 / 12) - 1;
    var totalMonths = years * 12;
    var totalMonthlyContrib = monthlyContrib + employerMatch;

    // Future value of current savings
    var fvCurrent = currentSavings * Math.pow(1 + monthlyReturn, totalMonths);

    // Future value of monthly contributions (annuity)
    var fvContrib = 0;
    if (monthlyReturn > 0) {
      fvContrib = totalMonthlyContrib * ((Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn);
    } else {
      fvContrib = totalMonthlyContrib * totalMonths;
    }

    var totalProjected = fvCurrent + fvContrib;
    var totalContributed = currentSavings + (totalMonthlyContrib * totalMonths);
    var growthAmount = totalProjected - totalContributed;
    var monthlyRetireIncome = (totalProjected * 0.04) / 12;

    document.getElementById('projectedTotal').textContent = fmt(totalProjected);
    document.getElementById('totalContrib').textContent = fmt(totalContributed);
    document.getElementById('investGrowth').textContent = fmt(growthAmount);
    document.getElementById('monthlyRetireIncome').textContent = fmt(monthlyRetireIncome) + '/mo';

    // Goal progress
    var goalRow = document.getElementById('goalRow');
    if (goal > 0) {
      var pct = (totalProjected / goal) * 100;
      document.getElementById('goalProgress').textContent = pct.toFixed(1) + '% of ' + fmt(goal);
      document.getElementById('goalProgress').style.color = pct >= 100 ? '#2e7d32' : pct >= 75 ? '#f57f17' : '#c62828';
      goalRow.style.display = '';
    } else {
      goalRow.style.display = 'none';
    }

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
  var inputs = document.querySelectorAll('.calc-card input[type="number"]');
  inputs.forEach(function(input) {
    input.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });

  // Render chart
  var chartBody = document.getElementById('chartBody');
  if (chartBody && chartBody.children.length === 0) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td><td>' + row[4] + '</td>';
      chartBody.appendChild(tr);
    });
  }

})();
