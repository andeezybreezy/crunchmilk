(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var baseSalary = parseFloat(document.getElementById('baseSalary').value) || 0;
    var yearsExp = parseFloat(document.getElementById('yearsExp').value) || 0;
    var stepIncrease = parseFloat(document.getElementById('stepIncrease').value) || 0;
    var masters = document.getElementById('masters').value;

    // Calculation logic
    var degBump = {ba: 0, ma: 0.12, phd: 0.20}; var bump = degBump[masters] || 0; var salary = baseSalary; for (var i = 0; i < yearsExp; i++) salary *= (1 + stepIncrease/100); salary *= (1 + bump); var career = 0; var s = baseSalary * (1 + bump); for (var j = 0; j < 30; j++) { career += s; s *= (1 + stepIncrease/100); } var monthly = salary * 0.72 / 12; document.getElementById('currentSalary').textContent = dollar(salary); document.getElementById('careerEarnings').textContent = dollar(career); document.getElementById('monthlyTakeHome').textContent = dollar(monthly) + ' (est. after tax)'; document.getElementById('degreeBump').textContent = bump > 0 ? '+' + pct(bump * 100, 0) + ' (' + dollar(baseSalary * bump) + '/yr)' : 'None';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['baseSalary', 'yearsExp', 'stepIncrease', 'masters'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
