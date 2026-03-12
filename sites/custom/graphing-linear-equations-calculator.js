(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var slope = parseFloat(document.getElementById('slope').value) || 0;
    var yIntercept = parseFloat(document.getElementById('yIntercept').value) || 0;

    // Calculation logic
    var m=slope;var b=yIntercept;var bStr=b>=0?' + '+fmt(Math.abs(b), 2):' - '+fmt(Math.abs(b), 2);document.getElementById('equation').textContent='y = '+fmt(m, 2)+'x'+bStr;if(m!==0){document.getElementById('xIntercept').textContent='('+fmt(-b/m, 2)+', 0)';}else{document.getElementById('xIntercept').textContent=b===0?'(0, 0)':'None (horizontal line)';}var pts=[];for(var i=-1;i<=1;i++){var xv=i;var yv=m*xv+b;pts.push('('+xv+', '+fmt(yv, 2)+')');}document.getElementById('threePoints').textContent=pts.join('  |  ');

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
