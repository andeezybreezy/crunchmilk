(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var monthlyExpenses = parseFloat(document.getElementById('monthlyExpenses').value) || 0;
    var stability = document.getElementById('stability').value;
    var dependents = parseFloat(document.getElementById('dependents').value) || 0;

    // Calculation logic
    var baseMonths = {'Very Stable': 3, 'Stable': 6, 'Variable': 9, 'Unstable': 12}; var months = (baseMonths[stability] || 6) + (dependents > 0 ? 1 : 0); var minimum = monthlyExpenses * 3; var recommended = monthlyExpenses * months;     document.getElementById('minimum').textContent = dollar(minimum);
    document.getElementById('recommended').textContent = dollar(recommended);
    document.getElementById('months').textContent = fmt(months,0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['monthlyExpenses', 'stability', 'dependents'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
