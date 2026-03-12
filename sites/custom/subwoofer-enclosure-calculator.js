(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var driverSize = document.getElementById('driverSize').value;
    var enclosureType = document.getElementById('enclosureType').value;
    var drivers = parseFloat(document.getElementById('drivers').value) || 0;

    // Calculation logic
    var volumes = {'8': {'Sealed':0.35,'Ported':0.5,'Bandpass':0.7}, '10': {'Sealed':0.6,'Ported':1,'Bandpass':1.4}, '12': {'Sealed':1,'Ported':1.75,'Bandpass':2.5}, '15': {'Sealed':2,'Ported':3.5,'Bandpass':5}, '18': {'Sealed':3.5,'Ported':6,'Bandpass':8}}; var vol = volumes[driverSize][enclosureType] * drivers; var side = Math.pow(vol * 1728, 1/3); var dimensions = fmt(side,0) + ' x ' + fmt(side,0) + ' x ' + fmt(side,0) + ' inches (cube)'; var surfaceArea = 6 * side * side / 144; var woodSheets = Math.ceil(surfaceArea / 32);     document.getElementById('volume').textContent = fmt(vol,2);
    document.getElementById('dimensions').textContent = dimensions;
    document.getElementById('woodSheets').textContent = fmt(woodSheets,0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['driverSize', 'enclosureType', 'drivers'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
