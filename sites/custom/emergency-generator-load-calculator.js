(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var essentialLoads = parseFloat(document.getElementById('essentialLoads').value) || 0;
    var motorLoads = parseFloat(document.getElementById('motorLoads').value) || 0;
    var startingMultiplier = parseFloat(document.getElementById('startingMultiplier').value) || 0;
    var powerFactor = parseFloat(document.getElementById('powerFactor').value) || 0;

    // Calculation logic
    var runW = essentialLoads + motorLoads;
    var startW = essentialLoads + (motorLoads * startingMultiplier);
    var kvaRun = runW / (powerFactor * 1000);
    var kvaStart = startW / (powerFactor * 1000);
    var kvaNeeded = Math.max(kvaRun, kvaStart);
    var stdSizes = [5,7.5,10,12,15,20,25,30,40,50,60,75,100,125,150,200];
    var recommended = stdSizes[stdSizes.length - 1];
    for (var i = 0; i < stdSizes.length; i++) { if (stdSizes[i] >= kvaNeeded) { recommended = stdSizes[i]; break; } }
    document.getElementById('runningLoad').textContent = fmt(runW, 0) + ' W (' + fmt(runW / 1000, 1) + ' kW)';
    document.getElementById('startingLoad').textContent = fmt(startW, 0) + ' W (' + fmt(startW / 1000, 1) + ' kW)';
    document.getElementById('kvaNeeded').textContent = fmt(recommended, 0) + ' kVA (min ' + fmt(kvaNeeded, 1) + ' kVA)';
    document.getElementById('kwNeeded').textContent = fmt(recommended * powerFactor, 0) + ' kW';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['essentialLoads', 'motorLoads', 'startingMultiplier', 'powerFactor'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
