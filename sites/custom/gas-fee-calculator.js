(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var gasPrice = parseFloat(document.getElementById('gasPrice').value) || 0;
    var gasLimit = document.getElementById('gasLimit').value;
    var ethPrice = parseFloat(document.getElementById('ethPrice').value) || 0;
    var priorityFee = parseFloat(document.getElementById('priorityFee').value) || 0;

    // Calculation logic
    var limit = parseInt(gasLimit);
    var totalGwei = (gasPrice + priorityFee) * limit;
    var ethCost = totalGwei / 1e9;
    var usdCost = ethCost * ethPrice;
    var baseFeeUSD = (gasPrice * limit / 1e9) * ethPrice;
    var tipUSD = (priorityFee * limit / 1e9) * ethPrice;
    document.getElementById('totalGwei').textContent = fmt(totalGwei, 0) + ' Gwei';
    document.getElementById('ethCost').textContent = ethCost.toFixed(6) + ' ETH';
    document.getElementById('usdCost').textContent = dollar(usdCost);
    document.getElementById('comparison').textContent = 'Base: ' + dollar(baseFeeUSD) + ' + Tip: ' + dollar(tipUSD);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['gasPrice', 'gasLimit', 'ethPrice', 'priorityFee'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
