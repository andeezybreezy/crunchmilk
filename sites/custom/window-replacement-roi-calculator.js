(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var windows = parseFloat(document.getElementById('windows').value) || 0;
    var costPerWindow = parseFloat(document.getElementById('costPerWindow').value) || 0;
    var monthlyEnergy = parseFloat(document.getElementById('monthlyEnergy').value) || 0;
    var currentType = document.getElementById('currentType').value;

    // Calculation logic
    var savingsPct = {'Single Pane': 0.25, 'Old Double Pane (15+ years)': 0.12, 'Decent Double Pane': 0.05}; var pct = savingsPct[currentType] || 0.12; var totalCost = windows * costPerWindow; var annualSavings = monthlyEnergy * 12 * pct; var roiYears = annualSavings > 0 ? totalCost / annualSavings : 999;     document.getElementById('totalCost').textContent = dollar(totalCost);
    document.getElementById('annualSavings').textContent = dollar(annualSavings);
    document.getElementById('roiYears').textContent = fmt(roiYears,1);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['windows', 'costPerWindow', 'monthlyEnergy', 'currentType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
