(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var functionType = document.getElementById('functionType').value;
    var a = parseFloat(document.getElementById('a').value) || 0;
    var b = parseFloat(document.getElementById('b').value) || 0;
    var c = parseFloat(document.getElementById('c').value) || 0;

    // Calculation logic
    var ft=document.getElementById('functionType').value;if(ft==='linear'){document.getElementById('domain').textContent='(-∞, ∞)  All real numbers';document.getElementById('range').textContent=a===0?'{'+b+'}':'(-∞, ∞)  All real numbers';document.getElementById('explanation').textContent='Linear functions have no restrictions on x or y (unless slope is 0).';}else if(ft==='quadratic'){var vx=-b/(2*a);var vy=a*vx*vx+b*vx+c;if(a>0){document.getElementById('range').textContent='['+fmt(vy,4)+', ∞)';document.getElementById('explanation').textContent='Opens upward; minimum at vertex y = '+fmt(vy,4);}else{document.getElementById('range').textContent='(-∞, '+fmt(vy,4)+']';document.getElementById('explanation').textContent='Opens downward; maximum at vertex y = '+fmt(vy,4);}document.getElementById('domain').textContent='(-∞, ∞)  All real numbers';}else if(ft==='square-root'){if(a===0){document.getElementById('domain').textContent='All reals (constant √b)';document.getElementById('range').textContent='{'+fmt(Math.sqrt(b),4)+'}';document.getElementById('explanation').textContent='Constant function.';}else{var boundary=-b/a;if(a>0){document.getElementById('domain').textContent='['+fmt(boundary,4)+', ∞)';document.getElementById('range').textContent='[0, ∞)';}else{document.getElementById('domain').textContent='(-∞, '+fmt(boundary,4)+']';document.getElementById('range').textContent='[0, ∞)';}document.getElementById('explanation').textContent='Expression under radical must be ≥ 0. Solve ax+b ≥ 0.';}}else if(ft==='rational'){var excl=-b;document.getElementById('domain').textContent='All reals except x = '+fmt(excl,4)+' → (-∞,'+fmt(excl,4)+') ∪ ('+fmt(excl,4)+',∞)';document.getElementById('range').textContent=a===0?'{0}':'All reals except y = 0 → (-∞,0) ∪ (0,∞)';document.getElementById('explanation').textContent='Denominator x+'+b+' cannot be 0, so x ≠ '+fmt(excl,4)+'.';}else{var vx=-b;var vy=c;if(a>0){document.getElementById('range').textContent='['+fmt(vy,4)+', ∞)';}else{document.getElementById('range').textContent='(-∞, '+fmt(vy,4)+']';}document.getElementById('domain').textContent='(-∞, ∞)  All real numbers';document.getElementById('explanation').textContent='Absolute value always outputs ≥ 0, then multiplied by a and shifted by c.';}

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['functionType', 'a', 'b', 'c'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
