(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var units = parseFloat(document.getElementById('units').value) || 0;
    var avgRent = parseFloat(document.getElementById('avgRent').value) || 0;
    var occupancy = parseFloat(document.getElementById('occupancy').value) || 0;
    var expenses = parseFloat(document.getElementById('expenses').value) || 0;

    // Calculation logic
    var grossIncome = units * avgRent * (occupancy/100); var netIncome = grossIncome - expenses; var annualNet = netIncome * 12;     document.getElementById('grossIncome').textContent = dollar(grossIncome);
    document.getElementById('netIncome').textContent = dollar(netIncome);
    document.getElementById('annualNet').textContent = dollar(annualNet);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['units', 'avgRent', 'occupancy', 'expenses'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
