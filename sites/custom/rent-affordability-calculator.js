(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var monthlyIncome = parseFloat(document.getElementById('monthlyIncome').value) || 0;
    var monthlyDebt = parseFloat(document.getElementById('monthlyDebt').value) || 0;
    var rule = document.getElementById('rule').value;

    // Calculation logic
    var pct = parseFloat(rule) / 100; var max = monthlyIncome * pct; var remaining = monthlyIncome - max - monthlyDebt; var dti = ((max + monthlyDebt) / monthlyIncome) * 100; document.getElementById('maxRent').textContent = dollar(max); document.getElementById('afterRent').textContent = dollar(remaining) + ' for other expenses'; document.getElementById('debtRatio').textContent = pct2 = fmt(dti, 0) + '% DTI';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['monthlyIncome', 'monthlyDebt', 'rule'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
