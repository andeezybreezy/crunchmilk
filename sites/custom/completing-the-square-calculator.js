(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var a = parseFloat(document.getElementById('a').value) || 0;
    var b = parseFloat(document.getElementById('b').value) || 0;
    var c = parseFloat(document.getElementById('c').value) || 0;

    // Calculation logic
    var h=-b/(2*a);var k=c-b*b/(4*a);var hStr=h>=0?'- '+fmt(Math.abs(h), 2):'+ '+fmt(Math.abs(h), 2);var kStr=k>=0?' + '+fmt(Math.abs(k), 2):' - '+fmt(Math.abs(k), 2);document.getElementById('vertexForm').textContent=(a===1?'':a===(-1)?'-':fmt(a, 2))+'(x '+hStr+')²'+kStr;document.getElementById('vertex').textContent='('+fmt(h, 2)+', '+fmt(k, 2)+')';var halfB=b/(2*a);document.getElementById('steps').textContent='Half of '+b+'/'+a+' is '+fmt(halfB, 2)+', squared is '+fmt(halfB*halfB, 2)+'. h = '+fmt(h, 2)+', k = '+fmt(k, 2);

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
