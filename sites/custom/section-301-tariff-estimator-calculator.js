(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var importValue = parseFloat(document.getElementById('importValue').value) || 0;
    var list = document.getElementById('list').value;
    var quantity = parseFloat(document.getElementById('quantity').value) || 0;

    // Calculation logic
    var rates = {'List 1 (25%)': 25, 'List 2 (25%)': 25, 'List 3 (25%)': 25, 'List 4A (7.5%)': 7.5, 'List 4B (varies)': 15}; var tariffRate = rates[list] || 25; var perShipment = importValue * (tariffRate/100); var annualTariff = perShipment * quantity;     document.getElementById('tariffRate').textContent = fmt(tariffRate,1);
    document.getElementById('perShipment').textContent = dollar(perShipment);
    document.getElementById('annualTariff').textContent = dollar(annualTariff);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['importValue', 'list', 'quantity'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
