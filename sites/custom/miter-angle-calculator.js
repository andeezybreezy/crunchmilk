(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var cornerAngle = parseFloat(document.getElementById('cornerAngle').value) || 0;
    var numSides = parseFloat(document.getElementById('numSides').value) || 0;
    var tiltAngle = parseFloat(document.getElementById('tiltAngle').value) || 0;

    // Calculation logic
    var interior = (numSides - 2) * 180 / numSides;
    var miter = (180 - interior) / 2;
    var tilt = tiltAngle * Math.PI / 180;
    var miterRad = miter * Math.PI / 180;
    var compMiter, compBevel;
    if (tiltAngle === 0) {
      compMiter = miter;
      compBevel = 0;
    } else {
      compMiter = Math.atan(Math.sin(miterRad) * Math.cos(tilt)) * 180 / Math.PI;
      compBevel = Math.atan(Math.cos(miterRad) * Math.sin(tilt)) * 180 / Math.PI;
    }
    document.getElementById('miterAngle').textContent = fmt(compMiter, 2) + '°';
    document.getElementById('bevelAngle').textContent = fmt(compBevel, 2) + '°';
    document.getElementById('bladeAngle').textContent = fmt(90 - compMiter, 2) + '° from fence';
    document.getElementById('interiorAngle').textContent = fmt(interior, 2) + '°';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['cornerAngle', 'numSides', 'tiltAngle'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
