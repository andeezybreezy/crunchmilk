(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var standingReach = parseFloat(document.getElementById('standingReach').value) || 0;
    var jumpReach = parseFloat(document.getElementById('jumpReach').value) || 0;
    var bodyWeight = parseFloat(document.getElementById('bodyWeight').value) || 0;
    var gender = document.getElementById('gender').value;

    // Calculation logic
    var jump = jumpReach - standingReach; var jumpCm = jump * 2.54; var rating = ''; if (gender === 'male') { if (jump >= 28) rating = 'Excellent (top athletic tier)'; else if (jump >= 24) rating = 'Very Good'; else if (jump >= 20) rating = 'Good (above average)'; else if (jump >= 16) rating = 'Average'; else rating = 'Below Average'; } else { if (jump >= 24) rating = 'Excellent (top athletic tier)'; else if (jump >= 20) rating = 'Very Good'; else if (jump >= 16) rating = 'Good (above average)'; else if (jump >= 12) rating = 'Average'; else rating = 'Below Average'; } var wKg = bodyWeight * 0.4536; var power = Math.round(60.7 * (jumpCm * 0.01) + 45.3 * wKg - 2055); if (power < 0) power = 0; document.getElementById('vertJump').textContent = fmt(jump, 1) + ' in'; document.getElementById('rating').textContent = rating; document.getElementById('peakPower').textContent = fmt(power, 0) + ' W'; document.getElementById('jumpCm').textContent = fmt(jumpCm, 1) + ' cm';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['standingReach', 'jumpReach', 'bodyWeight', 'gender'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
