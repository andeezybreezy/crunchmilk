(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var age = parseFloat(document.getElementById('age').value) || 0;
    var activity = document.getElementById('activity').value;
    var goal = document.getElementById('goal').value;

    // Calculation logic
    var targets = {'General Health': 8000, 'Weight Loss': 10000, 'Heart Health': 9000, 'Longevity': 7500}; var base = targets[goal] || 8000; var ageMod = age > 65 ? -1500 : age > 50 ? -500 : 0; var targetSteps = base + ageMod; var miles = targetSteps / 2100; var calories = targetSteps * 0.04; return {targetSteps: fmt(targetSteps,0), miles: fmt(miles,1), calories: fmt(calories,0)};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['age', 'activity', 'goal'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
