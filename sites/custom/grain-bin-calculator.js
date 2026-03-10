(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  var grainData = {
    corn:     { packFactor: 0.80, testWeight: 56, label: 'Corn' },
    wheat:    { packFactor: 0.80, testWeight: 60, label: 'Wheat' },
    soybeans: { packFactor: 0.80, testWeight: 60, label: 'Soybeans' },
    oats:     { packFactor: 0.80, testWeight: 32, label: 'Oats' }
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
    var diameter = val('binDiameter');
    var height = val('binHeight');
    var grainType = sel('grainType');

    if (diameter <= 0 || height <= 0) return;

    var grain = grainData[grainType];
    var radius = diameter / 2;
    var cubicFeet = Math.PI * radius * radius * height;
    var bushels = cubicFeet * grain.packFactor;
    var tons = (bushels * grain.testWeight) / 2000;

    document.getElementById('bushels').textContent = fmt(bushels) + ' bu';
    document.getElementById('tons').textContent = tons.toFixed(1) + ' tons';
    document.getElementById('cubicFeet').textContent = fmt(cubicFeet) + ' cu ft';
    document.getElementById('testWeight').textContent = grain.testWeight + ' lbs/bu (' + grain.label + ')';

    var tip = fmt(diameter) + ' ft × ' + fmt(height) + ' ft bin. ';
    tip += 'With peak grain (cone), actual capacity may be 15-20% higher than ' + fmt(bushels) + ' bushels.';
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
