(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var slope = parseFloat(document.getElementById('slope').value) || 0;
    var yIntercept = parseFloat(document.getElementById('yIntercept').value) || 0;

    // Calculation logic
    var m=slope;var b=yIntercept;var bStr=b>=0?' + '+fmt(Math.abs(b),4):' - '+fmt(Math.abs(b),4);document.getElementById('equation').textContent='y = '+fmt(m,4)+'x'+bStr;if(m!==0){document.getElementById('xIntercept').textContent='('+fmt(-b/m,4)+', 0)';}else{document.getElementById('xIntercept').textContent=b===0?'(0, 0)':'None (horizontal line)';}var pts=[];for(var i=-1;i<=1;i++){var xv=i;var yv=m*xv+b;pts.push('('+xv+', '+fmt(yv,4)+')');}document.getElementById('threePoints').textContent=pts.join('  |  ');

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['slope', 'yIntercept'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
