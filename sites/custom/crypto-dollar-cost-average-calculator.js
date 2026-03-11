(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var weeklyAmount = parseFloat(document.getElementById('weeklyAmount').value) || 0;
    var weeks = parseFloat(document.getElementById('weeks').value) || 0;
    var startPrice = parseFloat(document.getElementById('startPrice').value) || 0;
    var endPrice = parseFloat(document.getElementById('endPrice').value) || 0;

    // Calculation logic
    var totalInvested=weeklyAmount*weeks; var priceStep=(endPrice-startPrice)/weeks; var totalCrypto=0; var totalCostWeighted=0; for(var i=0;i<weeks;i++){var price=startPrice+priceStep*i; var bought=weeklyAmount/price; totalCrypto+=bought;} var avgCost=totalInvested/totalCrypto; var currentValue=totalCrypto*endPrice; var returnPct=((currentValue-totalInvested)/totalInvested)*100; return {totalInvested:dollar(totalInvested), cryptoAccumulated:fmt(totalCrypto,6), avgCostBasis:dollar(avgCost), currentValue:dollar(currentValue), returnPct:fmt(returnPct,1)+'%'};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['weeklyAmount', 'weeks', 'startPrice', 'endPrice'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
