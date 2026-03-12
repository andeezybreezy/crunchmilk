(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var elevation = parseFloat(document.getElementById('elevation').value) || 0;
    var scenario = document.getElementById('scenario').value;
    var yearTarget = parseFloat(document.getElementById('yearTarget').value) || 0;

    // Calculation logic
    var maxRise = {low: 1, moderate: 2, high: 4, extreme: 6.5}; var max = maxRise[scenario] || 2; var yearsFrom2020 = yearTarget - 2020; var rise = max * (yearsFrom2020 / 80); var margin = elevation - rise; var risk = margin <= 0 ? 'Extreme — Below projected sea level' : margin <= 3 ? 'High — Within storm surge range' : margin <= 6 ? 'Moderate — Vulnerable to major storms' : 'Low — Adequate elevation buffer'; document.getElementById('projectedRise').textContent = fmt(rise, 1) + ' feet'; document.getElementById('margin').textContent = fmt(margin, 1) + ' feet remaining'; document.getElementById('riskLevel').textContent = risk;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['elevation', 'scenario', 'yearTarget'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
