(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var hourlyRate = parseFloat(document.getElementById('hourlyRate').value) || 0;
    var regularHours = parseFloat(document.getElementById('regularHours').value) || 0;
    var overtimeHours = parseFloat(document.getElementById('overtimeHours').value) || 0;
    var overtimeRate = document.getElementById('overtimeRate').value;
    var taxBracket = parseFloat(document.getElementById('taxBracket').value) || 0;
    var weeksPerYear = parseFloat(document.getElementById('weeksPerYear').value) || 0;

    // Calculation logic
    var otMult = parseFloat(overtimeRate); var grossOTHourly = hourlyRate * otMult; var grossOTWeek = grossOTHourly * overtimeHours; var totalTaxRate = (taxBracket + 7.65) / 100; var netOTWeek = grossOTWeek * (1 - totalTaxRate); var effectiveRate = overtimeHours > 0 ? netOTWeek / overtimeHours : 0; var annualGross = grossOTWeek * weeksPerYear; var annualNet = netOTWeek * weeksPerYear; var realHourly = effectiveRate; document.getElementById('grossOT').textContent = dollar(grossOTWeek); document.getElementById('netOT').textContent = dollar(netOTWeek); document.getElementById('effectiveOTRate').textContent = dollar(effectiveRate) + '/hour after tax'; document.getElementById('annualOTGross').textContent = dollar(annualGross); document.getElementById('annualOTNet').textContent = dollar(annualNet); document.getElementById('hourlyAfterTax').textContent = dollar(realHourly) + '/hr (vs ' + dollar(hourlyRate * (1 - totalTaxRate)) + ' regular)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['hourlyRate', 'regularHours', 'overtimeHours', 'overtimeRate', 'taxBracket', 'weeksPerYear'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
