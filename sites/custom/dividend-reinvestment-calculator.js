(function() {
  'use strict';

  var chartData = [
    ['5', '$15,800', '$14,900', '+$900'],
    ['10', '$25,400', '$22,100', '+$3,300'],
    ['15', '$41,600', '$32,800', '+$8,800'],
    ['20', '$69,200', '$49,100', '+$20,100'],
    ['25', '$116,800', '$73,700', '+$43,100'],
    ['30', '$199,500', '$110,700', '+$88,800']
  ];

  function fmt(n) {
    if (n >= 1000000) return '$' + (n / 1000000).toFixed(2) + 'M';
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  function calculate() {
    var initial = parseFloat(document.getElementById('initialInv').value);
    var monthly = parseFloat(document.getElementById('monthlyAdd').value) || 0;
    var divYield = parseFloat(document.getElementById('divYield').value) / 100;
    var divGrowth = parseFloat(document.getElementById('divGrowth').value) / 100;
    var priceGrowth = parseFloat(document.getElementById('priceGrowth').value) / 100;
    var years = parseInt(document.getElementById('years').value);

    if (isNaN(initial) || isNaN(years) || initial <= 0 || years <= 0) return;

    // DRIP simulation (quarterly dividends)
    var dripBalance = initial;
    var noDripBalance = initial;
    var totalDividends = 0;
    var currentYield = divYield;
    var totalContributed = initial;

    for (var y = 0; y < years; y++) {
      // Quarterly dividend payments
      for (var q = 0; q < 4; q++) {
        // Monthly contributions (3 months per quarter)
        for (var m = 0; m < 3; m++) {
          dripBalance += monthly;
          noDripBalance += monthly;
          totalContributed += monthly;
        }

        // Quarterly dividend (yield / 4)
        var dripDiv = dripBalance * (currentYield / 4);
        var noDripDiv = noDripBalance * (currentYield / 4);
        totalDividends += dripDiv;

        // DRIP: reinvest dividends
        dripBalance += dripDiv;
        // No DRIP: dividends taken as cash (not added to balance)

        // Quarterly price growth
        var quarterGrowth = Math.pow(1 + priceGrowth, 0.25) - 1;
        dripBalance *= (1 + quarterGrowth);
        noDripBalance *= (1 + quarterGrowth);
      }

      // Increase dividend yield by growth rate each year
      currentYield *= (1 + divGrowth);
    }

    var finalAnnualDividend = dripBalance * currentYield;

    document.getElementById('dripValue').textContent = fmt(dripBalance);
    document.getElementById('noDripValue').textContent = fmt(noDripBalance);
    document.getElementById('dripAdvantage').textContent = '+' + fmt(dripBalance - noDripBalance);
    document.getElementById('totalDividends').textContent = fmt(totalDividends);
    document.getElementById('finalDivIncome').textContent = fmt(finalAnnualDividend) + '/yr';
    document.getElementById('totalContributed').textContent = fmt(totalContributed);

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
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td>';
      chartBody.appendChild(tr);
    });
  }

})();
