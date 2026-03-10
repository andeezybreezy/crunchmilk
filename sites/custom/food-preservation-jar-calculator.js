(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  // lbs per jar by size: halfpint, pint, quart
  // processTime: minutes for quart (pint is ~10 less, halfpint ~15 less)
  var produceData = {
    tomatoes:   { halfpint: 0.75, pint: 1.5,  quart: 3.0,  processQuart: 45, method: 'Water bath' },
    pickles:    { halfpint: 0.75, pint: 1.5,  quart: 2.5,  processQuart: 15, method: 'Water bath' },
    jam:        { halfpint: 0.35, pint: 0.5,  quart: 1.0,  processQuart: 15, method: 'Water bath' },
    salsa:      { halfpint: 0.75, pint: 1.5,  quart: 3.0,  processQuart: 20, method: 'Water bath' },
    peaches:    { halfpint: 0.5,  pint: 1.0,  quart: 2.5,  processQuart: 30, method: 'Water bath' },
    applesauce: { halfpint: 0.5,  pint: 1.0,  quart: 2.0,  processQuart: 20, method: 'Water bath' },
    greenbeans: { halfpint: 0.5,  pint: 1.0,  quart: 2.0,  processQuart: 25, method: 'Pressure canner' },
    corn:       { halfpint: 1.0,  pint: 2.0,  quart: 4.0,  processQuart: 85, method: 'Pressure canner' }
  };

  var cannerCapacity = {
    halfpint: 12,
    pint: 9,
    quart: 7
  };

  function val(id) {
    var v = parseFloat(document.getElementById(id).value);
    return isNaN(v) || v <= 0 ? 0 : v;
  }

  function sel(id) {
    return document.getElementById(id).value;
  }

  function calculate() {
    var produceType = sel('produceType');
    var quantity = val('quantity');
    var jarSize = sel('jarSize');

    if (quantity <= 0) return;

    var produce = produceData[produceType];
    var lbsPerJar = produce[jarSize];
    var jars = Math.ceil(quantity / lbsPerJar);
    var lids = jars;

    var processTime = produce.processQuart;
    if (jarSize === 'pint') processTime = Math.max(10, processTime - 10);
    else if (jarSize === 'halfpint') processTime = Math.max(5, processTime - 15);

    var jarsPerLoad = cannerCapacity[jarSize];
    var loads = Math.ceil(jars / jarsPerLoad);

    var sizeLabel = jarSize === 'halfpint' ? 'half-pint' : jarSize;

    document.getElementById('jarsNeeded').textContent = jars + ' ' + sizeLabel + ' jars';
    document.getElementById('lidsNeeded').textContent = lids + ' new lids + ' + lids + ' bands';
    document.getElementById('processTime').textContent = processTime + ' min (' + produce.method + ')';
    document.getElementById('cannerLoads').textContent = loads + ' load' + (loads > 1 ? 's' : '') + ' (' + jarsPerLoad + ' jars/load)';

    var tip = quantity + ' lbs of ' + produceType + ' at ' + lbsPerJar + ' lbs per ' + sizeLabel + ' jar. ';
    if (loads > 1) {
      var totalTime = loads * (processTime + 30); // 30 min prep/cool per load
      tip += 'Total canning time: ~' + Math.round(totalTime / 60) + ' hours for ' + loads + ' loads.';
    } else {
      tip += 'Single canner load — about ' + (processTime + 30) + ' min total with prep and cooling.';
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
