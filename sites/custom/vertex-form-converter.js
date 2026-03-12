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

    // Calculation logic
    var h=-b/(2*a);var k=c-b*b/(4*a);var hStr=h>=0?'- '+fmt(Math.abs(h),4):'+ '+fmt(Math.abs(h),4);var kStr=k>=0?' + '+fmt(Math.abs(k),4):' - '+fmt(Math.abs(k),4);var aStr=a===1?'':a===-1?'-':fmt(a,4);document.getElementById('vertexForm').textContent=aStr+'(x '+hStr+')²'+kStr;document.getElementById('vertex').textContent='('+fmt(h,4)+', '+fmt(k,4)+')';document.getElementById('axisOfSymmetry').textContent='x = '+fmt(h,4);document.getElementById('direction').textContent=a>0?'Upward (minimum at vertex)':'Downward (maximum at vertex)';

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
