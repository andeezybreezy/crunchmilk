(function() {
  'use strict';

  var system = 'imperial';

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
  });
})();
