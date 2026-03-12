(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var distance = parseFloat(document.getElementById('distance').value) || 0;
    var choke = document.getElementById('choke').value;
    var shotSize = document.getElementById('shotSize').value;
    var loadOz = parseFloat(document.getElementById('loadOz').value) || 0;

    // Calculation logic
    var chokePct = parseFloat(choke);
    var pelletsPerOz = {'9':585,'8':410,'7.5':350,'6':225,'4':135,'2':90,'00':8};
    var ppo = pelletsPerOz[shotSize] || 350;
    var totalPellets = shotSize === '00' ? Math.round(8 * loadOz / 1.125) : Math.round(ppo * loadOz);
    var spreadInches = distance * 1.0 * (1 - chokePct) * 3 + 10;
    if (distance <= 10) spreadInches = 8 + distance * 0.5;
    var circleArea = Math.PI * 15 * 15;
    var patternArea = Math.PI * Math.pow(spreadInches / 2, 2);
    var inCircle = Math.round(totalPellets * chokePct * Math.min(1, circleArea / patternArea));
    inCircle = Math.min(inCircle, totalPellets);
    var density = inCircle / circleArea;
    document.getElementById('spreadDia').textContent = fmt(spreadInches, 0) + '" diameter at ' + distance + ' yards';
    document.getElementById('pelletCount').textContent = fmt(totalPellets, 0) + ' pellets';
    document.getElementById('inCircle').textContent = fmt(inCircle, 0) + ' pellets (' + fmt(inCircle / totalPellets * 100, 0) + '% in 30" circle)';
    document.getElementById('density').textContent = fmt(density, 2) + ' pellets per sq inch';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['distance', 'choke', 'shotSize', 'loadOz'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
