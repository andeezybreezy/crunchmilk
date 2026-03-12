(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var inputTokens = parseFloat(document.getElementById('inputTokens').value) || 0;
    var outputTokens = parseFloat(document.getElementById('outputTokens').value) || 0;

    // Calculation logic
    var models=[{name:'Claude Haiku',i:0.25,o:1.25},{name:'Claude Sonnet',i:3,o:15},{name:'Claude Opus',i:15,o:75},{name:'GPT-4o Mini',i:0.15,o:0.60},{name:'GPT-4o',i:2.50,o:10}]; var costs=models.map(function(m){return {name:m.name,cost:inputTokens*m.i+outputTokens*m.o};}); costs.sort(function(a,b){return a.cost-b.cost;}); return {haikuCost:dollar(costs.find(function(c){return c.name==='Claude Haiku';}).cost), sonnetCost:dollar(costs.find(function(c){return c.name==='Claude Sonnet';}).cost), opusCost:dollar(costs.find(function(c){return c.name==='Claude Opus';}).cost), gpt4oMiniCost:dollar(costs.find(function(c){return c.name==='GPT-4o Mini';}).cost), gpt4oCost:dollar(costs.find(function(c){return c.name==='GPT-4o';}).cost), cheapest:costs[0].name+' at '+dollar(costs[0].cost)};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['inputTokens', 'outputTokens'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
