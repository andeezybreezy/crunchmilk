(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var distance = document.getElementById('distance').value;
    var time = parseFloat(document.getElementById('time').value) || 0;
    var gender = document.getElementById('gender').value;

    // Calculation logic
    var distMap = {'40':36.576, '100':100, '200':200, '60':54.864}; var meters = distMap[distance] || 100; var mps = meters / time; var kph = mps * 3.6; var mph = mps * 2.237; var rating = ''; if (distance === '40') { if (gender === 'male') { if (time <= 4.3) rating = 'Elite (NFL caliber)'; else if (time <= 4.5) rating = 'Excellent (college athlete)'; else if (time <= 4.8) rating = 'Very Good (athletic)'; else if (time <= 5.2) rating = 'Average (recreational)'; else rating = 'Below Average'; } else { if (time <= 4.8) rating = 'Elite'; else if (time <= 5.1) rating = 'Excellent'; else if (time <= 5.5) rating = 'Very Good'; else if (time <= 6.0) rating = 'Average'; else rating = 'Below Average'; } } else if (distance === '100') { if (gender === 'male') { if (time <= 10.5) rating = 'Elite (Olympic level)'; else if (time <= 11.5) rating = 'Excellent (college athlete)'; else if (time <= 12.5) rating = 'Good (athletic)'; else if (time <= 14.0) rating = 'Average'; else rating = 'Below Average'; } else { if (time <= 11.5) rating = 'Elite'; else if (time <= 12.5) rating = 'Excellent'; else if (time <= 13.5) rating = 'Good'; else if (time <= 15.0) rating = 'Average'; else rating = 'Below Average'; } } else { rating = mph > 18 ? 'Excellent' : mph > 14 ? 'Good' : mph > 10 ? 'Average' : 'Below Average'; } document.getElementById('mph').textContent = fmt(mph, 1) + ' mph'; document.getElementById('kph').textContent = fmt(kph, 1) + ' km/h'; document.getElementById('mps').textContent = fmt(mps, 2) + ' m/s'; document.getElementById('rating').textContent = rating;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['distance', 'time', 'gender'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
