(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var days = parseFloat(document.getElementById('days').value) || 0;
    var destination = document.getElementById('destination').value;
    var travelers = parseFloat(document.getElementById('travelers').value) || 0;
    var flightCost = parseFloat(document.getElementById('flightCost').value) || 0;

    // Calculation logic
    var dailyRates={budget:75,medium:150,high:300,luxury:500}; var daily=dailyRates[destination]; var totalDaily=daily*travelers; var tripDailyTotal=totalDaily*days; var flightTotal=flightCost*travelers; var tripTotal=tripDailyTotal+flightTotal; var perPerson=tripTotal/travelers;     document.getElementById('dailyPerPerson').textContent = dollar(daily)+'/day';
    document.getElementById('totalDaily').textContent = dollar(totalDaily)+'/day';
    document.getElementById('flightTotal').textContent = dollar(flightTotal);
    document.getElementById('tripTotal').textContent = dollar(tripTotal);
    document.getElementById('perPersonTotal').textContent = dollar(perPerson);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['days', 'destination', 'travelers', 'flightCost'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
