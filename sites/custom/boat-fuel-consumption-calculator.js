(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var hp = parseFloat(document.getElementById('hp').value) || 0;
    var throttle = parseFloat(document.getElementById('throttle').value) || 0;
    var fuelType = document.getElementById('fuelType').value;

    // Calculation logic
    var sfc = fuelType === 'Diesel' ? 0.055 : 0.075; var gph = hp * (throttle/100) * sfc; var price = fuelType === 'Diesel' ? 4.50 : 3.80; var costPerHour = gph * price;     document.getElementById('gph').textContent = fmt(gph,1);
    document.getElementById('costPerHour').textContent = dollar(costPerHour);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['hp', 'throttle', 'fuelType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
