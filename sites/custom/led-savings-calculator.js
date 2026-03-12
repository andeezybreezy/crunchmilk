(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var numBulbs = parseFloat(document.getElementById('numBulbs').value) || 0;
    var oldWatts = parseFloat(document.getElementById('oldWatts').value) || 0;
    var ledWatts = parseFloat(document.getElementById('ledWatts').value) || 0;
    var hoursDay = parseFloat(document.getElementById('hoursDay').value) || 0;
    var rate = parseFloat(document.getElementById('rate').value) || 0;

    // Calculation logic
    var oldKwh = (oldWatts * numBulbs * hoursDay * 365) / 1000; var newKwh = (ledWatts * numBulbs * hoursDay * 365) / 1000; var saved = oldKwh - newKwh; var savings = saved * rate; var bulbCost = numBulbs * 3; var payback = bulbCost / (savings / 12); document.getElementById('annualSavings').textContent = dollar(savings); document.getElementById('monthlySavings').textContent = dollar(savings / 12); document.getElementById('kwhSaved').textContent = fmt(saved, 0) + ' kWh'; document.getElementById('payback').textContent = fmt(payback, 1) + ' months';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['numBulbs', 'oldWatts', 'ledWatts', 'hoursDay', 'rate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
