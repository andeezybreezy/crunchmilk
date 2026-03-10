(function() {
  'use strict';

  // Adjustments per 1000 ft above 3000 ft, per cup/tsp of ingredient
  // [sugarReductionTbsp, flourAddTbsp, liquidAddTbsp, bpReductionTsp, tempIncreaseF]
  var bands = [
    { min: 0,     max: 3000,  sugar: 0,   flour: 0,   liquid: 0,   bp: 0,     temp: 0  },
    { min: 3000,  max: 5000,  sugar: 1,   flour: 1,   liquid: 2,   bp: 0.125, temp: 15 },
    { min: 5000,  max: 7000,  sugar: 2,   flour: 2,   liquid: 3,   bp: 0.188, temp: 20 },
    { min: 7000,  max: 10000, sugar: 2.5, flour: 2.5, liquid: 3.5, bp: 0.25,  temp: 25 },
    { min: 10000, max: 99999, sugar: 3,   flour: 3.5, liquid: 4,   bp: 0.25,  temp: 25 }
  ];

  function getBand(alt) {
    for (var i = 0; i < bands.length; i++) {
      if (alt >= bands[i].min && alt < bands[i].max) return bands[i];
    }
    return bands[bands.length - 1];
  }

  var presets = [
    ['Denver, CO', 5280],
    ['Salt Lake City', 4226],
    ['Santa Fe, NM', 7199],
    ['Leadville, CO', 10152],
    ['Albuquerque', 5312],
    ['Flagstaff, AZ', 6910]
  ];

  var presetGrid = document.getElementById('presetGrid');
  presets.forEach(function(p) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'preset-btn';
    btn.innerHTML = p[0] + '<span>' + p[1].toLocaleString() + ' ft</span>';
    btn.addEventListener('click', function() {
      document.getElementById('altitude').value = p[1];
      calculate();
    });
    presetGrid.appendChild(btn);
  });

  function fmtTbsp(val) {
    if (val === 0) return 'No change';
    return val.toFixed(1).replace(/\.0$/, '') + ' tbsp';
  }

  function calculate() {
    var alt = parseFloat(document.getElementById('altitude').value);
    if (isNaN(alt) || alt < 0) return;

    var sugar = parseFloat(document.getElementById('sugar').value) || 0;
    var flour = parseFloat(document.getElementById('flour').value) || 0;
    var liquid = parseFloat(document.getElementById('liquid').value) || 0;
    var bp = parseFloat(document.getElementById('bakingPowder').value) || 0;
    var temp = parseFloat(document.getElementById('ovenTemp').value) || 0;

    var band = getBand(alt);

    var sugarRedCups = (band.sugar / 16) * sugar; // tbsp to cups
    var flourAddCups = (band.flour / 16) * flour;
    var liquidAddCups = (band.liquid / 16) * liquid;
    var bpRedTsp = band.bp * bp;
    var tempInc = band.temp;

    var adjSugar = Math.max(0, sugar - sugarRedCups);
    var adjFlour = flour + flourAddCups;
    var adjLiquid = liquid + liquidAddCups;
    var adjBp = Math.max(0, bp - bpRedTsp);
    var adjTemp = temp + tempInc;

    var rows = [];
    if (sugar > 0) rows.push(['Sugar', sugar.toFixed(2) + ' cups', adjSugar.toFixed(2) + ' cups', '−' + fmtTbsp(band.sugar * sugar) + ' total']);
    if (flour > 0) rows.push(['Flour', flour.toFixed(2) + ' cups', adjFlour.toFixed(2) + ' cups', '+' + fmtTbsp(band.flour * flour) + ' total']);
    if (liquid > 0) rows.push(['Liquid', liquid.toFixed(2) + ' cups', adjLiquid.toFixed(2) + ' cups', '+' + fmtTbsp(band.liquid * liquid) + ' total']);
    if (bp > 0) rows.push(['Baking Powder', bp.toFixed(2) + ' tsp', adjBp.toFixed(2) + ' tsp', '−' + (bpRedTsp).toFixed(2) + ' tsp']);
    if (temp > 0) rows.push(['Oven Temp', temp + '°F', adjTemp + '°F', '+' + tempInc + '°F']);

    if (rows.length === 0 && alt >= 0) {
      rows.push(['Oven Temp', '350°F (default)', (350 + tempInc) + '°F', '+' + tempInc + '°F']);
    }

    var html = '<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:4px;font-size:0.9rem;">' +
      '<div style="font-weight:700;padding:6px;">Ingredient</div>' +
      '<div style="font-weight:700;padding:6px;">Original</div>' +
      '<div style="font-weight:700;padding:6px;">Adjusted</div>' +
      '<div style="font-weight:700;padding:6px;">Change</div>';

    rows.forEach(function(r) {
      html += '<div style="padding:6px;border-top:1px solid #e5e7eb;">' + r[0] + '</div>' +
        '<div style="padding:6px;border-top:1px solid #e5e7eb;">' + r[1] + '</div>' +
        '<div style="padding:6px;border-top:1px solid #e5e7eb;font-weight:600;">' + r[2] + '</div>' +
        '<div style="padding:6px;border-top:1px solid #e5e7eb;color:#666;">' + r[3] + '</div>';
    });
    html += '</div>';

    document.getElementById('adjustedOutput').innerHTML = html;

    var tip = alt < 3000 ? 'Your altitude is below 3,000 ft — no adjustments typically needed.' :
      alt < 5000 ? 'Moderate altitude. These are starting adjustments — fine-tune to your oven.' :
      alt < 7000 ? 'Significant altitude. Monitor baking closely and test for doneness early.' :
      'Very high altitude. Consider using extra eggs for structure and greasing pans more thoroughly.';

    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', calculate);
  document.getElementById('altitude').addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });

})();
