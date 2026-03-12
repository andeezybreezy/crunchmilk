(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var bodyWeight = parseFloat(document.getElementById('bodyWeight').value) || 0;
    var activityLevel = document.getElementById('activityLevel').value;
    var climate = document.getElementById('climate').value;
    var caffeine = parseFloat(document.getElementById('caffeine').value) || 0;

    // Calculation logic
    var activity = parseFloat(activityLevel);
    var climateFactor = parseFloat(climate);
    var baseOz = bodyWeight * 0.5;
    var adjustedOz = baseOz * activity * climateFactor;
    var caffeineOz = caffeine * 4;
    var totalOz = adjustedOz + caffeineOz;
    var liters = totalOz * 0.02957;
    var glasses = totalOz / 8;
    var hourly = totalOz / 16;
    document.getElementById('dailyOz').textContent = fmt(totalOz, 0) + ' oz';
    document.getElementById('dailyLiters').textContent = fmt(liters, 1) + ' L';
    document.getElementById('glassesPerDay').textContent = fmt(glasses, 1) + ' glasses';
    document.getElementById('hourlyRate').textContent = fmt(hourly, 0) + ' oz/hour';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['bodyWeight', 'activityLevel', 'climate', 'caffeine'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
