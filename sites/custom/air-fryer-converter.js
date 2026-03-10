(function() {
  'use strict';

  // Food presets: [name, ovenTempF, ovenTimeMin, tip]
  const presets = [
    ['Chicken Wings', 400, 30, 'Flip halfway. Internal temp should reach 165\u00B0F.'],
    ['French Fries', 425, 25, 'Shake basket halfway for even crispiness.'],
    ['Chicken Breast', 375, 25, 'Don\'t overcrowd. Internal temp should reach 165\u00B0F.'],
    ['Salmon Fillet', 400, 15, 'Skin-side down. No flipping needed.'],
    ['Bacon', 400, 12, 'No preheating needed. Lay flat, don\'t overlap.'],
    ['Chicken Thighs', 400, 35, 'Flip halfway. Skin-side up for last half for crispy skin.'],
    ['Steak (1 inch)', 400, 14, 'Flip once. Rest 5 min after cooking. Adjust time for doneness.'],
    ['Pork Chops', 400, 20, 'Flip halfway. Internal temp should reach 145\u00B0F.'],
    ['Brussels Sprouts', 375, 20, 'Toss with oil and seasoning. Shake basket halfway.'],
    ['Baked Potato', 400, 45, 'Pierce with fork. Rub with oil and salt.'],
    ['Chicken Tenders', 400, 12, 'Flip halfway for even browning.'],
    ['Shrimp', 400, 8, 'Don\'t overcook. Flip once at halfway.'],
    ['Mozzarella Sticks', 375, 8, 'Freeze first for best results. Don\'t overcrowd.'],
    ['Fish Sticks', 400, 10, 'No oil needed. Flip once halfway.'],
    ['Vegetables (mixed)', 375, 15, 'Cut uniform size. Toss with 1 tsp oil.'],
    ['Onion Rings', 400, 10, 'Single layer. Spray lightly with oil.'],
  ];

  // Chart data: [food, tempF, timeRange, note]
  const chartData = [
    ['Chicken Wings', '375\u00B0F / 190\u00B0C', '22-25 min', 'Flip halfway'],
    ['French Fries (fresh)', '380\u00B0F / 195\u00B0C', '18-22 min', 'Shake basket halfway'],
    ['French Fries (frozen)', '400\u00B0F / 200\u00B0C', '15-20 min', 'No oil needed'],
    ['Chicken Breast', '360\u00B0F / 182\u00B0C', '18-22 min', 'Internal temp 165\u00B0F'],
    ['Salmon', '375\u00B0F / 190\u00B0C', '10-12 min', 'Skin-side down'],
    ['Bacon', '375\u00B0F / 190\u00B0C', '8-10 min', 'No preheating needed'],
    ['Chicken Thighs', '375\u00B0F / 190\u00B0C', '25-30 min', 'Flip halfway'],
    ['Steak (1")', '375\u00B0F / 190\u00B0C', '10-14 min', 'Rest 5 min after'],
    ['Pork Chops', '375\u00B0F / 190\u00B0C', '14-18 min', 'Internal temp 145\u00B0F'],
    ['Shrimp', '375\u00B0F / 190\u00B0C', '6-8 min', 'Don\'t overcrowd'],
    ['Brussels Sprouts', '360\u00B0F / 182\u00B0C', '15-18 min', 'Shake halfway'],
    ['Baked Potato', '375\u00B0F / 190\u00B0C', '35-40 min', 'Pierce with fork'],
    ['Mozzarella Sticks', '360\u00B0F / 182\u00B0C', '6-8 min', 'Freeze first'],
    ['Chicken Tenders', '375\u00B0F / 190\u00B0C', '10-12 min', 'Flip halfway'],
    ['Fish Sticks (frozen)', '375\u00B0F / 190\u00B0C', '8-10 min', 'Flip once'],
    ['Onion Rings', '375\u00B0F / 190\u00B0C', '8-10 min', 'Single layer'],
    ['Vegetables (roasted)', '360\u00B0F / 182\u00B0C', '12-15 min', 'Cut uniform size'],
    ['Tofu', '375\u00B0F / 190\u00B0C', '12-15 min', 'Press dry first'],
  ];

  let unit = 'F';

  // Unit toggle
  const toggleBtns = document.querySelectorAll('.unit-toggle button');
  toggleBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      toggleBtns.forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      unit = btn.dataset.unit;
    });
  });

  // Render presets
  var presetGrid = document.getElementById('presetGrid');
  presets.forEach(function(p) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'preset-btn';
    btn.innerHTML = p[0] + '<span>' + p[1] + '\u00B0F / ' + p[2] + ' min</span>';
    btn.addEventListener('click', function() {
      document.getElementById('ovenTemp').value = p[1];
      document.getElementById('ovenTime').value = p[2];
      // Reset to Fahrenheit for presets
      unit = 'F';
      toggleBtns.forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      toggleBtns[0].classList.add('active');
      toggleBtns[0].setAttribute('aria-pressed', 'true');
      convert(p[3]);
    });
    presetGrid.appendChild(btn);
  });

  // Render chart (only if not already rendered by build system)
  var chartBody = document.getElementById('chartBody');
  if (chartBody && chartBody.children.length === 0) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td>';
      chartBody.appendChild(tr);
    });
  }

  // Conversion logic
  function convert(customTip) {
    var tempInput = parseFloat(document.getElementById('ovenTemp').value);
    var timeInput = parseFloat(document.getElementById('ovenTime').value);

    if (isNaN(tempInput) || isNaN(timeInput) || tempInput <= 0 || timeInput <= 0) {
      return;
    }

    var ovenTempF;
    if (unit === 'C') {
      ovenTempF = tempInput * 9 / 5 + 32;
    } else {
      ovenTempF = tempInput;
    }

    // Conversion: reduce temp by 25°F, reduce time by 20%
    var afTempF = Math.round(ovenTempF - 25);
    var afTimeMin = Math.round(timeInput * 0.8);

    // Ensure reasonable minimums
    if (afTempF < 200) afTempF = 200;
    if (afTimeMin < 1) afTimeMin = 1;

    // Display in correct unit
    var tempDisplay;
    if (unit === 'C') {
      var afTempC = Math.round((afTempF - 32) * 5 / 9);
      tempDisplay = afTempC + '\u00B0C';
    } else {
      tempDisplay = afTempF + '\u00B0F';
    }

    // Show both units in parentheses
    var tempBoth;
    if (unit === 'C') {
      tempBoth = tempDisplay + ' (' + afTempF + '\u00B0F)';
    } else {
      var afTempC2 = Math.round((afTempF - 32) * 5 / 9);
      tempBoth = tempDisplay + ' (' + afTempC2 + '\u00B0C)';
    }

    document.getElementById('afTemp').textContent = tempBoth;
    document.getElementById('afTime').textContent = afTimeMin + ' min';

    var tip = customTip || 'Check food a few minutes early. Every air fryer runs a little different.';
    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', function() {
    convert();
  });

  // Allow Enter key to trigger conversion
  document.getElementById('ovenTemp').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') convert();
  });
  document.getElementById('ovenTime').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') convert();
  });

})();
