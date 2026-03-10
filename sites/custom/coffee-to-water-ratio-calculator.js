(function() {
  'use strict';

  // Ratios: [light, medium, strong] expressed as water per 1g coffee
  var ratios = {
    drip:        { light: 17, medium: 16, strong: 15 },
    pourover:    { light: 16, medium: 15.5, strong: 15 },
    frenchpress: { light: 15, medium: 13.5, strong: 12 },
    espresso:    { light: 2.5, medium: 2, strong: 1.8 },
    coldbrew:    { light: 8, medium: 6.5, strong: 5 },
    aeropress:   { light: 13, medium: 12, strong: 11 }
  };

  var tips = {
    drip: 'Use medium grind. Brew time is automatic. Water temp 195-205°F.',
    pourover: 'Use medium-fine grind. Pour in slow circles. Total brew: 2.5-3.5 min.',
    frenchpress: 'Use coarse grind. Steep 4 min. Press and pour immediately.',
    espresso: 'Use very fine grind. Target 25-30 second extraction.',
    coldbrew: 'Use very coarse grind. Steep 12-24 hours in fridge. Dilute to serve.',
    aeropress: 'Use fine-medium grind. Brew 1-2 min. Experiment with inverted method.'
  };

  var ML_PER_CUP = 177; // 6 oz coffee cup
  var GRAMS_PER_TBSP = 5.5; // ground coffee approx
  var volumeUnit = 'cups';

  var toggleBtns = document.querySelectorAll('.unit-toggle button');
  toggleBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      toggleBtns.forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      volumeUnit = btn.dataset.unit;
    });
  });

  var presets = [
    ['1 Cup Drip', 'drip', 1, 'cups', 'medium'],
    ['2 Cups Pour Over', 'pourover', 2, 'cups', 'medium'],
    ['4 Cups French Press', 'frenchpress', 4, 'cups', 'medium'],
    ['Double Espresso', 'espresso', 36, 'ml', 'medium'],
    ['1 Liter Cold Brew', 'coldbrew', 1000, 'ml', 'medium'],
    ['1 Cup AeroPress', 'aeropress', 1, 'cups', 'medium'],
    ['12-Cup Carafe', 'drip', 12, 'cups', 'medium'],
    ['Strong French Press', 'frenchpress', 4, 'cups', 'strong']
  ];

  var presetGrid = document.getElementById('presetGrid');
  presets.forEach(function(p) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'preset-btn';
    btn.innerHTML = p[0] + '<span>' + p[1] + '</span>';
    btn.addEventListener('click', function() {
      document.getElementById('brewMethod').value = p[1];
      document.getElementById('cupCount').value = p[2];
      document.getElementById('strength').value = p[4];
      // Set unit
      volumeUnit = p[3];
      toggleBtns.forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      var target = p[3] === 'cups' ? toggleBtns[0] : toggleBtns[1];
      target.classList.add('active');
      target.setAttribute('aria-pressed', 'true');
      calculate();
    });
    presetGrid.appendChild(btn);
  });

  function calculate() {
    var method = document.getElementById('brewMethod').value;
    var amount = parseFloat(document.getElementById('cupCount').value);
    var strength = document.getElementById('strength').value;

    if (isNaN(amount) || amount <= 0) return;

    var waterMl = volumeUnit === 'cups' ? amount * ML_PER_CUP : amount;
    var ratio = ratios[method][strength];
    var coffeeGrams = waterMl / ratio;
    var tbsp = coffeeGrams / GRAMS_PER_TBSP;

    // For espresso, input ml is output ml, calculate coffee from ratio
    if (method === 'espresso') {
      coffeeGrams = waterMl / ratio;
    }

    document.getElementById('coffeeGrams').innerHTML = coffeeGrams.toFixed(1) + 'g <span style="font-size:0.8rem;color:#666;">(' + tbsp.toFixed(1) + ' tbsp)</span>';
    document.getElementById('waterMl').innerHTML = waterMl.toFixed(0) + ' ml <span style="font-size:0.8rem;color:#666;">(' + (waterMl / 29.5735).toFixed(1) + ' fl oz)</span>';

    var ratioDisplay = method === 'espresso'
      ? '1:' + ratio
      : '1:' + ratio;

    document.getElementById('extraInfo').innerHTML =
      '<div style="padding:10px;background:#f3f4f6;border-radius:8px;font-size:0.9rem;">' +
      '<strong>Ratio:</strong> ' + ratioDisplay + ' &bull; ' +
      '<strong>Strength:</strong> ' + strength.charAt(0).toUpperCase() + strength.slice(1) +
      '</div>';

    document.getElementById('resultTip').textContent = tips[method];

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', calculate);
  document.getElementById('cupCount').addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });

})();
