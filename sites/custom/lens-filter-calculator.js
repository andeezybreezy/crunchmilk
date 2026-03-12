(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var baseShutter = document.getElementById('baseShutter').value;
    var ndStops = document.getElementById('ndStops').value;
    var baseAperture = parseFloat(document.getElementById('baseAperture').value) || 0;
    var baseISO = parseFloat(document.getElementById('baseISO').value) || 0;

    // Calculation logic
    var stops = parseInt(ndStops);
    var base = parseFloat(baseShutter);
    var factor = Math.pow(2, stops);
    var newShutter = base * factor;
    var lightPct = (1 / factor) * 100;
    var shutterStr;
    if (newShutter >= 60) shutterStr = fmt(newShutter / 60, 1) + ' minutes';
    else if (newShutter >= 1) shutterStr = fmt(newShutter, 1) + ' seconds';
    else shutterStr = '1/' + fmt(1/newShutter, 0) + 's';
    var tip;
    if (newShutter >= 30) tip = 'Use bulb mode, remote shutter release, and sturdy tripod. Cover viewfinder to prevent light leak.';
    else if (newShutter >= 1) tip = 'Use tripod and timer/remote. Mirror lock-up recommended for DSLRs.';
    else tip = 'Handheld may work with stabilization. Tripod recommended for sharpest results.';
    document.getElementById('newShutter').textContent = shutterStr;
    document.getElementById('filterFactor').textContent = factor + '× (ND' + factor + ')';
    document.getElementById('lightReduction').textContent = fmt(lightPct, stops > 6 ? 4 : 2) + '% of original light (' + stops + ' stops)';
    document.getElementById('tip').textContent = tip;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['baseShutter', 'ndStops', 'baseAperture', 'baseISO'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
