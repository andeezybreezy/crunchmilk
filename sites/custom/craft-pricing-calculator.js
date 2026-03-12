(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var materials = parseFloat(document.getElementById('materials').value) || 0;
    var timeHours = parseFloat(document.getElementById('timeHours').value) || 0;
    var hourlyRate = parseFloat(document.getElementById('hourlyRate').value) || 0;
    var markup = parseFloat(document.getElementById('markup').value) || 0;

    // Calculation logic
    var labor = timeHours * hourlyRate; var cost = materials + labor; var wholesale = cost * (1 + markup / 100); var retail = wholesale * 2; var profit = wholesale - cost; var margin = (profit / wholesale) * 100; document.getElementById('wholesale').textContent = dollar(wholesale); document.getElementById('retail').textContent = dollar(retail); document.getElementById('hourlyEarned').textContent = dollar(profit / timeHours + hourlyRate) + '/hr (with profit)'; document.getElementById('profitMargin').textContent = pct(margin);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['materials', 'timeHours', 'hourlyRate', 'markup'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
