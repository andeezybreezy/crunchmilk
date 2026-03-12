(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var cartridgeCost = parseFloat(document.getElementById('cartridgeCost').value) || 0;
    var pageYield = parseFloat(document.getElementById('pageYield').value) || 0;
    var numCartridges = parseFloat(document.getElementById('numCartridges').value) || 0;
    var monthlyPages = parseFloat(document.getElementById('monthlyPages').value) || 0;
    var coveragePct = document.getElementById('coveragePct').value;

    // Calculation logic
    var cov = parseFloat(coveragePct); var adjYield = pageYield * (5 / cov); var costPerCart = cartridgeCost / adjYield; var cpp = costPerCart * numCartridges; var monthly = cpp * monthlyPages; var annual = monthly * 12; var setsYear = (monthlyPages * 12) / adjYield; document.getElementById('costPerPage').textContent = dollar(cpp); document.getElementById('monthlyCost').textContent = dollar(monthly); document.getElementById('annualCost').textContent = dollar(annual); document.getElementById('cartridgesYear').textContent = fmt(setsYear, 1) + ' sets';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['cartridgeCost', 'pageYield', 'numCartridges', 'monthlyPages', 'coveragePct'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
