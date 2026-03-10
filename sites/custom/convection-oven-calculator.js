(function() {
  'use strict';

  var presets = [
    ['Roast Chicken', 375, 75, 'Internal temp should reach 165°F. Let rest 10 minutes.'],
    ['Cookies', 350, 12, 'Rotate pan halfway for even browning.'],
    ['Roasted Vegetables', 425, 30, 'Toss with oil. Stir halfway through.'],
    ['Pizza', 450, 15, 'Convection gives a crispier crust.'],
    ['Turkey Breast', 350, 90, 'Internal temp should reach 165°F.'],
    ['Biscuits', 375, 18, 'Watch for golden tops.'],
    ['Pork Tenderloin', 425, 25, 'Internal temp should reach 145°F. Rest 5 min.'],
    ['Casserole', 350, 50, 'Cover for the first half of cooking.'],
    ['Lasagna', 350, 60, 'Uncover for the last 10-15 minutes.'],
    ['Salmon Fillet', 400, 18, 'Skin-side down. No flipping needed.'],
    ['Meatloaf', 350, 60, 'Internal temp should reach 160°F.'],
    ['Brownies', 325, 30, 'Check center with a toothpick.']
  ];

  var unit = 'F';

  var toggleBtns = document.querySelectorAll('.unit-toggle button');
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

  var presetGrid = document.getElementById('presetGrid');
  presets.forEach(function(p) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'preset-btn';
    btn.innerHTML = p[0] + '<span>' + p[1] + '\u00B0F / ' + p[2] + ' min</span>';
    btn.addEventListener('click', function() {
      document.getElementById('ovenTemp').value = p[1];
      document.getElementById('ovenTime').value = p[2];
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

  function convert(customTip) {
    var tempInput = parseFloat(document.getElementById('ovenTemp').value);
    var timeInput = parseFloat(document.getElementById('ovenTime').value);

    if (isNaN(tempInput) || isNaN(timeInput) || tempInput <= 0 || timeInput <= 0) return;

    var ovenTempF = unit === 'C' ? tempInput * 9 / 5 + 32 : tempInput;

    var convTempF = Math.round(ovenTempF - 25);
    var convTimeMin = Math.round(timeInput * 0.75);

    if (convTempF < 200) convTempF = 200;
    if (convTimeMin < 1) convTimeMin = 1;

    var tempDisplay, tempBoth;
    if (unit === 'C') {
      var convTempC = Math.round((convTempF - 32) * 5 / 9);
      tempDisplay = convTempC + '\u00B0C';
      tempBoth = tempDisplay + ' (' + convTempF + '\u00B0F)';
    } else {
      var convTempC2 = Math.round((convTempF - 32) * 5 / 9);
      tempDisplay = convTempF + '\u00B0F';
      tempBoth = tempDisplay + ' (' + convTempC2 + '\u00B0C)';
    }

    document.getElementById('convTemp').textContent = tempBoth;
    document.getElementById('convTime').textContent = convTimeMin + ' min';

    var tip = customTip || 'Check food a few minutes early. Every convection oven runs a little different.';
    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', function() { convert(); });
  document.getElementById('ovenTemp').addEventListener('keydown', function(e) { if (e.key === 'Enter') convert(); });
  document.getElementById('ovenTime').addEventListener('keydown', function(e) { if (e.key === 'Enter') convert(); });

})();
