(function() {
  'use strict';

  var activityFactors = {
    puppy:  { low: 2.0, moderate: 2.5, high: 3.0 },
    adult:  { low: 1.2, moderate: 1.5, high: 1.8 },
    senior: { low: 1.0, moderate: 1.2, high: 1.4 }
  };

  var presets = [
    ['Chihuahua', 6], ['Beagle', 25], ['Border Collie', 40],
    ['Lab / Golden', 70], ['German Shepherd', 80], ['Great Dane', 130]
  ];

  var dogWeight = document.getElementById('dogWeight');
  var weightUnit = document.getElementById('weightUnit');
  var ageGroup = document.getElementById('ageGroup');
  var activityLevel = document.getElementById('activityLevel');
  var foodType = document.getElementById('foodType');
  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  function renderPresets() {
    var grid = document.getElementById('presetGrid');
    presets.forEach(function(p) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'preset-btn';
      btn.innerHTML = p[0] + '<span>' + p[1] + ' lbs</span>';
      btn.addEventListener('click', function() {
        dogWeight.value = p[1];
        weightUnit.value = 'lbs';
        calculate();
      });
      grid.appendChild(btn);
    });
  }

  function calculate() {
    var w = parseFloat(dogWeight.value);
    if (isNaN(w) || w <= 0) return;

    var wKg = weightUnit.value === 'kg' ? w : w * 0.453592;
    var wLbs = weightUnit.value === 'lbs' ? w : w * 2.20462;

    var rer = 70 * Math.pow(wKg, 0.75);
    var age = ageGroup.value;
    var activity = activityLevel.value;
    var factor = activityFactors[age][activity];
    var mer = rer * factor;

    var food = foodType.value;
    var amountStr = '';
    var perMealStr = '';

    if (food === 'dry') {
      var cups = mer / 350;
      amountStr = cups.toFixed(1) + ' cups';
      perMealStr = (cups / 2).toFixed(1) + ' cups';
    } else if (food === 'wet') {
      var cans = mer / 250;
      amountStr = cans.toFixed(1) + ' cans (13 oz)';
      perMealStr = (cans / 2).toFixed(1) + ' cans';
    } else {
      var ozRaw = mer / 35;
      var lbsRaw = ozRaw / 16;
      amountStr = ozRaw.toFixed(0) + ' oz (' + lbsRaw.toFixed(2) + ' lbs)';
      perMealStr = (ozRaw / 2).toFixed(0) + ' oz';
    }

    document.getElementById('dailyCal').textContent = Math.round(mer) + ' kcal';
    document.getElementById('rerCal').textContent = Math.round(rer) + ' kcal';
    document.getElementById('foodAmount').textContent = amountStr;
    document.getElementById('perMeal').textContent = perMealStr;
    document.getElementById('resultTip').textContent = age.charAt(0).toUpperCase() + age.slice(1) + ', ' + activity + ' activity, factor: ' + factor.toFixed(1) + '×';

    result.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  [dogWeight, weightUnit, ageGroup, activityLevel, foodType].forEach(function(el) {
    el.addEventListener('change', calculate);
    el.addEventListener('input', calculate);
  });

  renderPresets();
  calculate();
})();
