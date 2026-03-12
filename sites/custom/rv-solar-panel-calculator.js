(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var dailyUse = parseFloat(document.getElementById('dailyUse').value) || 0;
    var sunHours = parseFloat(document.getElementById('sunHours').value) || 0;
    var batteryVolts = document.getElementById('batteryVolts').value;

    // Calculation logic
    var volts = parseFloat(batteryVolts) || 12; var dailyWh = dailyUse * volts; var wattsNeeded = dailyWh / sunHours / 0.85; var panels100 = Math.ceil(wattsNeeded / 100); var battAh = Math.ceil(dailyUse * 2); document.getElementById('wattsNeeded').textContent = fmt(wattsNeeded, 0) + 'W'; document.getElementById('panels').textContent = panels100 + ' panels'; document.getElementById('batteryAh').textContent = fmt(battAh, 0) + ' Ah'; document.getElementById('dailyWh').textContent = fmt(dailyWh, 0) + ' Wh'; document.getElementById('resultTip').textContent = 'Battery bank sized for 2 days autonomy (50% depth of discharge).';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['dailyUse', 'sunHours', 'batteryVolts'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
