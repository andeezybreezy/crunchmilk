(function() {
  'use strict';

  var presets = [
    ['Pot Roast', 325, 180, 'Use a chuck roast for best results. Add vegetables last 2 hours.'],
    ['Beef Stew', 325, 120, 'Cut meat into 1-inch cubes. Add potatoes halfway through.'],
    ['Pulled Pork', 325, 180, 'Use pork shoulder. Shred with two forks when done.'],
    ['Chicken Thighs', 375, 45, 'Bone-in thighs stay more tender in the slow cooker.'],
    ['Chili', 350, 60, 'Add beans and tomatoes. Flavors improve the next day.'],
    ['Soup/Broth', 350, 60, 'Reduce liquid by 1/3. Add pasta or noodles last 30 min.'],
    ['BBQ Ribs', 300, 180, 'Place on a rack if possible. Broil at the end for caramelization.'],
    ['Mac & Cheese', 350, 30, 'Use evaporated milk. Avoid cooking too long — pasta gets mushy.'],
    ['Meatballs', 375, 30, 'Brown first for best flavor. Add sauce before slow cooking.'],
    ['Whole Chicken', 350, 90, 'Season well. Place on foil balls for air circulation.']
  ];

  var presetGrid = document.getElementById('presetGrid');
  presets.forEach(function(p) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'preset-btn';
    btn.innerHTML = p[0] + '<span>' + p[1] + '\u00B0F / ' + p[2] + ' min</span>';
    btn.addEventListener('click', function() {
      document.getElementById('ovenTemp').value = p[1];
      document.getElementById('ovenTime').value = p[2];
      convert(p[3]);
    });
    presetGrid.appendChild(btn);
  });

  function convert(customTip) {
    var tempF = parseFloat(document.getElementById('ovenTemp').value);
    var timeMin = parseFloat(document.getElementById('ovenTime').value);

    if (isNaN(tempF) || isNaN(timeMin) || tempF <= 0 || timeMin <= 0) return;

    var lowMin, lowMax, highMin, highMax;

    if (tempF <= 350) {
      lowMin = 8; lowMax = 10;
      highMin = 4; highMax = 5;
    } else if (tempF <= 400) {
      lowMin = 6; lowMax = 8;
      highMin = 3; highMax = 4;
    } else {
      lowMin = 4; lowMax = 6;
      highMin = 2; highMax = 3;
    }

    document.getElementById('lowTime').textContent = lowMin + '–' + lowMax + ' hours';
    document.getElementById('highTime').textContent = highMin + '–' + highMax + ' hours';

    var tip = customTip || 'Reduce liquid by about 1/3. Add dairy and pasta in the last 30-60 minutes.';
    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', function() { convert(); });
  document.getElementById('ovenTemp').addEventListener('keydown', function(e) { if (e.key === 'Enter') convert(); });
  document.getElementById('ovenTime').addEventListener('keydown', function(e) { if (e.key === 'Enter') convert(); });

})();
