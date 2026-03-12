(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var jobsAdded = parseFloat(document.getElementById('jobsAdded').value) || 0;
    var expectedJobs = parseFloat(document.getElementById('expectedJobs').value) || 0;
    var unemploymentRate = parseFloat(document.getElementById('unemploymentRate').value) || 0;
    var wageGrowth = parseFloat(document.getElementById('wageGrowth').value) || 0;
    var mortgageBalance = parseFloat(document.getElementById('mortgageBalance').value) || 0;
    var savingsBalance = parseFloat(document.getElementById('savingsBalance').value) || 0;

    // Calculation logic
    var surprise = jobsAdded - expectedJobs; var surprisePct = expectedJobs !== 0 ? (surprise / expectedJobs) * 100 : 0; var hotLabor = jobsAdded > 300 || wageGrowth > 4.5; var coldLabor = jobsAdded < 100 || unemploymentRate > 5; var rateMove = 0; if (surprise > 100) rateMove = 0.15; else if (surprise > 50) rateMove = 0.08; else if (surprise > 0) rateMove = 0.03; else if (surprise > -50) rateMove = -0.03; else if (surprise > -100) rateMove = -0.08; else rateMove = -0.15; if (wageGrowth > 4.5) rateMove += 0.05; var rateOutlook = rateMove > 0 ? 'Rates likely to rise or stay higher longer' : 'Rates more likely to fall — Fed may cut sooner'; var mortgageAnnual = mortgageBalance * (rateMove / 100); var savingsAnnual = savingsBalance * (rateMove / 100); var marketDir = surprise > 50 ? 'Stocks may dip (higher-for-longer rates)' : surprise < -50 ? 'Stocks may rally (rate cuts expected)' : 'Modest market reaction expected'; var fedAction = hotLabor ? 'Fed likely to hold rates or hike — strong jobs reduce cut urgency' : coldLabor ? 'Fed likely to cut rates — weak jobs signal economic slowdown' : 'Fed likely to stay the course — labor market in balance'; document.getElementById('surprise').textContent = (surprise >= 0 ? '+' : '') + fmt(surprise, 0) + 'K (' + (surprise > 0 ? 'hotter' : surprise < 0 ? 'cooler' : 'in-line') + ' than expected)'; document.getElementById('rateOutlook').textContent = rateOutlook; document.getElementById('mortgageImpact').textContent = (mortgageAnnual >= 0 ? '+' : '') + dollar(Math.abs(mortgageAnnual)) + '/year ' + (mortgageAnnual >= 0 ? 'more' : 'less') + ' in interest'; document.getElementById('savingsImpact').textContent = (savingsAnnual >= 0 ? '+' : '') + dollar(Math.abs(savingsAnnual)) + '/year ' + (savingsAnnual >= 0 ? 'more' : 'less') + ' earned'; document.getElementById('marketReaction').textContent = marketDir; document.getElementById('fedAction').textContent = fedAction;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['jobsAdded', 'expectedJobs', 'unemploymentRate', 'wageGrowth', 'mortgageBalance', 'savingsBalance'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
