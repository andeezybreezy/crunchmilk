(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var renewableGrowth = parseFloat(document.getElementById('renewableGrowth').value) || 0;
    var lngExpansion = parseFloat(document.getElementById('lngExpansion').value) || 0;
    var demandReduction = parseFloat(document.getElementById('demandReduction').value) || 0;

    // Calculation logic
    var currentGasDep = 15; var currentOilDep = 25; var totalDep = 40; var annualReduction = renewableGrowth * 0.3 + lngExpansion * 0.2 + demandReduction; var gasYears = Math.ceil(currentGasDep / annualReduction); var oilYears = Math.ceil(currentOilDep / (annualReduction * 0.6)); var fullYears = Math.ceil(totalDep / annualReduction); var gasYear = 2026 + gasYears; var oilYear = 2026 + oilYears; var fullYear = 2026 + fullYears; var investment = fullYears * 120;     document.getElementById('currentDependency').textContent = totalDep + '% of energy from Russia/ME';
    document.getElementById('gasIndependence').textContent = gasYear.toString() + ' (from Russian gas)';
    document.getElementById('oilIndependence').textContent = oilYear.toString() + ' (from ME oil)';
    document.getElementById('fullIndependence').textContent = fullYear.toString();
    document.getElementById('investmentNeeded').textContent = '~' + Math.round(investment / 1000 * 10) / 10 + ' trillion EUR over ' + fullYears + ' years';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['renewableGrowth', 'lngExpansion', 'demandReduction'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
