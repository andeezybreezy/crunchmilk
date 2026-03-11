(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var pipeLength = parseFloat(document.getElementById('pipeLength').value) || 0;
    var pipeDiameter = document.getElementById('pipeDiameter').value;
    var insulationType = document.getElementById('insulationType').value;
    var waterTemp = parseFloat(document.getElementById('waterTemp').value) || 0;

    // Calculation logic
    var costs = {'foam':1.50,'fiberglass':3.00,'rubber':4.00};
    var rValues = {'foam':2.0,'fiberglass':3.5,'rubber':3.0};
    var waste = 1.10;
    var material = pipeLength * waste;
    var cost = material * costs[insulationType];
    var rVal = rValues[insulationType];
    var heatReduction = Math.min(95, rVal * 25);
    var tempDiff = Math.abs(waterTemp - 70);
    var annualSavings = (pipeLength * tempDiff * 0.02 * (heatReduction / 100));
    document.getElementById('materialNeeded').textContent = fmt(material, 0) + ' linear feet (includes 10% waste)';
    document.getElementById('materialCost').textContent = dollar(cost);
    document.getElementById('heatLossReduction').textContent = fmt(heatReduction, 0) + '% reduction (R-' + fmt(rVal, 1) + ' insulation)';
    document.getElementById('annualSavings').textContent = dollar(annualSavings) + '/year in energy costs';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['pipeLength', 'pipeDiameter', 'insulationType', 'waterTemp'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
