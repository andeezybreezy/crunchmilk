(function() {
  'use strict';

  var homeValHr = document.getElementById('homeValHr');
  var roofRating = document.getElementById('roofRating');
  var windowType = document.getElementById('windowType');
  var backupPower = document.getElementById('backupPower');
  var floodPrep = document.getElementById('floodPrep');
  var firePrep = document.getElementById('firePrep');
  var insurancePrem = document.getElementById('insurancePrem');
  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  var upgrades = {
    roofRating: { name: 'Impact-rated roof upgrade', cost: [12000, 22000], savingsPct: 0.12 },
    windowType: { name: 'Impact windows / storm shutters', cost: [8000, 25000], savingsPct: 0.15 },
    backupPower: { name: 'Whole-home standby generator', cost: [8000, 15000], savingsPct: 0.05 },
    floodPrep: { name: 'Sump pump + backflow valves', cost: [1500, 5000], savingsPct: 0.08 },
    firePrep: { name: 'Defensible space + fire-resistant materials', cost: [3000, 8000], savingsPct: 0.10 }
  };

  function calculate() {
    var homeValue = parseFloat(homeValHr.value);
    var roof = parseInt(roofRating.value, 10);
    var windows = parseInt(windowType.value, 10);
    var power = parseInt(backupPower.value, 10);
    var flood = parseInt(floodPrep.value, 10);
    var fire = parseInt(firePrep.value, 10);
    var premium = parseFloat(insurancePrem.value);

    if (isNaN(homeValue) || homeValue <= 0 || isNaN(premium)) return;

    // Composite score: each category 1-4, normalized to 0-100
    var scores = { roofRating: roof, windowType: windows, backupPower: power, floodPrep: flood, firePrep: fire };
    var totalPoints = roof + windows + power + flood + fire;
    var maxPoints = 20;
    var score = Math.round((totalPoints / maxPoints) * 100);

    var grade, gradeColor;
    if (score >= 90) { grade = 'A+'; gradeColor = '#16a34a'; }
    else if (score >= 80) { grade = 'A'; gradeColor = '#16a34a'; }
    else if (score >= 70) { grade = 'B+'; gradeColor = '#65a30d'; }
    else if (score >= 60) { grade = 'B'; gradeColor = '#ca8a04'; }
    else if (score >= 50) { grade = 'C'; gradeColor = '#ea580c'; }
    else if (score >= 35) { grade = 'D'; gradeColor = '#dc2626'; }
    else { grade = 'F'; gradeColor = '#991b1b'; }

    // Find lowest scoring category for recommendation
    var lowestKey = null;
    var lowestVal = 5;
    for (var key in scores) {
      if (scores[key] < lowestVal) {
        lowestVal = scores[key];
        lowestKey = key;
      }
    }

    var upgrade = upgrades[lowestKey];
    var avgCost = Math.round((upgrade.cost[0] + upgrade.cost[1]) / 2);
    var annualSavings = Math.round(premium * upgrade.savingsPct);
    var payback = annualSavings > 0 ? (avgCost / annualSavings).toFixed(1) : 'N/A';

    document.getElementById('rScore').textContent = score + ' / 100';
    document.getElementById('rScore').style.color = gradeColor;
    document.getElementById('rGrade').textContent = grade;
    document.getElementById('rGrade').style.color = gradeColor;
    document.getElementById('rUpgrade').textContent = upgrade.name;
    document.getElementById('rUpgradeCost').textContent = '$' + upgrade.cost[0].toLocaleString() + ' – $' + upgrade.cost[1].toLocaleString();
    document.getElementById('rSavings').textContent = annualSavings > 0 ? '$' + annualSavings.toLocaleString() + '/yr' : 'Varies';
    document.getElementById('rPayback').textContent = payback !== 'N/A' ? payback + ' years' : 'N/A';

    var weakAreas = [];
    if (roof <= 2) weakAreas.push('roof');
    if (windows <= 2) weakAreas.push('windows');
    if (power <= 2) weakAreas.push('backup power');
    if (flood <= 2) weakAreas.push('flood prep');
    if (fire <= 2) weakAreas.push('fire prep');

    document.getElementById('resultTip').textContent = weakAreas.length > 0
      ? 'Areas to improve: ' + weakAreas.join(', ') + '. Upgrading all weak areas could save $' + Math.round(premium * 0.25).toLocaleString() + '-$' + Math.round(premium * 0.45).toLocaleString() + '/yr on insurance.'
      : 'Excellent resilience! Your home is well-prepared for natural disasters.';

    result.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  [homeValHr, roofRating, windowType, backupPower, floodPrep, firePrep, insurancePrem].forEach(function(el) {
    el.addEventListener('change', calculate);
    el.addEventListener('input', calculate);
  });

  calculate();
})();
