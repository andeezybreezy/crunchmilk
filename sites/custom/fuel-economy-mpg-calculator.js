(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var miles = parseFloat(document.getElementById('miles').value) || 0;
    var gallons = parseFloat(document.getElementById('gallons').value) || 0;
    var gasPrice = parseFloat(document.getElementById('gasPrice').value) || 0;

    // Calculation logic
    var mpg = miles / gallons; var costPerMile = (gasPrice / mpg) * 100; var annualCost = (12000 / mpg) * gasPrice; return {mpg: fmt(mpg,1), costPerMile: fmt(costPerMile,1), annualCost: dollar(annualCost)};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['miles', 'gallons', 'gasPrice'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
