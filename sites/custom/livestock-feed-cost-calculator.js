(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var headCount = parseFloat(document.getElementById('headCount').value) || 0;
    var dailyFeed = parseFloat(document.getElementById('dailyFeed').value) || 0;
    var feedPrice = parseFloat(document.getElementById('feedPrice').value) || 0;
    var days = parseFloat(document.getElementById('days').value) || 0;
    var supplement = parseFloat(document.getElementById('supplement').value) || 0;

    // Calculation logic
    var costPerLb = feedPrice / 2000; var dailyFeedCost = dailyFeed * costPerLb + supplement; var totalDailyCost = dailyFeedCost * headCount; var periodHead = dailyFeedCost * days; var grand = periodHead * headCount; document.getElementById('dailyCostHead').textContent = dollar(dailyFeedCost); document.getElementById('totalDaily').textContent = dollar(totalDailyCost); document.getElementById('periodCostHead').textContent = dollar(periodHead); document.getElementById('grandTotal').textContent = dollar(grand);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['headCount', 'dailyFeed', 'feedPrice', 'days', 'supplement'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
