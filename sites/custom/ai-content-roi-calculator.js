(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var articlesPerMonth = parseFloat(document.getElementById('articlesPerMonth').value) || 0;
    var humanCostPerArticle = parseFloat(document.getElementById('humanCostPerArticle').value) || 0;
    var aiToolCost = parseFloat(document.getElementById('aiToolCost').value) || 0;
    var humanTimeHrs = parseFloat(document.getElementById('humanTimeHrs').value) || 0;
    var aiTimeHrs = parseFloat(document.getElementById('aiTimeHrs').value) || 0;
    var hourlyRate = parseFloat(document.getElementById('hourlyRate').value) || 0;

    // Calculation logic
    var humanTotal = articlesPerMonth * humanCostPerArticle;
    var aiEditCost = articlesPerMonth * aiTimeHrs * hourlyRate;
    var aiTotal = aiToolCost + aiEditCost;
    var savings = humanTotal - aiTotal;
    var timeSaved = articlesPerMonth * (humanTimeHrs - aiTimeHrs);
    var annualSave = savings * 12;
    var annualCost = aiToolCost * 12;
    var roi = (annualSave / annualCost) * 100;
    document.getElementById('humanMonthlyCost').textContent = dollar(humanTotal);
    document.getElementById('aiMonthlyCost').textContent = dollar(aiTotal);
    document.getElementById('monthlySavings').textContent = dollar(savings);
    document.getElementById('timeSaved').textContent = fmt(timeSaved, 0) + ' hours';
    document.getElementById('annualROI').textContent = fmt(roi, 0) + '%';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['articlesPerMonth', 'humanCostPerArticle', 'aiToolCost', 'humanTimeHrs', 'aiTimeHrs', 'hourlyRate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
