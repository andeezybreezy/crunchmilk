(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var targetSalary = parseFloat(document.getElementById('targetSalary').value) || 0;
    var billableHours = parseFloat(document.getElementById('billableHours').value) || 0;
    var weeksOff = parseFloat(document.getElementById('weeksOff').value) || 0;
    var expensesPct = parseFloat(document.getElementById('expensesPct').value) || 0;

    // Calculation logic
    var workingWeeks = 52 - weeksOff; var totalHours = billableHours * workingWeeks; var grossNeeded = targetSalary / (1 - expensesPct/100); var hourlyRate = grossNeeded / totalHours; var dayRate = hourlyRate * 8; var projectRate = hourlyRate * billableHours;     document.getElementById('hourlyRate').textContent = dollar(hourlyRate);
    document.getElementById('dayRate').textContent = dollar(dayRate);
    document.getElementById('projectRate').textContent = dollar(projectRate);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['targetSalary', 'billableHours', 'weeksOff', 'expensesPct'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
