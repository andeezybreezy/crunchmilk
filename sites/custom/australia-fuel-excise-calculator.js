(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var fuelPrice = parseFloat(document.getElementById('fuelPrice').value) || 0;
    var fuelType = document.getElementById('fuelType').value;
    var weeklyLitres = parseFloat(document.getElementById('weeklyLitres').value) || 0;
    var kmPerLitre = parseFloat(document.getElementById('kmPerLitre').value) || 0;
    var weeksPerYear = parseFloat(document.getElementById('weeksPerYear').value) || 0;

    // Calculation logic
    var exciseRates = {petrol: 0.503, diesel: 0.503, premium: 0.503};
    var excise = exciseRates[fuelType];
    var gstPerL = fuelPrice / 11;
    var totalTaxPerL = excise + gstPerL;
    var taxPctVal = (totalTaxPerL / fuelPrice) * 100;
    var weeklyTaxVal = totalTaxPerL * weeklyLitres;
    var annualFuel = fuelPrice * weeklyLitres * weeksPerYear;
    var annualTax = totalTaxPerL * weeklyLitres * weeksPerYear;
    document.getElementById('excisePerLitre').textContent = 'A$' + excise.toFixed(3) + '/L';
    document.getElementById('gstPerLitre').textContent = 'A$' + gstPerL.toFixed(3) + '/L';
    document.getElementById('taxPct').textContent = taxPctVal.toFixed(1) + '%';
    document.getElementById('weeklyTax').textContent = 'A$' + weeklyTaxVal.toFixed(2);
    document.getElementById('annualFuelCost').textContent = 'A$' + annualFuel.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('annualTaxPaid').textContent = 'A$' + annualTax.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['fuelPrice', 'fuelType', 'weeklyLitres', 'kmPerLitre', 'weeksPerYear'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
