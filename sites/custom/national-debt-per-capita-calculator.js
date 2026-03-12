(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var totalDebt = parseFloat(document.getElementById('totalDebt').value) || 0;
    var population = parseFloat(document.getElementById('population').value) || 0;
    var taxpayers = parseFloat(document.getElementById('taxpayers').value) || 0;
    var householdSize = parseFloat(document.getElementById('householdSize').value) || 0;

    // Calculation logic
    var debtDollars=totalDebt*1e12; var pop=population*1e6; var tax=taxpayers*1e6; var perCapita=debtDollars/pop; var perTaxpayer=debtDollars/tax; var perHousehold=perCapita*householdSize; var annualInterest=debtDollars*0.032; var interestPerCapita=annualInterest/pop; var gdp=28.78e12; var debtGDP=(debtDollars/gdp)*100;     document.getElementById('perCapita').textContent = dollar(perCapita);
    document.getElementById('perTaxpayer').textContent = dollar(perTaxpayer);
    document.getElementById('perHousehold').textContent = dollar(perHousehold);
    document.getElementById('interestPerCapita').textContent = dollar(interestPerCapita)+'/year';
    document.getElementById('debtGDP').textContent = fmt(debtGDP,1)+'%';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['totalDebt', 'population', 'taxpayers', 'householdSize'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
