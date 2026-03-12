(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var assessedValue = parseFloat(document.getElementById('assessedValue').value) || 0;
    var fairMarketValue = parseFloat(document.getElementById('fairMarketValue').value) || 0;
    var taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
    var appealCost = parseFloat(document.getElementById('appealCost').value) || 0;

    // Calculation logic
    var overAssessed = assessedValue - fairMarketValue;
    var currentTax = assessedValue * (taxRate / 100);
    var newTax = fairMarketValue * (taxRate / 100);
    var annualSave = currentTax - newTax;
    var netFirstYear = annualSave - appealCost;
    var fiveYear = (annualSave * 5) - appealCost;
    document.getElementById('overAssessed').textContent = overAssessed > 0 ? dollar(overAssessed) + ' over fair market value' : 'Assessment appears fair or undervalued';
    document.getElementById('currentTax').textContent = dollar(currentTax) + '/year';
    document.getElementById('newTax').textContent = dollar(newTax) + '/year';
    document.getElementById('annualSavings').textContent = annualSave > 0 ? dollar(annualSave) + '/year (' + dollar(netFirstYear) + ' first year after filing fee)' : 'No savings — assessment is fair';
    document.getElementById('fiveYearSavings').textContent = fiveYear > 0 ? dollar(fiveYear) + ' over 5 years' : 'Appeal not recommended';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['assessedValue', 'fairMarketValue', 'taxRate', 'appealCost'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
