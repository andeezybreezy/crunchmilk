(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var weight = parseFloat(document.getElementById('weight').value) || 0;
    var foodQuality = document.getElementById('foodQuality').value;
    var activity = document.getElementById('activity').value;

    // Calculation logic
    var baseCups = weight * 0.04 + 0.5; var actMult = {'Low': 0.8, 'Moderate': 1, 'High': 1.3, 'Working Dog': 1.6}; var cupsPerDay = baseCups * (actMult[activity] || 1); var lbsPerMonth = cupsPerDay * 0.25 * 30; var prices = {'Budget ($1/lb)': 1, 'Mid-Range ($2/lb)': 2, 'Premium ($3.50/lb)': 3.5, 'Raw/Fresh ($5/lb)': 5}; var monthlyCost = lbsPerMonth * (prices[foodQuality] || 2);     document.getElementById('cupsPerDay').textContent = fmt(cupsPerDay,1);
    document.getElementById('lbsPerMonth').textContent = fmt(lbsPerMonth,1);
    document.getElementById('monthlyCost').textContent = dollar(monthlyCost);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['weight', 'foodQuality', 'activity'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
