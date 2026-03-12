(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var invoiceAmount = parseFloat(document.getElementById('invoiceAmount').value) || 0;
    var factoringRate = parseFloat(document.getElementById('factoringRate').value) || 0;
    var advanceRate = parseFloat(document.getElementById('advanceRate').value) || 0;
    var monthlyInvoices = parseFloat(document.getElementById('monthlyInvoices').value) || 0;
    var avgPayDays = parseFloat(document.getElementById('avgPayDays').value) || 0;
    var monthlyExpenses = parseFloat(document.getElementById('monthlyExpenses').value) || 0;

    // Calculation logic
    var fee = invoiceAmount * (factoringRate / 100); var advance = invoiceAmount * (advanceRate / 100) - fee; var reserve = invoiceAmount - advance - fee; var monthlyFee = fee * monthlyInvoices; var annualFee = monthlyFee * 12; var monthlyRevenue = invoiceAmount * monthlyInvoices; var cashGap = (monthlyRevenue / 30) * avgPayDays - monthlyExpenses; var gapLabel = cashGap > monthlyExpenses ? dollar(cashGap) + ' tied up in receivables' : dollar(Math.max(0, (monthlyRevenue / 30) * avgPayDays)) + ' tied up in receivables'; document.getElementById('factoringFee').textContent = dollar(fee); document.getElementById('advanceAmt').textContent = dollar(advance); document.getElementById('reserveAmt').textContent = dollar(reserve); document.getElementById('monthlyFees').textContent = dollar(monthlyFee); document.getElementById('annualFees').textContent = dollar(annualFee); document.getElementById('cashFlowGap').textContent = gapLabel;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['invoiceAmount', 'factoringRate', 'advanceRate', 'monthlyInvoices', 'avgPayDays', 'monthlyExpenses'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
