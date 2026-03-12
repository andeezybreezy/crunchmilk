(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var gpuWatts = parseFloat(document.getElementById('gpuWatts').value) || 0;
    var cpuWatts = parseFloat(document.getElementById('cpuWatts').value) || 0;
    var peripherals = parseFloat(document.getElementById('peripherals').value) || 0;
    var hoursPerDay = parseFloat(document.getElementById('hoursPerDay').value) || 0;
    var electricityRate = parseFloat(document.getElementById('electricityRate').value) || 0;
    var psuEfficiency = parseFloat(document.getElementById('psuEfficiency').value) || 0;

    // Calculation logic
    var componentWatts = gpuWatts + cpuWatts + peripherals; var totalDraw = Math.round(componentWatts / (psuEfficiency / 100)); var kwhPerDay = (totalDraw * hoursPerDay) / 1000; var dailyCost = kwhPerDay * electricityRate; var monthlyCost = dailyCost * 30; var annualCost = dailyCost * 365;     document.getElementById('totalDraw').textContent = fmt(totalDraw, 0);
    document.getElementById('dailyCost').textContent = dollar(dailyCost);
    document.getElementById('monthlyCost').textContent = dollar(monthlyCost);
    document.getElementById('annualCost').textContent = dollar(annualCost);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['gpuWatts', 'cpuWatts', 'peripherals', 'hoursPerDay', 'electricityRate', 'psuEfficiency'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
