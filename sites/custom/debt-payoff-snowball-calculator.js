(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var debt1 = parseFloat(document.getElementById('debt1').value) || 0;
    var rate1 = parseFloat(document.getElementById('rate1').value) || 0;
    var debt2 = parseFloat(document.getElementById('debt2').value) || 0;
    var rate2 = parseFloat(document.getElementById('rate2').value) || 0;
    var extra = parseFloat(document.getElementById('extra').value) || 0;

    // Calculation logic
    var totalDebt = debt1 + debt2; var months1 = Math.ceil(debt1 / extra); var months2 = months1 + Math.ceil(debt2 / (extra + debt1*rate1/100/12)); var debtFreeMonths = months2; var minPayment1 = debt1 * 0.03; var minPayment2 = debt2 * 0.03; var minMonths = Math.ceil(totalDebt / (minPayment1 + minPayment2)); var interestSaved = totalDebt * 0.15 * ((minMonths - debtFreeMonths) / 12);     document.getElementById('totalDebt').textContent = dollar(totalDebt);
    document.getElementById('debtFreeMonths').textContent = fmt(debtFreeMonths,0);
    document.getElementById('interestSaved').textContent = dollar(Math.max(interestSaved,0));

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['debt1', 'rate1', 'debt2', 'rate2', 'extra'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
