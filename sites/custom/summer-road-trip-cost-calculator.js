(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var totalMiles = parseFloat(document.getElementById('totalMiles').value) || 0;
    var mpg = parseFloat(document.getElementById('mpg').value) || 0;
    var gasPrice = parseFloat(document.getElementById('gasPrice').value) || 0;
    var tripDays = parseFloat(document.getElementById('tripDays').value) || 0;
    var lodgingPerNight = parseFloat(document.getElementById('lodgingPerNight').value) || 0;
    var travelers = parseFloat(document.getElementById('travelers').value) || 0;

    // Calculation logic
    var gallons = totalMiles / mpg; var gas = gallons * gasPrice; var lodgingNights = Math.max(0, tripDays - 1); var lodging = lodgingNights * lodgingPerNight; var foodPerDay = 50 * travelers; var food = foodPerDay * tripDays; var activities = 30 * travelers * tripDays; var total = gas + lodging + food + activities; var perPerson = total / travelers; document.getElementById('gasCost').textContent = dollar(gas) + ' (' + fmt(gallons, 0) + ' gal)'; document.getElementById('lodgingTotal').textContent = dollar(lodging) + ' (' + lodgingNights + ' nights)'; document.getElementById('foodTotal').textContent = dollar(food) + ' (~$50/person/day)'; document.getElementById('activitiesEst').textContent = dollar(activities) + ' (~$30/person/day)'; document.getElementById('grandTotal').textContent = dollar(total); document.getElementById('costPerPerson').textContent = dollar(perPerson);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['totalMiles', 'mpg', 'gasPrice', 'tripDays', 'lodgingPerNight', 'travelers'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
