(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  var animalData = {
    cattle: { lbsPerDay: 30, label: 'Cattle' },
    horse:  { lbsPerDay: 20, label: 'Horse' },
    goat:   { lbsPerDay: 5,  label: 'Goat' },
    sheep:  { lbsPerDay: 5,  label: 'Sheep' }
  };

  var baleTypes = {
    small: { weight: 50, sqFt: 6, label: 'small square' },
    large: { weight: 1000, sqFt: 24, label: 'large square' },
    round: { weight: 1200, sqFt: 36, label: 'round' }
  };

  function val(id) {
    var v = parseFloat(document.getElementById(id).value);
    return isNaN(v) || v <= 0 ? 0 : v;
  }

  function sel(id) {
    return document.getElementById(id).value;
  }

  function fmt(n) {
    return Math.round(n).toLocaleString('en-US');
  }

  function calculate() {
    var herdSize = val('herdSize');
    var animalType = sel('animalType');
    var feedDays = val('feedDays');
    var wastePercent = val('wastePercent') / 100;

    if (herdSize <= 0 || feedDays <= 0) return;

    var animal = animalData[animalType];
    var dailyTotal = herdSize * animal.lbsPerDay;
    var totalLbs = dailyTotal * feedDays * (1 + wastePercent);

    var smallBales = Math.ceil(totalLbs / baleTypes.small.weight);
    var largeBales = Math.ceil(totalLbs / baleTypes.large.weight);
    var roundBales = Math.ceil(totalLbs / baleTypes.round.weight);

    var storageSqFt = roundBales * baleTypes.round.sqFt;

    document.getElementById('totalLbs').textContent = fmt(totalLbs) + ' lbs (' + (totalLbs / 2000).toFixed(1) + ' tons)';
    document.getElementById('smallBales').textContent = fmt(smallBales) + ' bales';
    document.getElementById('largeBales').textContent = fmt(largeBales) + ' bales';
    document.getElementById('roundBales').textContent = fmt(roundBales) + ' bales';
    document.getElementById('storageArea').textContent = fmt(storageSqFt) + ' sq ft';
    document.getElementById('dailyTotal').textContent = fmt(dailyTotal) + ' lbs/day';

    var tip = fmt(herdSize) + ' ' + animal.label.toLowerCase() + (herdSize > 1 ? 's' : '') +
      ' eating ' + fmt(dailyTotal) + ' lbs/day for ' + fmt(feedDays) + ' days';
    tip += ' (includes ' + Math.round(wastePercent * 100) + '% waste factor).';
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
