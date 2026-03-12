(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var current = parseFloat(document.getElementById('current').value) || 0;
    var threeHoursAgo = parseFloat(document.getElementById('threeHoursAgo').value) || 0;

    // Calculation logic
    var change = current - threeHoursAgo; var trend = change > 0.06 ? 'Rising rapidly' : change > 0.02 ? 'Rising slowly' : change < -0.06 ? 'Falling rapidly' : change < -0.02 ? 'Falling slowly' : 'Steady'; var forecast = change < -0.06 ? 'Storm likely approaching' : change < -0.02 ? 'Weather may deteriorate' : change > 0.06 ? 'Rapid clearing expected' : change > 0.02 ? 'Fair weather ahead' : 'Current conditions likely to continue';     document.getElementById('change').textContent = (change >= 0 ? '+' : '') + fmt(change,2);
    document.getElementById('trend').textContent = trend;
    document.getElementById('forecast').textContent = forecast;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['current', 'threeHoursAgo'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
