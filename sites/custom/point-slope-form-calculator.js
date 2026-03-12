(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var x1 = parseFloat(document.getElementById('x1').value) || 0;
    var y1 = parseFloat(document.getElementById('y1').value) || 0;
    var slope = parseFloat(document.getElementById('slope').value) || 0;

    // Calculation logic
    var m=slope;var b=y1-m*x1;var bStr=b>=0?'+ '+fmt(Math.abs(b),4):'- '+fmt(Math.abs(b),4);var x1Str=x1>=0?'- '+Math.abs(x1):'+ '+Math.abs(x1);document.getElementById('pointSlopeForm').textContent='y - '+y1+' = '+m+'(x '+x1Str+')';document.getElementById('slopeInterceptForm').textContent='y = '+fmt(m,4)+'x '+bStr;var A=-m;var B=1;var C=b;if(A<0){A=-A;B=-B;C=-C;}document.getElementById('standardForm').textContent=fmt(A,4)+'x + '+fmt(B,4)+'y = '+fmt(C,4);

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
