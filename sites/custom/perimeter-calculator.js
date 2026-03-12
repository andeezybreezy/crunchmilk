(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var shape = document.getElementById('shape').value;
    var side1 = parseFloat(document.getElementById('side1').value) || 0;
    var side2 = parseFloat(document.getElementById('side2').value) || 0;
    var side3 = parseFloat(document.getElementById('side3').value) || 0;

    // Calculation logic
    var s1=parseFloat(side1),s2=parseFloat(side2),s3=parseFloat(side3);var p,formula;if(shape==='rectangle'){p=2*(s1+s2);formula='P = 2(l + w) = 2('+s1+' + '+s2+') = '+fmt(p,4);}else if(shape==='triangle'){p=s1+s2+s3;formula='P = a + b + c = '+s1+' + '+s2+' + '+s3+' = '+fmt(p,4);}else if(shape==='square'){p=4*s1;formula='P = 4s = 4 × '+s1+' = '+fmt(p,4);}else if(shape==='circle'){p=2*Math.PI*s1;formula='C = 2πr = 2 × π × '+s1+' = '+fmt(p,4);}document.getElementById('perimeter').textContent=fmt(p,4)+' units';document.getElementById('formula').textContent=formula;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['shape', 'side1', 'side2', 'side3'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
