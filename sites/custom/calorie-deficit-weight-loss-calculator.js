(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var weight = parseFloat(document.getElementById('weight').value) || 0;
    var activity = document.getElementById('activity').value;
    var goalLbs = parseFloat(document.getElementById('goalLbs').value) || 0;

    // Calculation logic
    var mult = {'Sedentary': 13, 'Lightly Active': 14.5, 'Moderately Active': 16, 'Very Active': 18}; var tdee = weight * (mult[activity] || 14.5); var deficitCal = goalLbs * 500; var target = Math.max(tdee - deficitCal, 1200); var weeks = 20 / goalLbs;     document.getElementById('tdee').textContent = fmt(tdee,0);
    document.getElementById('target').textContent = fmt(target,0);
    document.getElementById('weeks').textContent = fmt(weeks,0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['weight', 'activity', 'goalLbs'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
