(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var x1 = parseFloat(document.getElementById('x1').value) || 0;
    var y1 = parseFloat(document.getElementById('y1').value) || 0;
    var slope = parseFloat(document.getElementById('slope').value) || 0;

    // Calculation logic
    var m=slope;var b=y1-m*x1;var bStr=b>=0?'+ '+fmt(Math.abs(b), 2):'- '+fmt(Math.abs(b), 2);var x1Str=x1>=0?'- '+Math.abs(x1):'+ '+Math.abs(x1);document.getElementById('pointSlopeForm').textContent='y - '+y1+' = '+m+'(x '+x1Str+')';document.getElementById('slopeInterceptForm').textContent='y = '+fmt(m, 2)+'x '+bStr;var A=-m;var B=1;var C=b;if(A<0){A=-A;B=-B;C=-C;}document.getElementById('standardForm').textContent=fmt(A, 2)+'x + '+fmt(B, 2)+'y = '+fmt(C, 2);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['x1', 'y1', 'slope'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
