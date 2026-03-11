(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var distanceMiles = parseFloat(document.getElementById('distanceMiles').value) || 0;
    var daysPerWeek = parseFloat(document.getElementById('daysPerWeek').value) || 0;
    var mpg = parseFloat(document.getElementById('mpg').value) || 0;
    var gasPrice = parseFloat(document.getElementById('gasPrice').value) || 0;
    var parkingMonth = parseFloat(document.getElementById('parkingMonth').value) || 0;

    // Calculation logic
    var roundTrip = distanceMiles * 2; var weeksPerYear = 50; var daysPerYear = daysPerWeek * weeksPerYear; var fuelCostPerDay = (roundTrip / mpg) * gasPrice; var wearPerMile = 0.10; var wearPerDay = roundTrip * wearPerMile; var dailyTotal = fuelCostPerDay + wearPerDay; var monthlyTotal = dailyTotal * daysPerWeek * 4.33 + parkingMonth; var annualTotal = dailyTotal * daysPerYear + parkingMonth * 12; var commuteHoursPerYear = (roundTrip / 30) * daysPerYear; var hourly = annualTotal / commuteHoursPerYear; document.getElementById('dailyCost').textContent = dollar(dailyTotal); document.getElementById('monthlyCost').textContent = dollar(monthlyTotal); document.getElementById('annualCost').textContent = dollar(annualTotal); document.getElementById('hourlyEquiv').textContent = dollar(hourly) + '/hr commute time';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['distanceMiles', 'daysPerWeek', 'mpg', 'gasPrice', 'parkingMonth'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
