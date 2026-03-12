(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var foodType = document.getElementById('foodType').value;
    var weeklySpend = parseFloat(document.getElementById('weeklySpend').value) || 0;
    var organicPct = parseFloat(document.getElementById('organicPct').value) || 0;
    var targetOrganicPct = parseFloat(document.getElementById('targetOrganicPct').value) || 0;
    var familySize = parseFloat(document.getElementById('familySize').value) || 0;

    // Calculation logic
    var premiums = {produce: 0.47, dairy: 0.35, meat: 0.65, grains: 0.30, baby: 0.25}; var pestReduction = {produce: 80, dairy: 40, meat: 30, grains: 50, baby: 70}; var nutritionBonus = {produce: 1.12, dairy: 1.05, meat: 1.03, grains: 1.02, baby: 1.08}; var prem = premiums[foodType] || 0.40; var pestRed = pestReduction[foodType] || 50; var nutBonus = nutritionBonus[foodType] || 1.05; var convCost = weeklySpend * (1 - organicPct / 100); var orgCost = weeklySpend * (organicPct / 100) * (1 + prem); var currentWeekly = convCost + orgCost; var targetConv = weeklySpend * (1 - targetOrganicPct / 100); var targetOrg = weeklySpend * (targetOrganicPct / 100) * (1 + prem); var targetWeekly = targetConv + targetOrg; var annualDiff = (targetWeekly - currentWeekly) * 52; var adjPestRed = pestRed * (targetOrganicPct - organicPct) / 100; var convNutrient = weeklySpend / 100; var orgNutrient = targetWeekly / (100 * nutBonus); document.getElementById('currentCost').textContent = dollar(currentWeekly) + '/week'; document.getElementById('targetCost').textContent = dollar(targetWeekly) + '/week'; document.getElementById('annualDiff').textContent = (annualDiff >= 0 ? '+' : '') + dollar(annualDiff) + '/year'; document.getElementById('premiumPct').textContent = fmt(prem * 100, 0) + '% more for organic ' + foodType; document.getElementById('pesticideReduction').textContent = fmt(adjPestRed, 0) + '% less pesticide exposure'; document.getElementById('costPerNutrient').textContent = 'Conv: $' + fmt(convNutrient, 2) + ' vs Org: $' + fmt(orgNutrient, 2) + ' per nutrition point';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['foodType', 'weeklySpend', 'organicPct', 'targetOrganicPct', 'familySize'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
