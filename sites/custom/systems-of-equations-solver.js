(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var a1 = parseFloat(document.getElementById('a1').value) || 0;
    var b1 = parseFloat(document.getElementById('b1').value) || 0;
    var c1 = parseFloat(document.getElementById('c1').value) || 0;
    var a2 = parseFloat(document.getElementById('a2').value) || 0;
    var b2 = parseFloat(document.getElementById('b2').value) || 0;
    var c2 = parseFloat(document.getElementById('c2').value) || 0;

    // Calculation logic
    var det=a1*b2-a2*b1;if(det===0){if(a1*c2===a2*c1&&b1*c2===b2*c1){document.getElementById('solutionType').textContent='Infinitely many solutions (same line)';document.getElementById('x').textContent='—';document.getElementById('y').textContent='—';}else{document.getElementById('solutionType').textContent='No solution (parallel lines)';document.getElementById('x').textContent='—';document.getElementById('y').textContent='—';}document.getElementById('method').textContent='Determinant = 0';}else{var xVal=(c1*b2-c2*b1)/det;var yVal=(a1*c2-a2*c1)/det;document.getElementById('x').textContent=fmt(xVal, 2);document.getElementById('y').textContent=fmt(yVal, 2);document.getElementById('solutionType').textContent='One unique solution';document.getElementById('method').textContent="Cramer's Rule (elimination)";}

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['a1', 'b1', 'c1', 'a2', 'b2', 'c2'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
