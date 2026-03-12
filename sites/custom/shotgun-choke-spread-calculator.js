(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var choke = document.getElementById('choke').value;
    var distance = parseFloat(document.getElementById('distance').value) || 0;

    // Calculation logic
    var rates = {'Cylinder (no choke)': 1.5, 'Improved Cylinder': 1.2, 'Modified': 1.0, 'Improved Modified': 0.85, 'Full': 0.7}; var rate = rates[choke] || 1; var spread = distance * rate; var density = spread < 20 ? 'Very tight' : spread < 30 ? 'Tight' : spread < 40 ? 'Medium' : 'Wide/sparse';     document.getElementById('spread').textContent = fmt(spread,0);
    document.getElementById('density').textContent = density;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['choke', 'distance'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
