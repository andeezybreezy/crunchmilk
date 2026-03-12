(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var plantType = document.getElementById('plantType').value;
    var sqft = parseFloat(document.getElementById('sqft').value) || 0;
    var soilType = document.getElementById('soilType').value;
    var temperature = document.getElementById('temperature').value;
    var recentRain = parseFloat(document.getElementById('recentRain').value) || 0;

    // Calculation logic
    var baseInches = {lawn: 1, vegetable: 1.25, flower: 1, shrub: 0.75, tree: 0.5};
    var base = baseInches[plantType];
    var soilFactor = parseFloat(soilType);
    var tempFactor = parseFloat(temperature);
    var weeklyInches = base * tempFactor - recentRain;
    weeklyInches = Math.max(0, weeklyInches);
    var gallonsPerSqFt = weeklyInches * 0.623;
    var totalGallons = gallonsPerSqFt * sqft;
    var sessions;
    if (soilFactor <= 0.7) sessions = 3;
    else if (soilFactor <= 1.0) sessions = 2;
    else sessions = 1;
    if (tempFactor >= 1.3) sessions = Math.min(sessions + 1, 2);
    var perSession = totalGallons / sessions;
    var scheduleText = sessions + ' times per week';
    if (weeklyInches <= 0) scheduleText = 'No additional watering needed this week (sufficient rain)';
    document.getElementById('weeklyNeed').textContent = fmt(weeklyInches, 2) + ' inches/week';
    document.getElementById('gallonsPerWeek').textContent = fmt(totalGallons, 0) + ' gallons';
    document.getElementById('wateringSchedule').textContent = scheduleText;
    document.getElementById('perSession').textContent = weeklyInches > 0 ? fmt(perSession, 0) + ' gallons per session (' + fmt(perSession / sqft * 1.604, 2) + '" per session)' : 'N/A — rain is sufficient';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['plantType', 'sqft', 'soilType', 'temperature', 'recentRain'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
