(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var weight = parseFloat(document.getElementById('weight').value) || 0;
    var diameter = document.getElementById('diameter').value;
    var density = document.getElementById('density').value;

    // Calculation logic
    var dia = parseFloat(diameter);
    var dens = parseFloat(density);
    var radiusCM = dia / 20;
    var areaCM2 = Math.PI * radiusCM * radiusCM;
    var volumeCM3 = weight / dens;
    var lengthCM = volumeCM3 / areaCM2;
    var meters = lengthCM / 100;
    var feet = meters * 3.28084;
    var cpm = 25 / meters;
    document.getElementById('lengthM').textContent = fmt(meters, 1) + ' m';
    document.getElementById('lengthFt').textContent = fmt(feet, 0) + ' ft';
    document.getElementById('costPerMeter').textContent = dollar(cpm) + '/m';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['weight', 'diameter', 'density'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
