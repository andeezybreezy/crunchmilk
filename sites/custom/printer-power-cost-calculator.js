(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var wattage = parseFloat(document.getElementById('wattage').value) || 0;
    var printHours = parseFloat(document.getElementById('printHours').value) || 0;
    var electricRate = parseFloat(document.getElementById('electricRate').value) || 0;
    var printsPerMonth = parseFloat(document.getElementById('printsPerMonth').value) || 0;

    // Calculation logic
    var kwh = (wattage / 1000) * printHours;
    var costPrint = kwh * electricRate;
    var monthly = costPrint * printsPerMonth;
    document.getElementById('costPerPrint').textContent = dollar(costPrint);
    document.getElementById('monthlyCost').textContent = dollar(monthly);
    document.getElementById('kwhPerPrint').textContent = fmt(kwh, 2) + ' kWh';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['wattage', 'printHours', 'electricRate', 'printsPerMonth'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
