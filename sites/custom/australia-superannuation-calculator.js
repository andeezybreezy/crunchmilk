(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var salary = parseFloat(document.getElementById('salary').value) || 0;
    var sgRate = parseFloat(document.getElementById('sgRate').value) || 0;
    var salarySacrifice = parseFloat(document.getElementById('salarySacrifice').value) || 0;
    var currentBalance = parseFloat(document.getElementById('currentBalance').value) || 0;
    var yearsToRetirement = parseFloat(document.getElementById('yearsToRetirement').value) || 0;
    var returnRate = parseFloat(document.getElementById('returnRate').value) || 0;

    // Calculation logic
    var sgContrib = salary * (sgRate / 100);
    var totalContrib = sgContrib + salarySacrifice;
    var concessionalCap = 30000;
    var taxOnContribVal = Math.min(totalContrib, concessionalCap) * 0.15;
    var afterTaxContrib = totalContrib - taxOnContribVal;
    var monthlyReturn = returnRate / 100 / 12;
    var months = yearsToRetirement * 12;
    var balance = currentBalance;
    var monthlyContrib = afterTaxContrib / 12;
    for (var i = 0; i < months; i++) {
      balance = balance * (1 + monthlyReturn) + monthlyContrib;
    }
    var monthlyIncome = balance * 0.04 / 12;
    document.getElementById('employerContrib').textContent = 'A$' + sgContrib.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('totalAnnualContrib').textContent = 'A$' + totalContrib.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('projectedBalance').textContent = 'A$' + balance.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('taxOnContrib').textContent = 'A$' + taxOnContribVal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('monthlyRetirement').textContent = 'A$' + monthlyIncome.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '/mo';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['salary', 'sgRate', 'salarySacrifice', 'currentBalance', 'yearsToRetirement', 'returnRate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
