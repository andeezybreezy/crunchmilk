(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var sqft = parseFloat(document.getElementById('sqft').value) || 0;
    var coats = parseFloat(document.getElementById('coats').value) || 0;
    var finishType = document.getElementById('finishType').value;
    var wastePct = parseFloat(document.getElementById('wastePct').value) || 0;

    // Calculation logic
    var coveragePerQt = parseFloat(finishType);
    var totalSqFt = sqft * coats * (1 + wastePct / 100);
    var qts = totalSqFt / coveragePerQt;
    var gals = qts / 4;
    var buyGal = Math.ceil(gals);
    var buyQt = Math.ceil(qts);
    var bestBuy = (buyGal <= buyQt / 3) ? buyGal + ' gallon(s)' : buyQt + ' quart(s)';
    document.getElementById('quartsNeeded').textContent = fmt(qts, 1) + ' quarts';
    document.getElementById('gallonsNeeded').textContent = bestBuy;
    document.getElementById('totalCoverage').textContent = fmt(totalSqFt, 0) + ' sq ft total';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['sqft', 'coats', 'finishType', 'wastePct'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
