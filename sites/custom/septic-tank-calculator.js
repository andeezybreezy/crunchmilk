(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  var percRates = {
    gravel: { rate: 2, appRate: 1.2 },
    sand:   { rate: 5, appRate: 0.8 },
    loam:   { rate: 20, appRate: 0.5 },
    clay:   { rate: 50, appRate: 0.2 }
  };

  function val(id) {
    var v = parseFloat(document.getElementById(id).value);
    return isNaN(v) || v <= 0 ? 0 : v;
  }

  function sel(id) {
    return document.getElementById(id).value;
  }

  function fmt(n) {
    return n.toLocaleString('en-US');
  }

  function calculate() {
    var bedrooms = parseInt(sel('bedrooms'), 10);
    var dailyUsage = val('dailyUsage');
    var soilType = sel('soilType');

    if (dailyUsage <= 0) return;

    // Minimum tank size by bedrooms
    var minTank;
    if (bedrooms <= 3) minTank = 1000;
    else if (bedrooms === 4) minTank = 1250;
    else minTank = 1500;

    // Upsize tank if daily usage is very high (tank should hold 2 days minimum)
    var usageTank = Math.ceil(dailyUsage * 2 / 250) * 250;
    if (usageTank > minTank) minTank = usageTank;

    // Drain field sizing
    var soil = percRates[soilType];
    var drainFieldSqFt = Math.ceil(dailyUsage / soil.appRate);

    // Cost estimate
    var tankCost = minTank <= 1000 ? 2000 : minTank <= 1250 ? 2500 : 3000;
    var fieldCostPerSqFt = soilType === 'clay' ? 12 : soilType === 'loam' ? 8 : soilType === 'sand' ? 6 : 5;
    var fieldCost = drainFieldSqFt * fieldCostPerSqFt;
    var permitCost = 1500;
    var totalCost = tankCost + fieldCost + permitCost;

    document.getElementById('tankSize').textContent = fmt(minTank) + ' gallons';
    document.getElementById('drainField').textContent = fmt(drainFieldSqFt) + ' sq ft';
    document.getElementById('percRate').textContent = soil.rate + ' min/inch (' + soilType + ')';
    document.getElementById('totalCost').textContent = '$' + fmt(totalCost);

    var tip = bedrooms + '-bedroom home, ' + fmt(Math.round(dailyUsage)) + ' gal/day. ';
    if (soilType === 'clay') tip += 'Clay soil requires a larger drain field — consider an engineered system.';
    else if (soilType === 'gravel') tip += 'Gravel drains quickly — verify adequate treatment depth with your health dept.';
    else tip += 'Tank cost ~$' + fmt(tankCost) + ' + drain field ~$' + fmt(fieldCost) + ' + permits ~$' + fmt(permitCost) + '.';
    document.getElementById('resultTip').textContent = tip;

    result.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  document.querySelectorAll('input[type="number"]').forEach(function(el) {
    el.addEventListener('input', calculate);
  });
  document.querySelectorAll('select').forEach(function(el) {
    el.addEventListener('change', calculate);
  });

  calculate();
})();
