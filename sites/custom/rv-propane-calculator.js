(function() {
  'use strict';

  // BTU per hour ratings for each appliance
  var btuRates = {
    furnace: 30000,
    fridge: 1500,
    stove: 9000,
    waterHeater: 12000,
    generator: 60000
  };

  var BTU_PER_GALLON = 91500;

  function calculate() {
    var appliances = [
      { id: 'Furnace', chk: 'chkFurnace', hrs: 'hrsFurnace', btu: btuRates.furnace },
      { id: 'Fridge', chk: 'chkFridge', hrs: 'hrsFridge', btu: btuRates.fridge },
      { id: 'Stove', chk: 'chkStove', hrs: 'hrsStove', btu: btuRates.stove },
      { id: 'Water Heater', chk: 'chkWaterHeater', hrs: 'hrsWaterHeater', btu: btuRates.waterHeater },
      { id: 'Generator', chk: 'chkGenerator', hrs: 'hrsGenerator', btu: btuRates.generator }
    ];

    var totalDailyBTU = 0;
    var biggestName = '';
    var biggestBTU = 0;

    for (var i = 0; i < appliances.length; i++) {
      var a = appliances[i];
      var checked = document.getElementById(a.chk).checked;
      var hours = parseFloat(document.getElementById(a.hrs).value) || 0;

      if (checked && hours > 0) {
        var dailyBTU = a.btu * hours;
        totalDailyBTU += dailyBTU;
        if (dailyBTU > biggestBTU) {
          biggestBTU = dailyBTU;
          biggestName = a.id;
        }
      }
    }

    if (totalDailyBTU === 0) return;

    var tankGallons = parseFloat(document.getElementById('tankSize').value);
    var numTanks = parseInt(document.getElementById('numTanks').value);
    var price = parseFloat(document.getElementById('propanePrice').value) || 3.50;

    var totalGallons = tankGallons * numTanks;

    // Daily usage in gallons
    var dailyGallons = totalDailyBTU / BTU_PER_GALLON;

    // Days per tank
    var daysPerTank = totalGallons / dailyGallons;

    // Costs
    var costPerDay = dailyGallons * price;
    var costPerWeek = costPerDay * 7;

    document.getElementById('dailyUsage').textContent = dailyGallons.toFixed(2) + ' gal/day';
    document.getElementById('daysPerTank').textContent = daysPerTank.toFixed(1) + ' days';
    document.getElementById('costPerDay').textContent = '$' + costPerDay.toFixed(2);
    document.getElementById('costPerWeek').textContent = '$' + costPerWeek.toFixed(2);
    document.getElementById('dailyBTU').textContent = totalDailyBTU.toLocaleString() + ' BTU';
    document.getElementById('biggest').textContent = biggestName;

    var biggestPct = ((biggestBTU / totalDailyBTU) * 100).toFixed(0);
    var tip = biggestName + ' accounts for ' + biggestPct + '% of your propane usage. Total capacity: ' + totalGallons.toFixed(1) + ' gallons (' + numTanks + ' \u00D7 ' + tankGallons + ' gal). Monthly cost estimate: $' + (costPerDay * 30).toFixed(2) + '.';
    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);

  // Enter key on number inputs
  var inputs = document.querySelectorAll('#hrsFurnace, #hrsFridge, #hrsStove, #hrsWaterHeater, #hrsGenerator, #propanePrice');
  inputs.forEach(function(input) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });
})();
