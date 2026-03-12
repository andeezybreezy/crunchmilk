(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var coverageAmount = parseFloat(document.getElementById('coverageAmount').value) || 0;
    var age = parseFloat(document.getElementById('age').value) || 0;
    var termPremium = parseFloat(document.getElementById('termPremium').value) || 0;
    var wholePremium = parseFloat(document.getElementById('wholePremium').value) || 0;
    var investReturn = parseFloat(document.getElementById('investReturn').value) || 0;
    var cashValueReturn = parseFloat(document.getElementById('cashValueReturn').value) || 0;

    // Calculation logic
    var termTotal = termPremium * 12 * 30; var wholeTotal = wholePremium * 12 * 30; var monthlyDiff = wholePremium - termPremium; var monthlyInvestRate = Math.pow(1 + investReturn / 100, 1/12) - 1; var investedValue = 0; for (var m = 0; m < 360; m++) { investedValue = (investedValue + monthlyDiff) * (1 + monthlyInvestRate); } var monthlyCashRate = Math.pow(1 + cashValueReturn / 100, 1/12) - 1; var cashValue = 0; var premiumToCash = wholePremium * 0.35; for (var m2 = 0; m2 < 360; m2++) { if (m2 < 24) { cashValue = cashValue * (1 + monthlyCashRate); } else if (m2 < 120) { cashValue = (cashValue + premiumToCash * 0.7) * (1 + monthlyCashRate); } else { cashValue = (cashValue + premiumToCash) * (1 + monthlyCashRate); } } var termNetWorth = investedValue; var wholeNetCostVal = wholeTotal - cashValue; var termAdvantage = investedValue - cashValue; document.getElementById('termTotal30').textContent = '$' + termTotal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); document.getElementById('wholeTotal30').textContent = '$' + wholeTotal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); document.getElementById('premiumDiff').textContent = '$' + monthlyDiff.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '/mo'; document.getElementById('investedDiffValue').textContent = '$' + investedValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); document.getElementById('cashValue30').textContent = '$' + cashValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); document.getElementById('termPlusInvest').textContent = '$' + termNetWorth.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); document.getElementById('wholeNetCost').textContent = '$' + wholeNetCostVal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); document.getElementById('recommendation').textContent = termAdvantage > 0 ? 'Buy Term & Invest the Difference (+$' + termAdvantage.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ')' : 'Whole Life (+$' + Math.abs(termAdvantage).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ')';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['coverageAmount', 'age', 'termPremium', 'wholePremium', 'investReturn', 'cashValueReturn'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
