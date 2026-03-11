(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var mpg = parseFloat(document.getElementById('mpg').value) || 0;
    var gasPrice = parseFloat(document.getElementById('gasPrice').value) || 0;
    var annualMiles = parseFloat(document.getElementById('annualMiles').value) || 0;

    // Calculation logic
    var costPerMile = gasPrice / mpg; var annualFuel = annualMiles * costPerMile; var monthlyFuel = annualFuel / 12;     document.getElementById('costPerMile').textContent = fmt(costPerMile * 100, 1);
    document.getElementById('annualFuel').textContent = dollar(annualFuel);
    document.getElementById('monthlyFuel').textContent = dollar(monthlyFuel);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['mpg', 'gasPrice', 'annualMiles'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
