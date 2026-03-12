(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var people = parseFloat(document.getElementById('people').value) || 0;
    var hardness = parseFloat(document.getElementById('hardness').value) || 0;
    var ironLevel = parseFloat(document.getElementById('ironLevel').value) || 0;
    var dailyGallons = parseFloat(document.getElementById('dailyGallons').value) || 0;

    // Calculation logic
    var effectiveHardness = hardness + (ironLevel * 5);
    var dailyTotal = people * dailyGallons;
    var dailyGrains = dailyTotal * effectiveHardness;
    var weeklyGrains = dailyGrains * 7;
    var sizes = [24000, 32000, 40000, 48000, 64000, 80000, 96000];
    var recommended = sizes[sizes.length - 1];
    for (var i = 0; i < sizes.length; i++) { if (sizes[i] >= weeklyGrains) { recommended = sizes[i]; break; } }
    var regenPerMonth = (dailyGrains * 30) / recommended;
    var saltLbs = regenPerMonth * 8;
    document.getElementById('dailyGrains').textContent = fmt(dailyGrains, 0) + ' grains/day';
    document.getElementById('weeklyGrains').textContent = fmt(weeklyGrains, 0) + ' grains/week';
    document.getElementById('softenerSize').textContent = fmt(recommended, 0) + ' grain capacity';
    document.getElementById('saltPerMonth').textContent = fmt(saltLbs, 0) + ' lbs/month (' + fmt(regenPerMonth, 1) + ' regenerations)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['people', 'hardness', 'ironLevel', 'dailyGallons'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
