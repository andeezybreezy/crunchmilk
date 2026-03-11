(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var adults = parseFloat(document.getElementById('adults').value) || 0;
    var children = parseFloat(document.getElementById('children').value) || 0;
    var days = parseFloat(document.getElementById('days').value) || 0;
    var calPerAdult = parseFloat(document.getElementById('calPerAdult').value) || 0;
    var activityLevel = document.getElementById('activityLevel').value;

    // Calculation logic
    var act = parseFloat(activityLevel); var adultCal = adults * calPerAdult * act * days; var childCal = children * (calPerAdult * 0.6) * act * days; var totalCal = adultCal + childCal; var lbs = totalCal / 1500; var grainLbs = totalCal / 1650; var cost = grainLbs * 0.75 + (totalCal / 2000) * 1.5; document.getElementById('totalCal').textContent = fmt(totalCal, 0) + ' calories'; document.getElementById('poundsFood').textContent = fmt(lbs, 0) + ' lbs'; document.getElementById('grainLbs').textContent = fmt(grainLbs, 0) + ' lbs (rice/wheat)'; document.getElementById('estimatedCost').textContent = dollar(cost);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['adults', 'children', 'days', 'calPerAdult', 'activityLevel'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
