(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var gpu = document.getElementById('gpu').value;
    var gpuCount = parseFloat(document.getElementById('gpuCount').value) || 0;
    var hoursPerDay = parseFloat(document.getElementById('hoursPerDay').value) || 0;
    var days = parseFloat(document.getElementById('days').value) || 0;

    // Calculation logic
    var rates={a100:1.50,h100:3.00,a10g:0.75,t4:0.35,l4:0.50}; var rate=rates[gpu]*gpuCount; var dailyCost=rate*hoursPerDay; var monthlyCost=dailyCost*days; var annualCost=monthlyCost*12;     document.getElementById('hourlyRate').textContent = dollar(rate)+'/hr';
    document.getElementById('dailyCost').textContent = dollar(dailyCost);
    document.getElementById('monthlyCost').textContent = dollar(monthlyCost);
    document.getElementById('annualCost').textContent = dollar(annualCost);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['gpu', 'gpuCount', 'hoursPerDay', 'days'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
