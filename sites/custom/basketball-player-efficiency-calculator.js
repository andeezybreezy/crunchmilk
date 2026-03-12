(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var points = parseFloat(document.getElementById('points').value) || 0;
    var rebounds = parseFloat(document.getElementById('rebounds').value) || 0;
    var assists = parseFloat(document.getElementById('assists').value) || 0;
    var steals = parseFloat(document.getElementById('steals').value) || 0;
    var blocks = parseFloat(document.getElementById('blocks').value) || 0;
    var turnovers = parseFloat(document.getElementById('turnovers').value) || 0;
    var minutes = parseFloat(document.getElementById('minutes').value) || 0;

    // Calculation logic
    var raw = points + (rebounds * 1.2) + (assists * 1.5) + (steals * 2) + (blocks * 2) - turnovers; var per = (raw / minutes) * 36; var rating = per > 25 ? 'MVP Level' : per > 20 ? 'All-Star' : per > 15 ? 'Above Average' : per > 10 ? 'Average' : 'Below Average';     document.getElementById('per').textContent = fmt(per,1);
    document.getElementById('rating').textContent = rating;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['points', 'rebounds', 'assists', 'steals', 'blocks', 'turnovers', 'minutes'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
