(function() {
  'use strict';

  var chartData = [
    ['300°F', '275°F', '20%', 'Low-and-slow meats, casseroles'],
    ['325°F', '300°F', '20%', 'Baked goods, delicate fish'],
    ['350°F', '325°F', '20%', 'Chicken breasts, pork chops'],
    ['375°F', '350°F', '20%', 'Roasted vegetables, salmon'],
    ['400°F', '375°F', '20%', 'Chicken wings, fries, steak'],
    ['425°F', '400°F', '20%', 'Pizza, crispy potatoes'],
    ['450°F', '425°F', '20%', 'High-heat roasting, broiling'],
    ['475°F', '450°F', '20%', 'Extreme crisping, flatbreads'],
    ['500°F', '475°F', '15-20%', 'Pizza stones, searing']
  ];

  // Food-specific adjustments: [tempReduction, timeMultiplier, tip]
  var foodAdjustments = {
    general:    [25, 0.80, 'Check food a few minutes early. Flip halfway for even browning.'],
    poultry:    [25, 0.78, 'Internal temp must reach 165°F. Let rest 5 minutes before cutting.'],
    meat:       [25, 0.80, 'Use a meat thermometer. Rest 5-10 minutes after cooking.'],
    fish:       [25, 0.75, 'Fish cooks fast in air fryers. Check 2-3 minutes early to avoid drying out.'],
    vegetables: [25, 0.80, 'Toss with a light spray of oil. Shake basket halfway through.'],
    baked:      [40, 0.85, 'Reduce temp more for baked goods to prevent over-browning on top.'],
    frozen:     [0,  0.90, 'No temp reduction for frozen foods. They need the full heat to thaw and crisp.']
  };

  var chartBody = document.getElementById('chartBody');
  if (chartBody && chartBody.children.length === 0) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function calculate() {
    var ovenTemp = parseFloat(document.getElementById('ovenTemp').value);
    var ovenTime = parseFloat(document.getElementById('ovenTime').value);
    var foodType = document.getElementById('foodType').value;

    if (isNaN(ovenTemp) || isNaN(ovenTime) || ovenTemp <= 0 || ovenTime <= 0) return;

    var adj = foodAdjustments[foodType] || foodAdjustments.general;
    var tempReduction = adj[0];
    var timeMultiplier = adj[1];
    var tip = adj[2];

    var afTemp = Math.round(ovenTemp - tempReduction);
    var afTime = Math.round(ovenTime * timeMultiplier);
    var timeSaved = Math.round(ovenTime - afTime);

    if (afTemp < 200) afTemp = 200;
    if (afTime < 1) afTime = 1;

    document.getElementById('afTemp').textContent = afTemp + '°F';
    document.getElementById('afTime').textContent = afTime + ' min';
    document.getElementById('tempDiff').textContent = '-' + tempReduction + '°F';
    document.getElementById('timeSaved').textContent = timeSaved + ' min saved';
    document.getElementById('tip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', calculate);

  document.getElementById('ovenTemp').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') calculate();
  });
  document.getElementById('ovenTime').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') calculate();
  });

})();
