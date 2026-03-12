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
    var disc=b*b-4*a*c;if(disc<0){document.getElementById('factored').textContent='Not factorable over the reals (discriminant < 0)';document.getElementById('check').textContent='Discriminant = '+disc;document.getElementById('method').textContent='Discriminant test';return;}var r1=(-b+Math.sqrt(disc))/(2*a);var r2=(-b-Math.sqrt(disc))/(2*a);document.getElementById('method').textContent='Quadratic formula to find roots, then factor';if(a===1){document.getElementById('factored').textContent='(x '+(r1>=0?'- '+fmt(Math.abs(r1), 2):'+ '+fmt(Math.abs(r1), 2))+')(x '+(r2>=0?'- '+fmt(Math.abs(r2), 2):'+ '+fmt(Math.abs(r2), 2))+')';} else {document.getElementById('factored').textContent=a+'(x '+(r1>=0?'- '+fmt(Math.abs(r1), 2):'+ '+fmt(Math.abs(r1), 2))+')(x '+(r2>=0?'- '+fmt(Math.abs(r2), 2):'+ '+fmt(Math.abs(r2), 2))+')';} document.getElementById('check').textContent='Roots: x = '+fmt(r1, 2)+', x = '+fmt(r2, 2)+' → expands to '+a+'x² + '+b+'x + '+c;

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
