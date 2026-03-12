(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var model = document.getElementById('model').value;
    var inputTokens = parseFloat(document.getElementById('inputTokens').value) || 0;
    var outputTokens = parseFloat(document.getElementById('outputTokens').value) || 0;
    var requests = parseFloat(document.getElementById('requests').value) || 0;
    var days = parseFloat(document.getElementById('days').value) || 0;

    // Calculation logic
    var pricing={haiku:{input:0.25,output:1.25},sonnet:{input:3,output:15},opus:{input:15,output:75}}; var p=pricing[model]; var inCost=(inputTokens/1000000)*p.input; var outCost=(outputTokens/1000000)*p.output; var costPerReq=inCost+outCost; var dailyCost=costPerReq*requests; var monthlyCost=dailyCost*days; var monthlyIn=inCost*requests*days; var monthlyOut=outCost*requests*days;     document.getElementById('costPerReq').textContent = '$'+fmt(costPerReq,6);
    document.getElementById('dailyCost').textContent = dollar(dailyCost);
    document.getElementById('monthlyCost').textContent = dollar(monthlyCost);
    document.getElementById('inputCost').textContent = dollar(monthlyIn);
    document.getElementById('outputCost').textContent = dollar(monthlyOut);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['model', 'inputTokens', 'outputTokens', 'requests', 'days'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
