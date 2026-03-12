(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var caseType = document.getElementById('caseType').value;
    var complexity = document.getElementById('complexity').value;
    var region = document.getElementById('region').value;

    // Calculation logic
    var baseRates = {'Simple Contract': 250, 'Personal Injury': 0, 'Divorce': 300, 'Criminal Defense': 350, 'Business Litigation': 400, 'Estate Planning': 275}; var hours = {'Simple Contract': 10, 'Personal Injury': 0, 'Divorce': 20, 'Criminal Defense': 30, 'Business Litigation': 50, 'Estate Planning': 8}; var complexMult = {'Simple': 0.8, 'Moderate': 1, 'Complex': 1.8}; var regionMult = {'Rural': 0.7, 'Suburban': 0.9, 'Urban': 1.1, 'Major Metro': 1.4}; var rate = baseRates[caseType] * (regionMult[region] || 1); var totalHours = hours[caseType] * (complexMult[complexity] || 1); var totalEstimate = caseType === 'Personal Injury' ? 0 : rate * totalHours; var retainer = Math.min(totalEstimate * 0.3, 10000); var hourlyRate = rate; if (caseType === 'Personal Injury') { hourlyRate = 0; totalEstimate = 0; retainer = 0; }     document.getElementById('hourlyRate').textContent = caseType === 'Personal Injury' ? 'Contingency (33%)' : dollar(hourlyRate);
    document.getElementById('totalEstimate').textContent = caseType === 'Personal Injury' ? 'Contingency fee - no upfront cost' : dollar(totalEstimate);
    document.getElementById('retainer').textContent = caseType === 'Personal Injury' ? 'None' : dollar(retainer);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['caseType', 'complexity', 'region'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
