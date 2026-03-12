(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var skinType = document.getElementById('skinType').value;
    var uvIndex = parseFloat(document.getElementById('uvIndex').value) || 0;
    var skinExposed = document.getElementById('skinExposed').value;
    var minutes = parseFloat(document.getElementById('minutes').value) || 0;

    // Calculation logic
    var skin = parseInt(skinType);
    var exposed = parseInt(skinExposed);
    var baseProdRate = [1000, 800, 600, 400, 250, 150];
    var ratePerMin = baseProdRate[skin - 1] * (uvIndex / 6) * (exposed / 25) / 20;
    var totalIU = ratePerMin * minutes;
    var burnTimes = [10, 15, 20, 30, 50, 70];
    var burnTime = burnTimes[skin - 1] * (6 / uvIndex);
    var optimalMin = Math.min(burnTime * 0.5, 30);
    var rec;
    if (minutes < optimalMin) rec = 'You could safely stay longer. Optimal: ' + fmt(optimalMin, 0) + ' min.';
    else if (minutes < burnTime) rec = 'Good exposure. Apply sunscreen if staying longer.';
    else rec = 'Risk of sunburn! Apply SPF 30+ sunscreen or seek shade.';
    document.getElementById('vitaminD').textContent = fmt(totalIU, 0) + ' IU (target: 600-4000 IU/day)';
    document.getElementById('optimalTime').textContent = fmt(optimalMin, 0) + ' minutes (before sunscreen needed)';
    document.getElementById('burnTime').textContent = fmt(burnTime, 0) + ' minutes at UV ' + uvIndex;
    document.getElementById('recommendation').textContent = rec;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['skinType', 'uvIndex', 'skinExposed', 'minutes'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
