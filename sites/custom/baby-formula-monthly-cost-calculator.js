(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var ageMonths = parseFloat(document.getElementById('ageMonths').value) || 0;
    var formulaType = document.getElementById('formulaType').value;
    var feedingsPerDay = parseFloat(document.getElementById('feedingsPerDay').value) || 0;

    // Calculation logic
    var ozPerFeeding = ageMonths < 1 ? 2.5 : ageMonths < 3 ? 4 : ageMonths < 6 ? 6 : 8; var ozPerDay = ozPerFeeding * feedingsPerDay; var costs = {'Standard Powder ($0.15/oz)': 0.15, 'Organic ($0.22/oz)': 0.22, 'Specialty/Hypoallergenic ($0.30/oz)': 0.30, 'Ready-to-Feed ($0.35/oz)': 0.35}; var costPerOz = costs[formulaType] || 0.15; var monthlyCost = ozPerDay * costPerOz * 30; var annualCost = monthlyCost * 12;     document.getElementById('ozPerDay').textContent = fmt(ozPerDay,0);
    document.getElementById('monthlyCost').textContent = dollar(monthlyCost);
    document.getElementById('annualCost').textContent = dollar(annualCost);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['ageMonths', 'formulaType', 'feedingsPerDay'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
