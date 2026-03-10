(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');
  var waxType = document.getElementById('waxType');

  var maxLoad = { soy: 10, paraffin: 12, coconut: 10, beeswax: 6, custom: 15 };

  waxType.addEventListener('change', function() {
    var pctInput = document.getElementById('fragrancePct');
    var current = parseFloat(pctInput.value);
    var max = maxLoad[waxType.value];
    if (current > max) pctInput.value = max;
    pctInput.max = max;
  });

  function val(id) {
    var v = parseFloat(document.getElementById(id).value);
    return isNaN(v) || v < 0 ? 0 : v;
  }

  function calculate() {
    var waxWeight = val('waxWeight');
    var fragrancePct = val('fragrancePct');
    var numCandles = Math.max(1, Math.round(val('numCandles')));

    if (waxWeight <= 0) return;

    var foPerCandle = waxWeight * fragrancePct / 100;
    var foTotal = foPerCandle * numCandles;
    var waxTotal = waxWeight * numCandles;
    var batchWeight = waxTotal + foTotal;

    // Conversions: 1 oz = 29.5735 mL, fragrance oil density ~0.95 g/mL → 1 oz ≈ 28.1 g
    var foMl = foTotal * 29.5735;
    var foGrams = foTotal * 28.35; // weight oz to grams

    document.getElementById('foPerCandle').textContent = foPerCandle.toFixed(2) + ' oz';
    document.getElementById('foTotal').textContent = foTotal.toFixed(2) + ' oz';
    document.getElementById('waxTotal').textContent = waxTotal.toFixed(1) + ' oz';
    document.getElementById('batchWeight').textContent = batchWeight.toFixed(1) + ' oz';
    document.getElementById('foMl').textContent = foMl.toFixed(1) + ' mL';
    document.getElementById('foGrams').textContent = foGrams.toFixed(1) + ' g';

    var max = maxLoad[waxType.value];
    var tip = fragrancePct > max
      ? 'Warning: ' + fragrancePct + '% exceeds recommended max of ' + max + '% for ' + waxType.value
      : waxType.value.charAt(0).toUpperCase() + waxType.value.slice(1) + ' wax at ' + fragrancePct + '% load';
    document.getElementById('resultTip').textContent = tip;

    result.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  document.querySelectorAll('input[type="number"]').forEach(function(el) {
    el.addEventListener('input', calculate);
  });
  waxType.addEventListener('change', calculate);

  calculate();

  // Populate chart
  var tbody = document.querySelector('.chart-table tbody');
  if (tbody) {
    var weights = [4, 8, 12, 16, 24, 32];
    var pcts = [6, 8, 10, 12];
    weights.forEach(function(w) {
      var tr = document.createElement('tr');
      var td0 = document.createElement('td');
      td0.textContent = w + ' oz';
      tr.appendChild(td0);
      pcts.forEach(function(p) {
        var fo = w * p / 100;
        var td = document.createElement('td');
        td.textContent = fo.toFixed(2) + ' oz';
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }
})();
