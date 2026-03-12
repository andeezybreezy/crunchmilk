(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var sqft = parseFloat(document.getElementById('sqft').value) || 0;
    var heatingDays = parseFloat(document.getElementById('heatingDays').value) || 0;
    var gasRate = parseFloat(document.getElementById('gasRate').value) || 0;
    var electricRate = parseFloat(document.getElementById('electricRate').value) || 0;

    // Calculation logic
    var dailyBtu = sqft * 25; var annualBtu = dailyBtu * heatingDays; var therms = annualBtu / 100000 / 0.95; var furnaceCost = therms * gasRate; var kwhNeeded = annualBtu / 3412 / 3; var heatPumpCost = kwhNeeded * electricRate; var savings = furnaceCost - heatPumpCost;     document.getElementById('furnaceCost').textContent = dollar(furnaceCost);
    document.getElementById('heatPumpCost').textContent = dollar(heatPumpCost);
    document.getElementById('savings').textContent = dollar(savings);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['sqft', 'heatingDays', 'gasRate', 'electricRate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
