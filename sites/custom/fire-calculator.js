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

  var lastCalc = null;

  function fmt(n) {
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  function calcYearsToFire(savings, annSavings, retRate, fireNum) {
    var bal = savings;
    var years = 0;
    var maxYears = 100;
    if (bal >= fireNum) return 0;
    if (annSavings <= 0 && retRate <= 0) return -1;
    while (bal < fireNum && years < maxYears) {
      bal = bal * (1 + retRate) + annSavings;
      years++;
    }
    return years >= maxYears ? -1 : years;
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

    var fireNum = expenses / wdRate;
    fireNumberEl.textContent = fmt(fireNum);

    var progress = Math.min((savings / fireNum) * 100, 100);
    savingsProgressEl.textContent = progress.toFixed(1) + '%';

    progressBarWrap.style.display = 'block';
    progressBar.style.width = progress + '%';
    progressLabel.textContent = fmt(fireNum);

    var years = calcYearsToFire(savings, annSavings, retRate, fireNum);

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

    lastCalc = { savings: savings, annSavings: annSavings, retRate: retRate, fireNum: fireNum, years: years };
    document.getElementById('whatIfSection').style.display = 'block';
    updateWhatIf();
  }

  function updateWhatIf() {
    if (!lastCalc) return;
    var toggle = document.getElementById('whatIfToggle');
    if (!toggle.checked) return;

    var extraSavings = parseFloat(document.getElementById('wiSavings').value) || 0;
    var extraYears = parseFloat(document.getElementById('wiYears').value) || 0;

    var newYears = calcYearsToFire(lastCalc.savings, lastCalc.annSavings + extraSavings, lastCalc.retRate, lastCalc.fireNum);

    var origLabel = lastCalc.years === -1 ? 'N/A' : lastCalc.years + ' years';
    var newLabel = newYears === -1 ? 'N/A' : newYears + ' years';
    var yearsSaved = (lastCalc.years !== -1 && newYears !== -1) ? (lastCalc.years - newYears) : 0;

    document.getElementById('wiOriginal').textContent = origLabel;
    document.getElementById('wiNew').textContent = newLabel;
    document.getElementById('wiDelta').textContent = yearsSaved > 0 ? yearsSaved + ' years' : (yearsSaved === 0 ? 'No change' : Math.abs(yearsSaved) + ' years more');
    document.getElementById('wiDelta').style.color = yearsSaved > 0 ? '#059669' : (yearsSaved === 0 ? 'var(--text-mid)' : '#dc2626');
  }

  var wiToggle = document.getElementById('whatIfToggle');
  if (wiToggle) {
    wiToggle.addEventListener('change', function() {
      document.getElementById('whatIfControls').style.display = this.checked ? 'block' : 'none';
      if (this.checked) updateWhatIf();
    });
  }
  var wiSavings = document.getElementById('wiSavings');
  var wiYears = document.getElementById('wiYears');
  if (wiSavings) {
    wiSavings.addEventListener('input', function() {
      document.getElementById('wiSavingsVal').textContent = parseInt(this.value).toLocaleString();
      updateWhatIf();
    });
  }
  if (wiYears) {
    wiYears.addEventListener('input', function() {
      document.getElementById('wiYearsVal').textContent = this.value;
      updateWhatIf();
    });
  }

  calcBtn.addEventListener('click', calculate);
  calculate();
})();
