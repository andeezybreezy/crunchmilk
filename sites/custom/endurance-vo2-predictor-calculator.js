(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var raceDistance = document.getElementById('raceDistance').value;
    var minutes = parseFloat(document.getElementById('minutes').value) || 0;
    var seconds = parseFloat(document.getElementById('seconds').value) || 0;
    var age = parseFloat(document.getElementById('age').value) || 0;
    var gender = document.getElementById('gender').value;

    // Calculation logic
    var totalSec = minutes * 60 + seconds; var distMeters = {'1mile':1609,'5k':5000,'10k':10000,'half':21097,'full':42195}; var dist = distMeters[raceDistance] || 5000; var speed = dist / totalSec; var pctVO2 = 0.8 + 0.1894393 * Math.exp(-0.012778 * totalSec / 60) + 0.2989558 * Math.exp(-0.1932605 * totalSec / 60); var vo2cost = -4.6 + 0.182258 * (speed * 60) + 0.000104 * Math.pow(speed * 60, 2); var vo2 = vo2cost / pctVO2; vo2 = Math.max(15, Math.min(90, Math.round(vo2 * 10) / 10)); var ratingText = ''; if (gender === 'male') { if (vo2 >= 60) ratingText = 'Superior (elite athlete)'; else if (vo2 >= 50) ratingText = 'Excellent'; else if (vo2 >= 43) ratingText = 'Good'; else if (vo2 >= 36) ratingText = 'Average'; else ratingText = 'Below Average'; } else { if (vo2 >= 50) ratingText = 'Superior (elite athlete)'; else if (vo2 >= 42) ratingText = 'Excellent'; else if (vo2 >= 36) ratingText = 'Good'; else if (vo2 >= 30) ratingText = 'Average'; else ratingText = 'Below Average'; } var avgVO2 = gender === 'male' ? (age < 30 ? 44 : age < 40 ? 42 : age < 50 ? 39 : age < 60 ? 35 : 30) : (age < 30 ? 36 : age < 40 ? 34 : age < 50 ? 31 : age < 60 ? 28 : 24); var pctile = 50 + Math.round((vo2 - avgVO2) * 3); pctile = Math.max(1, Math.min(99, pctile)); var milePace = (totalSec / (dist / 1609.34)) / 60; var paceMin = Math.floor(milePace); var paceSec = Math.round((milePace - paceMin) * 60); document.getElementById('vo2max').textContent = fmt(vo2, 1); document.getElementById('rating').textContent = ratingText; document.getElementById('percentile').textContent = pctile + 'th percentile'; document.getElementById('pace').textContent = paceMin + ':' + (paceSec < 10 ? '0' : '') + paceSec + ' /mi';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['raceDistance', 'minutes', 'seconds', 'age', 'gender'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
