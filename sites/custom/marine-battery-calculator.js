(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var dailyAh = parseFloat(document.getElementById('dailyAh').value) || 0;
    var daysAnchor = parseFloat(document.getElementById('daysAnchor').value) || 0;
    var battType = document.getElementById('battType').value;

    // Calculation logic
    var dod = {fla: 0.50, agm: 0.50, lifepo4: 0.80}; var costs = {fla: 1.5, agm: 2.5, lifepo4: 5}; var maxDod = dod[battType] || 0.50; var costPerAh = costs[battType] || 2.5; var totalNeed = dailyAh * daysAnchor; var bankAh = Math.ceil(totalNeed / maxDod); var numBatt = Math.ceil(bankAh / 100); var cost = bankAh * costPerAh; document.getElementById('totalAh').textContent = fmt(totalNeed, 0) + ' Ah'; document.getElementById('bankSize').textContent = fmt(bankAh, 0) + ' Ah'; document.getElementById('batteries').textContent = numBatt + ' × 100Ah'; document.getElementById('estCost').textContent = dollar(cost);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['dailyAh', 'daysAnchor', 'battType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
