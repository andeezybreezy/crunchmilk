(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var bagWeight = parseFloat(document.getElementById('bagWeight').value) || 0;
    var airline = document.getElementById('airline').value;
    var bags = parseFloat(document.getElementById('bags').value) || 0;
    var checkedBagFee = parseFloat(document.getElementById('checkedBagFee').value) || 0;

    // Calculation logic
    var limits = {'domestic':50,'international':50,'budget':40,'premium':70};
    var limit = limits[airline];
    var over = Math.max(0, bagWeight - limit);
    var overFee = 0;
    if (over > 0 && over <= 20) overFee = 100;
    else if (over > 20 && over <= 50) overFee = 200;
    else if (over > 50) overFee = 400;
    var totalBags = bags * checkedBagFee;
    var totalCost = totalBags + overFee;
    document.getElementById('status').textContent = over === 0 ? 'GOOD — Within ' + limit + ' lb limit (' + fmt(limit - bagWeight, 1) + ' lbs to spare)' : 'OVERWEIGHT by ' + fmt(over, 1) + ' lbs';
    document.getElementById('overweight').textContent = over === 0 ? 'None' : fmt(over, 1) + ' lbs over ' + limit + ' lb limit';
    document.getElementById('overweightFee').textContent = overFee > 0 ? dollar(overFee) : 'None';
    document.getElementById('totalBagCost').textContent = dollar(totalCost) + ' (' + bags + ' bag(s) at ' + dollar(checkedBagFee) + ' + ' + dollar(overFee) + ' overweight)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['bagWeight', 'airline', 'bags', 'checkedBagFee'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
