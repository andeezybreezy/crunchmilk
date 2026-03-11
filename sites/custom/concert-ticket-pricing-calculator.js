(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var venueCost = parseFloat(document.getElementById('venueCost').value) || 0;
    var artistFee = parseFloat(document.getElementById('artistFee').value) || 0;
    var production = parseFloat(document.getElementById('production').value) || 0;
    var capacity = parseFloat(document.getElementById('capacity').value) || 0;
    var expectedFill = parseFloat(document.getElementById('expectedFill').value) || 0;

    // Calculation logic
    var totalCost = venueCost + artistFee + production;
    var expectedAttendees = Math.floor(capacity * (expectedFill / 100));
    var breakEvenPrice = totalCost / expectedAttendees;
    var suggested = Math.ceil(breakEvenPrice * 1.30);
    var revenue = suggested * expectedAttendees;
    var profit = revenue - totalCost;
    document.getElementById('totalCost').textContent = dollar(totalCost);
    document.getElementById('breakEven').textContent = dollar(breakEvenPrice) + ' (' + fmt(expectedAttendees, 0) + ' attendees)';
    document.getElementById('suggestedPrice').textContent = dollar(suggested) + ' (30% margin)';
    document.getElementById('projectedRevenue').textContent = dollar(revenue);
    document.getElementById('projectedProfit').textContent = dollar(profit);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['venueCost', 'artistFee', 'production', 'capacity', 'expectedFill'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
