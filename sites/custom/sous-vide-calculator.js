(function() {
  'use strict';

  // Data: protein -> doneness -> { tempF, minMin (minutes), maxMin (minutes) }
  // Times are for 1-inch thickness; scale by thickness
  var data = {
    beefSteak: {
      rare:       { tempF: 130, minMin: 60,  maxMin: 180 },
      mediumRare: { tempF: 135, minMin: 60,  maxMin: 240 },
      medium:     { tempF: 140, minMin: 60,  maxMin: 240 },
      mediumWell: { tempF: 150, minMin: 60,  maxMin: 210 },
      well:       { tempF: 160, minMin: 60,  maxMin: 180 },
      sear: 'Sear 60-90 sec per side in screaming-hot cast iron with high-smoke-point oil.',
      useThickness: true
    },
    beefRoast: {
      rare:       { tempF: 130, minMin: 240, maxMin: 600 },
      mediumRare: { tempF: 135, minMin: 240, maxMin: 600 },
      medium:     { tempF: 140, minMin: 240, maxMin: 600 },
      mediumWell: { tempF: 150, minMin: 240, maxMin: 480 },
      well:       { tempF: 160, minMin: 240, maxMin: 480 },
      sear: 'Sear all sides in hot pan or torch after resting 5 min. Slice against the grain.',
      useThickness: true
    },
    porkChop: {
      rare:       { tempF: 135, minMin: 60,  maxMin: 240 },
      mediumRare: { tempF: 138, minMin: 60,  maxMin: 240 },
      medium:     { tempF: 140, minMin: 90,  maxMin: 240 },
      mediumWell: { tempF: 150, minMin: 90,  maxMin: 210 },
      well:       { tempF: 160, minMin: 90,  maxMin: 180 },
      sear: 'Sear 60 sec per side. Pork is safe at 140°F+ when held for adequate time.',
      useThickness: true
    },
    porkTenderloin: {
      rare:       { tempF: 135, minMin: 90,  maxMin: 240 },
      mediumRare: { tempF: 138, minMin: 90,  maxMin: 240 },
      medium:     { tempF: 140, minMin: 90,  maxMin: 240 },
      mediumWell: { tempF: 150, minMin: 90,  maxMin: 210 },
      well:       { tempF: 160, minMin: 90,  maxMin: 180 },
      sear: 'Sear quickly on all sides. Tenderloin dries out if overcooked — 140°F is ideal.',
      useThickness: true
    },
    chickenBreast: {
      rare:       { tempF: 140, minMin: 90,  maxMin: 240 },
      mediumRare: { tempF: 145, minMin: 90,  maxMin: 240 },
      medium:     { tempF: 150, minMin: 90,  maxMin: 240 },
      mediumWell: { tempF: 155, minMin: 75,  maxMin: 210 },
      well:       { tempF: 165, minMin: 60,  maxMin: 180 },
      sear: 'Sear skin-side down if skin-on. 150°F gives juicy, safe chicken (held 3+ min pasteurizes).',
      useThickness: true
    },
    chickenThigh: {
      rare:       { tempF: 150, minMin: 90,  maxMin: 240 },
      mediumRare: { tempF: 155, minMin: 90,  maxMin: 240 },
      medium:     { tempF: 165, minMin: 90,  maxMin: 240 },
      mediumWell: { tempF: 170, minMin: 60,  maxMin: 210 },
      well:       { tempF: 176, minMin: 60,  maxMin: 180 },
      sear: 'Sear skin-side down for crispy skin. Thighs are forgiving — 165°F for tender, fall-apart texture.',
      useThickness: true
    },
    salmon: {
      rare:       { tempF: 110, minMin: 40,  maxMin: 60 },
      mediumRare: { tempF: 120, minMin: 40,  maxMin: 75 },
      medium:     { tempF: 130, minMin: 40,  maxMin: 75 },
      mediumWell: { tempF: 140, minMin: 40,  maxMin: 60 },
      well:       { tempF: 150, minMin: 30,  maxMin: 60 },
      sear: 'Sear skin-side only for 60-90 sec in hot pan. Pat dry first. 120°F gives silky, custard-like texture.',
      useThickness: true
    },
    whitefish: {
      rare:       { tempF: 122, minMin: 30,  maxMin: 50 },
      mediumRare: { tempF: 126, minMin: 30,  maxMin: 50 },
      medium:     { tempF: 130, minMin: 30,  maxMin: 60 },
      mediumWell: { tempF: 135, minMin: 30,  maxMin: 50 },
      well:       { tempF: 140, minMin: 25,  maxMin: 45 },
      sear: 'Gently sear or torch. White fish is delicate — handle carefully after cooking.',
      useThickness: true
    },
    shrimp: {
      rare:       { tempF: 130, minMin: 15,  maxMin: 35 },
      mediumRare: { tempF: 135, minMin: 15,  maxMin: 40 },
      medium:     { tempF: 140, minMin: 15,  maxMin: 40 },
      mediumWell: { tempF: 145, minMin: 15,  maxMin: 35 },
      well:       { tempF: 150, minMin: 15,  maxMin: 30 },
      sear: 'Quick sear 30 sec per side or serve as-is. Do not overcook — shrimp get rubbery.',
      useThickness: false
    },
    eggs: {
      rare:       { tempF: 145, minMin: 45,  maxMin: 90 },
      mediumRare: { tempF: 147, minMin: 45,  maxMin: 90 },
      medium:     { tempF: 150, minMin: 45,  maxMin: 75 },
      mediumWell: { tempF: 155, minMin: 45,  maxMin: 75 },
      well:       { tempF: 165, minMin: 45,  maxMin: 75 },
      sear: 'No sear needed. Crack into a bowl gently. 145°F = runny yolk, set white. 165°F = fully set.',
      useThickness: false
    },
    lamb: {
      rare:       { tempF: 130, minMin: 60,  maxMin: 180 },
      mediumRare: { tempF: 135, minMin: 60,  maxMin: 180 },
      medium:     { tempF: 140, minMin: 60,  maxMin: 180 },
      mediumWell: { tempF: 150, minMin: 60,  maxMin: 150 },
      well:       { tempF: 160, minMin: 60,  maxMin: 120 },
      sear: 'Sear 60-90 sec per side. Lamb fat renders beautifully at high heat. Rest 2 min.',
      useThickness: true
    }
  };

  var donenessLabels = {
    rare: 'Rare', mediumRare: 'Medium-Rare', medium: 'Medium',
    mediumWell: 'Medium-Well', well: 'Well Done'
  };

  function updateUI() {
    var protein = document.getElementById('protein').value;
    var d = data[protein];
    var thicknessGroup = document.getElementById('thicknessGroup');
    thicknessGroup.style.display = d.useThickness ? '' : 'none';

    // Update doneness options for eggs
    var donenessEl = document.getElementById('doneness');
    if (protein === 'eggs') {
      donenessEl.options[0].textContent = 'Soft / Runny Yolk';
      donenessEl.options[1].textContent = 'Soft-Medium';
      donenessEl.options[2].textContent = 'Medium (Jammy)';
      donenessEl.options[3].textContent = 'Medium-Hard';
      donenessEl.options[4].textContent = 'Hard Boiled';
    } else {
      donenessEl.options[0].textContent = 'Rare';
      donenessEl.options[1].textContent = 'Medium-Rare';
      donenessEl.options[2].textContent = 'Medium';
      donenessEl.options[3].textContent = 'Medium-Well';
      donenessEl.options[4].textContent = 'Well Done';
    }
  }

  document.getElementById('protein').addEventListener('change', updateUI);
  updateUI();

  function fmtTime(minutes) {
    if (minutes < 60) return minutes + ' min';
    var hrs = Math.floor(minutes / 60);
    var mins = minutes % 60;
    if (mins === 0) return hrs + ' hr' + (hrs > 1 ? 's' : '');
    return hrs + ' hr ' + mins + ' min';
  }

  function calculate() {
    var protein = document.getElementById('protein').value;
    var doneness = document.getElementById('doneness').value;
    var thickness = parseFloat(document.getElementById('thickness').value) || 1;
    var d = data[protein];
    var cook = d[doneness];

    if (!cook) return;

    // Scale time by thickness (roughly thickness^2 for heat transfer)
    var thicknessFactor = d.useThickness ? Math.pow(thickness, 1.5) : 1;
    var minTime = Math.round(cook.minMin * thicknessFactor);
    var maxTime = Math.round(cook.maxMin * thicknessFactor);

    var tempC = ((cook.tempF - 32) * 5 / 9).toFixed(1);

    document.getElementById('tempResult').innerHTML =
      cook.tempF + '°F <span style="font-size:0.85rem;color:#666;">(' + tempC + '°C)</span>';
    document.getElementById('timeResult').innerHTML =
      fmtTime(minTime) + ' — ' + fmtTime(maxTime);

    var donenessLabel = protein === 'eggs' ?
      document.getElementById('doneness').options[document.getElementById('doneness').selectedIndex].textContent :
      donenessLabels[doneness];

    var html = '<div style="padding:12px;background:#f3f4f6;border-radius:8px;">';
    html += '<div><strong>Protein:</strong> ' + document.getElementById('protein').options[document.getElementById('protein').selectedIndex].textContent + '</div>';
    html += '<div><strong>Doneness:</strong> ' + donenessLabel + '</div>';
    if (d.useThickness) html += '<div><strong>Thickness:</strong> ' + thickness + ' inches</div>';
    html += '<div style="margin-top:8px;padding-top:8px;border-top:1px solid #e5e7eb;">';
    html += '<strong>Searing:</strong> ' + d.sear + '</div>';
    html += '</div>';

    document.getElementById('extraInfo').innerHTML = html;
    document.getElementById('resultTip').textContent =
      'Pat dry before searing. Season with salt before bagging. Use hottest possible pan for searing (60-90 seconds max per side).';

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', calculate);
  document.getElementById('thickness').addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  document.getElementById('protein').addEventListener('change', function() {
    if (document.getElementById('result').classList.contains('visible')) calculate();
  });
  document.getElementById('doneness').addEventListener('change', function() {
    if (document.getElementById('result').classList.contains('visible')) calculate();
  });

})();
