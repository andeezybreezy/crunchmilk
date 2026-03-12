(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var taxOwed = parseFloat(document.getElementById('taxOwed').value) || 0;
    var monthsLate = parseFloat(document.getElementById('monthsLate').value) || 0;
    var penaltyType = document.getElementById('penaltyType').value;
    var annualIncome = parseFloat(document.getElementById('annualIncome').value) || 0;
    var filedExtension = document.getElementById('filedExtension').value;

    // Calculation logic
    var filePen = 0; var payPen = 0; var effectiveMonths = filedExtension === 'yes' ? Math.max(0, monthsLate - 6) : monthsLate; if (penaltyType === 'filing' || penaltyType === 'both') { var fileRate = 0.05; var fileMonths = Math.min(effectiveMonths, 5); filePen = taxOwed * fileRate * fileMonths; filePen = Math.min(filePen, taxOwed * 0.25); } if (penaltyType === 'payment' || penaltyType === 'both') { payPen = taxOwed * 0.005 * monthsLate; } if (penaltyType === 'both' && effectiveMonths <= 5) { filePen = Math.max(0, filePen - payPen); } var interest = taxOwed * (0.08 / 12) * monthsLate; var total = filePen + payPen + interest; var effRate = taxOwed > 0 ? (total / taxOwed) * (12 / monthsLate) * 100 : 0; document.getElementById('filingPenalty').textContent = dollar(filePen); document.getElementById('paymentPenalty').textContent = dollar(payPen); document.getElementById('interestCharged').textContent = dollar(interest); document.getElementById('totalPenalty').textContent = dollar(total); document.getElementById('effectiveCost').textContent = fmt(effRate, 1) + '% annualized';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['taxOwed', 'monthsLate', 'penaltyType', 'annualIncome', 'filedExtension'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
