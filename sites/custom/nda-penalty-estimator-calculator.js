(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var tradeSecretValue = parseFloat(document.getElementById('tradeSecretValue').value) || 0;
    var breachSeverity = document.getElementById('breachSeverity').value;
    var liquidated = parseFloat(document.getElementById('liquidated').value) || 0;

    // Calculation logic
    var severityMult = {'Minor (limited disclosure)': 0.1, 'Moderate (some competitive harm)': 0.3, 'Severe (public/competitor disclosure)': 0.7}; var mult = severityMult[breachSeverity] || 0.3; var estimatedDamages = liquidated > 0 ? liquidated : tradeSecretValue * mult; var legalCosts = Math.min(estimatedDamages * 0.15, 100000);     document.getElementById('estimatedDamages').textContent = dollar(estimatedDamages);
    document.getElementById('legalCosts').textContent = dollar(legalCosts);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['tradeSecretValue', 'breachSeverity', 'liquidated'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
