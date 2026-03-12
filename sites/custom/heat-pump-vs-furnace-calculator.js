(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
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
