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
    var type = document.getElementById('type').value;

    // Calculation logic
    var tp=document.getElementById('type').value;if(c<0){if(tp==='lt'||tp==='lte'){document.getElementById('solution').textContent='No solution';document.getElementById('intervalNotation').textContent='∅';}else{document.getElementById('solution').textContent='All real numbers';document.getElementById('intervalNotation').textContent='(-∞, ∞)';}return;}var lo=(-c-b)/a;var hi=(c-b)/a;if(a<0){var tmp=lo;lo=hi;hi=tmp;}if(tp==='lt'){document.getElementById('solution').textContent=fmt(lo, 2)+' < x < '+fmt(hi, 2);document.getElementById('intervalNotation').textContent='('+fmt(lo, 2)+', '+fmt(hi, 2)+')';}else if(tp==='lte'){document.getElementById('solution').textContent=fmt(lo, 2)+' ≤ x ≤ '+fmt(hi, 2);document.getElementById('intervalNotation').textContent='['+fmt(lo, 2)+', '+fmt(hi, 2)+']';}else if(tp==='gt'){document.getElementById('solution').textContent='x < '+fmt(lo, 2)+' or x > '+fmt(hi, 2);document.getElementById('intervalNotation').textContent='(-∞, '+fmt(lo, 2)+') ∪ ('+fmt(hi, 2)+', ∞)';}else{document.getElementById('solution').textContent='x ≤ '+fmt(lo, 2)+' or x ≥ '+fmt(hi, 2);document.getElementById('intervalNotation').textContent='(-∞, '+fmt(lo, 2)+'] ∪ ['+fmt(hi, 2)+', ∞)';}

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['a', 'b', 'c', 'type'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
