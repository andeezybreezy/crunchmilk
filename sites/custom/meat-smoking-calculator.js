(function() {
  'use strict';

  // ── Meat data ──────────────────────────────────────────────────────────
  // perLb: true = time scales with weight, false = fixed total time
  // minPerLb / maxPerLb: minutes per pound at 225°F (or total minutes if !perLb)
  // targetLow/High: internal temp target range
  // wrapTemp: internal temp to wrap (null = no wrap)
  // wrapNote: description of wrap guidance
  // restMin/restMax: rest time in minutes
  // defaultWeight: pre-filled weight for convenience
  // wood: recommended wood pairings
  // method: special cooking method note (e.g., 3-2-1 ribs)

  var meatData = {
    whole_brisket: {
      name: 'Beef Brisket (whole packer)',
      perLb: true,
      minPerLb: 60, maxPerLb: 90,
      targetLow: 200, targetHigh: 205,
      wrapTemp: 160, wrapNote: 'Wrap at 160-170°F internal — the stall. Use butcher paper to preserve bark, or foil for speed.',
      restMin: 60, restMax: 120,
      defaultWeight: 14,
      wood: ['Oak', 'Hickory', 'Mesquite'],
      tips: 'Plan for the stall — brisket can plateau at 150-170°F for hours. The flat will finish before the point.'
    },
    brisket_flat: {
      name: 'Beef Brisket (flat only)',
      perLb: true,
      minPerLb: 60, maxPerLb: 75,
      targetLow: 200, targetHigh: 205,
      wrapTemp: 160, wrapNote: 'Wrap at 160°F internal to push through the stall and retain moisture.',
      restMin: 60, restMax: 60,
      defaultWeight: 7,
      wood: ['Oak', 'Hickory'],
      tips: 'Flats dry out easier than whole packers — wrap a bit earlier and don\'t overcook. Probe-tender is key.'
    },
    pork_butt: {
      name: 'Pork Butt / Shoulder',
      perLb: true,
      minPerLb: 90, maxPerLb: 120,
      targetLow: 195, targetHigh: 205,
      wrapTemp: 160, wrapNote: 'Wrap at 160°F internal to power through the stall. Butcher paper or foil both work well.',
      restMin: 60, restMax: 120,
      defaultWeight: 9,
      wood: ['Hickory', 'Apple', 'Cherry'],
      tips: 'Pork butt is very forgiving. It\'s hard to overcook. For pulled pork, go to 203°F+ for easy shredding.'
    },
    spare_ribs: {
      name: 'Pork Ribs (spare)',
      perLb: false,
      minPerLb: 300, maxPerLb: 360,
      targetLow: 195, targetHigh: 203,
      wrapTemp: null, wrapNote: null,
      restMin: 10, restMax: 15,
      defaultWeight: 4,
      wood: ['Hickory', 'Cherry', 'Apple'],
      method: '3-2-1 Method: 3 hrs smoke unwrapped, 2 hrs wrapped in foil with liquid, 1 hr unwrapped with sauce.',
      tips: 'The 3-2-1 method is a guideline, not gospel. Adjust based on thickness. Ribs are done when they bend and crack.'
    },
    baby_back_ribs: {
      name: 'Pork Ribs (baby back)',
      perLb: false,
      minPerLb: 240, maxPerLb: 300,
      targetLow: 195, targetHigh: 203,
      wrapTemp: null, wrapNote: null,
      restMin: 10, restMax: 15,
      defaultWeight: 3,
      wood: ['Apple', 'Cherry', 'Pecan'],
      method: '2-2-1 Method: 2 hrs smoke unwrapped, 2 hrs wrapped in foil with liquid, 1 hr unwrapped with sauce.',
      tips: 'Baby backs are leaner and cook faster than spare ribs. Don\'t overdo the wrap phase or they\'ll fall apart.'
    },
    whole_chicken: {
      name: 'Whole Chicken',
      perLb: true,
      minPerLb: 30, maxPerLb: 45,
      targetLow: 165, targetHigh: 165,
      wrapTemp: null, wrapNote: null,
      restMin: 15, restMax: 15,
      defaultWeight: 5,
      wood: ['Apple', 'Cherry', 'Pecan'],
      tips: 'Spatchcocking (removing backbone) speeds up cooking and gives more even results. Pat skin dry for crispier finish.'
    },
    turkey_breast: {
      name: 'Turkey Breast',
      perLb: true,
      minPerLb: 30, maxPerLb: 40,
      targetLow: 165, targetHigh: 165,
      wrapTemp: null, wrapNote: 'Optional: wrap in foil at 140°F if skin is getting too dark.',
      restMin: 20, restMax: 20,
      defaultWeight: 7,
      wood: ['Apple', 'Pecan', 'Cherry'],
      tips: 'Brine overnight for juicier results. Turkey breast dries out fast — pull right at 165°F.'
    },
    whole_turkey: {
      name: 'Whole Turkey',
      perLb: true,
      minPerLb: 30, maxPerLb: 40,
      targetLow: 165, targetHigh: 165,
      wrapTemp: null, wrapNote: 'Optional: tent with foil if skin darkens too quickly.',
      restMin: 30, restMax: 30,
      defaultWeight: 14,
      wood: ['Apple', 'Cherry', 'Pecan'],
      tips: 'Keep turkey under 14 lbs for safety — larger birds spend too long in the danger zone. Brine for best results.'
    },
    beef_ribs: {
      name: 'Beef Ribs (plate/short)',
      perLb: false,
      minPerLb: 360, maxPerLb: 480,
      targetLow: 200, targetHigh: 205,
      wrapTemp: 170, wrapNote: 'Wrap at 170°F internal. Butcher paper recommended to preserve the bark.',
      restMin: 30, restMax: 30,
      defaultWeight: 5,
      wood: ['Oak', 'Hickory'],
      tips: 'Beef ribs are like brisket on a stick. Look for well-marbled plate ribs for the best results.'
    },
    tri_tip: {
      name: 'Tri-Tip',
      perLb: true,
      minPerLb: 30, maxPerLb: 45,
      targetLow: 130, targetHigh: 135,
      wrapTemp: null, wrapNote: null,
      restMin: 10, restMax: 10,
      defaultWeight: 3,
      wood: ['Oak', 'Red Oak', 'Hickory'],
      tips: 'Smoke to 125°F, then sear over high heat for a crust. Slice against the grain — tri-tip has two grain directions.'
    },
    pork_loin: {
      name: 'Pork Loin',
      perLb: true,
      minPerLb: 25, maxPerLb: 35,
      targetLow: 145, targetHigh: 145,
      wrapTemp: null, wrapNote: null,
      restMin: 10, restMax: 10,
      defaultWeight: 4,
      wood: ['Apple', 'Cherry', 'Maple'],
      tips: 'Pork loin is lean — don\'t overcook past 145°F or it dries out. Consider a glaze in the last 30 minutes.'
    },
    salmon: {
      name: 'Salmon Fillet',
      perLb: false,
      minPerLb: 60, maxPerLb: 180,
      targetLow: 145, targetHigh: 145,
      wrapTemp: null, wrapNote: null,
      restMin: 5, restMax: 5,
      defaultWeight: 2,
      wood: ['Alder', 'Cedar', 'Apple'],
      tips: 'Cure salmon with a brown sugar + salt mix for 2-4 hours before smoking. Smoke at a lower temp (175-225°F) for best texture.'
    },
    sausage: {
      name: 'Sausage Links',
      perLb: false,
      minPerLb: 120, maxPerLb: 180,
      targetLow: 165, targetHigh: 165,
      wrapTemp: null, wrapNote: null,
      restMin: 5, restMax: 5,
      defaultWeight: 3,
      wood: ['Hickory', 'Maple', 'Apple'],
      tips: 'Start at lower temp (180°F) for 1 hour to set the casing, then raise to 225°F to finish.'
    },
    chuck_roast: {
      name: 'Beef Chuck Roast',
      perLb: true,
      minPerLb: 60, maxPerLb: 90,
      targetLow: 200, targetHigh: 205,
      wrapTemp: 160, wrapNote: 'Wrap at 160°F internal with beef broth for "poor man\'s brisket." Foil works great here.',
      restMin: 30, restMax: 30,
      defaultWeight: 4,
      wood: ['Oak', 'Hickory', 'Pecan'],
      tips: 'Chuck roast is the "poor man\'s brisket" — similar collagen breakdown. Wrap with a splash of beef broth for incredible results.'
    }
  };

  // ── DOM references ─────────────────────────────────────────────────────
  var meatSelect = document.getElementById('meatType');
  var weightInput = document.getElementById('meatWeight');
  var weightGroup = document.getElementById('weightGroup');
  var dinnerInput = document.getElementById('dinnerTime');
  var calcBtn = document.getElementById('calculateBtn');
  var resultDiv = document.getElementById('result');
  var resultContent = document.getElementById('resultContent');
  var tempBtns = document.querySelectorAll('[data-temp]');

  var smokerTemp = 225;

  // ── Smoker temp toggle ─────────────────────────────────────────────────
  tempBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      tempBtns.forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      smokerTemp = parseInt(btn.dataset.temp, 10);
    });
  });

  // ── Update form when meat changes ──────────────────────────────────────
  function onMeatChange() {
    var meat = meatData[meatSelect.value];
    if (!meat) return;

    // Set default weight
    weightInput.value = meat.defaultWeight;

    // Show/hide weight input for fixed-time cuts
    if (!meat.perLb) {
      weightGroup.style.display = 'none';
    } else {
      weightGroup.style.display = '';
    }
  }

  meatSelect.addEventListener('change', onMeatChange);
  onMeatChange(); // Initialize on load

  // ── Calculation ────────────────────────────────────────────────────────
  function calculate() {
    var key = meatSelect.value;
    var meat = meatData[key];
    if (!meat) return;

    var weight = parseFloat(weightInput.value);
    if (meat.perLb && (isNaN(weight) || weight <= 0)) {
      weightInput.focus();
      return;
    }

    // Temperature adjustment factor
    // At 225°F = baseline (1.0x). Higher temp = faster cook.
    // Rough rule: every 25°F above 225 reduces time by ~15%
    var tempFactor = 1.0;
    if (smokerTemp === 250) tempFactor = 0.85;
    else if (smokerTemp === 275) tempFactor = 0.72;

    // Calculate time range in minutes
    var minTime, maxTime;
    if (meat.perLb) {
      minTime = Math.round(meat.minPerLb * weight * tempFactor);
      maxTime = Math.round(meat.maxPerLb * weight * tempFactor);
    } else {
      minTime = Math.round(meat.minPerLb * tempFactor);
      maxTime = Math.round(meat.maxPerLb * tempFactor);
    }

    // Format time as hours and minutes
    function formatTime(mins) {
      var h = Math.floor(mins / 60);
      var m = mins % 60;
      if (h === 0) return m + ' min';
      if (m === 0) return h + ' hr' + (h > 1 ? 's' : '');
      return h + ' hr' + (h > 1 ? 's' : '') + ' ' + m + ' min';
    }

    function formatTimeShort(mins) {
      var h = (mins / 60).toFixed(1);
      if (h.endsWith('.0')) h = h.slice(0, -2);
      return h + ' hrs';
    }

    // Target temp display
    var targetStr;
    if (meat.targetLow === meat.targetHigh) {
      targetStr = meat.targetLow + '°F';
    } else {
      targetStr = meat.targetLow + '-' + meat.targetHigh + '°F';
    }

    // Rest time
    var restStr;
    if (meat.restMin === meat.restMax) {
      restStr = meat.restMin + ' minutes';
    } else {
      restStr = meat.restMin + '-' + meat.restMax + ' minutes';
    }

    // Pellet & charcoal estimates (use max time for safety margin)
    var avgTime = (minTime + maxTime) / 2;
    var avgHours = avgTime / 60;
    var pelletMin = Math.ceil(avgHours * 1);
    var pelletMax = Math.ceil(avgHours * 2);
    var charcoalMin = Math.ceil(avgHours * 2);
    var charcoalMax = Math.ceil(avgHours * 3);

    // Start time calculation
    var startTimeHTML = '';
    if (dinnerInput.value) {
      var parts = dinnerInput.value.split(':');
      var dinnerHour = parseInt(parts[0], 10);
      var dinnerMinute = parseInt(parts[1], 10);
      var dinnerTotalMin = dinnerHour * 60 + dinnerMinute;

      // Use max time + max rest for safety
      var totalNeeded = maxTime + meat.restMax;
      var startTotalMin = dinnerTotalMin - totalNeeded;

      // Handle crossing midnight (previous day)
      if (startTotalMin < 0) startTotalMin += 1440;

      var startH = Math.floor(startTotalMin / 60) % 24;
      var startM = startTotalMin % 60;
      var ampm = startH >= 12 ? 'PM' : 'AM';
      var displayH = startH % 12;
      if (displayH === 0) displayH = 12;
      var displayM = startM < 10 ? '0' + startM : startM;

      var dinnerAmpm = dinnerHour >= 12 ? 'PM' : 'AM';
      var dinnerDisplayH = dinnerHour % 12;
      if (dinnerDisplayH === 0) dinnerDisplayH = 12;
      var dinnerDisplayM = dinnerMinute < 10 ? '0' + dinnerMinute : dinnerMinute;

      startTimeHTML = '<div class="result-section">' +
        '<div class="result-section-title">Start Time Calculator</div>' +
        '<div class="result-highlight">Start smoking at <strong>' + displayH + ':' + displayM + ' ' + ampm + '</strong></div>' +
        '<div class="result-detail">To eat at ' + dinnerDisplayH + ':' + dinnerDisplayM + ' ' + dinnerAmpm +
        ', allowing ' + formatTime(maxTime) + ' cook time + ' + restStr + ' rest</div>' +
        '</div>';
    }

    // Wood recommendations
    var woodStr = meat.wood.join(', ');

    // Build results HTML
    var html = '<style>' +
      '.result-section{padding:16px 0;border-bottom:1px solid #fca5a5}' +
      '.result-section:last-child{border-bottom:none;padding-bottom:0}' +
      '.result-section:first-child{padding-top:0}' +
      '.result-section-title{font-size:0.8rem;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-light);margin-bottom:6px;font-weight:600}' +
      '.result-highlight{font-size:1.5rem;font-weight:800;color:var(--primary);margin-bottom:4px}' +
      '.result-detail{font-size:0.9rem;color:var(--text-light);line-height:1.6}' +
      '.result-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}' +
      '.result-grid-item .result-highlight{font-size:1.2rem}' +
      '.result-wrap-note{background:#fef2f2;border:1px solid #fca5a5;border-radius:8px;padding:12px;margin-top:8px;font-size:0.88rem;line-height:1.6}' +
      '.result-tip-box{background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:12px;font-size:0.88rem;line-height:1.6;color:#92400e}' +
      '@media(max-width:480px){.result-grid{grid-template-columns:1fr}}' +
      '</style>';

    // Cooking time
    html += '<div class="result-section">' +
      '<div class="result-section-title">Estimated Cooking Time</div>' +
      '<div class="result-highlight">' + formatTime(minTime) + ' — ' + formatTime(maxTime) + '</div>' +
      '<div class="result-detail">';
    if (meat.perLb) {
      html += weight + ' lbs at ' + smokerTemp + '°F';
    } else {
      html += 'At ' + smokerTemp + '°F (time-based cut, not weight-dependent)';
    }
    html += '</div></div>';

    // Target temp & rest
    html += '<div class="result-section"><div class="result-grid">' +
      '<div class="result-grid-item">' +
      '<div class="result-section-title">Target Internal Temp</div>' +
      '<div class="result-highlight">' + targetStr + '</div>' +
      '</div>' +
      '<div class="result-grid-item">' +
      '<div class="result-section-title">Rest Time</div>' +
      '<div class="result-highlight">' + restStr + '</div>' +
      '</div>' +
      '</div></div>';

    // Wrap guidance (if applicable)
    if (meat.wrapTemp || meat.method) {
      html += '<div class="result-section">' +
        '<div class="result-section-title">Wrapping / Method</div>';
      if (meat.method) {
        html += '<div class="result-wrap-note">' + meat.method + '</div>';
      }
      if (meat.wrapTemp) {
        html += '<div class="result-wrap-note">' + meat.wrapNote + '</div>';
      }
      html += '</div>';
    }

    // Start time
    if (startTimeHTML) {
      html += startTimeHTML;
    }

    // Fuel estimates
    html += '<div class="result-section"><div class="result-grid">' +
      '<div class="result-grid-item">' +
      '<div class="result-section-title">Pellets Needed</div>' +
      '<div class="result-highlight">' + pelletMin + '-' + pelletMax + ' lbs</div>' +
      '<div class="result-detail">~1-2 lbs/hour</div>' +
      '</div>' +
      '<div class="result-grid-item">' +
      '<div class="result-section-title">Charcoal Needed</div>' +
      '<div class="result-highlight">' + charcoalMin + '-' + charcoalMax + ' lbs</div>' +
      '<div class="result-detail">~2-3 lbs/hour</div>' +
      '</div>' +
      '</div></div>';

    // Wood recommendation
    html += '<div class="result-section">' +
      '<div class="result-section-title">Recommended Wood</div>' +
      '<div class="result-highlight" style="font-size:1.1rem">' + woodStr + '</div>' +
      '</div>';

    // Pro tip
    if (meat.tips) {
      html += '<div class="result-section">' +
        '<div class="result-section-title">Pro Tip</div>' +
        '<div class="result-tip-box">' + meat.tips + '</div>' +
        '</div>';
    }

    resultContent.innerHTML = html;
    resultDiv.classList.add('visible');
    resultDiv.style.display = 'block';
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // ── Event listeners ────────────────────────────────────────────────────
  calcBtn.addEventListener('click', calculate);

  // Enter key triggers calculation from any input
  weightInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') calculate();
  });
  dinnerInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') calculate();
  });

  // ── Render reference chart ─────────────────────────────────────────────
  var chartBody = document.getElementById('chartBody');
  if (chartBody && chartBody.children.length === 0) {
    var chartRows = [
      ['Beef Brisket (whole)', '225-250°F', '1-1.5 hr/lb', '200-205°F', 'Oak, Hickory'],
      ['Beef Brisket (flat)', '225-250°F', '1-1.25 hr/lb', '200-205°F', 'Oak, Hickory'],
      ['Pork Butt / Shoulder', '225-250°F', '1.5-2 hr/lb', '195-205°F', 'Hickory, Apple'],
      ['Pork Ribs (spare)', '225-250°F', '5-6 hrs total', '195-203°F', 'Hickory, Cherry'],
      ['Pork Ribs (baby back)', '225-250°F', '4-5 hrs total', '195-203°F', 'Apple, Cherry'],
      ['Whole Chicken', '250-275°F', '30-45 min/lb', '165°F', 'Apple, Cherry'],
      ['Turkey Breast', '250-275°F', '30-40 min/lb', '165°F', 'Apple, Pecan'],
      ['Whole Turkey', '250-275°F', '30-40 min/lb', '165°F', 'Apple, Cherry'],
      ['Beef Ribs (plate/short)', '225-250°F', '6-8 hrs total', '200-205°F', 'Oak, Hickory'],
      ['Tri-Tip', '225-250°F', '30-45 min/lb', '130-135°F', 'Oak, Red Oak'],
      ['Pork Loin', '225-250°F', '25-35 min/lb', '145°F', 'Apple, Cherry'],
      ['Salmon Fillet', '175-225°F', '1-3 hrs total', '145°F', 'Alder, Cedar'],
      ['Sausage Links', '225-250°F', '2-3 hrs total', '165°F', 'Hickory, Maple'],
      ['Beef Chuck Roast', '225-250°F', '1-1.5 hr/lb', '200-205°F', 'Oak, Hickory']
    ];
    chartRows.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td><td>' + row[4] + '</td>';
      chartBody.appendChild(tr);
    });
  }

})();
