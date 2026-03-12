(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var daysOut = parseFloat(document.getElementById('daysOut').value) || 0;
    var partialDays = parseFloat(document.getElementById('partialDays').value) || 0;
    var perDiemRate = parseFloat(document.getElementById('perDiemRate').value) || 0;
    var deductPct = parseFloat(document.getElementById('deductPct').value) || 0;
    var taxBracket = document.getElementById('taxBracket').value;
    var selfEmployed = document.getElementById('selfEmployed').value;

    // Calculation logic
    var fullAmt = daysOut * perDiemRate; var partialRate = perDiemRate * 0.75; var partAmt = partialDays * partialRate; var totalPD = fullAmt + partAmt; var deductible = totalPD * (deductPct / 100); var bracket = parseFloat(selfEmployed === 'yes' ? taxBracket : taxBracket) / 100; var seTaxSaving = selfEmployed === 'yes' ? deductible * 0.153 * 0.5 : 0; var savings = deductible * bracket + seTaxSaving; document.getElementById('fullDayAmt').textContent = dollar(fullAmt); document.getElementById('partialDayAmt').textContent = dollar(partAmt); document.getElementById('totalPerDiem').textContent = dollar(totalPD); document.getElementById('deductibleAmt').textContent = dollar(deductible); document.getElementById('taxSavings').textContent = dollar(savings); document.getElementById('monthlyBenefit').textContent = dollar(savings / 12);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['daysOut', 'partialDays', 'perDiemRate', 'deductPct', 'taxBracket', 'selfEmployed'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
