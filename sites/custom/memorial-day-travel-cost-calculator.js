(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var distance = parseFloat(document.getElementById('distance').value) || 0;
    var travelMode = document.getElementById('travelMode').value;
    var nights = parseFloat(document.getElementById('nights').value) || 0;
    var hotelRate = parseFloat(document.getElementById('hotelRate').value) || 0;
    var travelers = parseFloat(document.getElementById('travelers').value) || 0;
    var dailyFood = parseFloat(document.getElementById('dailyFood').value) || 0;

    // Calculation logic
    var transport = 0; if (travelMode === 'car') { var mpg = 28; var gasPrice = 3.60; transport = (distance / mpg) * gasPrice; } else { transport = 350 * travelers; } var lodging = nights * hotelRate; var food = (nights + 1) * dailyFood * travelers; var subtotal = transport + lodging + food; var surcharge = subtotal * 0.20; var total = subtotal + surcharge; var pp = total / travelers; document.getElementById('transportCost').textContent = dollar(transport); document.getElementById('lodgingCost').textContent = dollar(lodging); document.getElementById('foodCost').textContent = dollar(food); document.getElementById('holidaySurcharge').textContent = dollar(surcharge) + ' (~20% holiday markup)'; document.getElementById('totalTrip').textContent = dollar(total); document.getElementById('perPerson').textContent = dollar(pp) + '/person';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['distance', 'travelMode', 'nights', 'hotelRate', 'travelers', 'dailyFood'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
