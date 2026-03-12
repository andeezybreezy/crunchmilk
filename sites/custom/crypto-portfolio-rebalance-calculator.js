(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var totalValue = parseFloat(document.getElementById('totalValue').value) || 0;
    var btcCurrent = parseFloat(document.getElementById('btcCurrent').value) || 0;
    var ethCurrent = parseFloat(document.getElementById('ethCurrent').value) || 0;
    var altCurrent = parseFloat(document.getElementById('altCurrent').value) || 0;
    var btcTarget = parseFloat(document.getElementById('btcTarget').value) || 0;
    var ethTarget = parseFloat(document.getElementById('ethTarget').value) || 0;
    var altTarget = parseFloat(document.getElementById('altTarget').value) || 0;

    // Calculation logic
    var btcDiff = (btcTarget - btcCurrent) / 100 * totalValue; var ethDiff = (ethTarget - ethCurrent) / 100 * totalValue; var altDiff = (altTarget - altCurrent) / 100 * totalValue; var totalTrade = (Math.abs(btcDiff) + Math.abs(ethDiff) + Math.abs(altDiff)) / 2; document.getElementById('btcTrade').textContent = (btcDiff >= 0 ? 'Buy ' : 'Sell ') + dollar(Math.abs(btcDiff)); document.getElementById('ethTrade').textContent = (ethDiff >= 0 ? 'Buy ' : 'Sell ') + dollar(Math.abs(ethDiff)); document.getElementById('altTrade').textContent = (altDiff >= 0 ? 'Buy ' : 'Sell ') + dollar(Math.abs(altDiff)); document.getElementById('totalTraded').textContent = dollar(totalTrade);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['totalValue', 'btcCurrent', 'ethCurrent', 'altCurrent', 'btcTarget', 'ethTarget', 'altTarget'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
