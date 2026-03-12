(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var coinPrice = parseFloat(document.getElementById('coinPrice').value) || 0;
    var dailyVolume = parseFloat(document.getElementById('dailyVolume').value) || 0;
    var transactionUSD = parseFloat(document.getElementById('transactionUSD').value) || 0;
    var marketCap = parseFloat(document.getElementById('marketCap').value) || 0;

    // Calculation logic
    var coins = transactionUSD / coinPrice; var volPct = (transactionUSD / dailyVolume) * 100; var mcPct = (transactionUSD / marketCap) * 100; var status = transactionUSD >= 100000000 ? 'Mega Whale (100M+)' : transactionUSD >= 10000000 ? 'Whale (10M+)' : transactionUSD >= 1000000 ? 'Large Holder (1M+)' : transactionUSD >= 100000 ? 'Dolphin (100K+)' : 'Small Fish'; document.getElementById('coinAmount').textContent = fmt(coins, 4) + ' coins'; document.getElementById('volumePct').textContent = fmt(volPct, 4) + '%'; document.getElementById('marketCapPct').textContent = fmt(mcPct, 6) + '%'; document.getElementById('whaleStatus').textContent = status;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['coinPrice', 'dailyVolume', 'transactionUSD', 'marketCap'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
