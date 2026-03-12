(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var homeSqFt = parseFloat(document.getElementById('homeSqFt').value) || 0;
    var currentBill = parseFloat(document.getElementById('currentBill').value) || 0;
    var systemCost = parseFloat(document.getElementById('systemCost').value) || 0;
    var taxCredit = parseFloat(document.getElementById('taxCredit').value) || 0;
    var cop = parseFloat(document.getElementById('cop').value) || 0;

    // Calculation logic
    var credit = systemCost * (taxCredit / 100);
    var netCost = systemCost - credit;
    var geoEfficiency = cop / 1.0;
    var geoBill = currentBill / geoEfficiency;
    var savings = currentBill - geoBill;
    var payback = savings > 0 ? netCost / savings : Infinity;
    var twentyYear = (savings * 20) - netCost;
    document.getElementById('netCost').textContent = dollar(netCost) + ' (after ' + dollar(credit) + ' tax credit)';
    document.getElementById('annualSavings').textContent = dollar(savings) + '/year (' + fmt(savings / currentBill * 100, 0) + '% reduction)';
    document.getElementById('payback').textContent = payback === Infinity ? 'N/A' : fmt(payback, 1) + ' years';
    document.getElementById('twentyYearSavings').textContent = dollar(twentyYear);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['homeSqFt', 'currentBill', 'systemCost', 'taxCredit', 'cop'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
