(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var xrpAmount = parseFloat(document.getElementById('xrpAmount').value) || 0;
    var xrpPrice = parseFloat(document.getElementById('xrpPrice').value) || 0;
    var apy = parseFloat(document.getElementById('apy').value) || 0;
    var years = parseFloat(document.getElementById('years').value) || 0;

    // Calculation logic
    var initialValue=xrpAmount*xrpPrice; var futureXRP=xrpAmount*Math.pow(1+apy/100,years); var rewardsXRP=futureXRP-xrpAmount; var rewardsUSD=rewardsXRP*xrpPrice; var totalValue=futureXRP*xrpPrice;     document.getElementById('initialValue').textContent = dollar(initialValue);
    document.getElementById('futureXRP').textContent = fmt(futureXRP,2)+' XRP';
    document.getElementById('rewardsXRP').textContent = fmt(rewardsXRP,2)+' XRP';
    document.getElementById('rewardsUSD').textContent = dollar(rewardsUSD);
    document.getElementById('totalValue').textContent = dollar(totalValue);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['xrpAmount', 'xrpPrice', 'apy', 'years'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
