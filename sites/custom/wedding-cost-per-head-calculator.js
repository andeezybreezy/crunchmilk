(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var totalBudget = parseFloat(document.getElementById('totalBudget').value) || 0;
    var guestCount = parseFloat(document.getElementById('guestCount').value) || 0;
    var fixedCosts = parseFloat(document.getElementById('fixedCosts').value) || 0;
    var venueType = document.getElementById('venueType').value;
    var mealType = document.getElementById('mealType').value;

    // Calculation logic
    var variableBudget = totalBudget - fixedCosts; var costPerGuest = totalBudget / guestCount; var varPerGuest = variableBudget / guestCount; var venueMult = {backyard:0.6,restaurant:1.0,banquet:0.9,hotel:1.25,estate:1.15}; var mealCosts = {buffet:45,plated:65,family:55,stations:60}; var cateringPG = (mealCosts[mealType] || 65) * (venueMult[venueType] || 1.0); var maxG = Math.floor(variableBudget / varPerGuest); var savingsCut = varPerGuest; document.getElementById('costPerHead').textContent = dollar(costPerGuest); document.getElementById('variablePerHead').textContent = dollar(varPerGuest); document.getElementById('cateringPerHead').textContent = dollar(cateringPG); document.getElementById('variableBudget').textContent = dollar(variableBudget); document.getElementById('maxGuests').textContent = fmt(maxG, 0) + ' guests'; document.getElementById('savingsPerCut').textContent = dollar(savingsCut) + ' saved per guest cut';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['totalBudget', 'guestCount', 'fixedCosts', 'venueType', 'mealType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
