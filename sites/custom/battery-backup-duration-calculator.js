(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var batteryKWh = parseFloat(document.getElementById('batteryKWh').value) || 0;
    var essentialLoad = parseFloat(document.getElementById('essentialLoad').value) || 0;
    var usablePercent = parseFloat(document.getElementById('usablePercent').value) || 0;
    var inverterEfficiency = parseFloat(document.getElementById('inverterEfficiency').value) || 0;

    // Calculation logic
    var usableKWh = batteryKWh * (usablePercent / 100) * (inverterEfficiency / 100);
    var runtimeHours = usableKWh / essentialLoad;
    var days = runtimeHours / 24;
    var tip = runtimeHours < 4 ? 'Reduce load or add more battery capacity — ' + fmt(runtimeHours, 1) + ' hrs may not last overnight' : (runtimeHours < 12 ? 'Good for overnight backup. Reduce non-essential loads to extend runtime' : 'Excellent runtime. Can handle most outages comfortably');
    document.getElementById('usableKWh').textContent = fmt(usableKWh, 1) + ' kWh (of ' + fmt(batteryKWh, 1) + ' kWh total)';
    document.getElementById('runtime').textContent = fmt(runtimeHours, 1) + ' hours (' + fmt(runtimeHours * 60, 0) + ' minutes)';
    document.getElementById('dailyCycles').textContent = fmt(days, 2) + ' days';
    document.getElementById('tip').textContent = tip;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['batteryKWh', 'essentialLoad', 'usablePercent', 'inverterEfficiency'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
