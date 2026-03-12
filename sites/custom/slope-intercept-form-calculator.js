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
    var x2 = parseFloat(document.getElementById('x2').value) || 0;
    var y2 = parseFloat(document.getElementById('y2').value) || 0;

    // Calculation logic
    var run=x2-x1;if(run===0){document.getElementById('equation').textContent='Undefined (vertical line x = '+x1+')';document.getElementById('slope').textContent='Undefined';document.getElementById('yIntercept').textContent='N/A';}else{var m=(y2-y1)/run;var b=y1-m*x1;var bStr=b>=0?' + '+fmt(Math.abs(b),4):' - '+fmt(Math.abs(b),4);document.getElementById('equation').textContent='y = '+fmt(m,4)+'x'+bStr;document.getElementById('slope').textContent=fmt(m,4);document.getElementById('yIntercept').textContent=fmt(b,4);}

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['x1', 'y1', 'x2', 'y2'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
