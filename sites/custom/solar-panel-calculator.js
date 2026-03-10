(function() {
  'use strict';

  var monthlyKwh = document.getElementById('monthlyKwh');
  var sunHours = document.getElementById('sunHours');
  var panelWatts = document.getElementById('panelWatts');
  var systemLoss = document.getElementById('systemLoss');
  var electricityRate = document.getElementById('electricityRate');
  var costPerWatt = document.getElementById('costPerWatt');
  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  function calculate() {
    var kwh = parseFloat(monthlyKwh.value);
    var sun = parseFloat(sunHours.value);
    var watts = parseFloat(panelWatts.value);
    var loss = parseFloat(systemLoss.value) / 100;
    var rate = parseFloat(electricityRate.value);
    var cpw = parseFloat(costPerWatt.value);

    if (isNaN(kwh) || kwh <= 0 || isNaN(sun) || sun <= 0) return;

    var efficiency = 1 - loss;
    var panelKw = watts / 1000;
    var dailyProduction = sun * panelKw * efficiency;
    var monthlyPerPanel = dailyProduction * 30;
    var panels = Math.ceil(kwh / monthlyPerPanel);
    var systemKw = (panels * watts) / 1000;
    var annualProduction = panels * dailyProduction * 365;

    var grossCost = systemKw * 1000 * cpw;
    var taxCredit = grossCost * 0.30;
    var netCost = grossCost - taxCredit;
    var annualSavings = annualProduction * rate;
    var payback = netCost / annualSavings;

    document.getElementById('panelsNeeded').textContent = panels + ' panels';
    document.getElementById('systemSize').textContent = systemKw.toFixed(1) + ' kW';
    document.getElementById('systemCost').textContent = '$' + Math.round(grossCost).toLocaleString();
    document.getElementById('afterCredit').textContent = '$' + Math.round(netCost).toLocaleString();
    document.getElementById('annualSavings').textContent = '$' + Math.round(annualSavings).toLocaleString() + '/yr';
    document.getElementById('paybackYears').textContent = payback.toFixed(1) + ' years';
    document.getElementById('resultTip').textContent = panels + ' × ' + watts + 'W panels producing ~' + Math.round(annualProduction).toLocaleString() + ' kWh/year';

    result.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  [monthlyKwh, sunHours, panelWatts, systemLoss, electricityRate, costPerWatt].forEach(function(el) {
    el.addEventListener('change', calculate);
    el.addEventListener('input', calculate);
  });

  calculate();
})();
