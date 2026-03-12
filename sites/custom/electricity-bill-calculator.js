(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var sqft = parseFloat(document.getElementById('sqft').value) || 0;
    var region = document.getElementById('region').value;
    var rate = parseFloat(document.getElementById('rate').value) || 0;

    // Calculation logic
    var kwhPerSqft = {south: 0.85, north: 0.60, mid: 0.65, west: 0.50}; var factor = kwhPerSqft[region] || 0.65; var kwh = sqft * factor; var bill = kwh * rate; document.getElementById('estKwh').textContent = fmt(kwh, 0) + ' kWh'; document.getElementById('estBill').textContent = dollar(bill); document.getElementById('annual').textContent = dollar(bill * 12);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['sqft', 'region', 'rate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
