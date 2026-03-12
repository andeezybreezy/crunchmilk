(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var watts = parseFloat(document.getElementById('watts').value) || 0;
    var hoursDay = parseFloat(document.getElementById('hoursDay').value) || 0;
    var rate = parseFloat(document.getElementById('rate').value) || 0;

    // Calculation logic
    var kwh = watts * hoursDay / 1000; var daily = kwh * rate; var monthly = daily * 30; var annual = daily * 365;     document.getElementById('daily').textContent = dollar(daily);
    document.getElementById('monthly').textContent = dollar(monthly);
    document.getElementById('annual').textContent = dollar(annual);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['watts', 'hoursDay', 'rate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
