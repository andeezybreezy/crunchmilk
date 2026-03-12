(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var miles = parseFloat(document.getElementById('miles').value) || 0;
    var mpg = parseFloat(document.getElementById('mpg').value) || 0;
    var gasPrice = parseFloat(document.getElementById('gasPrice').value) || 0;
    var nights = parseFloat(document.getElementById('nights').value) || 0;
    var campRate = parseFloat(document.getElementById('campRate').value) || 0;
    var foodBudget = parseFloat(document.getElementById('foodBudget').value) || 0;

    // Calculation logic
    var fuel = (miles / mpg) * gasPrice; var camp = nights * campRate; var food = (nights + 1) * foodBudget; var total = fuel + camp + food; var days = nights + 1; document.getElementById('fuelTotal').textContent = dollar(fuel); document.getElementById('campTotal').textContent = dollar(camp); document.getElementById('foodTotal').textContent = dollar(food); document.getElementById('grandTotal').textContent = dollar(total); document.getElementById('perDay').textContent = dollar(total / days); document.getElementById('perMile').textContent = dollar(total / miles);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['miles', 'mpg', 'gasPrice', 'nights', 'campRate', 'foodBudget'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
