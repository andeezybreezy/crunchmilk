(function() {
  'use strict';

  var volumeUnit = 'gal';
  var GRAMS_PER_GALLON = 3785.41;
  var GRAMS_PER_LITER = 1000;
  var GRAMS_PER_OZ = 28.3495;
  var GRAMS_PER_LB = 453.592;
  var GRAMS_PER_TBSP_SALT = 18; // kosher salt approx

  // Presets: [name, method, brinePct, tip]
  var presets = [
    ['Whole Turkey', 'wet', 6, 'Brine 12-24 hours. Rinse and pat dry before roasting.'],
    ['Chicken (whole)', 'wet', 5, 'Brine 4-12 hours. Pat dry for crispier skin.'],
    ['Chicken Breasts', 'wet', 4, 'Brine only 1-2 hours. Prevents dryness.'],
    ['Pork Chops', 'wet', 5, 'Brine 2-4 hours. Great for grilling.'],
    ['Pork Shoulder', 'wet', 6, 'Brine 12-24 hours for pulled pork.'],
    ['Salmon', 'wet', 4, 'Brine 30-60 min. Prevents white albumin.'],
    ['Turkey (dry brine)', 'dry', 0.5, 'Apply salt, refrigerate uncovered 24-48 hours.'],
    ['Chicken (dry brine)', 'dry', 0.5, 'Apply salt, refrigerate uncovered 12-24 hours.']
  ];

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

  // Toggle fields based on method
  var methodSelect = document.getElementById('brineMethod');
  methodSelect.addEventListener('change', function() {
    var method = methodSelect.value;
    document.getElementById('waterGroup').style.display = method === 'dry' ? 'none' : '';
    document.getElementById('meatWeightGroup').style.display = (method === 'dry' || method === 'equilibrium') ? '' : 'none';
  });

  var presetGrid = document.getElementById('presetGrid');
  presets.forEach(function(p) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'preset-btn';
    btn.innerHTML = p[0] + '<span>' + p[2] + '% ' + p[1] + '</span>';
    btn.addEventListener('click', function() {
      document.getElementById('brineMethod').value = p[1];
      document.getElementById('brinePct').value = p[2];
      methodSelect.dispatchEvent(new Event('change'));
      calculate(p[3]);
    });
    presetGrid.appendChild(btn);
  });

  function calculate(customTip) {
    var method = document.getElementById('brineMethod').value;
    var brinePct = parseFloat(document.getElementById('brinePct').value);
    var addSugar = document.getElementById('addSugar').checked;

    if (isNaN(brinePct) || brinePct <= 0) return;

    var saltGrams, html;

    if (method === 'wet') {
      var waterAmt = parseFloat(document.getElementById('waterAmount').value);
      if (isNaN(waterAmt) || waterAmt <= 0) return;

      var waterGrams = volumeUnit === 'gal' ? waterAmt * GRAMS_PER_GALLON : waterAmt * GRAMS_PER_LITER;
      // salt = water_weight * (brine% / (100 - brine%))
      saltGrams = waterGrams * (brinePct / (100 - brinePct));

      html = buildOutput(saltGrams, addSugar, waterAmt + ' ' + (volumeUnit === 'gal' ? 'gallon(s)' : 'liter(s)') + ' water');

    } else if (method === 'dry') {
      var meatLbs = parseFloat(document.getElementById('meatWeight').value);
      if (isNaN(meatLbs) || meatLbs <= 0) return;

      var meatGrams = meatLbs * GRAMS_PER_LB;
      saltGrams = meatGrams * brinePct / 100;

      html = buildOutput(saltGrams, addSugar, meatLbs + ' lbs meat (dry brine)');

    } else {
      // Equilibrium
      var waterAmt2 = parseFloat(document.getElementById('waterAmount').value);
      var meatLbs2 = parseFloat(document.getElementById('meatWeight').value);
      if (isNaN(waterAmt2) || isNaN(meatLbs2) || waterAmt2 <= 0 || meatLbs2 <= 0) return;

      var waterGrams2 = volumeUnit === 'gal' ? waterAmt2 * GRAMS_PER_GALLON : waterAmt2 * GRAMS_PER_LITER;
      var meatGrams2 = meatLbs2 * GRAMS_PER_LB;
      var totalWeight = waterGrams2 + meatGrams2;
      saltGrams = totalWeight * brinePct / 100;

      html = buildOutput(saltGrams, addSugar, 'equilibrium: ' + waterAmt2 + ' ' + (volumeUnit === 'gal' ? 'gal' : 'L') + ' water + ' + meatLbs2 + ' lbs meat');
    }

    document.getElementById('brineOutput').innerHTML = html;
    document.getElementById('resultTip').textContent = customTip || 'Use non-iodized salt (kosher or sea salt). Refrigerate while brining.';

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function buildOutput(saltGrams, addSugar, description) {
    var saltOz = saltGrams / GRAMS_PER_OZ;
    var saltTbsp = saltGrams / GRAMS_PER_TBSP_SALT;
    var saltCups = saltTbsp / 16;

    var html = '<div style="display:grid;gap:4px;">';
    html += row('Salt', saltGrams.toFixed(0) + 'g (' + saltOz.toFixed(1) + ' oz)');
    html += row('Salt (volume)', saltCups >= 1 ? saltCups.toFixed(1) + ' cups' : saltTbsp.toFixed(1) + ' tbsp');

    if (addSugar) {
      html += row('Sugar', saltGrams.toFixed(0) + 'g (' + saltOz.toFixed(1) + ' oz)');
    }

    html += '</div>';
    html += '<div style="margin-top:8px;padding:10px;background:#f3f4f6;border-radius:8px;font-size:0.9rem;">';
    html += '<strong>For:</strong> ' + description + ' at ' + document.getElementById('brinePct').value + '% concentration';
    html += '</div>';
    return html;
  }

  function row(label, value) {
    return '<div style="display:flex;justify-content:space-between;padding:10px;border-bottom:1px solid #e5e7eb;">' +
      '<span style="font-weight:600;">' + label + '</span>' +
      '<span>' + value + '</span></div>';
  }

  document.getElementById('convertBtn').addEventListener('click', function() { calculate(); });

})();
