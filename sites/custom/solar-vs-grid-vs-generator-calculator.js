(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var monthlyKwh = parseFloat(document.getElementById('monthlyKwh').value) || 0;
    var gridRate = parseFloat(document.getElementById('gridRate').value) || 0;
    var solarCost = parseFloat(document.getElementById('solarCost').value) || 0;
    var solarTaxCredit = parseFloat(document.getElementById('solarTaxCredit').value) || 0;
    var genCost = parseFloat(document.getElementById('genCost').value) || 0;
    var fuelCostGal = parseFloat(document.getElementById('fuelCostGal').value) || 0;

    // Calculation logic
    var annualKwh = monthlyKwh * 12; var gridInflation = 0.03; var fuelInflation = 0.04; var gridTotal = 0; var currentRate = gridRate; for (var y = 0; y < 20; y++) { gridTotal += annualKwh * currentRate; currentRate *= (1 + gridInflation); } var netSolarCost = solarCost * (1 - solarTaxCredit / 100); var solarMaintenance = 200; var inverterReplace = 3000; var solarTotalCost = netSolarCost; for (var y2 = 0; y2 < 20; y2++) { solarTotalCost += solarMaintenance; if (y2 === 11) solarTotalCost += inverterReplace; } var solarAnnualSavings = annualKwh * gridRate; var paybackYears = netSolarCost / solarAnnualSavings; var solarEffectiveCostPerKwh = solarTotalCost / (annualKwh * 20); var genKwhPerGal = 8; var genFuelPerYear = annualKwh / genKwhPerGal; var genMaintenancePerYear = 800; var genReplaceInterval = 7; var genTotal = genCost; var currentFuelCost = fuelCostGal; for (var y3 = 0; y3 < 20; y3++) { genTotal += genFuelPerYear * currentFuelCost + genMaintenancePerYear; currentFuelCost *= (1 + fuelInflation); if (y3 > 0 && y3 % genReplaceInterval === 0) genTotal += genCost * 0.7; } var genCostPerKwhVal = genTotal / (annualKwh * 20); var solarSavingsVal = gridTotal - solarTotalCost; var bestOpt = 'Solar'; var bestCost = solarTotalCost; if (gridTotal < bestCost) { bestOpt = 'Grid'; bestCost = gridTotal; } if (genTotal < bestCost) { bestOpt = 'Generator'; bestCost = genTotal; } document.getElementById('gridTotal20').textContent = '$' + gridTotal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); document.getElementById('solarTotal20').textContent = '$' + solarTotalCost.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); document.getElementById('genTotal20').textContent = '$' + genTotal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); document.getElementById('solarPayback').textContent = paybackYears.toFixed(1) + ' years'; document.getElementById('solarSavings20').textContent = solarSavingsVal > 0 ? '$' + solarSavingsVal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '-$' + Math.abs(solarSavingsVal).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); document.getElementById('solarCostPerKwh').textContent = '$' + solarEffectiveCostPerKwh.toFixed(3) + '/kWh'; document.getElementById('genCostPerKwh').textContent = '$' + genCostPerKwhVal.toFixed(3) + '/kWh'; document.getElementById('bestOption').textContent = bestOpt + ' ($' + bestCost.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ')';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['monthlyKwh', 'gridRate', 'solarCost', 'solarTaxCredit', 'genCost', 'fuelCostGal'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
