(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var currentBlock = parseFloat(document.getElementById('currentBlock').value) || 0;
    var btcPrice = parseFloat(document.getElementById('btcPrice').value) || 0;
    var blockReward = parseFloat(document.getElementById('blockReward').value) || 0;

    // Calculation logic
    var halvingInterval=210000; var currentEpoch=Math.floor(currentBlock/halvingInterval); var nextHalving=(currentEpoch+1)*halvingInterval; var blocksRemaining=nextHalving-currentBlock; var daysRemaining=Math.round(blocksRemaining*10/60/24); var newReward=blockReward/2; var dailyBTC=blockReward*144; return {nextHalving:fmt(nextHalving,0), blocksRemaining:fmt(blocksRemaining,0)+' blocks', daysRemaining:fmt(daysRemaining,0)+' days (~'+fmt(daysRemaining/365,1)+' years)', newReward:fmt(newReward,4)+' BTC', dailySupply:fmt(dailyBTC,1)+' BTC/day ('+dollar(dailyBTC*btcPrice)+')'};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['currentBlock', 'btcPrice', 'blockReward'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
