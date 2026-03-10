(function() {
  'use strict';

  var calcMode = document.getElementById('calcMode');
  var volumeInputs = document.getElementById('volumeInputs');
  var dimsInputs = document.getElementById('dimsInputs');
  var volume = document.getElementById('volume');
  var volUnit = document.getElementById('volUnit');
  var dimLen = document.getElementById('dimLen');
  var dimWid = document.getElementById('dimWid');
  var dimDepth = document.getElementById('dimDepth');
  var bagSize = document.getElementById('bagSize');
  var bagCost = document.getElementById('bagCost');

  var outBags = document.getElementById('outBags');
  var outWeight = document.getElementById('outWeight');
  var outPallets = document.getElementById('outPallets');
  var outVolCuFt = document.getElementById('outVolCuFt');
  var outVolCuYd = document.getElementById('outVolCuYd');
  var outCost = document.getElementById('outCost');
  var costItem = document.getElementById('costItem');
  var resultTip = document.getElementById('resultTip');

  var yieldPerBag = { '40': 0.30, '60': 0.45, '80': 0.60 };
  var bagsPerPallet = { '40': 80, '60': 56, '80': 42 };

  calcMode.addEventListener('change', function() {
    if (calcMode.value === 'volume') {
      volumeInputs.style.display = '';
      dimsInputs.style.display = 'none';
    } else {
      volumeInputs.style.display = 'none';
      dimsInputs.style.display = '';
    }
    calculate();
  });

  function calculate() {
    var cuFt;

    if (calcMode.value === 'volume') {
      var v = parseFloat(volume.value);
      if (isNaN(v) || v <= 0) { clearResults(); return; }
      cuFt = volUnit.value === 'cuyd' ? v * 27 : v;
    } else {
      var l = parseFloat(dimLen.value);
      var w = parseFloat(dimWid.value);
      var d = parseFloat(dimDepth.value);
      if (isNaN(l) || isNaN(w) || isNaN(d) || l <= 0 || w <= 0 || d <= 0) { clearResults(); return; }
      cuFt = l * w * (d / 12);
    }

    var size = bagSize.value;
    var yld = yieldPerBag[size];
    var bags = Math.ceil(cuFt / yld);
    var weight = bags * parseInt(size);
    var pallets = bags / bagsPerPallet[size];
    var price = parseFloat(bagCost.value);

    outBags.textContent = bags.toLocaleString();
    outWeight.textContent = weight.toLocaleString() + ' lbs';
    outPallets.textContent = pallets < 1 ? pallets.toFixed(2) : pallets.toFixed(1);
    outVolCuFt.textContent = cuFt.toFixed(1);
    outVolCuYd.textContent = (cuFt / 27).toFixed(2);

    if (!isNaN(price) && price > 0) {
      outCost.textContent = '$' + (bags * price).toFixed(2);
      costItem.style.display = '';
    } else {
      costItem.style.display = 'none';
    }

    resultTip.textContent = cuFt.toFixed(1) + ' cu ft ÷ ' + yld + ' cu ft/bag = ' + bags + ' bags of ' + size + ' lb concrete (' + weight.toLocaleString() + ' lbs).';
  }

  function clearResults() {
    outBags.textContent = '—';
    outWeight.textContent = '—';
    outPallets.textContent = '—';
    outVolCuFt.textContent = '—';
    outVolCuYd.textContent = '—';
    costItem.style.display = 'none';
    resultTip.textContent = 'Enter volume or dimensions to calculate bags needed.';
  }

  volume.addEventListener('input', calculate);
  volUnit.addEventListener('change', calculate);
  dimLen.addEventListener('input', calculate);
  dimWid.addEventListener('input', calculate);
  dimDepth.addEventListener('input', calculate);
  bagSize.addEventListener('change', calculate);
  bagCost.addEventListener('input', calculate);

  calculate();
})();
