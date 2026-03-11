(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var fuelRate = parseFloat(document.getElementById('fuelRate').value) || 0;
    var speed = parseFloat(document.getElementById('speed').value) || 0;
    var distance = parseFloat(document.getElementById('distance').value) || 0;
    var fuelPrice = parseFloat(document.getElementById('fuelPrice').value) || 0;
    var tankSize = parseFloat(document.getElementById('tankSize').value) || 0;

    // Calculation logic
    var tripHours = distance / speed;
    var fuelUsed = fuelRate * tripHours;
    var cost = fuelUsed * fuelPrice;
    var nmpg = speed / fuelRate;
    var maxRange = (tankSize / 3) * nmpg;
    var hrs = Math.floor(tripHours);
    var mins = Math.round((tripHours - hrs) * 60);
    document.getElementById('tripTime').textContent = hrs + 'h ' + mins + 'm';
    document.getElementById('fuelUsed').textContent = fmt(fuelUsed, 1) + ' gallons';
    document.getElementById('tripCost').textContent = dollar(cost);
    document.getElementById('range').textContent = fmt(maxRange, 0) + ' nm (1/3 out, 1/3 back, 1/3 reserve)';
    document.getElementById('nmpg').textContent = fmt(nmpg, 2) + ' NMPG';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['fuelRate', 'speed', 'distance', 'fuelPrice', 'tankSize'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
