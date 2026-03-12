(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var gasLimit = parseFloat(document.getElementById('gasLimit').value) || 0;
    var gasPrice = parseFloat(document.getElementById('gasPrice').value) || 0;
    var ethPrice = parseFloat(document.getElementById('ethPrice').value) || 0;
    var txValue = parseFloat(document.getElementById('txValue').value) || 0;

    // Calculation logic
    var feeWei = gasLimit * gasPrice; var feeETHval = feeWei / 1e9; var feeUSDval = feeETHval * ethPrice; var feePctVal = (feeUSDval / txValue) * 100; var lowFee = gasLimit * 10 / 1e9 * ethPrice; var savings = feeUSDval - lowFee; document.getElementById('feeETH').textContent = fmt(feeETHval, 2) + ' ETH'; document.getElementById('feeUSD').textContent = dollar(feeUSDval); document.getElementById('feePct').textContent = fmt(feePctVal, 2) + '%'; document.getElementById('savingsLow').textContent = dollar(savings) + ' (at 10 gwei)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['gasLimit', 'gasPrice', 'ethPrice', 'txValue'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
