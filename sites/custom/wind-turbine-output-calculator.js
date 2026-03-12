(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var rotorDiameter = parseFloat(document.getElementById('rotorDiameter').value) || 0;
    var avgWindSpeed = parseFloat(document.getElementById('avgWindSpeed').value) || 0;
    var hubHeight = parseFloat(document.getElementById('hubHeight').value) || 0;
    var electricRate = parseFloat(document.getElementById('electricRate').value) || 0;

    // Calculation logic
    var radiusM = (rotorDiameter / 2) * 0.3048;
    var area = Math.PI * radiusM * radiusM;
    var windMS = avgWindSpeed * 0.44704;
    var airDensity = 1.225;
    var efficiency = 0.35;
    var ratedWatts = 0.5 * airDensity * area * Math.pow(windMS, 2) * efficiency;
    var ratedKW = ratedWatts / 1000;
    var capacityFactor = 0.25;
    var annualKWh = ratedKW * 8760 * capacityFactor;
    var savings = annualKWh * electricRate;
    var installCost = ratedKW * 3000;
    var payback = savings > 0 ? installCost / savings : 999;
    document.getElementById('ratedPower').textContent = fmt(ratedKW, 2) + ' kW (' + fmt(ratedWatts, 0) + ' watts)';
    document.getElementById('annualKWh').textContent = fmt(annualKWh, 0) + ' kWh/year';
    document.getElementById('annualSavings').textContent = dollar(savings) + '/year';
    document.getElementById('payback').textContent = fmt(payback, 1) + ' years (at ' + dollar(installCost) + ' installed)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['rotorDiameter', 'avgWindSpeed', 'hubHeight', 'electricRate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
