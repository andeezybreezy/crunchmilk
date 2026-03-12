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
    var variationType = document.getElementById('variationType').value;

    // Calculation logic
    var vt=document.getElementById('variationType').value;if(vt==='direct'){if(x1===0){document.getElementById('y2').textContent='Error: x₁ cannot be 0 for direct variation';document.getElementById('constant').textContent='—';document.getElementById('equation').textContent='—';return;}var k=y1/x1;var y2val=k*x2;document.getElementById('constant').textContent='k = '+fmt(k,4);document.getElementById('y2').textContent=fmt(y2val,4);document.getElementById('equation').textContent='y = '+fmt(k,4)+'x';}else{if(x1===0||x2===0){document.getElementById('y2').textContent='Error: x cannot be 0 for inverse variation';document.getElementById('constant').textContent='—';document.getElementById('equation').textContent='—';return;}var k=y1*x1;var y2val=k/x2;document.getElementById('constant').textContent='k = '+fmt(k,4);document.getElementById('y2').textContent=fmt(y2val,4);document.getElementById('equation').textContent='y = '+fmt(k,4)+'/x';}

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['x1', 'y1', 'x2', 'variationType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
