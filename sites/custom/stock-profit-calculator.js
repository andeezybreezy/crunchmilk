(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var bp=f('buyPrice');var s=f('shares');var sp=f('sellPrice');var c=f('commission');var cost=bp*s+c;var rev=sp*s-c;var profit=rev-cost;var _r = {totalCost:$(cost),totalRevenue:$(rev),profit:$(profit),returnPct:pct(profit/(bp*s)*100,2)};

    document.getElementById('totalCost').textContent = _r.totalCost;
    document.getElementById('totalRevenue').textContent = _r.totalRevenue;
    document.getElementById('profit').textContent = _r.profit;
    document.getElementById('returnPct').textContent = _r.returnPct;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['buyPrice', 'shares', 'sellPrice', 'commission'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
