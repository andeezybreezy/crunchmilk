(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var region = document.getElementById('region').value;
    var homeValue = parseFloat(document.getElementById('homeValue').value) || 0;
    var annualInsurance = parseFloat(document.getElementById('annualInsurance').value) || 0;
    var monthlyEnergy = parseFloat(document.getElementById('monthlyEnergy').value) || 0;
    var monthlyFood = parseFloat(document.getElementById('monthlyFood').value) || 0;
    var yearsForward = parseFloat(document.getElementById('yearsForward').value) || 0;

    // Calculation logic
    var regionRisk = {northeast: {ins: 6, energy: 3, food: 3, prop: -2}, southeast: {ins: 12, energy: 5, food: 4, prop: -8}, midwest: {ins: 7, energy: 3, food: 3.5, prop: -3}, southwest: {ins: 9, energy: 6, food: 4, prop: -5}, pacific: {ins: 10, energy: 4, food: 3.5, prop: -4}, mountain: {ins: 8, energy: 3.5, food: 3, prop: -2}}; var risk = regionRisk[region]; var futureIns = annualInsurance * Math.pow(1 + risk.ins / 100, yearsForward); var futureEnergy = monthlyEnergy * Math.pow(1 + risk.energy / 100, yearsForward); var futureFood = monthlyFood * Math.pow(1 + risk.food / 100, yearsForward); var propChange = homeValue * (risk.prop / 100) * (yearsForward / 10); var propFuture = homeValue + propChange; var annualInsIncrease = futureIns - annualInsurance; var annualEnergyIncrease = (futureEnergy - monthlyEnergy) * 12; var annualFoodIncrease = (futureFood - monthlyFood) * 12; var totalAnnual = annualInsIncrease + annualEnergyIncrease + annualFoodIncrease; var cumulative = 0; for (var i = 1; i <= yearsForward; i++) { var yIns = annualInsurance * Math.pow(1 + risk.ins / 100, i) - annualInsurance; var yEnergy = (monthlyEnergy * Math.pow(1 + risk.energy / 100, i) - monthlyEnergy) * 12; var yFood = (monthlyFood * Math.pow(1 + risk.food / 100, i) - monthlyFood) * 12; cumulative += yIns + yEnergy + yFood; } document.getElementById('insuranceProjected').textContent = dollar(futureIns) + '/yr (+' + fmt(((futureIns / annualInsurance - 1) * 100), 0) + '%)'; document.getElementById('energyProjected').textContent = dollar(futureEnergy) + '/mo (+' + fmt(((futureEnergy / monthlyEnergy - 1) * 100), 0) + '%)'; document.getElementById('foodProjected').textContent = dollar(futureFood) + '/mo (+' + fmt(((futureFood / monthlyFood - 1) * 100), 0) + '%)'; document.getElementById('propertyImpact').textContent = dollar(propFuture) + ' (' + (propChange >= 0 ? '+' : '') + dollar(propChange) + ')'; document.getElementById('totalAnnualIncrease').textContent = '+' + dollar(totalAnnual) + '/yr by year ' + yearsForward; document.getElementById('cumulativeCost').textContent = dollar(cumulative) + ' total extra over ' + yearsForward + ' years';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['region', 'homeValue', 'annualInsurance', 'monthlyEnergy', 'monthlyFood', 'yearsForward'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
