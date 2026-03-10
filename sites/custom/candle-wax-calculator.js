(function() {
  'use strict';

  var densities = {
    soy:      { ozPerFloz: 0.86, gPerMl: 0.90, name: 'Soy Wax' },
    paraffin: { ozPerFloz: 0.90, gPerMl: 0.93, name: 'Paraffin Wax' },
    beeswax:  { ozPerFloz: 0.96, gPerMl: 0.96, name: 'Beeswax' },
    coconut:  { ozPerFloz: 0.82, gPerMl: 0.85, name: 'Coconut Blend' }
  };

  var presets = [
    ['Tin (4 oz)', 4], ['Jelly Jar (8 oz)', 8], ['Mason Jar (12 oz)', 12],
    ['Tumbler (10 oz)', 10], ['Large Jar (16 oz)', 16], ['3-Wick (26 oz)', 26]
  ];

  var containerVolume = document.getElementById('containerVolume');
  var volumeUnit = document.getElementById('volumeUnit');
  var numCandles = document.getElementById('numCandles');
  var waxType = document.getElementById('waxType');
  var fragranceLoad = document.getElementById('fragranceLoad');
  var fillPercent = document.getElementById('fillPercent');
  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  function renderPresets() {
    var grid = document.getElementById('presetGrid');
    presets.forEach(function(p) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'preset-btn';
      btn.innerHTML = p[0] + '<span>' + p[1] + ' fl oz</span>';
      btn.addEventListener('click', function() {
        containerVolume.value = p[1];
        volumeUnit.value = 'oz';
        calculate();
      });
      grid.appendChild(btn);
    });
  }

  function calculate() {
    var vol = parseFloat(containerVolume.value);
    var count = parseInt(numCandles.value, 10) || 1;
    var type = waxType.value;
    var fragPct = parseFloat(fragranceLoad.value) || 0;
    var fillPct = parseFloat(fillPercent.value) || 85;

    if (isNaN(vol) || vol <= 0) return;

    var volOz = volumeUnit.value === 'ml' ? vol * 0.033814 : vol;
    var volMl = volumeUnit.value === 'ml' ? vol : vol * 29.5735;

    var d = densities[type];
    var fillFactor = fillPct / 100;

    var waxOzPerCandle = volOz * fillFactor * d.ozPerFloz;
    var totalWaxOz = waxOzPerCandle * count;
    var totalWaxLbs = totalWaxOz / 16;
    var totalWaxG = volMl * fillFactor * d.gPerMl * count;

    var fragOz = totalWaxOz * (fragPct / 100);
    var fragG = totalWaxG * (fragPct / 100);

    var dyeOzPerLb = 0.1;
    var dyeOz = totalWaxLbs * dyeOzPerLb;
    var dyeG = dyeOz * 28.3495;

    document.getElementById('waxPerCandle').textContent = waxOzPerCandle.toFixed(1) + ' oz';
    document.getElementById('totalWax').textContent = totalWaxOz.toFixed(1) + ' oz (' + totalWaxLbs.toFixed(2) + ' lbs / ' + totalWaxG.toFixed(0) + ' g)';
    document.getElementById('fragranceOil').textContent = fragOz.toFixed(1) + ' oz (' + fragG.toFixed(0) + ' g)';
    document.getElementById('dyeAmount').textContent = dyeOz.toFixed(2) + ' oz (' + dyeG.toFixed(1) + ' g) — ' + Math.round(dyeOz / 0.0021) + ' drops liquid dye';
    document.getElementById('resultTip').textContent = d.name + ' at ' + fillPct + '% fill, ' + fragPct + '% fragrance load';

    result.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  [containerVolume, numCandles, waxType, fragranceLoad, fillPercent, volumeUnit].forEach(function(el) {
    el.addEventListener('change', calculate);
    el.addEventListener('input', calculate);
  });

  renderPresets();
  calculate();
})();
