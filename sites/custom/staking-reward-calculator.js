(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var stakedAmount = parseFloat(document.getElementById('stakedAmount').value) || 0;
    var apy = parseFloat(document.getElementById('apy').value) || 0;
    var stakingPeriod = parseFloat(document.getElementById('stakingPeriod').value) || 0;
    var compounding = document.getElementById('compounding').value;

    // Calculation logic
    var rate = apy / 100; var periods = stakingPeriod; var finalVal; if (compounding === 'daily') { finalVal = stakedAmount * Math.pow(1 + rate/365, periods * 30.44); } else if (compounding === 'monthly') { finalVal = stakedAmount * Math.pow(1 + rate/12, periods); } else { finalVal = stakedAmount * (1 + rate * periods / 12); } var reward = finalVal - stakedAmount; var effAPY = (Math.pow(finalVal / stakedAmount, 12/periods) - 1) * 100; var monthly = reward / periods; document.getElementById('totalReward').textContent = dollar(reward); document.getElementById('effectiveAPY').textContent = fmt(effAPY, 2) + '%'; document.getElementById('finalValue').textContent = dollar(finalVal); document.getElementById('monthlyReward').textContent = dollar(monthly);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['stakedAmount', 'apy', 'stakingPeriod', 'compounding'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
