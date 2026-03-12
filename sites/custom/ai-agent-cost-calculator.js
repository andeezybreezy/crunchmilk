(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var stepsPerTask = parseFloat(document.getElementById('stepsPerTask').value) || 0;
    var tokensPerStep = parseFloat(document.getElementById('tokensPerStep').value) || 0;
    var tasksPerDay = parseFloat(document.getElementById('tasksPerDay').value) || 0;
    var model = document.getElementById('model').value;
    var days = parseFloat(document.getElementById('days').value) || 0;

    // Calculation logic
    var pricing={haiku:{avg:0.75},sonnet:{avg:9},opus:{avg:45}}; var avgRate=pricing[model].avg; var tokPerTask=stepsPerTask*tokensPerStep; var costPerTask=(tokPerTask/1000000)*avgRate; var dailyCost=costPerTask*tasksPerDay; var monthlyCost=dailyCost*days;     document.getElementById('tokensPerTask').textContent = fmt(tokPerTask,0);
    document.getElementById('costPerTask').textContent = '$'+fmt(costPerTask,4);
    document.getElementById('dailyCost').textContent = dollar(dailyCost);
    document.getElementById('monthlyCost').textContent = dollar(monthlyCost);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['stepsPerTask', 'tokensPerStep', 'tasksPerDay', 'model', 'days'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
