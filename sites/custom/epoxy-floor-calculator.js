(function() {
  'use strict';

  var epInputMode = document.getElementById('epInputMode');
  var epSqftInput = document.getElementById('epSqftInput');
  var epDimsInput = document.getElementById('epDimsInput');
  var epArea = document.getElementById('epArea');
  var epLen = document.getElementById('epLen');
  var epWid = document.getElementById('epWid');
  var epCoatType = document.getElementById('epCoatType');
  var epCoats = document.getElementById('epCoats');
  var epCostGal = document.getElementById('epCostGal');

  var outGallons = document.getElementById('outGallons');
  var outKits = document.getElementById('outKits');
  var outPrimer = document.getElementById('outPrimer');
  var outCovRate = document.getElementById('outCovRate');
  var outFloorArea = document.getElementById('outFloorArea');
  var outCost = document.getElementById('outCost');
  var costItem = document.getElementById('costItem');
  var resultTip = document.getElementById('resultTip');

  // Average coverage per gallon by type
  var coverageRates = {
    thin:      { avg: 300, label: '200–400 sqft/gal' },
    selflevel: { avg: 14,  label: '12–16 sqft/gal' },
    flake:     { avg: 250, label: '200–300 sqft/gal' }
  };

  var primerCoverage = 300; // sq ft per gallon
  var kitCoverage = 250;    // sq ft per kit

  epInputMode.addEventListener('change', function() {
    if (epInputMode.value === 'sqft') {
      epSqftInput.style.display = '';
      epDimsInput.style.display = 'none';
    } else {
      epSqftInput.style.display = 'none';
      epDimsInput.style.display = '';
    }
    calculate();
  });

  function calculate() {
    var area;
    if (epInputMode.value === 'sqft') {
      area = parseFloat(epArea.value);
    } else {
      var l = parseFloat(epLen.value);
      var w = parseFloat(epWid.value);
      if (isNaN(l) || isNaN(w) || l <= 0 || w <= 0) { clearResults(); return; }
      area = l * w;
    }

    if (isNaN(area) || area <= 0) { clearResults(); return; }

    var type = epCoatType.value;
    var coats = parseInt(epCoats.value);
    var costGal = parseFloat(epCostGal.value);
    var rate = coverageRates[type];

    var gallonsPerCoat = area / rate.avg;
    var totalGallons = Math.ceil(gallonsPerCoat * coats);
    var primerGal = Math.ceil(area / primerCoverage);
    var kits = Math.ceil(area / kitCoverage);

    outGallons.textContent = totalGallons;
    outKits.textContent = kits;
    outPrimer.textContent = primerGal;
    outCovRate.textContent = rate.label;
    outFloorArea.textContent = area.toLocaleString() + ' sq ft';

    if (!isNaN(costGal) && costGal > 0) {
      var totalCost = (totalGallons + primerGal) * costGal;
      outCost.textContent = '$' + totalCost.toFixed(2);
      costItem.style.display = '';
    } else {
      costItem.style.display = 'none';
    }

    resultTip.textContent = area.toLocaleString() + ' sq ft × ' + coats + ' coat' + (coats > 1 ? 's' : '') + ' at ' + rate.avg + ' sqft/gal = ' + totalGallons + ' gal epoxy + ' + primerGal + ' gal primer.';
  }

  function clearResults() {
    outGallons.textContent = '—';
    outKits.textContent = '—';
    outPrimer.textContent = '—';
    outCovRate.textContent = '—';
    outFloorArea.textContent = '—';
    costItem.style.display = 'none';
    resultTip.textContent = 'Enter floor area and coating type to calculate materials.';
  }

  epArea.addEventListener('input', calculate);
  epLen.addEventListener('input', calculate);
  epWid.addEventListener('input', calculate);
  epCoatType.addEventListener('change', calculate);
  epCoats.addEventListener('change', calculate);
  epCostGal.addEventListener('input', calculate);

  calculate();
})();
