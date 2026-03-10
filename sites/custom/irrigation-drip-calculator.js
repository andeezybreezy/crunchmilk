(function() {
  'use strict';

  var chartData = [
    ['Sand (0.5 GPH)', '6"', '10"', '8-12"'],
    ['Sand (1.0 GPH)', '12"', '12"', '12-18"'],
    ['Loam (0.5 GPH)', '12"', '14"', '14-18"'],
    ['Loam (1.0 GPH)', '18"', '18"', '18-24"'],
    ['Loam (2.0 GPH)', '18"', '20"', '24-30"'],
    ['Clay (0.5 GPH)', '18"', '18"', '18-24"'],
    ['Clay (1.0 GPH)', '24"', '24"', '24-36"'],
    ['Clay (2.0 GPH)', '24"', '26"', '30-42"']
  ];

  var chartBody = document.getElementById('chartBody');
  if (chartBody && chartBody.children.length === 0) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td>';
      chartBody.appendChild(tr);
    });
  }

  // Soil spacing in inches: [emitterSpacing, rowSpacing]
  var soilSpacing = {
    sandy: [12, 12],
    loam:  [18, 18],
    clay:  [24, 24]
  };

  function calculate() {
    var zoneL = parseFloat(document.getElementById('zoneLength').value);
    var zoneW = parseFloat(document.getElementById('zoneWidth').value);
    var soil = document.getElementById('soilType').value;
    var gph = parseFloat(document.getElementById('emitterGPH').value);
    var weeklyNeed = parseFloat(document.getElementById('weeklyNeed').value);

    if (isNaN(zoneL) || isNaN(zoneW) || isNaN(weeklyNeed) || zoneL <= 0 || zoneW <= 0) return;

    var spacing = soilSpacing[soil] || soilSpacing.loam;
    var emitterSpacingIn = spacing[0];
    var rowSpacingIn = spacing[1];

    var emitterSpacingFt = emitterSpacingIn / 12;
    var rowSpacingFt = rowSpacingIn / 12;

    var numRows = Math.max(1, Math.ceil(zoneW / rowSpacingFt));
    var emittersPerRow = Math.max(1, Math.ceil(zoneL / emitterSpacingFt));
    var totalEmitters = numRows * emittersPerRow;
    var totalGPH = totalEmitters * gph;

    var areaSqFt = zoneL * zoneW;
    // Weekly gallons needed: areaSqFt * weeklyInches * 0.623
    var weeklyGallons = areaSqFt * weeklyNeed * 0.623;
    // Assume 3 watering days per week
    var wateringDays = 3;
    var gallonsPerSession = weeklyGallons / wateringDays;
    var runTimeHours = gallonsPerSession / totalGPH;
    var runTimeMin = Math.round(runTimeHours * 60);

    document.getElementById('emitterSpacing').textContent = emitterSpacingIn + '" apart';
    document.getElementById('rowSpacing').textContent = rowSpacingIn + '" between rows';
    document.getElementById('totalEmitters').textContent = totalEmitters + ' emitters';
    document.getElementById('totalFlow').textContent = totalGPH.toFixed(1) + ' GPH';
    document.getElementById('runTime').textContent = runTimeMin + ' min (' + wateringDays + '×/week)';
    document.getElementById('weeklyUsage').textContent = Math.round(weeklyGallons) + ' gallons';

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', calculate);

  ['zoneLength', 'zoneWidth', 'weeklyNeed'].forEach(function(id) {
    document.getElementById(id).addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });

})();
