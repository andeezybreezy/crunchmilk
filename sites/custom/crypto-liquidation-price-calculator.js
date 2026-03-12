(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var entryPrice = parseFloat(document.getElementById('entryPrice').value) || 0;
    var leverage = parseFloat(document.getElementById('leverage').value) || 0;
    var positionType = document.getElementById('positionType').value;
    var marginBalance = parseFloat(document.getElementById('marginBalance').value) || 0;

    // Calculation logic
    var positionSize=marginBalance*leverage; var liqPct=1/leverage; var liqPrice; if(positionType==='long'){liqPrice=entryPrice*(1-liqPct+0.005);}else{liqPrice=entryPrice*(1+liqPct-0.005);} var distancePct=Math.abs(liqPrice-entryPrice)/entryPrice*100;     document.getElementById('positionSize').textContent = dollar(positionSize);
    document.getElementById('liqPrice').textContent = dollar(liqPrice);
    document.getElementById('distancePct').textContent = fmt(distancePct,1)+'% from entry';
    document.getElementById('maxLoss').textContent = dollar(marginBalance)+' (entire margin)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['entryPrice', 'leverage', 'positionType', 'marginBalance'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
