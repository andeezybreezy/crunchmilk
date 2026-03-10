(function() {
  'use strict';

  var tankShape = document.getElementById('tankShape');
  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  var dimSections = {
    rectangle: document.getElementById('dimRect'),
    cylinder: document.getElementById('dimCyl'),
    bowfront: document.getElementById('dimBow'),
    hex: document.getElementById('dimHex')
  };

  tankShape.addEventListener('change', function() {
    for (var k in dimSections) {
      dimSections[k].style.display = k === tankShape.value ? '' : 'none';
    }
  });

  function val(id) {
    var v = parseFloat(document.getElementById(id).value);
    return isNaN(v) || v <= 0 ? 0 : v;
  }

  function calculate() {
    var shape = tankShape.value;
    var cubicIn = 0;
    var baseArea = 0; // sq inches for substrate calc

    if (shape === 'rectangle') {
      var l = val('rectL'), w = val('rectW'), h = val('rectH');
      cubicIn = l * w * h;
      baseArea = l * w;
    } else if (shape === 'cylinder') {
      var d = val('cylD'), ch = val('cylH');
      var r = d / 2;
      cubicIn = Math.PI * r * r * ch;
      baseArea = Math.PI * r * r;
    } else if (shape === 'bowfront') {
      var bl = val('bowL'), bw = val('bowW'), bd = val('bowD'), bh = val('bowH');
      var rectVol = bl * bw * bh;
      var bowVol = bd * bl * bh * 0.5;
      cubicIn = rectVol + bowVol;
      baseArea = bl * bw + bd * bl * 0.5;
    } else if (shape === 'hex') {
      var s = val('hexS'), hh = val('hexH');
      baseArea = (3 * Math.sqrt(3) / 2) * s * s;
      cubicIn = baseArea * hh;
    }

    if (cubicIn <= 0) return;

    var gallons = cubicIn / 231;
    var liters = gallons * 3.78541;
    var waterLbs = gallons * 8.34;
    var substrateLbs = baseArea / 10; // ~2 inch bed
    var heaterLow = Math.round(gallons * 3);
    var heaterHigh = Math.round(gallons * 5);

    document.getElementById('gallons').textContent = gallons.toFixed(1) + ' gal';
    document.getElementById('liters').textContent = liters.toFixed(1) + ' L';
    document.getElementById('waterWeight').textContent = waterLbs.toFixed(0) + ' lbs (' + (waterLbs * 0.453592).toFixed(0) + ' kg)';
    document.getElementById('substrate').textContent = substrateLbs.toFixed(0) + ' lbs of gravel';
    document.getElementById('heater').textContent = heaterLow + '–' + heaterHigh + ' watts';

    var tip = shape.charAt(0).toUpperCase() + shape.slice(1) + ' tank — ' + cubicIn.toFixed(0) + ' cubic inches';
    if (gallons > 75) tip += ' (consider dual heaters)';
    document.getElementById('resultTip').textContent = tip;

    result.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  document.querySelectorAll('input[type=\"number\"]').forEach(function(el) {
    el.addEventListener('input', calculate);
  });
  tankShape.addEventListener('change', calculate);

  calculate();
})();
