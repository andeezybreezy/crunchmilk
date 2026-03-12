(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var regulation = document.getElementById('regulation').value;
    var employees = parseFloat(document.getElementById('employees').value) || 0;
    var dataVolume = document.getElementById('dataVolume').value;
    var currentState = document.getElementById('currentState').value;

    // Calculation logic
    var baseCosts = {'GDPR (EU)': 50000, 'CCPA/CPRA (California)': 30000, 'HIPAA (Healthcare)': 80000, 'SOC 2': 60000, 'Multiple Frameworks': 120000}; var sizeMultiplier = employees < 50 ? 0.5 : employees < 200 ? 1 : employees < 1000 ? 2 : 4; var volumeMultiplier = {'Under 10,000': 0.7, '10,000 - 100,000': 1, '100,000 - 1 million': 1.5, 'Over 1 million': 2.5}; var stateMultiplier = {'Starting from Scratch': 1.5, 'Partially Compliant': 1, 'Mostly Compliant': 0.4}; var initialCost = baseCosts[regulation] * sizeMultiplier * (volumeMultiplier[dataVolume] || 1) * (stateMultiplier[currentState] || 1); var annualMaintenance = initialCost * 0.3; var dpoSalary = employees > 100 ? 120000 : 0; var penalties = {'GDPR (EU)': 20000000, 'CCPA/CPRA (California)': 7500, 'HIPAA (Healthcare)': 1500000, 'SOC 2': 0, 'Multiple Frameworks': 20000000}; var penaltyRisk = penalties[regulation] || 0;     document.getElementById('initialCost').textContent = dollar(initialCost);
    document.getElementById('annualMaintenance').textContent = dollar(annualMaintenance);
    document.getElementById('dpoSalary').textContent = dpoSalary > 0 ? dollar(dpoSalary) : 'N/A (under 100 employees)';
    document.getElementById('penaltyRisk').textContent = penaltyRisk > 0 ? dollar(penaltyRisk) : 'Contractual only';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['regulation', 'employees', 'dataVolume', 'currentState'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
