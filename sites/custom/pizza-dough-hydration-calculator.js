(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var doughBalls = parseFloat(document.getElementById('doughBalls').value) || 0;
    var ballWeight = parseFloat(document.getElementById('ballWeight').value) || 0;
    var hydration = parseFloat(document.getElementById('hydration').value) || 0;
    var saltPct = parseFloat(document.getElementById('saltPct').value) || 0;

    // Calculation logic
    var totalDough = doughBalls * ballWeight;
    var flourPct = 100;
    var waterPct = hydration;
    var yeastPct = 0.3;
    var totalPct = flourPct + waterPct + saltPct + yeastPct;
    var flour = totalDough * (flourPct / totalPct);
    var water = totalDough * (waterPct / totalPct);
    var salt = totalDough * (saltPct / totalPct);
    var yeast = totalDough * (yeastPct / totalPct);
    document.getElementById('flour').textContent = fmt(flour, 0) + ' g (' + fmt(flour / 28.35, 1) + ' oz)';
    document.getElementById('water').textContent = fmt(water, 0) + ' g (' + fmt(water / 29.57, 1) + ' fl oz)';
    document.getElementById('salt').textContent = fmt(salt, 1) + ' g (' + fmt(salt / 6, 1) + ' tsp)';
    document.getElementById('yeast').textContent = fmt(yeast, 1) + ' g (' + fmt(yeast / 3, 1) + ' tsp)';
    document.getElementById('totalDough').textContent = fmt(totalDough, 0) + ' g for ' + fmt(doughBalls, 0) + ' balls';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['doughBalls', 'ballWeight', 'hydration', 'saltPct'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
