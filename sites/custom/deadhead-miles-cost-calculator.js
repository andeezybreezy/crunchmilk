(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var deadMiles = parseFloat(document.getElementById('deadMiles').value) || 0;
    var fuelCPM = parseFloat(document.getElementById('fuelCPM').value) || 0;
    var fixedCPM = parseFloat(document.getElementById('fixedCPM').value) || 0;
    var avgSpeed = parseFloat(document.getElementById('avgSpeed').value) || 0;
    var driverPay = parseFloat(document.getElementById('driverPay').value) || 0;
    var nextLoadRate = parseFloat(document.getElementById('nextLoadRate').value) || 0;

    // Calculation logic
    var fuel = deadMiles * fuelCPM; var fixed = deadMiles * fixedCPM; var hours = deadMiles / avgSpeed; var timeCost = hours * driverPay; var totalCost = fuel + fixed + timeCost; var effectiveRPM = nextLoadRate > 0 ? (nextLoadRate - totalCost) / deadMiles : 0; document.getElementById('fuelCost').textContent = dollar(fuel); document.getElementById('fixedCost').textContent = dollar(fixed); document.getElementById('timeCost').textContent = dollar(timeCost); document.getElementById('totalDeadCost').textContent = dollar(totalCost); document.getElementById('hoursLost').textContent = fmt(hours, 1) + ' hrs'; document.getElementById('effectiveRate').textContent = nextLoadRate > 0 ? '$' + effectiveRPM.toFixed(2) + '/mi net' : 'N/A';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['deadMiles', 'fuelCPM', 'fixedCPM', 'avgSpeed', 'driverPay', 'nextLoadRate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
