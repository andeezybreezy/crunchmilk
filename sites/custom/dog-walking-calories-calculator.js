(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var yourWeight = parseFloat(document.getElementById('yourWeight').value) || 0;
    var minutes = parseFloat(document.getElementById('minutes').value) || 0;
    var pace = document.getElementById('pace').value;

    // Calculation logic
    var mets = {'Slow (2 mph)': 2.5, 'Moderate (3 mph)': 3.5, 'Brisk (4 mph)': 4.5, 'Jogging (5 mph)': 7}; var met = mets[pace] || 3.5; var calories = met * 3.5 * (yourWeight * 0.453592) / 200 * minutes; var weeklyCalories = calories * 7; var speeds = {'Slow (2 mph)': 2, 'Moderate (3 mph)': 3, 'Brisk (4 mph)': 4, 'Jogging (5 mph)': 5}; var monthlyMiles = (speeds[pace] || 3) * (minutes/60) * 30;     document.getElementById('calories').textContent = fmt(calories,0);
    document.getElementById('weeklyCalories').textContent = fmt(weeklyCalories,0);
    document.getElementById('monthlyMiles').textContent = fmt(monthlyMiles,0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['yourWeight', 'minutes', 'pace'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
