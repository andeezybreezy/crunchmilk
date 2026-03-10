(function() {
  'use strict';

  var annualExpenses = document.getElementById('annualExpenses');
  var currentSavings = document.getElementById('currentSavings');
  var annualSavings = document.getElementById('annualSavings');
  var expectedReturn = document.getElementById('expectedReturn');
  var withdrawalRate = document.getElementById('withdrawalRate');
  var currentAge = document.getElementById('currentAge');
  var retirementAge = document.getElementById('retirementAge');
  var calcBtn = document.getElementById('calcBtn');

  var fireNumberEl = document.getElementById('fireNumber');
  var yearsToFireEl = document.getElementById('yearsToFire');
  var fireDateEl = document.getElementById('fireDate');
  var savingsProgressEl = document.getElementById('savingsProgress');
  var coastFireEl = document.getElementById('coastFire');
  var coastStatusEl = document.getElementById('coastStatus');
  var progressBarWrap = document.getElementById('progressBarWrap');
  var progressBar = document.getElementById('progressBar');
  var progressLabel = document.getElementById('progressLabel');
  var resultDiv = document.getElementById('result');

  function fmt(n) {
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  function calculate() {
    var expenses = parseFloat(annualExpenses.value) || 0;
    var savings = parseFloat(currentSavings.value) || 0;
    var annSavings = parseFloat(annualSavings.value) || 0;
    var retRate = (parseFloat(expectedReturn.value) || 7) / 100;
    var wdRate = (parseFloat(withdrawalRate.value) || 4) / 100;
    var age = parseInt(currentAge.value, 10) || 30;
    var retAge = parseInt(retirementAge.value, 10) || 65;

    if (expenses <= 0) return;

    // FIRE number
    var fireNum = expenses / wdRate;
    fireNumberEl.textContent = fmt(fireNum);

    // Progress
    var progress = Math.min((savings / fireNum) * 100, 100);
    savingsProgressEl.textContent = progress.toFixed(1) + '%';

    // Progress bar
    progressBarWrap.style.display = 'block';
    progressBar.style.width = progress + '%';
    progressLabel.textContent = fmt(fireNum);

    // Years to FIRE (simulate year by year)
    var bal = savings;
    var years = 0;
    var maxYears = 100;

    if (bal >= fireNum) {
      years = 0;
    } else if (annSavings <= 0 && retRate <= 0) {
      years = -1; // Never
    } else {
      while (bal < fireNum && years < maxYears) {
        bal = bal * (1 + retRate) + annSavings;
        years++;
      }
      if (years >= maxYears) years = -1;
    }

    if (years === -1) {
      yearsToFireEl.textContent = 'N/A';
      fireDateEl.textContent = 'Not reachable';
    } else if (years === 0) {
      yearsToFireEl.textContent = '0';
      fireDateEl.textContent = 'Already FIRE!';
    } else {
      yearsToFireEl.textContent = years + ' years';
      var fireYear = new Date().getFullYear() + years;
      var fireAge = age + years;
      fireDateEl.textContent = fireYear + ' (age ' + fireAge + ')';
    }

    // Coast FIRE
    var yearsToRetirement = Math.max(retAge - age, 1);
    var coastFireNum = fireNum / Math.pow(1 + retRate, yearsToRetirement);
    coastFireEl.textContent = fmt(coastFireNum);

    if (savings >= coastFireNum) {
      coastStatusEl.textContent = 'Reached!';
      coastStatusEl.style.color = '#059669';
    } else {
      var deficit = coastFireNum - savings;
      coastStatusEl.textContent = fmt(deficit) + ' away';
      coastStatusEl.style.color = '#dc2626';
    }

    resultDiv.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  calculate();
})();
