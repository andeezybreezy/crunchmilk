(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var dailyUsage = parseFloat(document.getElementById('dailyUsage').value) || 0;
    var autonomyDays = parseFloat(document.getElementById('autonomyDays').value) || 0;
    var depthOfDischarge = parseFloat(document.getElementById('depthOfDischarge').value) || 0;
    var batteryVoltage = document.getElementById('batteryVoltage').value;
    var batteryType = document.getElementById('batteryType').value;

    // Calculation logic
    var totalKWH = dailyUsage * autonomyDays;
    var usableKWH = totalKWH / (depthOfDischarge / 100);
    var voltage = parseInt(batteryVoltage);
    var ah = (usableKWH * 1000) / voltage;
    var costPerKWH = {lithium: 400, agm: 200, flooded: 150};
    var lifeYears = {lithium: '10-15 years (5000+ cycles)', agm: '4-6 years (1000 cycles)', flooded: '5-8 years (1500 cycles)'};
    var cost = usableKWH * costPerKWH[batteryType];
    document.getElementById('totalCapacity').textContent = fmt(usableKWH, 1) + ' kWh (' + fmt(totalKWH, 1) + ' kWh usable)';
    document.getElementById('ampHours').textContent = fmt(ah, 0) + ' Ah at ' + voltage + 'V';
    document.getElementById('estimatedCost').textContent = dollar(cost);
    document.getElementById('batteryLife').textContent = lifeYears[batteryType];

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['dailyUsage', 'autonomyDays', 'depthOfDischarge', 'batteryVoltage', 'batteryType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
