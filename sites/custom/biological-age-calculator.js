(function() {
  'use strict';

  function fmt(n, d) {
    return n.toFixed(typeof d === 'undefined' ? 1 : d);
  }

  var chronAgeEl = document.getElementById('chronAge');
  var restingHREl = document.getElementById('restingHR');
  var systolicBPEl = document.getElementById('systolicBP');
  var waistEl = document.getElementById('waist');
  var exerciseEl = document.getElementById('exercise');
  var sleepEl = document.getElementById('sleep');
  var smokingEl = document.getElementById('smoking');
  var alcoholEl = document.getElementById('alcohol');
  var stressEl = document.getElementById('stress');
  var dietEl = document.getElementById('diet');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var chartData = [
    ['Exercise', '-5 years', '0', '+4 years'],
    ['Smoking', '0 (never)', '+2 (former)', '+8 (current)'],
    ['Sleep', '-2 years (7-8 hrs)', '0', '+3 years (<5 hrs)'],
    ['Diet Quality', '-3 years', '0', '+3 years'],
    ['Stress Level', '-1 year (low)', '+1 year', '+4 years (chronic)'],
    ['Blood Pressure', '-2 years (<120)', '0', '+4 years (>140)']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function getVal(el) { var v = parseFloat(el.value); return isNaN(v) ? 0 : v; }

  function calculate() {
    var age = getVal(chronAgeEl);
    if (age <= 0) return;

    var factors = [];
    var delta = 0;

    // Resting heart rate
    var hr = getVal(restingHREl);
    if (hr > 0) {
      var hrDelta = 0;
      if (hr < 55) { hrDelta = -2.5; }
      else if (hr < 60) { hrDelta = -1.5; }
      else if (hr < 70) { hrDelta = 0; }
      else if (hr < 80) { hrDelta = 1.5; }
      else if (hr < 90) { hrDelta = 3; }
      else { hrDelta = 4.5; }
      delta += hrDelta;
      factors.push({ name: 'Resting Heart Rate', value: hr + ' bpm', delta: hrDelta, tip: hr > 75 ? 'Aim for <70 bpm through regular cardio exercise' : hr < 60 ? 'Excellent cardiovascular fitness' : 'Within normal range' });
    }

    // Blood pressure
    var bp = getVal(systolicBPEl);
    if (bp > 0) {
      var bpDelta = 0;
      if (bp < 110) { bpDelta = -2; }
      else if (bp < 120) { bpDelta = -1; }
      else if (bp < 130) { bpDelta = 0.5; }
      else if (bp < 140) { bpDelta = 2; }
      else if (bp < 160) { bpDelta = 4; }
      else { bpDelta = 6; }
      delta += bpDelta;
      factors.push({ name: 'Blood Pressure', value: bp + ' mmHg systolic', delta: bpDelta, tip: bp >= 130 ? 'Reduce sodium, increase exercise, manage stress' : 'Blood pressure is well-controlled' });
    }

    // Waist circumference
    var waist = getVal(waistEl);
    if (waist > 0) {
      var waistDelta = 0;
      if (waist < 32) { waistDelta = -1.5; }
      else if (waist < 35) { waistDelta = 0; }
      else if (waist < 38) { waistDelta = 1; }
      else if (waist < 42) { waistDelta = 2.5; }
      else { waistDelta = 4; }
      delta += waistDelta;
      factors.push({ name: 'Waist Circumference', value: waist + '"', delta: waistDelta, tip: waist >= 37 ? 'Visceral fat accelerates aging — focus on reducing through diet and exercise' : 'Healthy waist measurement' });
    }

    // Exercise
    var exercise = parseInt(exerciseEl.value);
    var exDelta = 0;
    var exLabels = ['Sedentary', 'Light', 'Moderate', 'Active', 'Very Active'];
    if (exercise === 0) { exDelta = 4; }
    else if (exercise === 1) { exDelta = 1; }
    else if (exercise === 2) { exDelta = -2; }
    else if (exercise === 3) { exDelta = -4; }
    else { exDelta = -5; }
    delta += exDelta;
    factors.push({ name: 'Exercise', value: exLabels[exercise], delta: exDelta, tip: exercise < 2 ? 'Exercise is the #1 anti-aging intervention — aim for 150 min/week moderate activity' : 'Excellent exercise habits' });

    // Sleep
    var sleep = getVal(sleepEl);
    if (sleep > 0) {
      var slDelta = 0;
      if (sleep >= 7 && sleep <= 8) { slDelta = -2; }
      else if (sleep >= 6.5 && sleep < 7) { slDelta = 0; }
      else if (sleep >= 8 && sleep <= 8.5) { slDelta = 0; }
      else if (sleep >= 6 && sleep < 6.5) { slDelta = 1; }
      else if (sleep < 6) { slDelta = 3; }
      else { slDelta = 1.5; }
      delta += slDelta;
      factors.push({ name: 'Sleep', value: sleep + ' hrs/night', delta: slDelta, tip: (sleep < 7 || sleep > 8.5) ? 'Aim for 7-8 hours. Consistency matters more than duration.' : 'Optimal sleep duration' });
    }

    // Smoking
    var smoking = smokingEl.value;
    var smDelta = 0;
    if (smoking === 'never') { smDelta = 0; }
    else if (smoking === 'former') { smDelta = 2; }
    else if (smoking === 'light') { smDelta = 5; }
    else { smDelta = 8; }
    delta += smDelta;
    if (smoking !== 'never') {
      factors.push({ name: 'Smoking', value: smoking === 'former' ? 'Former smoker' : smoking === 'light' ? 'Light smoker' : 'Heavy smoker', delta: smDelta, tip: smoking !== 'former' ? 'Quitting smoking is the single best thing you can do for longevity' : 'Good that you quit — risk continues to decrease over time' });
    }

    // Alcohol
    var alcohol = alcoholEl.value;
    var alDelta = 0;
    if (alcohol === 'none') { alDelta = 0; }
    else if (alcohol === 'light') { alDelta = 0; }
    else if (alcohol === 'moderate') { alDelta = 1; }
    else { alDelta = 3.5; }
    delta += alDelta;
    if (alDelta > 0) {
      factors.push({ name: 'Alcohol', value: alcohol === 'moderate' ? '4-7 drinks/week' : '8+ drinks/week', delta: alDelta, tip: 'Recent research shows no amount of alcohol is beneficial. Reducing intake improves health markers.' });
    }

    // Stress
    var stress = stressEl.value;
    var stDelta = 0;
    if (stress === 'low') { stDelta = -1; }
    else if (stress === 'moderate') { stDelta = 1; }
    else if (stress === 'high') { stDelta = 2.5; }
    else { stDelta = 4; }
    delta += stDelta;
    factors.push({ name: 'Stress Level', value: stress.charAt(0).toUpperCase() + stress.slice(1), delta: stDelta, tip: stDelta > 1 ? 'Chronic stress accelerates aging — consider meditation, therapy, or lifestyle changes' : 'Good stress management' });

    // Diet
    var diet = dietEl.value;
    var diDelta = 0;
    if (diet === 'excellent') { diDelta = -3; }
    else if (diet === 'good') { diDelta = -1; }
    else if (diet === 'average') { diDelta = 1; }
    else { diDelta = 3; }
    delta += diDelta;
    factors.push({ name: 'Diet Quality', value: diet.charAt(0).toUpperCase() + diet.slice(1), delta: diDelta, tip: diDelta > 0 ? 'Focus on whole foods, vegetables, lean protein, and healthy fats' : 'Great dietary habits' });

    var bioAge = Math.round(age + delta);
    var displayDelta = bioAge - age;

    document.getElementById('rBioAge').textContent = bioAge + ' years';
    document.getElementById('rBioAge').style.color = displayDelta <= -3 ? '#059669' : displayDelta >= 3 ? '#dc2626' : '#f59e0b';

    var deltaText = displayDelta === 0 ? 'Same as chronological' : (displayDelta > 0 ? '+' + displayDelta + ' years older' : displayDelta + ' years younger');
    document.getElementById('rDelta').textContent = deltaText;
    document.getElementById('rDelta').style.color = displayDelta <= 0 ? '#059669' : '#dc2626';

    var d = '';

    // Visual gauge
    var gaugeMin = age - 15;
    var gaugeMax = age + 15;
    var gaugePos = Math.max(0, Math.min(100, ((bioAge - gaugeMin) / (gaugeMax - gaugeMin)) * 100));
    d += '<div style="margin-bottom:20px">';
    d += '<div style="display:flex;justify-content:space-between;font-size:0.75rem;color:var(--text-light)">';
    d += '<span>' + (age - 10) + ' (younger)</span><span>Age ' + age + '</span><span>' + (age + 10) + ' (older)</span>';
    d += '</div>';
    d += '<div style="width:100%;height:20px;background:linear-gradient(to right, #059669, #f59e0b, #dc2626);border-radius:10px;position:relative;margin-top:4px">';
    d += '<div style="position:absolute;left:' + gaugePos + '%;top:-4px;transform:translateX(-50%);width:12px;height:28px;background:#1f2937;border-radius:6px;border:2px solid white"></div>';
    d += '</div></div>';

    // Factor breakdown
    d += '<div style="margin-bottom:12px"><strong>Factor Breakdown</strong></div>';
    // Sort by absolute impact (most impactful first)
    factors.sort(function(a, b) { return Math.abs(b.delta) - Math.abs(a.delta); });

    factors.forEach(function(f) {
      var bg = f.delta <= -1 ? '#f0fdf4' : f.delta >= 1 ? '#fef2f2' : '#f9fafb';
      var sign = f.delta > 0 ? '+' : '';
      var dColor = f.delta <= -1 ? '#059669' : f.delta >= 1 ? '#dc2626' : '#6b7280';
      d += '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:' + bg + ';border-radius:6px;margin-bottom:4px;font-size:0.9rem">';
      d += '<div><strong>' + f.name + '</strong>: ' + f.value + '</div>';
      d += '<div style="color:' + dColor + ';font-weight:bold;min-width:70px;text-align:right">' + sign + fmt(f.delta) + ' yrs</div>';
      d += '</div>';
    });

    // Top 3 improvement areas
    var improvable = factors.filter(function(f) { return f.delta > 0; }).slice(0, 2);
    if (improvable.length > 0) {
      d += '<div style="padding:14px;background:#f0fdf4;border-radius:8px;margin-top:16px;border-left:4px solid #059669">';
      d += '<strong style="color:#059669">Top Improvement Areas</strong>';
      d += '<ol style="margin:8px 0 0 0;padding-left:20px;font-size:0.9rem;line-height:1.7">';
      improvable.forEach(function(f) {
        d += '<li><strong>' + f.name + '</strong> (+' + fmt(f.delta) + ' yrs): ' + f.tip + '</li>';
      });
      d += '</ol></div>';
    } else {
      d += '<div style="padding:14px;background:#f0fdf4;border-radius:8px;margin-top:16px;border-left:4px solid #059669">';
      d += '<strong style="color:#059669">Excellent! Your lifestyle factors are all positive or neutral.</strong>';
      d += '</div>';
    }

    d += '<div style="padding:12px;background:#f9fafb;border-radius:8px;font-size:0.8rem;margin-top:12px">';
    d += '<strong>Note:</strong> This is an estimate based on population-level research correlations, not a clinical measurement. For a precise biological age, consider an epigenetic age test (DNA methylation analysis) from providers like TruDiagnostic or Elysium.';
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

  [chronAgeEl, restingHREl, systolicBPEl, waistEl, sleepEl].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

})();
