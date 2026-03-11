(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var objectMass = parseFloat(document.getElementById('objectMass').value) || 0;
    var objectVolume = parseFloat(document.getElementById('objectVolume').value) || 0;
    var fluidDensity = document.getElementById('fluidDensity').value;

    // Calculation logic
    var fluidD = parseFloat(fluidDensity);
    var g = 9.81;
    var objectDensity = objectMass / objectVolume;
    var buoyantF = fluidD * objectVolume * g;
    var weightF = objectMass * g;
    var netF = buoyantF - weightF;
    var floats = objectDensity < fluidD;
    var subPct = floats ? (objectDensity / fluidD) * 100 : 100;
    document.getElementById('buoyantForce').textContent = fmt(buoyantF, 2) + ' N';
    document.getElementById('objectWeight').textContent = fmt(weightF, 2) + ' N';
    document.getElementById('netForce').textContent = fmt(netF, 2) + ' N (' + (netF > 0 ? 'upward' : 'downward') + ')';
    document.getElementById('floatOrSink').textContent = floats ? 'FLOATS (density ' + fmt(objectDensity, 0) + ' < fluid ' + fmt(fluidD, 0) + ' kg/m³)' : 'SINKS (density ' + fmt(objectDensity, 0) + ' > fluid ' + fmt(fluidD, 0) + ' kg/m³)';
    document.getElementById('submergedPct').textContent = floats ? fmt(subPct, 1) + '% submerged' : '100% submerged (sinking)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['objectMass', 'objectVolume', 'fluidDensity'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
