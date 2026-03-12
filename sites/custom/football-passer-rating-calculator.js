(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var completions = parseFloat(document.getElementById('completions').value) || 0;
    var attempts = parseFloat(document.getElementById('attempts').value) || 0;
    var yards = parseFloat(document.getElementById('yards').value) || 0;
    var touchdowns = parseFloat(document.getElementById('touchdowns').value) || 0;
    var interceptions = parseFloat(document.getElementById('interceptions').value) || 0;

    // Calculation logic
    var a = Math.min(Math.max(((completions/attempts)-0.3)*5, 0), 2.375); var b = Math.min(Math.max(((yards/attempts)-3)*0.25, 0), 2.375); var c = Math.min(Math.max((touchdowns/attempts)*20, 0), 2.375); var d = Math.min(Math.max(2.375-((interceptions/attempts)*25), 0), 2.375); var rating = ((a+b+c+d)/6)*100; var grade = rating >= 100 ? 'Elite' : rating >= 90 ? 'Excellent' : rating >= 80 ? 'Good' : rating >= 70 ? 'Average' : 'Below Average';     document.getElementById('rating').textContent = fmt(rating,1);
    document.getElementById('grade').textContent = grade;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['completions', 'attempts', 'yards', 'touchdowns', 'interceptions'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
