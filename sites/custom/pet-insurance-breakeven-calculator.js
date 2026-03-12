(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var monthlyPremium = parseFloat(document.getElementById('monthlyPremium').value) || 0;
    var deductible = parseFloat(document.getElementById('deductible').value) || 0;
    var reimbursement = parseFloat(document.getElementById('reimbursement').value) || 0;
    var expectedVetBills = parseFloat(document.getElementById('expectedVetBills').value) || 0;

    // Calculation logic
    var annualPremium = monthlyPremium * 12; var eligible = Math.max(expectedVetBills - deductible, 0); var reimbursed = eligible * (reimbursement / 100); var netSavings = reimbursed - annualPremium;     document.getElementById('annualPremium').textContent = dollar(annualPremium);
    document.getElementById('reimbursed').textContent = dollar(reimbursed);
    document.getElementById('netSavings').textContent = dollar(netSavings);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['monthlyPremium', 'deductible', 'reimbursement', 'expectedVetBills'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
