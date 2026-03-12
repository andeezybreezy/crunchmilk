(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var xrpAmount = parseFloat(document.getElementById('xrpAmount').value) || 0;
    var buyPrice = parseFloat(document.getElementById('buyPrice').value) || 0;
    var sellPrice = parseFloat(document.getElementById('sellPrice').value) || 0;
    var investment = parseFloat(document.getElementById('investment').value) || 0;

    // Calculation logic
    var xrp=xrpAmount>0?xrpAmount:investment/buyPrice; var invested=xrp*buyPrice; var currentValue=xrp*sellPrice; var profit=currentValue-invested; var returnPct=(profit/invested)*100;     document.getElementById('totalInvested').textContent = dollar(invested);
    document.getElementById('currentValue').textContent = dollar(currentValue);
    document.getElementById('profit').textContent = dollar(profit);
    document.getElementById('returnPct').textContent = fmt(returnPct,1)+'%';
    document.getElementById('xrpHeld').textContent = fmt(xrp,2)+' XRP';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['xrpAmount', 'buyPrice', 'sellPrice', 'investment'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
