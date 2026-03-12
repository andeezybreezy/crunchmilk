(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var dogAge = parseFloat(document.getElementById('dogAge').value) || 0;
    var size = document.getElementById('size').value;

    // Calculation logic
    var firstYear = 15; var secondYear = 9; var laterYears = {'Small (under 20 lbs)': 4, 'Medium (20-50 lbs)': 5, 'Large (50-90 lbs)': 6, 'Giant (90+ lbs)': 7}; var yearRate = laterYears[size] || 5; var humanAge = dogAge <= 1 ? dogAge * firstYear : dogAge <= 2 ? firstYear + (dogAge-1) * secondYear : firstYear + secondYear + (dogAge-2) * yearRate; var lifeStage = humanAge < 15 ? 'Puppy' : humanAge < 30 ? 'Young Adult' : humanAge < 55 ? 'Adult' : humanAge < 75 ? 'Senior' : 'Geriatric';     document.getElementById('humanAge').textContent = fmt(humanAge,0);
    document.getElementById('lifeStage').textContent = lifeStage;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['dogAge', 'size'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
