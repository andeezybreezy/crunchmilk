(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var x1 = parseFloat(document.getElementById('x1').value) || 0;
    var y1 = parseFloat(document.getElementById('y1').value) || 0;
    var x2 = parseFloat(document.getElementById('x2').value) || 0;
    var y2 = parseFloat(document.getElementById('y2').value) || 0;

    // Calculation logic
    var xA=parseFloat(x1),yA=parseFloat(y1),xB=parseFloat(x2),yB=parseFloat(y2);var dx=xB-xA,dy=yB-yA;var dist=Math.sqrt(dx*dx+dy*dy);var mx=(xA+xB)/2,my=(yA+yB)/2;document.getElementById('distance').textContent=fmt(dist, 2)+' units';document.getElementById('midpoint').textContent='('+fmt(mx, 2)+', '+fmt(my, 2)+')';

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
