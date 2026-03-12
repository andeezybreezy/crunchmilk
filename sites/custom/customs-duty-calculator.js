(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var goodsValue = parseFloat(document.getElementById('goodsValue').value) || 0;
    var shippingCost = parseFloat(document.getElementById('shippingCost').value) || 0;
    var insuranceCost = parseFloat(document.getElementById('insuranceCost').value) || 0;
    var dutyRate = parseFloat(document.getElementById('dutyRate').value) || 0;

    // Calculation logic
    var cif = goodsValue + shippingCost + insuranceCost; var duty = cif * (dutyRate / 100); var mpf = Math.min(Math.max(cif * 0.003464, 31.67), 614.35); var total = cif + duty + mpf; document.getElementById('customsValue').textContent = dollar(cif); document.getElementById('dutyAmount').textContent = dollar(duty); document.getElementById('mpfFee').textContent = dollar(mpf); document.getElementById('totalLanded').textContent = dollar(total); document.getElementById('resultTip').textContent = 'Duty rate varies by HTS code. Check hts.usitc.gov for exact rates.';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['goodsValue', 'shippingCost', 'insuranceCost', 'dutyRate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
