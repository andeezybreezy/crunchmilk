(function() {
  'use strict';

  var chartData = [
    ['$1,800', '$1,700', '$1,200', '1.3%'],
    ['$2,000', '$1,700', '$3,600', '4.0%'],
    ['$2,200', '$1,700', '$6,000', '6.7%'],
    ['$2,400', '$1,700', '$8,400', '9.3%'],
    ['$2,600', '$1,700', '$10,800', '12.0%'],
    ['$2,800', '$1,700', '$13,200', '14.7%'],
    ['$3,000', '$1,700', '$15,600', '17.3%']
  ];

  function fmt(n) {
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  function calculate() {
    var price = parseFloat(document.getElementById('purchasePrice').value);
    var dpPct = parseFloat(document.getElementById('downPayment').value);
    var closing = parseFloat(document.getElementById('closingCosts').value) || 0;
    var rehab = parseFloat(document.getElementById('rehabCosts').value) || 0;
    var rent = parseFloat(document.getElementById('monthlyRent').value);
    var expenses = parseFloat(document.getElementById('monthlyExpenses').value);

    if (isNaN(price) || isNaN(dpPct) || isNaN(rent) || isNaN(expenses) || price <= 0 || rent <= 0) return;

    var downPayment = price * (dpPct / 100);
    var totalCashInvested = downPayment + closing + rehab;
    var monthlyCashFlow = rent - expenses;
    var annualCashFlow = monthlyCashFlow * 12;
    var cocReturn = (annualCashFlow / totalCashInvested) * 100;

    document.getElementById('cocReturn').textContent = cocReturn.toFixed(2) + '%';
    document.getElementById('annualCF').textContent = fmt(annualCashFlow) + '/yr';
    document.getElementById('totalInvested').textContent = fmt(totalCashInvested);
    document.getElementById('monthlyCF').textContent = fmt(monthlyCashFlow) + '/mo';

    // Color-code the return
    var cocEl = document.getElementById('cocReturn');
    cocEl.style.color = cocReturn >= 8 ? '#2e7d32' : cocReturn >= 5 ? '#f57f17' : '#c62828';

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);

  // Enter key on all inputs
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
