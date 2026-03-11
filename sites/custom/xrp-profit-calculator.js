(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var xrpAmount = parseFloat(document.getElementById('xrpAmount').value) || 0;
    var buyPrice = parseFloat(document.getElementById('buyPrice').value) || 0;
    var sellPrice = parseFloat(document.getElementById('sellPrice').value) || 0;
    var investment = parseFloat(document.getElementById('investment').value) || 0;

    // Calculation logic
    var xrp=xrpAmount>0?xrpAmount:investment/buyPrice; var invested=xrp*buyPrice; var currentValue=xrp*sellPrice; var profit=currentValue-invested; var returnPct=(profit/invested)*100; return {totalInvested:dollar(invested), currentValue:dollar(currentValue), profit:dollar(profit), returnPct:fmt(returnPct,1)+'%', xrpHeld:fmt(xrp,2)+' XRP'};

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
