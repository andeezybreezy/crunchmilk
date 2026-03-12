(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var amount = parseFloat(document.getElementById('amount').value) || 0;
    var marketRate = parseFloat(document.getElementById('marketRate').value) || 0;
    var offeredRate = parseFloat(document.getElementById('offeredRate').value) || 0;

    // Calculation logic
    var atMarket=amount*marketRate; var atOffered=amount*offeredRate; var diff=atMarket-atOffered; var feePct=((marketRate-offeredRate)/marketRate)*100; var feeDollar=amount*(1-offeredRate/marketRate);     document.getElementById('atMarket').textContent = fmt(atMarket,2);
    document.getElementById('atOffered').textContent = fmt(atOffered,2);
    document.getElementById('feePct').textContent = fmt(feePct,2)+'%';
    document.getElementById('feeDollar').textContent = dollar(feeDollar);

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
