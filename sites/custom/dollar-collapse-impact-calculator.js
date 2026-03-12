(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var declinePct = parseFloat(document.getElementById('declinePct').value) || 0;
    var savingsAmount = parseFloat(document.getElementById('savingsAmount').value) || 0;
    var annualIncome = parseFloat(document.getElementById('annualIncome').value) || 0;
    var mortgageBalance = parseFloat(document.getElementById('mortgageBalance').value) || 0;
    var monthlyGroceries = parseFloat(document.getElementById('monthlyGroceries').value) || 0;
    var goldPct = parseFloat(document.getElementById('goldPct').value) || 0;

    // Calculation logic
    var decline = declinePct / 100; var importMult = 1 / (1 - decline); var domesticMult = 1 + decline * 0.4; var savingsReal = savingsAmount * (1 - decline); var gasNew = 3.50 * importMult; var importPct = 0.35; var groceryNew = monthlyGroceries * (1 + decline * importPct + decline * 0.15); var mortgageReal = mortgageBalance * (1 - decline); var goldAlloc = savingsAmount * (goldPct / 100); var cashAlloc = savingsAmount * (1 - goldPct / 100); var goldValue = goldAlloc * importMult; var cashValue = cashAlloc * (1 - decline); var totalAfter = goldValue + cashValue; var netChange = totalAfter - savingsAmount; document.getElementById('savingsImpact').textContent = dollar(savingsReal) + ' (was ' + dollar(savingsAmount) + ')'; document.getElementById('gasPrice').textContent = dollar(gasNew) + '/gallon'; document.getElementById('groceryImpact').textContent = dollar(groceryNew) + '/mo (was ' + dollar(monthlyGroceries) + ')'; document.getElementById('importCosts').textContent = '+' + fmt(((importMult - 1) * 100), 0) + '% on imported goods'; document.getElementById('mortgageEffect').textContent = dollar(mortgageReal) + ' (debt shrinks in real terms)'; document.getElementById('hedgeValue').textContent = dollar(goldValue) + ' (from ' + dollar(goldAlloc) + ')'; document.getElementById('netImpact').textContent = (netChange >= 0 ? '+' : '') + dollar(netChange);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['declinePct', 'savingsAmount', 'annualIncome', 'mortgageBalance', 'monthlyGroceries', 'goldPct'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
