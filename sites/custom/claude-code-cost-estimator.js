(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var hoursPerDay = parseFloat(document.getElementById('hoursPerDay').value) || 0;
    var daysPerMonth = parseFloat(document.getElementById('daysPerMonth').value) || 0;
    var promptsPerHour = parseFloat(document.getElementById('promptsPerHour').value) || 0;
    var avgInputTokens = parseFloat(document.getElementById('avgInputTokens').value) || 0;
    var avgOutputTokens = parseFloat(document.getElementById('avgOutputTokens').value) || 0;
    var model = document.getElementById('model').value;

    // Calculation logic
    var pricing={haiku:{input:0.25,output:1.25},sonnet:{input:3,output:15},opus:{input:15,output:75}}; var p=pricing[model]; var monthlyPrompts=hoursPerDay*daysPerMonth*promptsPerHour; var totalIn=monthlyPrompts*avgInputTokens; var totalOut=monthlyPrompts*avgOutputTokens; var inCost=(totalIn/1000000)*p.input; var outCost=(totalOut/1000000)*p.output; var monthlyCost=inCost+outCost; var costPerHour=monthlyCost/(hoursPerDay*daysPerMonth); var costPerPrompt=monthlyCost/monthlyPrompts;     document.getElementById('monthlyPrompts').textContent = fmt(monthlyPrompts,0);
    document.getElementById('monthlyTokens').textContent = fmt((totalIn+totalOut)/1000000,1)+'M';
    document.getElementById('monthlyCost').textContent = dollar(monthlyCost);
    document.getElementById('costPerHour').textContent = dollar(costPerHour);
    document.getElementById('costPerPrompt').textContent = '$'+fmt(costPerPrompt, 2);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['hoursPerDay', 'daysPerMonth', 'promptsPerHour', 'avgInputTokens', 'avgOutputTokens', 'model'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
