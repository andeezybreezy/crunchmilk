(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var earnedRuns = parseFloat(document.getElementById('earnedRuns').value) || 0;
    var inningsPitched = parseFloat(document.getElementById('inningsPitched').value) || 0;

    // Calculation logic
    var e = (earnedRuns / inningsPitched) * 9; var rating = e <= 2.50 ? 'Ace/Elite' : e <= 3.50 ? 'Very Good' : e <= 4.00 ? 'Above Average' : e <= 4.50 ? 'Average' : e <= 5.00 ? 'Below Average' : 'Poor'; document.getElementById('era').textContent = e.toFixed(2); document.getElementById('rating').textContent = rating; document.getElementById('per9').textContent = e.toFixed(2) + ' ER per 9 innings';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['earnedRuns', 'inningsPitched'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
