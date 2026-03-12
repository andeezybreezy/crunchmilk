(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var gasPrice = parseFloat(document.getElementById('gasPrice').value) || 0;
    var gasLimit = parseFloat(document.getElementById('gasLimit').value) || 0;
    var ethPrice = parseFloat(document.getElementById('ethPrice').value) || 0;

    // Calculation logic
    var gasGwei=gasPrice*gasLimit; var gasFeeETH=gasGwei/1e9; var gasFeeUSD=gasFeeETH*ethPrice;     document.getElementById('gasFeeETH').textContent = fmt(gasFeeETH, 2)+' ETH';
    document.getElementById('gasFeeUSD').textContent = dollar(gasFeeUSD);
    document.getElementById('gasGwei').textContent = fmt(gasGwei,0)+' Gwei';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['gasPrice', 'gasLimit', 'ethPrice'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
