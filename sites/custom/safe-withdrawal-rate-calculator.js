(function() {
  'use strict';

  var chartData = [
    ['3.0%', '$30,000', '$2,500', '$1,840,000+', 'Indefinitely'],
    ['3.5%', '$35,000', '$2,917', '$1,200,000+', '40+ years'],
    ['4.0%', '$40,000', '$3,333', '$580,000+', '30+ years'],
    ['4.5%', '$45,000', '$3,750', '$120,000', '~28 years'],
    ['5.0%', '$50,000', '$4,167', 'Depleted', '~23 years'],
    ['6.0%', '$60,000', '$5,000', 'Depleted', '~18 years'],
    ['7.0%', '$70,000', '$5,833', 'Depleted', '~14 years']
  ];

  function fmt(n) {
    if (n < 0) return '-$' + Math.abs(Math.round(n)).toLocaleString('en-US');
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  function calculate() {
    var portfolio = parseFloat(document.getElementById('portfolio').value);
    var swr = parseFloat(document.getElementById('withdrawalRate').value);
    var returnRate = parseFloat(document.getElementById('returnRate').value);
    var inflation = parseFloat(document.getElementById('inflation').value);

    if (isNaN(portfolio) || isNaN(swr) || isNaN(returnRate) || portfolio <= 0 || swr <= 0) return;

    var annualReturn = (returnRate || 0) / 100;
    var annualInflation = (inflation || 0) / 100;
    var firstWithdrawal = portfolio * (swr / 100);

    document.getElementById('annualWithdrawal').textContent = fmt(firstWithdrawal) + '/yr';
    document.getElementById('monthlyIncome').textContent = fmt(firstWithdrawal / 12) + '/mo';

    // 30-year projection
    var bal = portfolio;
    var withdrawal = firstWithdrawal;
    var yearsLast = 0;
    var depleted = false;
    var projDiv = document.getElementById('projectionTable');
    projDiv.innerHTML = '';

    // Show key years
    var showYears = [1, 5, 10, 15, 20, 25, 30];
    var projections = [];

    for (var y = 1; y <= 50; y++) {
      bal = bal * (1 + annualReturn) - withdrawal;
      if (bal <= 0 && !depleted) {
        yearsLast = y;
        depleted = true;
      }
      if (y <= 30) {
        projections.push({ year: y, balance: bal, withdrawal: withdrawal });
      }
      withdrawal = withdrawal * (1 + annualInflation);
    }

    if (!depleted) yearsLast = 50;

    var portfolio30 = projections.length >= 30 ? projections[29].balance : 0;
    document.getElementById('portfolio30').textContent = portfolio30 > 0 ? fmt(portfolio30) : 'Depleted';
    document.getElementById('yearsLast').textContent = yearsLast >= 50 ? '50+ years' : '~' + yearsLast + ' years';

    // Render projection milestones
    showYears.forEach(function(yr) {
      if (yr <= projections.length) {
        var p = projections[yr - 1];
        var row = document.createElement('div');
        row.className = 'result-row';
        row.innerHTML = '<div class="result-item" style="flex:0.3"><div class="result-label">Year ' + p.year + '</div></div>' +
          '<div class="result-item"><div class="result-label">Balance</div><div class="result-value" style="font-size:1rem">' + (p.balance > 0 ? fmt(p.balance) : 'Depleted') + '</div></div>' +
          '<div class="result-item"><div class="result-label">Withdrawal</div><div class="result-value" style="font-size:1rem">' + fmt(p.withdrawal) + '</div></div>';
        projDiv.appendChild(row);
      }
    });

    document.getElementById('result').classList.add('visible');
    document.getElementById('projectionResult').style.display = '';
    document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
