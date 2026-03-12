(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var miles = parseFloat(document.getElementById('miles').value) || 0;
    var gallons = parseFloat(document.getElementById('gallons').value) || 0;
    var gasPrice = parseFloat(document.getElementById('gasPrice').value) || 0;

    // Calculation logic
    var mpg = miles / gallons; var costPerMile = (gasPrice / mpg) * 100; var annualCost = (12000 / mpg) * gasPrice;     document.getElementById('mpg').textContent = fmt(mpg,1);
    document.getElementById('costPerMile').textContent = fmt(costPerMile,1);
    document.getElementById('annualCost').textContent = dollar(annualCost);

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
