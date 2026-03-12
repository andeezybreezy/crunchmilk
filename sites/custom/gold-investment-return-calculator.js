(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var investment = parseFloat(document.getElementById('investment').value) || 0;
    var buyPrice = parseFloat(document.getElementById('buyPrice').value) || 0;
    var currentPrice = parseFloat(document.getElementById('currentPrice').value) || 0;
    var years = parseFloat(document.getElementById('years').value) || 0;

    // Calculation logic
    var ounces=investment/buyPrice; var currentVal=ounces*currentPrice; var profit=currentVal-investment; var returnPct=(profit/investment)*100; var annualized=(Math.pow(currentVal/investment,1/years)-1)*100;     document.getElementById('ounces').textContent = fmt(ounces, 2)+' oz';
    document.getElementById('currentVal').textContent = dollar(currentVal);
    document.getElementById('profit').textContent = dollar(profit);
    document.getElementById('returnPct').textContent = fmt(returnPct,1)+'%';
    document.getElementById('annualized').textContent = fmt(annualized,1)+'%';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['investment', 'buyPrice', 'currentPrice', 'years'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
