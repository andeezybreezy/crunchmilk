(function() {
  'use strict';

  var dimFactors = { ups: 139, fedex: 139, usps: 166 };

  var dimUnit = document.getElementById('dimUnit');
  var pkgLength = document.getElementById('pkgLength');
  var pkgWidth = document.getElementById('pkgWidth');
  var pkgHeight = document.getElementById('pkgHeight');
  var actualWeight = document.getElementById('actualWeight');
  var carrier = document.getElementById('carrier');
  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  function calculate() {
    var l = parseFloat(pkgLength.value) || 0;
    var w = parseFloat(pkgWidth.value) || 0;
    var h = parseFloat(pkgHeight.value) || 0;
    var actual = parseFloat(actualWeight.value) || 0;
    var unit = dimUnit.value;
    var car = carrier.value;

    if (l <= 0 || w <= 0 || h <= 0) return;

    // Convert cm to inches if needed
    if (unit === 'cm') {
      l /= 2.54; w /= 2.54; h /= 2.54;
    }

    var cubicIn = l * w * h;
    var factor = dimFactors[car];
    var dimWt = cubicIn / factor;
    var dimRounded = Math.ceil(dimWt);
    var actualRounded = Math.ceil(actual);
    var billable = Math.max(dimRounded, actualRounded);

    var billed = billable === dimRounded && dimRounded > actualRounded ? 'DIM weight' : 'actual weight';

    document.getElementById('dimWeight').textContent = dimRounded + ' lbs (' + dimWt.toFixed(1) + ')';
    document.getElementById('actWeight').textContent = actual.toFixed(1) + ' lbs';
    document.getElementById('billWeight').textContent = billable + ' lbs';
    document.getElementById('cubicIn').textContent = Math.round(cubicIn).toLocaleString() + ' in³';

    var tip = 'Billed by ' + billed + ' — ' + car.toUpperCase() + ' DIM factor: ' + factor;
    if (cubicIn > 1728 || car !== 'usps') {
      // always note
    }
    if (car === 'usps' && cubicIn <= 1728) {
      tip += ' (under 1 cu ft — DIM may not apply for USPS)';
    }
    document.getElementById('resultTip').textContent = tip;

    result.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  [pkgLength, pkgWidth, pkgHeight, actualWeight, carrier, dimUnit].forEach(function(el) {
    el.addEventListener('change', calculate);
    el.addEventListener('input', calculate);
  });

  calculate();
})();
