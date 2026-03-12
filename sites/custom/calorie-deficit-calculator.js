(function() {
  'use strict';

  var system = 'imperial';
  var lastCalc = null;

  document.querySelectorAll('[data-system]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('[data-system]').forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      system = btn.dataset.system;
      var label = system === 'imperial' ? 'lbs' : 'kg';
      document.getElementById('weightUnit').textContent = label;
      document.getElementById('weightUnit2').textContent = label;
    });
  });

  function updateWhatIf() {
    if (!lastCalc) return;
    var toggle = document.getElementById('whatIfToggle');
    if (!toggle.checked) return;

    var extraBurn = parseFloat(document.getElementById('wiExercise').value) || 0;
    var newTotalDeficit = lastCalc.dailyDeficit + extraBurn;
    var newWeeklyLoss = newTotalDeficit * 7 / 3500;
    var newWeeks = Math.ceil(lastCalc.weightToLoseLbs / newWeeklyLoss);
    var weeksSaved = lastCalc.weeks - newWeeks;

    document.getElementById('wiOriginal').textContent = lastCalc.weeks + ' weeks';
    document.getElementById('wiNew').textContent = newWeeks + ' weeks';
    document.getElementById('wiDelta').textContent = weeksSaved > 0 ? weeksSaved + ' weeks' : 'No change';
    document.getElementById('wiDelta').style.color = weeksSaved > 0 ? '#059669' : 'var(--text-mid)';
    document.getElementById('wiNewCals').textContent = lastCalc.dailyCal + ' cal/day (eat the same, burn ' + extraBurn + ' more)';
  }

  var wiToggle = document.getElementById('whatIfToggle');
  if (wiToggle) {
    wiToggle.addEventListener('change', function() {
      document.getElementById('whatIfControls').style.display = this.checked ? 'block' : 'none';
      if (this.checked) updateWhatIf();
    });
  }
  var wiExercise = document.getElementById('wiExercise');
  if (wiExercise) {
    wiExercise.addEventListener('input', function() {
      document.getElementById('wiExerciseVal').textContent = this.value;
      updateWhatIf();
    });
  }

  document.getElementById('calcBtn').addEventListener('click', function() {
    var currentWeight = parseFloat(document.getElementById('currentWeight').value);
    var goalWeight = parseFloat(document.getElementById('goalWeight').value);
    var tdee = parseFloat(document.getElementById('tdeeInput').value);
    var lossRateLbs = parseFloat(document.getElementById('lossRate').value);

    if (!currentWeight || !goalWeight || !tdee) {
      alert('Please fill in all fields.');
      return;
    }

    var weightToLoseLbs;
    if (system === 'imperial') {
      weightToLoseLbs = currentWeight - goalWeight;
    } else {
      weightToLoseLbs = (currentWeight - goalWeight) * 2.20462;
    }

    if (weightToLoseLbs <= 0) {
      alert('Goal weight must be less than current weight.');
      return;
    }

    var dailyDeficit = Math.round(lossRateLbs * 3500 / 7);
    var dailyCal = Math.round(tdee - dailyDeficit);
    var weeks = Math.ceil(weightToLoseLbs / lossRateLbs);

    var targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + weeks * 7);
    var options = { year: 'numeric', month: 'long', day: 'numeric' };

    var tip = '';
    if (dailyCal < 1200) {
      tip = '\u26a0\ufe0f This calorie target is below 1,200. Consider a slower loss rate for safety.';
    }

    document.getElementById('dailyCal').textContent = dailyCal.toLocaleString() + ' cal/day';
    document.getElementById('deficitVal').textContent = dailyDeficit.toLocaleString() + ' cal/day';
    document.getElementById('weeksVal').textContent = weeks + ' weeks (' + Math.round(weeks / 4.3) + ' months)';
    document.getElementById('dateVal').textContent = targetDate.toLocaleDateString('en-US', options);
    document.getElementById('resultTip').textContent = tip;
    document.getElementById('result').style.display = '';

    lastCalc = { dailyDeficit: dailyDeficit, dailyCal: dailyCal, weeks: weeks, weightToLoseLbs: weightToLoseLbs };
    document.getElementById('whatIfSection').style.display = 'block';
    updateWhatIf();
  });
})();
