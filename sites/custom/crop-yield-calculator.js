(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var crop = document.getElementById('crop').value;
    var acres = parseFloat(document.getElementById('acres').value) || 0;
    var yieldFactor = parseFloat(document.getElementById('yieldFactor').value) || 0;
    var pricePerUnit = parseFloat(document.getElementById('pricePerUnit').value) || 0;

    // Calculation logic
    var avgYields = {corn: 175, soybeans: 50, wheat: 47, rice: 7500, cotton: 800};
    var units = {corn: 'bu', soybeans: 'bu', wheat: 'bu', rice: 'lbs', cotton: 'lbs'};
    var baseYield = avgYields[crop];
    var unit = units[crop];
    var actualYield = baseYield * (yieldFactor / 100);
    var total = actualYield * acres;
    var revenue = total * pricePerUnit;
    var revPerAcre = revenue / acres;
    document.getElementById('yieldPerAcre').textContent = fmt(actualYield, 1) + ' ' + unit + '/acre';
    document.getElementById('totalYield').textContent = fmt(total, 0) + ' ' + unit;
    document.getElementById('grossRevenue').textContent = dollar(revenue);
    document.getElementById('revenuePerAcre').textContent = dollar(revPerAcre) + '/acre';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['crop', 'acres', 'yieldFactor', 'pricePerUnit'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
