(function() {
  'use strict';

  // Baseline life expectancy (CDC 2023 data)
  var baseline = { male: 76.4, female: 81.2 };

  // Adjustment factors (years added/subtracted)
  var exerciseAdj = function(min) {
    if (min >= 300) return 4.0;
    if (min >= 150) return 3.5;
    if (min >= 75) return 2.0;
    if (min >= 30) return 0.5;
    return -2.0;
  };

  var bmiAdj = function(bmi) {
    if (bmi >= 18.5 && bmi < 25) return 1.5;
    if (bmi >= 25 && bmi < 27) return 0.5;
    if (bmi >= 27 && bmi < 30) return -0.5;
    if (bmi >= 30 && bmi < 35) return -2.5;
    if (bmi >= 35 && bmi < 40) return -4.0;
    if (bmi >= 40) return -5.5;
    if (bmi < 18.5) return -1.5;
    return 0;
  };

  var dietAdj = { poor: -2, average: 0, good: 2, excellent: 3 };
  var sleepAdj = function(hrs) {
    if (hrs >= 7 && hrs <= 8) return 1;
    if (hrs >= 6 && hrs < 7) return 0;
    if (hrs > 8 && hrs <= 9) return 0;
    if (hrs < 6) return -2;
    return -1.5; // >9
  };
  var stressAdj = { low: 1, moderate: 0, high: -1.5, chronic: -3 };
  var smokingAdj = { never: 0, former: -3, current: -10 };
  var alcoholAdj = { none: 0, light: 0.5, moderate: -0.5, heavy: -3 };
  var socialAdj = { isolated: -2, some: 0, strong: 2.5 };

  // Score components (0-100 scale)
  var exerciseScore = function(min) {
    if (min >= 300) return 15;
    if (min >= 150) return 13;
    if (min >= 75) return 8;
    if (min >= 30) return 4;
    return 0;
  };

  var chartData = [
    ['Exercise','+3.5 yrs','+0 yrs','-2 yrs','5.5 yrs'],
    ['BMI','+1.5 yrs','+0 yrs','-4 yrs','5.5 yrs'],
    ['Diet','+3 yrs','+0 yrs','-2 yrs','5 yrs'],
    ['Sleep','+1 yr','+0 yrs','-2 yrs','3 yrs'],
    ['Smoking','+0 yrs','-3 yrs (former)','-10 yrs','10 yrs'],
    ['Alcohol','+0 yrs','-0.5 yrs','-3 yrs','3 yrs'],
    ['Stress','+1 yr','+0 yrs','-3 yrs','4 yrs'],
    ['Social Ties','+2.5 yrs','+0 yrs','-2 yrs','4.5 yrs']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function calculate() {
    var age = parseInt(document.getElementById('currentAge').value, 10);
    var sex = document.getElementById('bioSex').value;
    var exerciseMin = parseInt(document.getElementById('exerciseMin').value, 10) || 0;
    var bmi = parseFloat(document.getElementById('bmi').value) || 0;
    var diet = document.getElementById('dietQuality').value;
    var sleep = parseFloat(document.getElementById('sleepHours').value) || 0;
    var stress = document.getElementById('stressLevel').value;
    var smoking = document.getElementById('smoking').value;
    var alcohol = document.getElementById('alcohol').value;
    var social = document.getElementById('socialConnect').value;

    if (isNaN(age) || age < 1 || age > 120) return;

    var base = baseline[sex];
    var totalAdj = 0;

    totalAdj += exerciseAdj(exerciseMin);
    if (bmi > 0) totalAdj += bmiAdj(bmi);
    totalAdj += dietAdj[diet];
    if (sleep > 0) totalAdj += sleepAdj(sleep);
    totalAdj += stressAdj[stress];
    totalAdj += smokingAdj[smoking];
    totalAdj += alcoholAdj[alcohol];
    totalAdj += socialAdj[social];

    var lifeExp = Math.round((base + totalAdj) * 10) / 10;
    if (lifeExp < age + 1) lifeExp = age + 1;

    // Calculate score (0-100)
    var score = 50; // baseline
    score += exerciseScore(exerciseMin);
    if (bmi >= 18.5 && bmi < 25) score += 12;
    else if (bmi >= 25 && bmi < 30) score += 5;
    else if (bmi >= 30) score -= 5;
    if (diet === 'excellent') score += 12;
    else if (diet === 'good') score += 8;
    else if (diet === 'poor') score -= 5;
    if (sleep >= 7 && sleep <= 8) score += 8;
    else if (sleep >= 6) score += 3;
    else score -= 5;
    if (stress === 'low') score += 6;
    else if (stress === 'high') score -= 4;
    else if (stress === 'chronic') score -= 8;
    if (smoking === 'never') score += 8;
    else if (smoking === 'current') score -= 15;
    else score -= 5;
    if (alcohol === 'none' || alcohol === 'light') score += 4;
    else if (alcohol === 'heavy') score -= 6;
    if (social === 'strong') score += 6;
    else if (social === 'isolated') score -= 5;

    score = Math.max(5, Math.min(100, score));

    var avgLE = baseline[sex];
    var diffYears = lifeExp - avgLE;
    var diffStr = diffYears >= 0 ? '+' + diffYears.toFixed(1) + ' years' : diffYears.toFixed(1) + ' years';

    // Find top improvement area
    var improvements = [];
    if (exerciseMin < 150) improvements.push({area:'Exercise', gain: 'Add moderate exercise to reach 150 min/week'});
    if (bmi >= 30) improvements.push({area:'Weight', gain: 'Reaching healthy BMI (18.5-24.9) could add 3-5 years'});
    if (diet === 'poor' || diet === 'average') improvements.push({area:'Diet', gain: 'Shifting to whole foods/Mediterranean diet could add 2-3 years'});
    if (sleep < 7 || sleep > 8) improvements.push({area:'Sleep', gain: 'Optimizing to 7-8 hours could add 1-2 years'});
    if (smoking === 'current') improvements.push({area:'Smoking', gain: 'Quitting smoking could add up to 10 years'});
    if (stress === 'high' || stress === 'chronic') improvements.push({area:'Stress', gain: 'Stress management could add 1-3 years'});
    if (alcohol === 'heavy') improvements.push({area:'Alcohol', gain: 'Reducing alcohol could add 2-3 years'});
    if (social === 'isolated') improvements.push({area:'Social', gain: 'Building social connections could add 2+ years'});

    var topImprov = improvements.length > 0 ? improvements[0].area + ': ' + improvements[0].gain : 'Excellent — maintain current habits!';

    document.getElementById('longevityScore').textContent = score + ' / 100';
    document.getElementById('lifeExpectancy').textContent = lifeExp.toFixed(1) + ' years';
    document.getElementById('vsAverage').textContent = diffStr + ' vs. avg (' + avgLE + ')';
    document.getElementById('vsAverage').style.color = diffYears >= 0 ? '#16a34a' : '#dc2626';
    document.getElementById('topImprovement').textContent = topImprov;

    var tip = 'Score of ' + score + '/100. Estimated life expectancy: ' + lifeExp.toFixed(1) + ' years. ';
    tip += 'This is a statistical estimate, not a medical prediction. Genetics, healthcare access, and other factors also play major roles.';
    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
})();
