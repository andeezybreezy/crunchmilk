(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var extruder = document.getElementById('extruder').value;
    var material = document.getElementById('material').value;
    var nozzle = parseFloat(document.getElementById('nozzle').value) || 0;

    // Calculation logic
    var distances = {'Direct Drive': {'PLA': 1, 'PETG': 1.5, 'ABS': 1, 'TPU': 0.5}, 'Bowden Tube': {'PLA': 5, 'PETG': 6, 'ABS': 5, 'TPU': 3}}; var speeds = {'Direct Drive': 25, 'Bowden Tube': 40}; var distance = distances[extruder][material] || 2; var speed = speeds[extruder] || 30; var tip = nozzle > 220 ? 'Higher temps need more retraction - add 0.5mm' : 'Temperature is in good range';     document.getElementById('distance').textContent = fmt(distance,1);
    document.getElementById('speed').textContent = fmt(speed,0);
    document.getElementById('tip').textContent = tip;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['extruder', 'material', 'nozzle'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
