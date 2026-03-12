(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var grossIncome = parseFloat(document.getElementById('grossIncome').value) || 0;
    var filingStatus = document.getElementById('filingStatus').value;
    var stateTaxRate = parseFloat(document.getElementById('stateTaxRate').value) || 0;
    var annualSpending = parseFloat(document.getElementById('annualSpending').value) || 0;
    var salesTaxRate = parseFloat(document.getElementById('salesTaxRate').value) || 0;
    var propertyTax = parseFloat(document.getElementById('propertyTax').value) || 0;

    // Calculation logic
    var stdDed = filingStatus === 'married' ? 29200 : 14600; var taxableIncome = Math.max(0, grossIncome - stdDed); var fedTax = 0; if (filingStatus === 'married') { if (taxableIncome <= 23200) fedTax = taxableIncome * 0.10; else if (taxableIncome <= 94300) fedTax = 2320 + (taxableIncome - 23200) * 0.12; else if (taxableIncome <= 201050) fedTax = 10852 + (taxableIncome - 94300) * 0.22; else if (taxableIncome <= 383900) fedTax = 34337 + (taxableIncome - 201050) * 0.24; else fedTax = 78221 + (taxableIncome - 383900) * 0.32; } else { if (taxableIncome <= 11600) fedTax = taxableIncome * 0.10; else if (taxableIncome <= 47150) fedTax = 1160 + (taxableIncome - 11600) * 0.12; else if (taxableIncome <= 100525) fedTax = 5426 + (taxableIncome - 47150) * 0.22; else if (taxableIncome <= 191950) fedTax = 17168.50 + (taxableIncome - 100525) * 0.24; else fedTax = 39110.50 + (taxableIncome - 191950) * 0.32; } var stTax = grossIncome * (stateTaxRate / 100); var ssWage = Math.min(grossIncome, 168600); var fica = ssWage * 0.062 + grossIncome * 0.0145; var salesPaid = annualSpending * (salesTaxRate / 100); var totalTax = fedTax + stTax + fica + salesPaid + propertyTax; var effRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0; document.getElementById('federalTax').textContent = dollar(fedTax) + ' (' + fmt((fedTax / grossIncome) * 100, 1) + '%)'; document.getElementById('stateTax').textContent = dollar(stTax) + ' (' + fmt(stateTaxRate, 1) + '%)'; document.getElementById('ficaTax').textContent = dollar(fica) + ' (' + fmt((fica / grossIncome) * 100, 1) + '%)'; document.getElementById('salesTaxPaid').textContent = dollar(salesPaid); document.getElementById('totalTaxes').textContent = dollar(totalTax); document.getElementById('effectiveRate').textContent = fmt(effRate, 1) + '% of gross income';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['grossIncome', 'filingStatus', 'stateTaxRate', 'annualSpending', 'salesTaxRate', 'propertyTax'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
