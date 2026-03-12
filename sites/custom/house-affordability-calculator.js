(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var annualIncome = parseFloat(document.getElementById('annualIncome').value) || 0;
    var monthlyDebt = parseFloat(document.getElementById('monthlyDebt').value) || 0;
    var downPayment = parseFloat(document.getElementById('downPayment').value) || 0;
    var rate = parseFloat(document.getElementById('rate').value) || 0;

    // Calculation logic
    var monthlyIncome = annualIncome / 12; var maxPITI = monthlyIncome * 0.28; var maxTotal = monthlyIncome * 0.36 - monthlyDebt; var maxPayment = Math.min(maxPITI, maxTotal); var piOnly = maxPayment * 0.75; var r = rate / 100 / 12; var n = 360; var maxLoan = piOnly * (Math.pow(1+r,n)-1) / (r * Math.pow(1+r,n)); var maxPrice = maxLoan + downPayment; var dtiPct = ((maxPayment + monthlyDebt) / monthlyIncome) * 100; document.getElementById('maxHome').textContent = dollar(maxPrice); document.getElementById('monthlyPayment').textContent = dollar(maxPayment) + ' (est. PITI)'; document.getElementById('dti').textContent = pct(dtiPct);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['annualIncome', 'monthlyDebt', 'downPayment', 'rate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
