(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var cartridgePrice = parseFloat(document.getElementById('cartridgePrice').value) || 0;
    var pageYield = parseFloat(document.getElementById('pageYield').value) || 0;
    var pagesPerMonth = parseFloat(document.getElementById('pagesPerMonth').value) || 0;
    var numCartridges = document.getElementById('numCartridges').value;

    // Calculation logic
    var nCart = parseInt(numCartridges);
    var cpp = (cartridgePrice * nCart) / pageYield;
    var monthly = cpp * pagesPerMonth;
    var yearly = monthly * 12;
    var monthsPerSet = pageYield / pagesPerMonth;
    document.getElementById('costPerPage').textContent = '$' + (cpp).toFixed(3);
    document.getElementById('monthlyCost').textContent = dollar(monthly);
    document.getElementById('yearlyCost').textContent = dollar(yearly);
    document.getElementById('replacementFreq').textContent = fmt(monthsPerSet, 1) + ' months';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['cartridgePrice', 'pageYield', 'pagesPerMonth', 'numCartridges'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
