(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var tempF = parseFloat(document.getElementById('tempF').value) || 0;
    var rh = parseFloat(document.getElementById('rh').value) || 0;

    // Calculation logic
    var T = (tempF - 32) * 5/9; var a = 17.271; var b = 237.7; var gamma = (a * T)/(b + T) + Math.log(rh/100); var dpC = (b * gamma)/(a - gamma); var dpF = dpC * 9/5 + 32; var spread = tempF - dpF; var comfort = dpF >= 75 ? 'Extremely Uncomfortable — Oppressive' : dpF >= 70 ? 'Very Humid — Uncomfortable' : dpF >= 65 ? 'Humid — Somewhat Uncomfortable' : dpF >= 60 ? 'Comfortable — Pleasant' : dpF >= 55 ? 'Dry — Very Comfortable' : 'Very Dry — Excellent'; document.getElementById('dewPoint').textContent = fmt(dpF, 1) + '°F (' + fmt(dpC, 1) + '°C)'; document.getElementById('comfort').textContent = comfort; document.getElementById('spreadF').textContent = fmt(spread, 1) + '°F';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['tempF', 'rh'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
