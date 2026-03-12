(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var a = parseFloat(document.getElementById('a').value) || 0;
    var b = parseFloat(document.getElementById('b').value) || 0;
    var x_coeff = parseFloat(document.getElementById('x_coeff').value) || 0;
    var type = document.getElementById('type').value;

    // Calculation logic
    var tp=document.getElementById('type').value;if(x_coeff===0){document.getElementById('solution').textContent='Error: coefficient cannot be 0';document.getElementById('intervalNotation').textContent='—';return;}var lo=a/x_coeff;var hi=b/x_coeff;if(x_coeff<0){var tmp=lo;lo=hi;hi=tmp;}if(tp==='and'){document.getElementById('solution').textContent=fmt(lo,4)+' < x < '+fmt(hi,4);document.getElementById('intervalNotation').textContent='('+fmt(lo,4)+', '+fmt(hi,4)+')';}else{document.getElementById('solution').textContent='x < '+fmt(lo,4)+' or x > '+fmt(hi,4);document.getElementById('intervalNotation').textContent='(-∞, '+fmt(lo,4)+') ∪ ('+fmt(hi,4)+', ∞)';}

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['a', 'b', 'x_coeff', 'type'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
