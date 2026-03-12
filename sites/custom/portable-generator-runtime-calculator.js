(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var tankSize = parseFloat(document.getElementById('tankSize').value) || 0;
    var ratedWatts = parseFloat(document.getElementById('ratedWatts').value) || 0;
    var loadPct = parseFloat(document.getElementById('loadPct').value) || 0;

    // Calculation logic
    var fullLoadGPH = ratedWatts / 1000 * 0.75; var actualGPH = fullLoadGPH * (loadPct/100); var runtime = tankSize / actualGPH; var costPerHour = actualGPH * 3.80;     document.getElementById('runtime').textContent = fmt(runtime,1);
    document.getElementById('fuelPerHour').textContent = fmt(actualGPH,2);
    document.getElementById('costPerHour').textContent = dollar(costPerHour);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['tankSize', 'ratedWatts', 'loadPct'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
