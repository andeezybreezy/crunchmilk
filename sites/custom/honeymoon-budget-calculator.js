(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var destination = document.getElementById('destination').value;
    var nights = parseFloat(document.getElementById('nights').value) || 0;
    var travelStyle = document.getElementById('travelStyle').value;
    var includeFlights = document.getElementById('includeFlights').value;
    var activities = document.getElementById('activities').value;

    // Calculation logic
    var flightCosts = {domestic:600,caribbean:900,europe:1800,asia:2200,pacific:3000,africa:2800}; var hotelPerNight = {budget:{domestic:120,caribbean:150,europe:130,asia:60,pacific:200,africa:180},mid:{domestic:220,caribbean:300,europe:250,asia:120,pacific:450,africa:400},luxury:{domestic:400,caribbean:550,europe:500,asia:250,pacific:900,africa:750},ultra:{domestic:700,caribbean:1000,europe:900,asia:500,pacific:1800,africa:1500}}; var flights = includeFlights === 'yes' ? (flightCosts[destination] || 1500) * 2 : 0; if(travelStyle === 'luxury') flights *= 1.5; if(travelStyle === 'ultra') flights *= 2.5; var hotel = (hotelPerNight[travelStyle][destination] || 250) * nights; var foodPerDay = {budget:80,mid:150,luxury:250,ultra:450}; var food = (foodPerDay[travelStyle] || 150) * nights; var actMult = {relaxed:0.3,moderate:1.0,active:1.8}; var actPerDay = {budget:40,mid:100,luxury:200,ultra:400}; var act = (actPerDay[travelStyle] || 100) * nights * (actMult[activities] || 1.0); var total = flights + hotel + food + act; var daily = total / nights; document.getElementById('totalBudget').textContent = dollar(total); document.getElementById('flightsCost').textContent = includeFlights === 'yes' ? dollar(flights) : 'Using Points'; document.getElementById('hotelCost').textContent = dollar(hotel); document.getElementById('foodCost').textContent = dollar(food); document.getElementById('activityCost').textContent = dollar(act); document.getElementById('dailyAvg').textContent = dollar(daily) + '/day';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['destination', 'nights', 'travelStyle', 'includeFlights', 'activities'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
