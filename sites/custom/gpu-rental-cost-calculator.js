(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var gpu = document.getElementById('gpu').value;
    var gpuCount = parseFloat(document.getElementById('gpuCount').value) || 0;
    var hoursPerDay = parseFloat(document.getElementById('hoursPerDay').value) || 0;
    var days = parseFloat(document.getElementById('days').value) || 0;

    // Calculation logic
    var rates={a100:1.50,h100:3.00,a10g:0.75,t4:0.35,l4:0.50}; var rate=rates[gpu]*gpuCount; var dailyCost=rate*hoursPerDay; var monthlyCost=dailyCost*days; var annualCost=monthlyCost*12; return {hourlyRate:dollar(rate)+'/hr', dailyCost:dollar(dailyCost), monthlyCost:dollar(monthlyCost), annualCost:dollar(annualCost)};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['gpu', 'gpuCount', 'hoursPerDay', 'days'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
