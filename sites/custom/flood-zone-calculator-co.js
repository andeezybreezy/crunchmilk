(function() {
  'use strict';

  var femaZone = document.getElementById('femaZone');
  var elevation = document.getElementById('elevation');
  var waterDist = document.getElementById('waterDist');
  var propertyType = document.getElementById('propertyType');
  var hasBasement = document.getElementById('hasBasement');
  var homeValFz = document.getElementById('homeValFz');
  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  // Zone base risk scores (0-100) and annual probability
  var zoneData = {
    'V':    { base: 95, prob: 1.5, required: true, ratePerK: 22 },
    'A':    { base: 80, prob: 1.0, required: true, ratePerK: 8 },
    'AH':   { base: 70, prob: 1.0, required: true, ratePerK: 5 },
    'X500': { base: 35, prob: 0.2, required: false, ratePerK: 1.8 },
    'X':    { base: 15, prob: 0.05, required: false, ratePerK: 1.2 },
    'D':    { base: 45, prob: 0.5, required: false, ratePerK: 2.5 }
  };

  function calculate() {
    var zone = femaZone.value;
    var elev = parseFloat(elevation.value);
    var dist = parseFloat(waterDist.value);
    var prop = propertyType.value;
    var basement = hasBasement.value === 'yes';
    var homeValue = parseFloat(homeValFz.value);

    if (isNaN(elev) || isNaN(dist) || isNaN(homeValue) || homeValue <= 0) return;

    var zd = zoneData[zone];

    // Elevation adjustment: each foot above BFE reduces risk by ~5 pts; below adds ~8 pts
    var elevAdj = 0;
    if (elev > 0) {
      elevAdj = -Math.min(40, elev * 5);
    } else if (elev < 0) {
      elevAdj = Math.min(30, Math.abs(elev) * 8);
    }

    // Distance to water: closer = higher risk
    var distAdj = 0;
    if (dist < 250) distAdj = 15;
    else if (dist < 500) distAdj = 10;
    else if (dist < 1000) distAdj = 5;
    else distAdj = 0;

    // Basement adjustment
    var basementAdj = basement ? 10 : 0;

    // Property type adjustment
    var propAdj = prop === 'mobile' ? 10 : prop === 'commercial' ? 5 : 0;

    var score = Math.round(Math.min(100, Math.max(0, zd.base + elevAdj + distAdj + basementAdj + propAdj)));

    var level, levelColor;
    if (score < 25) { level = 'Low'; levelColor = '#16a34a'; }
    else if (score < 45) { level = 'Moderate'; levelColor = '#ca8a04'; }
    else if (score < 70) { level = 'High'; levelColor = '#ea580c'; }
    else { level = 'Very High'; levelColor = '#dc2626'; }

    // Insurance premium estimate
    var elevFactor = elev > 0 ? Math.max(0.4, 1 - elev * 0.08) : 1 + Math.abs(elev) * 0.15;
    var basementFactor = basement ? 1.25 : 1.0;
    var premium = Math.round((homeValue / 1000) * zd.ratePerK * elevFactor * basementFactor);

    // Probability calculations
    var annualProb = zd.prob;
    // Adjust probability by elevation
    if (elev > 3) annualProb *= 0.5;
    else if (elev > 1) annualProb *= 0.75;
    else if (elev < 0) annualProb *= 1.5;

    var prob30 = (1 - Math.pow(1 - annualProb / 100, 30)) * 100;

    document.getElementById('rScore').textContent = score + ' / 100';
    document.getElementById('rScore').style.color = levelColor;
    document.getElementById('rLevel').textContent = level;
    document.getElementById('rLevel').style.color = levelColor;
    document.getElementById('rRequired').textContent = zd.required ? 'Yes (w/ federally-backed mortgage)' : 'No (but recommended)';
    document.getElementById('rRequired').style.color = zd.required ? '#dc2626' : '#16a34a';
    document.getElementById('rPremium').textContent = '$' + premium.toLocaleString() + '/yr';
    document.getElementById('rProb').textContent = annualProb.toFixed(2) + '%';
    document.getElementById('rProb30').textContent = prob30.toFixed(1) + '%';

    var zoneLabels = { 'V': 'V (Coastal High Hazard)', 'A': 'A (High Risk)', 'AH': 'AH (Shallow Flooding)', 'X500': 'X Shaded (Moderate)', 'X': 'X (Low Risk)', 'D': 'D (Undetermined)' };
    var tip = 'Zone ' + zoneLabels[zone] + '. ' + elev + 'ft above BFE. ';
    if (elev < 1 && (zone === 'A' || zone === 'V' || zone === 'AH')) {
      tip += 'Elevating above BFE could significantly reduce premiums.';
    } else if (!zd.required) {
      tip += 'Consider a Preferred Risk Policy for affordable protection.';
    } else {
      tip += 'Elevation credit reduces your premium.';
    }
    document.getElementById('resultTip').textContent = tip;

    result.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  [femaZone, elevation, waterDist, propertyType, hasBasement, homeValFz].forEach(function(el) {
    el.addEventListener('change', calculate);
    el.addEventListener('input', calculate);
  });

  calculate();
})();
