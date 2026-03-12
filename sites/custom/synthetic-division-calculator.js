(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var a = parseFloat(document.getElementById('a').value) || 0;
    var b = parseFloat(document.getElementById('b').value) || 0;
    var c = parseFloat(document.getElementById('c').value) || 0;
    var d = parseFloat(document.getElementById('d').value) || 0;
    var divisor = parseFloat(document.getElementById('divisor').value) || 0;

    // Calculation logic
    var k=divisor;var r0=a;var r1=r0*k+b;var r2=r1*k+c;var rem=r2*k+d;document.getElementById('quotient').textContent=fmt(r0,4)+'x² '+(r1>=0?'+ '+fmt(r1,4):'- '+fmt(Math.abs(r1),4))+'x '+(r2>=0?'+ '+fmt(r2,4):'- '+fmt(Math.abs(r2),4));document.getElementById('remainder').textContent=fmt(rem,4);document.getElementById('isFactorQuestion').textContent=Math.abs(rem)<1e-10?'Yes — (x - '+k+') is a factor':'No — remainder is '+fmt(rem,4);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['a', 'b', 'c', 'd', 'divisor'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
