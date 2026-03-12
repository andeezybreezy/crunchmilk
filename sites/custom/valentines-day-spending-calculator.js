(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var relationship = document.getElementById('relationship').value;
    var dinnerBudget = parseFloat(document.getElementById('dinnerBudget').value) || 0;
    var giftBudget = parseFloat(document.getElementById('giftBudget').value) || 0;
    var flowersBudget = parseFloat(document.getElementById('flowersBudget').value) || 0;
    var activityBudget = parseFloat(document.getElementById('activityBudget').value) || 0;
    var income = parseFloat(document.getElementById('income').value) || 0;

    // Calculation logic
    var total = dinnerBudget + giftBudget + flowersBudget + activityBudget; var avgSpend = {new: 50, dating: 100, serious: 175, married: 150, longterm: 100}; var avg = avgSpend[relationship] || 100; var diff = total - avg; var pctIncome = income > 0 ? (total / income) * 100 : 0; var tenYearCost = total * 10 * 1.03; var tipTax = dinnerBudget * 0.30; document.getElementById('totalSpend').textContent = dollar(total); document.getElementById('avgComparison').textContent = (diff >= 0 ? '+' : '') + dollar(diff) + ' vs ' + dollar(avg) + ' average'; document.getElementById('incomePercent').textContent = fmt(pctIncome, 1) + '% of income'; document.getElementById('costPerYear').textContent = dollar(tenYearCost) + ' (with inflation)'; document.getElementById('tipAndTax').textContent = '~' + dollar(tipTax) + ' in tip & tax on dinner';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['relationship', 'dinnerBudget', 'giftBudget', 'flowersBudget', 'activityBudget', 'income'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
