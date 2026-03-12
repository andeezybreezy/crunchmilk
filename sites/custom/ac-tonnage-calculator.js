(function() {
  'use strict';

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 2;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  var sqftEl = document.getElementById('sqft');
  var climateEl = document.getElementById('climate');
  var insulationEl = document.getElementById('insulation');
  var sunEl = document.getElementById('sunExposure');
  var ceilingEl = document.getElementById('ceilingHeight');
  var occupantsEl = document.getElementById('occupants');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var climateFactors = { '1': 1.20, '2': 1.15, '3': 1.0, '4': 0.90, '5': 0.80 };
  var insulationFactors = { poor: 1.30, average: 1.0, good: 0.85, excellent: 0.80 };
  var sunFactors = { heavy: 1.10, moderate: 1.0, light: 0.90 };

  var chartData = [
    ['800-1,000', '18,000-22,000', '1.5', '18K mini-split or 1.5-ton central'],
    ['1,000-1,300', '22,000-26,000', '2.0', '24K unit / 2-ton central'],
    ['1,300-1,700', '26,000-34,000', '2.5', '30K unit / 2.5-ton central'],
    ['1,700-2,100', '34,000-42,000', '3.0', '36K unit / 3-ton central'],
    ['2,100-2,700', '42,000-52,000', '3.5-4.0', '48K unit / 4-ton central'],
    ['2,700-3,300', '52,000-60,000', '4.0-5.0', '60K unit / 5-ton central']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function getVal(el) { var v = parseFloat(el.value); return isNaN(v) ? 0 : v; }

  function calculate() {
    var sqft = getVal(sqftEl);
    var climate = climateEl.value;
    var insulation = insulationEl.value;
    var sun = sunEl.value;
    var ceiling = getVal(ceilingEl);
    var occupants = Math.round(getVal(occupantsEl));

    if (sqft <= 0) return;

    // Base: 20 BTU per sq ft
    var baseBTU = sqft * 20;

    // Apply factors
    var climateFactor = climateFactors[climate] || 1.0;
    var insulationFactor = insulationFactors[insulation] || 1.0;
    var sunFactor = sunFactors[sun] || 1.0;

    // Ceiling height factor: add 10% per foot above 8'
    var ceilingFactor = 1 + ((ceiling - 8) * 0.10);

    var adjustedBTU = baseBTU * climateFactor * insulationFactor * sunFactor * ceilingFactor;

    // Occupant adjustment: each person above 2 adds 600 BTU
    if (occupants > 2) {
      adjustedBTU += (occupants - 2) * 600;
    }

    // Calculate tons (1 ton = 12,000 BTU)
    var exactTons = adjustedBTU / 12000;

    // Round to nearest standard size (1.5, 2, 2.5, 3, 3.5, 4, 2)
    var standardSizes = [1.5, 2, 2.5, 3, 3.5, 4, 5];
    var recommended = standardSizes[standardSizes.length - 1];
    for (var i = 0; i < standardSizes.length; i++) {
      if (exactTons <= standardSizes[i]) {
        recommended = standardSizes[i];
        break;
      }
    }

    var btuPerSqFt = adjustedBTU / sqft;

    // Range: one size down to one size up
    var idx = standardSizes.indexOf(recommended);
    var minTons = idx > 0 ? standardSizes[idx - 1] : standardSizes[0];
    var maxTons = idx < standardSizes.length - 1 ? standardSizes[idx + 1] : standardSizes[standardSizes.length - 1];

    document.getElementById('rTons').textContent = recommended + ' ton' + (recommended !== 1 ? 's' : '');
    document.getElementById('rBTU').textContent = fmt(recommended * 12000, 0) + ' BTU/hr';
    document.getElementById('rRange').textContent = minTons + ' – ' + maxTons + ' tons';
    document.getElementById('rPerSqFt').textContent = fmt(btuPerSqFt, 0) + ' BTU/sf';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  [sqftEl, climateEl, insulationEl, sunEl, ceilingEl, occupantsEl].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('change', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

})();
