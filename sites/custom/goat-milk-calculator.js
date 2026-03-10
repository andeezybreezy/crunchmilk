(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  // Gallons per day at peak
  var breedData = {
    saanen:   { peakGal: 1.25, label: 'Saanen', butterfat: 3.5 },
    alpine:   { peakGal: 0.875, label: 'Alpine', butterfat: 3.5 },
    lamancha: { peakGal: 0.875, label: 'LaMancha', butterfat: 4.0 },
    nubian:   { peakGal: 0.625, label: 'Nubian', butterfat: 5.0 },
    nigerian: { peakGal: 0.375, label: 'Nigerian Dwarf', butterfat: 6.5 }
  };

  var lactationFactor = {
    early: 0.80,
    peak:  1.00,
    mid:   0.75,
    late:  0.50
  };

  function val(id) {
    var v = parseFloat(document.getElementById(id).value);
    return isNaN(v) || v <= 0 ? 0 : v;
  }

  function sel(id) {
    return document.getElementById(id).value;
  }

  function calculate() {
    var does = val('doeCount');
    var breed = sel('breed');
    var stage = sel('lactStage');

    if (does <= 0) return;

    var b = breedData[breed];
    var lf = lactationFactor[stage];

    var dailyPerDoe = b.peakGal * lf;
    var dailyTotal = does * dailyPerDoe;
    var weeklyTotal = dailyTotal * 7;
    var monthlyTotal = dailyTotal * 30.44;

    // Cheese: ~1 lb per gallon (hard cheese)
    var cheeseMonthly = monthlyTotal * 1;

    // Soap: 1 gallon = ~8 batches (10-12 oz per batch, 128 oz per gallon)
    var soapBatches = monthlyTotal * 8;

    var quartsDaily = dailyPerDoe * 4;

    document.getElementById('dailyMilk').textContent = dailyTotal.toFixed(2) + ' gal (' + (dailyTotal * 4).toFixed(1) + ' qt)';
    document.getElementById('weeklyMilk').textContent = weeklyTotal.toFixed(1) + ' gallons';
    document.getElementById('monthlyMilk').textContent = monthlyTotal.toFixed(1) + ' gallons';
    document.getElementById('cheeseYield').textContent = cheeseMonthly.toFixed(1) + ' lbs cheese';
    document.getElementById('soapBatches').textContent = Math.floor(soapBatches) + ' batches (~' + (Math.floor(soapBatches) * 5) + ' bars)';
    document.getElementById('perDoe').textContent = dailyPerDoe.toFixed(2) + ' gal (' + quartsDaily.toFixed(1) + ' qt)';

    var tip = does + ' ' + b.label + ' doe' + (does > 1 ? 's' : '') + ' at ' + stage + ' lactation (' + b.butterfat + '% butterfat). ';
    if (stage === 'late') {
      tip += 'Consider drying off does 2 months before next kidding.';
    } else if (stage === 'peak') {
      tip += 'Peak production — great time for cheese making and building surplus.';
    } else {
      tip += 'Monthly milk value at $10/gal: ~$' + Math.round(monthlyTotal * 10) + '.';
    }
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
