(function() {
  'use strict';

  // Presets: [name, method, conventionalMinutes, tip]
  var presets = [
    ['Chicken Breast', 'oven', 30, 'Quick release. Internal temp 165°F.'],
    ['Pot Roast', 'oven', 180, 'Natural release 15 min. Cut in half if over 3 lbs.'],
    ['Beef Stew', 'stovetop', 90, 'Natural release 10 min. Cut meat into 1-inch cubes.'],
    ['Pulled Pork', 'oven', 240, 'Natural release 15 min. Shred with two forks.'],
    ['Dried Beans', 'stovetop', 120, 'Natural release. No pre-soaking needed.'],
    ['White Rice', 'stovetop', 20, 'Natural release 10 min. 1:1 water ratio.'],
    ['Ribs', 'oven', 180, 'Natural release 10 min. Broil after for caramelized crust.'],
    ['Whole Chicken', 'oven', 90, 'Natural release 15 min. About 6 min per pound.'],
    ['Chili', 'stovetop', 60, 'Natural release 10 min. Brown meat first for flavor.'],
    ['Hard Boiled Eggs', 'stovetop', 12, 'Quick release + ice bath. Easy peeling.'],
    ['Bone Broth', 'stovetop', 480, 'Natural release. Deep, rich flavor in 2 hours.'],
    ['Potatoes (cubed)', 'stovetop', 20, 'Quick release. Cut into 1-inch cubes.']
  ];

  var methodMultipliers = {
    oven: 1/3,
    stovetop: 1/3,
    slowlow: 0.055,    // 8hrs (480min) → ~26min
    slowhigh: 0.083    // 4hrs (240min) → ~20min
  };

  var presetGrid = document.getElementById('presetGrid');
  presets.forEach(function(p) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'preset-btn';
    btn.innerHTML = p[0] + '<span>' + p[2] + ' min conventional</span>';
    btn.addEventListener('click', function() {
      document.getElementById('cookMethod').value = p[1];
      document.getElementById('convTime').value = p[2];
      convert(p[3]);
    });
    presetGrid.appendChild(btn);
  });

  function convert(customTip) {
    var method = document.getElementById('cookMethod').value;
    var convTime = parseFloat(document.getElementById('convTime').value);

    if (isNaN(convTime) || convTime <= 0) return;

    var multiplier = methodMultipliers[method] || 1/3;
    var pressureMin = Math.round(convTime * multiplier);

    if (pressureMin < 1) pressureMin = 1;

    var setting = 'High Pressure';
    var releaseType = pressureMin >= 15 ? 'Natural Release (10-15 min)' : 'Quick Release';

    document.getElementById('pressureTime').textContent = pressureMin + ' min';
    document.getElementById('pressureSetting').textContent = setting;

    var tip = customTip || 'Add at least 1 cup of liquid. Allow 5-15 min for cooker to reach pressure.';
    document.getElementById('resultTip').textContent = releaseType + '. ' + tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', function() { convert(); });
  document.getElementById('convTime').addEventListener('keydown', function(e) { if (e.key === 'Enter') convert(); });

})();
