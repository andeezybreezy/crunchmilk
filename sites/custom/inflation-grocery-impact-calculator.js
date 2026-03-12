(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var weeklyGrocery = parseFloat(document.getElementById('weeklyGrocery').value) || 0;
    var inflationRate = parseFloat(document.getElementById('inflationRate').value) || 0;
    var foodInflation = parseFloat(document.getElementById('foodInflation').value) || 0;
    var familySize = parseFloat(document.getElementById('familySize').value) || 0;
    var incomeGrowth = parseFloat(document.getElementById('incomeGrowth').value) || 0;

    // Calculation logic
    var weeklyInc = weeklyGrocery * (foodInflation / 100); var monthlyInc = weeklyInc * 4.33; var annualInc = weeklyInc * 52; var fiveYear = 0; for (var y = 1; y <= 5; y++) { fiveYear += weeklyGrocery * 52 * (Math.pow(1 + foodInflation / 100, y) - 1); } var realWageLoss = foodInflation - incomeGrowth; var perPerson = annualInc / familySize; var milk = 4.50 * (foodInflation / 100); var bread = 3.50 * (foodInflation / 100); var eggs = 5.00 * (foodInflation / 100); var chicken = 4.00 * (foodInflation / 100); document.getElementById('weeklyIncrease').textContent = '+' + dollar(weeklyInc) + '/week'; document.getElementById('monthlyImpact').textContent = '+' + dollar(monthlyInc) + '/month'; document.getElementById('annualImpact').textContent = '+' + dollar(annualInc) + '/year (' + dollar(perPerson) + '/person)'; document.getElementById('fiveYearCost').textContent = '+' + dollar(fiveYear) + ' over 5 years'; document.getElementById('realWageImpact').textContent = (realWageLoss > 0 ? 'Losing ' + fmt(realWageLoss, 1) + '% purchasing power' : 'Wages outpacing food inflation by ' + fmt(Math.abs(realWageLoss), 1) + '%'); document.getElementById('itemExamples').textContent = 'Milk +$' + fmt(milk, 2) + ' | Bread +$' + fmt(bread, 2) + ' | Eggs +$' + fmt(eggs, 2) + ' | Chicken/lb +$' + fmt(chicken, 2);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['weeklyGrocery', 'inflationRate', 'foodInflation', 'familySize', 'incomeGrowth'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
