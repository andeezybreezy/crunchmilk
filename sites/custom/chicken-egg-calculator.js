(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  var breedData = {
    high:     { min: 280, max: 320, label: 'High production' },
    heritage: { min: 150, max: 200, label: 'Heritage' },
    bantam:   { min: 100, max: 150, label: 'Bantam' }
  };

  var ageFactor = { 1: 1.0, 2: 0.85, 3: 0.70, 4: 0.55 };
  var seasonFactor = { summer: 1.0, fall: 0.85, winter: 0.60 };

  function val(id) {
    var v = parseFloat(document.getElementById(id).value);
    return isNaN(v) || v <= 0 ? 0 : v;
  }

  function sel(id) {
    return document.getElementById(id).value;
  }

  function calculate() {
    var hens = val('henCount');
    var breed = sel('breedType');
    var age = parseInt(sel('henAge'), 10);
    var season = sel('season');

    if (hens <= 0) return;

    var b = breedData[breed];
    var avgYearly = (b.min + b.max) / 2;
    var af = ageFactor[age] || 0.55;
    var sf = seasonFactor[season] || 1.0;

    var adjustedYearly = avgYearly * af;
    var dailyPerHen = (adjustedYearly / 365) * sf;
    var dailyTotal = hens * dailyPerHen;
    var weeklyTotal = dailyTotal * 7;
    var monthlyTotal = dailyTotal * 30.44;
    var yearlyTotal = hens * adjustedYearly;

    var dozensMonth = monthlyTotal / 12;

    // Feed cost: ~$0.07/hen/day
    var feedCostMonth = hens * 0.07 * 30.44;
    // Egg value: ~$4.50/dozen
    var eggValueMonth = dozensMonth * 4.50;

    document.getElementById('dailyEggs').textContent = dailyTotal.toFixed(1) + ' eggs';
    document.getElementById('weeklyEggs').textContent = weeklyTotal.toFixed(0) + ' eggs';
    document.getElementById('monthlyEggs').textContent = monthlyTotal.toFixed(0) + ' eggs';
    document.getElementById('yearlyEggs').textContent = Math.round(yearlyTotal).toLocaleString('en-US') + ' eggs';
    document.getElementById('dozensMonth').textContent = dozensMonth.toFixed(1) + ' dozen';

    var savings = eggValueMonth - feedCostMonth;
    var costText = 'Feed: $' + feedCostMonth.toFixed(2) + '/mo | Value: $' + eggValueMonth.toFixed(2) + '/mo';
    document.getElementById('costAnalysis').textContent = costText;

    var tip = b.label + ' hens, year ' + age + ', ' + season + ' season. ';
    if (savings > 0) {
      tip += 'Monthly savings vs store eggs: ~$' + savings.toFixed(2) + '.';
    } else {
      tip += 'Feed cost slightly exceeds egg value at current production level.';
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
