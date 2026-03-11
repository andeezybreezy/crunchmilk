(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var deposit = parseFloat(document.getElementById('deposit').value) || 0;
    var poolApy = parseFloat(document.getElementById('poolApy').value) || 0;
    var rewardToken = parseFloat(document.getElementById('rewardToken').value) || 0;
    var duration = parseFloat(document.getElementById('duration').value) || 0;
    var gasFees = parseFloat(document.getElementById('gasFees').value) || 0;

    // Calculation logic
    var months = duration; var poolRate = poolApy / 100; var rewardRate = rewardToken / 100; var poolEarnings = deposit * (Math.pow(1 + poolRate / 12, months) - 1); var rewardEarnings = deposit * (rewardRate / 12) * months; var totalGas = gasFees * months; var netProfit = poolEarnings + rewardEarnings - totalGas; var effectiveApy = (netProfit / deposit) * (12 / months) * 100; return {poolEarnings: dollar(poolEarnings), rewardEarnings: dollar(rewardEarnings), totalGas: dollar(totalGas), netProfit: dollar(netProfit), effectiveApy: fmt(effectiveApy, 1)};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['deposit', 'poolApy', 'rewardToken', 'duration', 'gasFees'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
