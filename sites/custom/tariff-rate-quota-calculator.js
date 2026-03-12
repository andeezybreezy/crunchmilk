(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var quantity = parseFloat(document.getElementById('quantity').value) || 0;
    var quotaLimit = parseFloat(document.getElementById('quotaLimit').value) || 0;
    var inQuotaRate = parseFloat(document.getElementById('inQuotaRate').value) || 0;
    var overQuotaRate = parseFloat(document.getElementById('overQuotaRate').value) || 0;
    var unitPrice = parseFloat(document.getElementById('unitPrice').value) || 0;

    // Calculation logic
    var inQuotaQty = Math.min(quantity, quotaLimit); var overQuotaQty = Math.max(quantity - quotaLimit, 0); var inQuotaDuty = inQuotaQty * unitPrice * (inQuotaRate/100); var overQuotaDuty = overQuotaQty * unitPrice * (overQuotaRate/100); var totalDuty = inQuotaDuty + overQuotaDuty; var totalValue = quantity * unitPrice; var effectiveRate = (totalDuty / totalValue) * 100;     document.getElementById('inQuotaDuty').textContent = dollar(inQuotaDuty);
    document.getElementById('overQuotaDuty').textContent = dollar(overQuotaDuty);
    document.getElementById('totalDuty').textContent = dollar(totalDuty);
    document.getElementById('effectiveRate').textContent = fmt(effectiveRate,1);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['quantity', 'quotaLimit', 'inQuotaRate', 'overQuotaRate', 'unitPrice'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
