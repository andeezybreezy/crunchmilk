(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var flour = parseFloat(document.getElementById('flour').value) || 0;
    var water = parseFloat(document.getElementById('water').value) || 0;
    var starter = parseFloat(document.getElementById('starter').value) || 0;
    var starterHydration = parseFloat(document.getElementById('starterHydration').value) || 0;

    // Calculation logic
    var starterFlour = starter / (1 + starterHydration/100); var starterWater = starter - starterFlour; var totalFlour = flour + starterFlour; var totalWater = water + starterWater; var hydration = (totalWater / totalFlour) * 100;     document.getElementById('hydration').textContent = fmt(hydration,1);
    document.getElementById('totalFlour').textContent = fmt(totalFlour,0);
    document.getElementById('totalWater').textContent = fmt(totalWater,0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['flour', 'water', 'starter', 'starterHydration'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
