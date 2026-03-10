(function() {
  'use strict';

  var chartData = [
    ['Long Grain White', '1 : 1.5', '15-18 min', '~3 cups', 'Most versatile, fluffy'],
    ['Short Grain White', '1 : 1.25', '15-18 min', '~3 cups', 'Stickier, good for bowls'],
    ['Basmati', '1 : 1.5', '15-18 min', '~3 cups', 'Rinse well, soak 20 min'],
    ['Jasmine', '1 : 1.25', '12-15 min', '~3 cups', 'Fragrant, slightly sticky'],
    ['Sushi Rice', '1 : 1.1', '15-18 min', '~2.75 cups', 'Rinse until clear, season after'],
    ['Brown Rice', '1 : 2.25', '40-50 min', '~3.5 cups', 'More water and time needed'],
    ['Wild Rice', '1 : 3', '45-55 min', '~3.5 cups', 'Technically a grass seed'],
    ['Arborio (Risotto)', '1 : 3-4', '18-25 min', '~3 cups', 'Add liquid gradually, stir'],
    ['Sticky Rice', '1 : 1.1', '20-25 min', '~2.5 cups', 'Soak 4+ hours first'],
    ['Parboiled', '1 : 2', '20-25 min', '~3 cups', 'More forgiving, harder to mess up']
  ];

  var chartBody = document.getElementById('chartBody');
  if (chartBody && chartBody.children.length === 0) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td><td>' + row[4] + '</td>';
      chartBody.appendChild(tr);
    });
  }

  // Rice data: [waterRatio, cookTime, yieldMultiplier, methodAdjustments]
  // waterRatio = cups water per cup rice (stovetop)
  var riceData = {
    longWhite:  { ratio: 1.5,  time: '15-18 min', yield: 3.0 },
    shortWhite: { ratio: 1.25, time: '15-18 min', yield: 3.0 },
    basmati:    { ratio: 1.5,  time: '15-18 min', yield: 3.0 },
    jasmine:    { ratio: 1.25, time: '12-15 min', yield: 3.0 },
    sushi:      { ratio: 1.1,  time: '15-18 min', yield: 2.75 },
    brown:      { ratio: 2.25, time: '40-50 min', yield: 3.5 },
    wildRice:   { ratio: 3.0,  time: '45-55 min', yield: 3.5 },
    arborio:    { ratio: 3.5,  time: '18-25 min', yield: 3.0 },
    sticky:     { ratio: 1.1,  time: '20-25 min', yield: 2.5 },
    parboiled:  { ratio: 2.0,  time: '20-25 min', yield: 3.0 }
  };

  // Method adjustments for water ratio
  var methodAdjust = {
    stovetop:   1.0,
    ricecooker: 0.95,   // rice cookers lose less steam
    instantpot: 0.9,    // pressure cooking needs less water
    oven:       1.05    // oven evaporates slightly more
  };

  // Method cook time overrides
  var methodTimes = {
    stovetop:   null,  // use default
    ricecooker: null,  // automatic
    instantpot: { longWhite: '3-4 min + natural release', shortWhite: '3-4 min + NR', basmati: '4-5 min + NR', jasmine: '3-4 min + NR', sushi: '3-4 min + NR', brown: '15-20 min + NR', wildRice: '25-30 min + NR', arborio: '6-8 min + NR', sticky: '5-6 min + NR', parboiled: '5-6 min + NR' },
    oven:       { longWhite: '25-30 min at 350°F', shortWhite: '25-30 min at 350°F', basmati: '25-30 min at 350°F', jasmine: '20-25 min at 350°F', sushi: '25-30 min at 350°F', brown: '55-65 min at 375°F', wildRice: '60-70 min at 375°F', arborio: '30-40 min at 350°F', sticky: '30-35 min at 350°F', parboiled: '30-35 min at 350°F' }
  };

  function calculate() {
    var riceCups = parseFloat(document.getElementById('riceCups').value) || 0;
    var riceType = document.getElementById('riceType').value;
    var method = document.getElementById('method').value;
    var servingsInput = parseFloat(document.getElementById('servings').value) || 0;

    // If servings entered, calculate cups needed (1 serving ≈ ½ cup dry rice)
    if (servingsInput > 0) {
      riceCups = Math.ceil(servingsInput * 0.5 * 4) / 4; // round to nearest quarter cup
    }

    if (riceCups <= 0) return;

    var rd = riceData[riceType] || riceData.longWhite;
    var waterAdj = methodAdjust[method] || 1.0;

    var waterRatio = rd.ratio * waterAdj;
    var waterCups = riceCups * waterRatio;
    var cookedCups = riceCups * rd.yield;
    var servingsCount = Math.round(cookedCups * 2); // ~½ cup cooked per serving

    // Format ratio nicely
    var ratioDisplay = '1 : ' + waterRatio.toFixed(2);

    // Cook time
    var cookTime = rd.time;
    if (method === 'instantpot' && methodTimes.instantpot[riceType]) {
      cookTime = methodTimes.instantpot[riceType];
    } else if (method === 'oven' && methodTimes.oven[riceType]) {
      cookTime = methodTimes.oven[riceType];
    } else if (method === 'ricecooker') {
      cookTime = 'Automatic';
    }

    // Round water to nearest quarter for nice display
    var waterDisplay = waterCups.toFixed(2);
    var quarterRounded = Math.round(waterCups * 4) / 4;
    if (Math.abs(quarterRounded - waterCups) < 0.1) {
      // Show as fraction if close to a quarter
      var whole = Math.floor(quarterRounded);
      var frac = quarterRounded - whole;
      if (frac === 0) waterDisplay = whole + '';
      else if (Math.abs(frac - 0.25) < 0.01) waterDisplay = (whole > 0 ? whole + ' ' : '') + '1/4';
      else if (Math.abs(frac - 0.5) < 0.01) waterDisplay = (whole > 0 ? whole + ' ' : '') + '1/2';
      else if (Math.abs(frac - 0.75) < 0.01) waterDisplay = (whole > 0 ? whole + ' ' : '') + '3/4';
      else waterDisplay = quarterRounded.toFixed(2);
    }

    document.getElementById('waterAmount').textContent = waterDisplay + ' cups';
    document.getElementById('riceAmount').textContent = riceCups + ' cup' + (riceCups !== 1 ? 's' : '') + ' dry';
    document.getElementById('ratio').textContent = ratioDisplay;
    document.getElementById('yield').textContent = cookedCups.toFixed(1) + ' cups cooked';
    document.getElementById('cookTime').textContent = cookTime;
    document.getElementById('servingsResult').textContent = servingsCount + ' servings';

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', calculate);

  document.getElementById('riceCups').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') calculate();
  });
  document.getElementById('servings').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') calculate();
  });

})();
