(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var annualContrib = parseFloat(document.getElementById('annualContrib').value) || 0;
    var currentBalance = parseFloat(document.getElementById('currentBalance').value) || 0;
    var returnRate = parseFloat(document.getElementById('returnRate').value) || 0;
    var years = parseFloat(document.getElementById('years').value) || 0;
    var marginalRate = parseFloat(document.getElementById('marginalRate').value) || 0;

    // Calculation logic
    var monthlyRate = returnRate / 100 / 12;
    var months = years * 12;
    var monthlyContrib = annualContrib / 12;
    var balance = currentBalance;
    for (var i = 0; i < months; i++) {
      balance = balance * (1 + monthlyRate) + monthlyContrib;
    }
    var totalContrib = currentBalance + annualContrib * years;
    var growth = balance - totalContrib;
    var taxSavedVal = growth * (marginalRate / 100);
    var monthlyInc = balance * 0.04 / 12;
    document.getElementById('totalContributions').textContent = '$' + totalContrib.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('investmentGrowth').textContent = '$' + growth.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('tfsaBalance').textContent = '$' + balance.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('taxSaved').textContent = '$' + taxSavedVal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('monthlyIncome').textContent = '$' + monthlyInc.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '/mo';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['annualContrib', 'currentBalance', 'returnRate', 'years', 'marginalRate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
