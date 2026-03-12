(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var metalValue = parseFloat(document.getElementById('metalValue').value) || 0;
    var metalType = document.getElementById('metalType').value;
    var storageType = document.getElementById('storageType').value;
    var years = parseFloat(document.getElementById('years').value) || 0;

    // Calculation logic
    var rates = {'Home Safe': 0, 'Bank Safe Deposit Box': 0.002, 'Private Vault (Segregated)': 0.005, 'Private Vault (Allocated)': 0.004}; var silverPremium = metalType === 'Silver' ? 1.5 : metalType === 'Mixed Portfolio' ? 1.2 : 1; var annualRate = rates[storageType] || 0; var annualCost = storageType === 'Home Safe' ? 0 : Math.max(metalValue * annualRate * silverPremium, storageType === 'Bank Safe Deposit Box' ? 150 : 200); var totalCost = annualCost * years; var costAsPct = (annualCost / metalValue) * 100; var insuranceRate = storageType === 'Home Safe' ? 0.015 : storageType === 'Bank Safe Deposit Box' ? 0.005 : 0.001; var insuranceCost = metalValue * insuranceRate;     document.getElementById('annualCost').textContent = storageType === 'Home Safe' ? 'Free (but see insurance)' : dollar(annualCost);
    document.getElementById('totalCost').textContent = dollar(totalCost);
    document.getElementById('costAsPct').textContent = fmt(costAsPct, 2);
    document.getElementById('insuranceCost').textContent = dollar(insuranceCost);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['metalValue', 'metalType', 'storageType', 'years'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
