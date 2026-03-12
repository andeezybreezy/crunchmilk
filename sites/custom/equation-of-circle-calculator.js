(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var centerX = parseFloat(document.getElementById('centerX').value) || 0;
    var centerY = parseFloat(document.getElementById('centerY').value) || 0;
    var radius = parseFloat(document.getElementById('radius').value) || 0;

    // Calculation logic
    var h=parseFloat(document.getElementById('centerX').value); var k=parseFloat(document.getElementById('centerY').value); var r=parseFloat(document.getElementById('radius').value); if(isNaN(h)||isNaN(k)||isNaN(r)||r<=0){document.getElementById('standardForm').textContent='Enter valid values (positive radius)';return;} var hStr=h>=0?'(x - '+h+')':'(x + '+Math.abs(h)+')'; var kStr=k>=0?'(y - '+k+')':'(y + '+Math.abs(k)+')'; if(h===0) hStr='x'; if(k===0) kStr='y'; document.getElementById('standardForm').textContent=hStr+'\u00B2 + '+kStr+'\u00B2 = '+fmt(r*r, 2); var D=-2*h; var E=-2*k; var F=h*h+k*k-r*r; var dStr=D>=0?' + '+fmt(D, 2)+'x':' - '+fmt(Math.abs(D), 2)+'x'; var eStr=E>=0?' + '+fmt(E, 2)+'y':' - '+fmt(Math.abs(E), 2)+'y'; var fStr=F>=0?' + '+fmt(F, 2):' - '+fmt(Math.abs(F), 2); document.getElementById('generalForm').textContent='x\u00B2 + y\u00B2'+dStr+eStr+fStr+' = 0'; document.getElementById('area').textContent=fmt(Math.PI*r*r, 2); document.getElementById('circumference').textContent=fmt(2*Math.PI*r, 2);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['centerX', 'centerY', 'radius'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
