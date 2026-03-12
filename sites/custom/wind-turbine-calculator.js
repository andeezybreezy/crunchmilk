(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var avgWindSpeed = parseFloat(document.getElementById('avgWindSpeed').value) || 0;
    var rotorDiameter = parseFloat(document.getElementById('rotorDiameter').value) || 0;
    var turbineCost = parseFloat(document.getElementById('turbineCost').value) || 0;
    var electricRate = parseFloat(document.getElementById('electricRate').value) || 0;

    // Calculation logic
    var windMs = avgWindSpeed * 0.44704;
    var rotorM = rotorDiameter * 0.3048;
    var area = Math.PI * Math.pow(rotorM / 2, 2);
    var airDensity = 1.225;
    var betzLimit = 0.35;
    var ratedPower = 0.5 * airDensity * area * Math.pow(windMs, 2) * betzLimit;
    var capacityFactor = 0.25;
    var annualKWH = ratedPower * 8760 * capacityFactor / 1000;
    var monthlySav = (annualKWH / 12) * electricRate;
    var annualSav = annualKWH * electricRate;
    var payback = annualSav > 0 ? turbineCost / annualSav : Infinity;
    document.getElementById('ratedPower').textContent = fmt(ratedPower, 0) + ' watts (' + fmt(ratedPower / 1000, 1) + ' kW)';
    document.getElementById('annualOutput').textContent = fmt(annualKWH, 0) + ' kWh/year';
    document.getElementById('monthlySavings').textContent = dollar(monthlySav) + '/month (' + dollar(annualSav) + '/year)';
    document.getElementById('payback').textContent = payback === Infinity ? 'Never' : fmt(payback, 1) + ' years';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['avgWindSpeed', 'rotorDiameter', 'turbineCost', 'electricRate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
