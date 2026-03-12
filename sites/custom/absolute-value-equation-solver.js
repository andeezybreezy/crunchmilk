(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var a = parseFloat(document.getElementById('a').value) || 0;
    var b = parseFloat(document.getElementById('b').value) || 0;
    var c = parseFloat(document.getElementById('c').value) || 0;

    // Calculation logic
    if(c<0){document.getElementById('solution1').textContent='No solution';document.getElementById('solution2').textContent='—';document.getElementById('noSolution').textContent='Absolute value cannot equal a negative number';return;}if(c===0){var x=-b/a;document.getElementById('solution1').textContent='x = '+fmt(x, 2);document.getElementById('solution2').textContent='(only one solution)';document.getElementById('noSolution').textContent='|ax+b| = 0 means ax+b = 0';return;}var x1=(c-b)/a;var x2=(-c-b)/a;document.getElementById('solution1').textContent='x = '+fmt(x1, 2);document.getElementById('solution2').textContent='x = '+fmt(x2, 2);document.getElementById('noSolution').textContent='Two solutions from: '+a+'x + '+b+' = '+c+' and '+a+'x + '+b+' = -'+c;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['a', 'b', 'c'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
