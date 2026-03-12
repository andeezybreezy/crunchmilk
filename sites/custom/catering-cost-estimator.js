(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var guestCount = parseFloat(document.getElementById('guestCount').value) || 0;
    var mealStyle = document.getElementById('mealStyle').value;
    var courseCount = parseFloat(document.getElementById('courseCount').value) || 0;
    var barService = document.getElementById('barService').value;
    var barHours = parseFloat(document.getElementById('barHours').value) || 0;
    var dietaryNeeds = parseFloat(document.getElementById('dietaryNeeds').value) || 0;

    // Calculation logic
    var baseFoodCost = {cocktail:35,buffet:45,plated:70,family:55,stations:60}; var foodBase = baseFoodCost[mealStyle] || 60; var courseAdj = 1 + (courseCount - 3) * 0.15; var foodPP = foodBase * Math.max(courseAdj, 0.7); var dietaryAdj = 1 + (dietaryNeeds / 100) * 0.10; foodPP *= dietaryAdj; var barCostPH = {none:0,cash:5,beer_wine:12,open_full:22,premium:35}; var barPP = (barCostPH[barService] || 0) * barHours; var totalPP = foodPP + barPP; var subtotal = totalPP * guestCount; var serviceAndTax = subtotal * 0.28; var grand = subtotal + serviceAndTax; document.getElementById('foodPerPerson').textContent = dollar(foodPP); document.getElementById('barPerPerson').textContent = dollar(barPP); document.getElementById('totalPerPerson').textContent = dollar(totalPP); document.getElementById('subtotal').textContent = dollar(subtotal); document.getElementById('serviceCharge').textContent = dollar(serviceAndTax); document.getElementById('grandTotal').textContent = dollar(grand);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['guestCount', 'mealStyle', 'courseCount', 'barService', 'barHours', 'dietaryNeeds'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
