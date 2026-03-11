(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var bedrooms = parseFloat(document.getElementById('bedrooms').value) || 0;
    var distance = parseFloat(document.getElementById('distance').value) || 0;
    var type = document.getElementById('type').value;

    // Calculation logic
    var baseCost = {'DIY Truck': 200, 'Labor Only': 600, 'Full Service': 1500}; var base = baseCost[type] || 600; var sizeMult = bedrooms * 0.5 + 0.5; var distMult = distance > 100 ? 1 + distance/500 : 1; var estimate = base * sizeMult * distMult; var timeline = distance > 500 ? '2-4 days' : 'Same day';     document.getElementById('estimate').textContent = dollar(estimate);
    document.getElementById('timeline').textContent = timeline;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['bedrooms', 'distance', 'type'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
