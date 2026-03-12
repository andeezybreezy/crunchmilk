(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var proceedsOfSale = parseFloat(document.getElementById('proceedsOfSale').value) || 0;
    var adjustedCostBase = parseFloat(document.getElementById('adjustedCostBase').value) || 0;
    var sellingExpenses = parseFloat(document.getElementById('sellingExpenses').value) || 0;
    var marginalRate = parseFloat(document.getElementById('marginalRate').value) || 0;
    var capitalLosses = parseFloat(document.getElementById('capitalLosses').value) || 0;

    // Calculation logic
    var totalGainVal = proceedsOfSale - adjustedCostBase - sellingExpenses;
    totalGainVal = Math.max(0, totalGainVal);
    var netGainVal = Math.max(0, totalGainVal - capitalLosses);
    var taxable50 = 0;
    var taxable67 = 0;
    if (netGainVal <= 250000) {
      taxable50 = netGainVal * 0.50;
    } else {
      taxable50 = 250000 * 0.50;
      taxable67 = (netGainVal - 250000) * 0.6667;
    }
    var totalTaxable = taxable50 + taxable67;
    var tax = totalTaxable * (marginalRate / 100);
    document.getElementById('totalGain').textContent = '$' + totalGainVal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('netGain').textContent = '$' + netGainVal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('taxableGain50').textContent = '$' + taxable50.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('taxableGain67').textContent = netGainVal > 250000 ? '$' + taxable67.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 'N/A';
    document.getElementById('totalTaxableGain').textContent = '$' + totalTaxable.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('estimatedTax').textContent = '$' + tax.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['proceedsOfSale', 'adjustedCostBase', 'sellingExpenses', 'marginalRate', 'capitalLosses'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
