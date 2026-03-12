(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var area = parseFloat(document.getElementById('area').value) || 0;
    var seedType = document.getElementById('seedType').value;
    var condition = document.getElementById('condition').value;

    // Calculation logic
    var rates = {'Kentucky Bluegrass': 2, 'Perennial Ryegrass': 4, 'Tall Fescue': 6, 'Bermuda': 1.5, 'Zoysia': 1.5}; var multipliers = {'Light Overseeding': 0.5, 'Moderate Repair': 1, 'Heavy Renovation': 1.5}; var base = rates[seedType] || 3; var mult = multipliers[condition] || 1; var seedLbs = (area / 1000) * base * mult; var bags = Math.ceil(seedLbs / 5); var cost = bags * 25;     document.getElementById('seedLbs').textContent = fmt(seedLbs,1);
    document.getElementById('bags').textContent = fmt(bags,0);
    document.getElementById('cost').textContent = dollar(cost);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['area', 'seedType', 'condition'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
