(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var amount = parseFloat(document.getElementById('amount').value) || 0;
    var marketRate = parseFloat(document.getElementById('marketRate').value) || 0;
    var offeredRate = parseFloat(document.getElementById('offeredRate').value) || 0;

    // Calculation logic
    var atMarket=amount*marketRate; var atOffered=amount*offeredRate; var diff=atMarket-atOffered; var feePct=((marketRate-offeredRate)/marketRate)*100; var feeDollar=amount*(1-offeredRate/marketRate); return {atMarket:fmt(atMarket,2), atOffered:fmt(atOffered,2), feePct:fmt(feePct,2)+'%', feeDollar:dollar(feeDollar)};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['amount', 'marketRate', 'offeredRate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
