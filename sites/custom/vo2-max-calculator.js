(function() {
  'use strict';

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 1;
    return n.toFixed(d);
  }

  var ageEl = document.getElementById('age');
  var genderEl = document.getElementById('gender');
  var testTypeEl = document.getElementById('testType');
  var testInputsDiv = document.getElementById('testInputs');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var chartData = [
    ['20-29', '<34 / <28', '34-40 / 28-34', '40-48 / 34-41', '48-55 / 41-48', '>55 / >48'],
    ['30-39', '<32 / <26', '32-38 / 26-32', '38-45 / 32-38', '45-52 / 38-45', '>52 / >45'],
    ['40-49', '<30 / <24', '30-35 / 24-29', '35-42 / 29-35', '42-49 / 35-42', '>49 / >42'],
    ['50-59', '<27 / <22', '27-33 / 22-27', '33-39 / 27-33', '39-46 / 33-39', '>46 / >39'],
    ['60-69', '<24 / <20', '24-30 / 20-25', '30-36 / 25-31', '36-43 / 31-37', '>43 / >37']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      var cells = '';
      for (var i = 0; i < row.length; i++) cells += '<td>' + row[i] + '</td>';
      tr.innerHTML = cells;
      chartBody.appendChild(tr);
    });
  }

  function buildTestInputs() {
    var type = testTypeEl.value;
    var html = '';
    if (type === 'cooper') {
      html += '<div class="input-group"><label for="cooperDist">Distance Covered in 12 min (meters)</label>';
      html += '<input type="number" id="cooperDist" placeholder="2400" inputmode="decimal" step="any"></div>';
      html += '<p style="font-size:0.8rem;color:var(--text-light);margin-top:-8px">Tip: 1 mile = 1609 meters. Run on a track for best accuracy.</p>';
    } else if (type === 'rockport') {
      html += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px">';
      html += '<div class="input-group"><label for="weight">Body Weight (lbs)</label>';
      html += '<input type="number" id="weight" placeholder="170" inputmode="decimal" step="any"></div>';
      html += '<div class="input-group"><label for="walkTime">1-Mile Walk Time (min)</label>';
      html += '<input type="number" id="walkTime" placeholder="15.5" inputmode="decimal" step="0.1"></div>';
      html += '<div class="input-group"><label for="walkHR">Ending Heart Rate (bpm)</label>';
      html += '<input type="number" id="walkHR" placeholder="140" inputmode="decimal" step="1"></div>';
      html += '</div>';
    } else if (type === 'step') {
      html += '<div class="input-group"><label for="recoveryHR">Recovery Heart Rate (bpm, 1 min after 3-min step test)</label>';
      html += '<input type="number" id="recoveryHR" placeholder="100" inputmode="decimal" step="1"></div>';
      html += '<p style="font-size:0.8rem;color:var(--text-light);margin-top:-8px">Step up and down on a 12-inch step at 24 steps/min for 3 minutes. Measure HR at 1 minute after stopping.</p>';
    } else {
      html += '<p style="font-size:0.85rem;color:var(--text-light);padding:12px;background:#f9fafb;border-radius:8px">Resting estimate uses age and gender norms. No test needed, but this is the least accurate method. Consider the Cooper test for better results.</p>';
    }
    testInputsDiv.innerHTML = html;
  }

  buildTestInputs();
  testTypeEl.addEventListener('change', buildTestInputs);

  function getVal(id) {
    var el = document.getElementById(id);
    if (!el) return 0;
    var v = parseFloat(el.value);
    return isNaN(v) ? 0 : v;
  }

  // Fitness categories by age decade and gender: [poor, fair, good, excellent, superior]
  var categories = {
    male: {
      20: [34, 40, 48, 55],
      30: [32, 38, 45, 52],
      40: [30, 35, 42, 49],
      50: [27, 33, 39, 46],
      60: [24, 30, 36, 43],
      70: [21, 27, 33, 40]
    },
    female: {
      20: [28, 34, 41, 48],
      30: [26, 32, 38, 45],
      40: [24, 29, 35, 42],
      50: [22, 27, 33, 39],
      60: [20, 25, 31, 37],
      70: [18, 23, 28, 34]
    }
  };

  function getCategory(vo2, age, gender) {
    var decade = Math.min(Math.max(Math.floor(age / 10) * 10, 20), 70);
    var thresholds = categories[gender][decade];
    if (vo2 < thresholds[0]) return { label: 'Poor', color: '#dc2626', percentile: '< 20th' };
    if (vo2 < thresholds[1]) return { label: 'Fair', color: '#d97706', percentile: '20th-40th' };
    if (vo2 < thresholds[2]) return { label: 'Good', color: '#059669', percentile: '40th-60th' };
    if (vo2 < thresholds[3]) return { label: 'Excellent', color: '#059669', percentile: '60th-80th' };
    return { label: 'Superior', color: '#7c3aed', percentile: '> 80th' };
  }

  function calculate() {
    var age = getVal('age');
    var gender = genderEl.value;
    var type = testTypeEl.value;

    if (age <= 0 || age > 100) return;

    var vo2 = 0;
    var method = '';

    if (type === 'cooper') {
      var dist = getVal('cooperDist');
      if (dist <= 0) return;
      vo2 = (dist - 504.9) / 44.73;
      method = 'Cooper 12-Minute Run Test';
    } else if (type === 'rockport') {
      var weight = getVal('weight');
      var walkTime = getVal('walkTime');
      var walkHR = getVal('walkHR');
      if (weight <= 0 || walkTime <= 0 || walkHR <= 0) return;
      var weightKg = weight * 0.4536;
      var genderVal = gender === 'male' ? 1 : 0;
      vo2 = 132.853 - (0.0769 * weight) - (0.3877 * age) + (6.315 * genderVal) - (3.2649 * walkTime) - (0.1565 * walkHR);
      method = 'Rockport 1-Mile Walk Test';
    } else if (type === 'step') {
      var recoveryHR = getVal('recoveryHR');
      if (recoveryHR <= 0) return;
      if (gender === 'male') {
        vo2 = 111.33 - (0.42 * recoveryHR);
      } else {
        vo2 = 65.81 - (0.1847 * recoveryHR);
      }
      method = '3-Minute Step Test';
    } else {
      // Resting estimate based on age/gender averages
      var decade = Math.min(Math.max(Math.floor(age / 10) * 10, 20), 70);
      var thresholds = categories[gender][decade];
      vo2 = (thresholds[1] + thresholds[2]) / 2; // midpoint of fair-good
      method = 'Resting Estimate (age/gender norms)';
    }

    vo2 = Math.max(vo2, 10);
    var cat = getCategory(vo2, age, gender);

    // Longevity outlook
    var longevity;
    if (cat.label === 'Superior' || cat.label === 'Excellent') {
      longevity = 'Strong';
    } else if (cat.label === 'Good') {
      longevity = 'Above Average';
    } else if (cat.label === 'Fair') {
      longevity = 'Average';
    } else {
      longevity = 'Elevated Risk';
    }

    document.getElementById('rVO2').textContent = fmt(vo2, 1) + ' ml/kg/min';
    document.getElementById('rVO2').style.color = cat.color;
    document.getElementById('rCategory').textContent = cat.label;
    document.getElementById('rCategory').style.color = cat.color;
    document.getElementById('rPercentile').textContent = cat.percentile;
    document.getElementById('rLongevity').textContent = longevity;
    document.getElementById('rLongevity').style.color = cat.color;

    var d = '';

    d += '<div style="padding:12px;background:#f0fdf4;border-radius:8px;font-size:0.9rem;margin-bottom:12px">';
    d += '<strong>Your Result: ' + fmt(vo2, 1) + ' ml/kg/min</strong><br>';
    d += 'Method: ' + method + '<br>';
    d += 'Category: <strong style="color:' + cat.color + '">' + cat.label + '</strong> for ' + age + '-year-old ' + (gender === 'male' ? 'male' : 'female') + '<br>';
    d += 'Percentile: ' + cat.percentile + '</div>';

    // Improvement targets
    var decade2 = Math.min(Math.max(Math.floor(age / 10) * 10, 20), 70);
    var t = categories[gender][decade2];
    d += '<div style="padding:12px;background:#eff6ff;border-radius:8px;font-size:0.9rem;margin-bottom:12px">';
    d += '<strong>Targets for Your Age Group (' + gender + ', ' + decade2 + 's)</strong><br>';
    d += '<span style="color:#dc2626">Poor: &lt;' + t[0] + '</span> | ';
    d += '<span style="color:#d97706">Fair: ' + t[0] + '-' + t[1] + '</span> | ';
    d += '<span style="color:#059669">Good: ' + t[1] + '-' + t[2] + '</span> | ';
    d += '<span style="color:#059669">Excellent: ' + t[2] + '-' + t[3] + '</span> | ';
    d += '<span style="color:#7c3aed">Superior: &gt;' + t[3] + '</span>';
    d += '</div>';

    d += '<div style="padding:12px;background:#fefce8;border-radius:8px;font-size:0.9rem">';
    d += '<strong>Longevity Significance</strong><br>';
    d += 'Research shows VO2 max is one of the strongest predictors of all-cause mortality. ';
    if (vo2 < t[1]) {
      d += 'Improving from your current level to "Good" (' + t[1] + '+) could <strong>reduce mortality risk by up to 50%</strong>. ';
      d += 'Focus on Zone 2 training (3-4 hours/week) plus 1-2 high-intensity interval sessions.';
    } else if (vo2 < t[2]) {
      d += 'You are in a good range. Aim for "Excellent" (' + t[2] + '+) with consistent Zone 2 training and weekly intervals.';
    } else {
      d += 'Your fitness level is associated with <strong>significantly reduced mortality risk</strong>. Maintain with consistent training.';
    }
    d += '</div>';

    document.getElementById('resultDetails').innerHTML = d;
    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  [ageEl, genderEl, testTypeEl].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('change', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

  testInputsDiv.addEventListener('input', calculate);

})();
