(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var tripDistance = parseFloat(document.getElementById('tripDistance').value) || 0;
    var groundSpeed = parseFloat(document.getElementById('groundSpeed').value) || 0;
    var burnRate = parseFloat(document.getElementById('burnRate').value) || 0;
    var tankCapacity = parseFloat(document.getElementById('tankCapacity').value) || 0;
    var timeOfDay = document.getElementById('timeOfDay').value;
    var safetyMargin = parseFloat(document.getElementById('safetyMargin').value) || 0;

    // Calculation logic
    var tripTimeHrs = tripDistance / groundSpeed; var tripMin = tripTimeHrs * 60; var tripFuelGal = burnRate * tripTimeHrs; var reserveMin = timeOfDay === 'night' ? 45 : 30; var reserveGal = burnRate * (reserveMin / 60); var safetyGal = burnRate * (safetyMargin / 60); var totalRequired = tripFuelGal + reserveGal + safetyGal; var remaining = tankCapacity - tripFuelGal; var remainingMin = remaining > 0 ? (remaining / burnRate) * 60 : 0; var tripH = Math.floor(tripMin / 60); var tripM = Math.round(tripMin % 60); var canMakeIt = totalRequired <= tankCapacity; var status = canMakeIt ? fmt(remaining, 1) + ' gal (' + fmt(remainingMin, 0) + ' min endurance)' : 'INSUFFICIENT — need ' + fmt(totalRequired - tankCapacity, 1) + ' gal more or plan fuel stop'; document.getElementById('tripTime').textContent = tripH + 'h ' + tripM + 'm'; document.getElementById('tripFuel').textContent = fmt(tripFuelGal, 1) + ' gal'; document.getElementById('legalReserve').textContent = fmt(reserveGal, 1) + ' gal (' + reserveMin + ' min — FAR 91.151)'; document.getElementById('safetyFuel').textContent = safetyMargin > 0 ? fmt(safetyGal, 1) + ' gal (' + safetyMargin + ' min)' : 'None added'; document.getElementById('totalRequired').textContent = fmt(totalRequired, 1) + ' gal'; document.getElementById('fuelRemaining').textContent = status;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['tripDistance', 'groundSpeed', 'burnRate', 'tankCapacity', 'timeOfDay', 'safetyMargin'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
