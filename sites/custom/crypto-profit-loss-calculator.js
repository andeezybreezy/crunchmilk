(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var buyPrice = parseFloat(document.getElementById('buyPrice').value) || 0;
    var sellPrice = parseFloat(document.getElementById('sellPrice').value) || 0;
    var quantity = parseFloat(document.getElementById('quantity').value) || 0;
    var fees = parseFloat(document.getElementById('fees').value) || 0;

    // Calculation logic
    var invested = buyPrice * quantity; var returned = sellPrice * quantity; var profitLoss = returned - invested; var roi = (profitLoss / invested) * 100; var afterFees = profitLoss - fees;     document.getElementById('profitLoss').textContent = dollar(profitLoss);
    document.getElementById('roi').textContent = (roi >= 0 ? '+' : '') + fmt(roi,1);
    document.getElementById('afterFees').textContent = dollar(afterFees);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['buyPrice', 'sellPrice', 'quantity', 'fees'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
