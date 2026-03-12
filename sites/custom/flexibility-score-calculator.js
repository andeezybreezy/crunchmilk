(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var reachCm = parseFloat(document.getElementById('reachCm').value) || 0;
    var age = parseFloat(document.getElementById('age').value) || 0;
    var gender = document.getElementById('gender').value;

    // Calculation logic
    var inches = Math.round(reachCm / 2.54 * 10) / 10; var avg = gender === 'male' ? (age < 30 ? 25 : age < 40 ? 23 : age < 50 ? 20 : age < 60 ? 18 : 15) : (age < 30 ? 29 : age < 40 ? 27 : age < 50 ? 24 : age < 60 ? 22 : 19); var diff = reachCm - avg; var rating = ''; var pctile = 50; if (diff >= 10) { rating = 'Excellent'; pctile = 90; } else if (diff >= 5) { rating = 'Above Average'; pctile = 75; } else if (diff >= -2) { rating = 'Average'; pctile = 50; } else if (diff >= -8) { rating = 'Below Average'; pctile = 25; } else { rating = 'Poor'; pctile = 10; } var rec = pctile < 30 ? 'Stretch hamstrings and lower back daily — hold each stretch 30+ seconds' : pctile < 60 ? 'Good baseline — add yoga or dynamic stretching 3x per week' : 'Great flexibility — maintain with regular stretching'; document.getElementById('reachIn').textContent = fmt(inches, 1) + ' in (' + fmt(reachCm, 1) + ' cm)'; document.getElementById('rating').textContent = rating; document.getElementById('percentile').textContent = 'Approx. ' + pctile + 'th percentile'; document.getElementById('recommendation').textContent = rec;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['reachCm', 'age', 'gender'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
