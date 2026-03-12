(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var currentSalary = parseFloat(document.getElementById('currentSalary').value) || 0;
    var currentIndex = parseFloat(document.getElementById('currentIndex').value) || 0;
    var newIndex = parseFloat(document.getElementById('newIndex').value) || 0;

    // Calculation logic
    var equivalent = currentSalary * (newIndex / currentIndex); var diff = equivalent - currentSalary; var pctDiff = ((newIndex - currentIndex) / currentIndex) * 100; document.getElementById('equivalentSalary').textContent = dollar(equivalent); document.getElementById('difference').textContent = (diff >= 0 ? '+' : '') + dollar(diff) + '/year'; document.getElementById('pctChange').textContent = (pctDiff >= 0 ? '+' : '') + pct(pctDiff, 1); document.getElementById('resultTip').textContent = newIndex > currentIndex ? 'New city is more expensive. You need a raise to maintain your lifestyle.' : 'New city is cheaper! Your purchasing power increases.';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['currentSalary', 'currentIndex', 'newIndex'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
