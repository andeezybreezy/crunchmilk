(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var estateValue = parseFloat(document.getElementById('estateValue').value) || 0;
    var planType = document.getElementById('planType').value;
    var state = document.getElementById('state').value;
    var method = document.getElementById('method').value;

    // Calculation logic
    var basePrices = {'Simple Will': {'Online Service': 150, 'Attorney (Small Firm)': 500, 'Attorney (Large Firm)': 1200}, 'Living Trust': {'Online Service': 500, 'Attorney (Small Firm)': 2500, 'Attorney (Large Firm)': 5000}, 'Complex Trust (Irrevocable)': {'Online Service': 0, 'Attorney (Small Firm)': 5000, 'Attorney (Large Firm)': 12000}, 'Full Estate Plan': {'Online Service': 800, 'Attorney (Small Firm)': 4000, 'Attorney (Large Firm)': 10000}}; var complexityMult = {'Simple (single, few assets)': 1, 'Moderate (married, home + accounts)': 1.5, 'Complex (business, multiple properties)': 2.5}; var base = basePrices[planType][method] || 1000; if (planType === 'Complex Trust (Irrevocable)' && method === 'Online Service') base = 5000; var documentCost = base * (complexityMult[state] || 1); var annualMaintenance = planType === 'Simple Will' ? 0 : documentCost * 0.05; var probateRate = estateValue > 1000000 ? 0.04 : 0.05; var probateSavings = planType !== 'Simple Will' ? estateValue * probateRate : 0; var totalFirstYear = documentCost + annualMaintenance;     document.getElementById('documentCost').textContent = dollar(documentCost);
    document.getElementById('annualMaintenance').textContent = annualMaintenance > 0 ? dollar(annualMaintenance) : 'None';
    document.getElementById('probateSavings').textContent = probateSavings > 0 ? dollar(probateSavings) : 'N/A (will goes through probate)';
    document.getElementById('totalFirstYear').textContent = dollar(totalFirstYear);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['estateValue', 'planType', 'state', 'method'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
