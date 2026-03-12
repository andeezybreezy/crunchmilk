(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var currentDebt = parseFloat(document.getElementById('currentDebt').value) || 0;
    var gdp = parseFloat(document.getElementById('gdp').value) || 0;
    var deficitGrowth = parseFloat(document.getElementById('deficitGrowth').value) || 0;
    var gdpGrowth = parseFloat(document.getElementById('gdpGrowth').value) || 0;
    var avgInterestRate = parseFloat(document.getElementById('avgInterestRate').value) || 0;
    var yearsForward = parseFloat(document.getElementById('yearsForward').value) || 0;

    // Calculation logic
    var debt = currentDebt; var g = gdp; var defGr = deficitGrowth / 100; var gdpGr = gdpGrowth / 100; var intRate = avgInterestRate / 100; var deficit = 1.7; var crisisYr = 'Beyond projection'; for (var i = 0; i < yearsForward; i++) { deficit = deficit * (1 + defGr); debt += deficit; g = g * (1 + gdpGr); var interest = debt * intRate; var revenue = g * 0.17; if (interest / revenue > 0.5 && crisisYr === 'Beyond projection') { crisisYr = (2024 + i + 1) + ' (interest > 50% of revenue)'; } } var ratio = (debt / g) * 100; var annInt = debt * intRate; var rev = g * 0.17; var intPctRev = (annInt / rev) * 100; var pop = 335; var perCap = (debt * 1e12) / (pop * 1e6); document.getElementById('futureDebt').textContent = '$' + fmt(debt, 1) + ' Trillion'; document.getElementById('futureGDP').textContent = '$' + fmt(g, 1) + ' Trillion'; document.getElementById('futureRatio').textContent = fmt(ratio, 1) + '%'; document.getElementById('annualInterest').textContent = '$' + fmt(annInt, 2) + ' Trillion/yr'; document.getElementById('interestPctRevenue').textContent = fmt(intPctRev, 1) + '% of federal revenue'; document.getElementById('crisisYear').textContent = crisisYr; document.getElementById('perCapita').textContent = dollar(perCap) + ' per person';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['currentDebt', 'gdp', 'deficitGrowth', 'gdpGrowth', 'avgInterestRate', 'yearsForward'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
