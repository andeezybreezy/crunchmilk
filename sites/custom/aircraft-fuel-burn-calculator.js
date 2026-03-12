(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var aircraftType = document.getElementById('aircraftType').value;
    var burnRate = parseFloat(document.getElementById('burnRate').value) || 0;
    var flightTime = parseFloat(document.getElementById('flightTime').value) || 0;
    var fuelType = document.getElementById('fuelType').value;
    var fuelPrice = parseFloat(document.getElementById('fuelPrice').value) || 0;
    var reserveTime = parseFloat(document.getElementById('reserveTime').value) || 0;

    // Calculation logic
    var defaultBurn = {single:10,twin:24,turboprop:55,light_jet:150,airliner:800}; var burn = burnRate > 0 ? burnRate : (defaultBurn[aircraftType] || 10); var tripGal = burn * flightTime; var reserveGal = burn * reserveTime; var totalGal = tripGal + reserveGal; var tripCost = tripGal * fuelPrice; var defaultSpeed = {single:130,twin:180,turboprop:250,light_jet:400,airliner:480}; var speed = defaultSpeed[aircraftType] || 130; var tripNm = speed * flightTime; var costNm = tripNm > 0 ? tripCost / tripNm : 0; document.getElementById('burnRateUsed').textContent = fmt(burn, 1) + ' GPH'; document.getElementById('tripFuel').textContent = fmt(tripGal, 1) + ' gal'; document.getElementById('reserveFuel').textContent = fmt(reserveGal, 1) + ' gal'; document.getElementById('totalFuel').textContent = fmt(totalGal, 1) + ' gal'; document.getElementById('fuelCost').textContent = dollar(tripCost); document.getElementById('costPerNm').textContent = '$' + costNm.toFixed(2) + '/nm';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['aircraftType', 'burnRate', 'flightTime', 'fuelType', 'fuelPrice', 'reserveTime'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
