(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var ac = document.getElementById('ac').value;
    var microwave = document.getElementById('microwave').value;
    var fridge = document.getElementById('fridge').value;
    var otherWatts = parseFloat(document.getElementById('otherWatts').value) || 0;

    // Calculation logic
    var acW = parseFloat(ac) * 1800; var mwW = parseFloat(microwave) * 1000; var fridgeW = parseFloat(fridge) * 600; var running = acW + mwW + fridgeW + otherWatts; var starting = running + (acW > 0 ? 1200 : 0); var genRec = starting <= 2000 ? '2,000W Inverter' : starting <= 3500 ? '3,500W Inverter' : starting <= 5500 ? '5,500W Conventional' : starting <= 7500 ? '7,500W Conventional' : '10,000W+ Conventional'; var fuelRate = running / 1000 * 0.15; document.getElementById('runningWatts').textContent = fmt(running, 0) + 'W'; document.getElementById('startingWatts').textContent = fmt(starting, 0) + 'W'; document.getElementById('genSize').textContent = genRec; document.getElementById('fuelPerHr').textContent = fmt(fuelRate, 1) + ' gal/hr';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['ac', 'microwave', 'fridge', 'otherWatts'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
