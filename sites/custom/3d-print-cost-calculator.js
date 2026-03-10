(function() {
  'use strict';

  function calculate() {
    var filamentG = parseFloat(document.getElementById('filamentUsed').value);
    var filamentPerKg = parseFloat(document.getElementById('filamentCost').value);
    var printHours = parseFloat(document.getElementById('printTime').value);
    var elecRate = parseFloat(document.getElementById('electricRate').value);
    var watts = parseFloat(document.getElementById('printerWattage').value);
    var printerCost = parseFloat(document.getElementById('printerCost').value);
    var printerLife = parseFloat(document.getElementById('printerLife').value);
    var markup = parseFloat(document.getElementById('markup').value);

    if (isNaN(filamentG) || isNaN(printHours) || filamentG <= 0 || printHours <= 0) return;

    // Material cost
    var materialCost = (filamentG / 1000) * filamentPerKg;

    // Electricity cost
    var electricCost = (watts / 1000) * printHours * elecRate;

    // Depreciation cost
    var depreciationCost = printerLife > 0 ? (printerCost / printerLife) * printHours : 0;

    // Total cost
    var totalCost = materialCost + electricCost + depreciationCost;

    // Sell price with markup
    var sellPrice = totalCost * (1 + (markup / 100));
    var profit = sellPrice - totalCost;

    document.getElementById('totalCost').textContent = '$' + totalCost.toFixed(2);
    document.getElementById('sellPrice').textContent = '$' + sellPrice.toFixed(2);
    document.getElementById('materialCost').textContent = '$' + materialCost.toFixed(2);
    document.getElementById('electricCost').textContent = '$' + electricCost.toFixed(2);
    document.getElementById('depreciationCost').textContent = '$' + depreciationCost.toFixed(2);
    document.getElementById('profit').textContent = '$' + profit.toFixed(2);

    // Cost breakdown percentages
    var matPct = ((materialCost / totalCost) * 100).toFixed(0);
    var elecPct = ((electricCost / totalCost) * 100).toFixed(0);
    var depPct = ((depreciationCost / totalCost) * 100).toFixed(0);
    var tip = 'Cost breakdown: Material ' + matPct + '%, Electricity ' + elecPct + '%, Depreciation ' + depPct + '%. Cost per gram: $' + (totalCost / filamentG).toFixed(3) + '.';
    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);

  var inputs = document.querySelectorAll('#filamentUsed, #filamentCost, #printTime, #electricRate, #printerWattage, #printerCost, #printerLife, #markup');
  inputs.forEach(function(input) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });
})();
