(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var a1 = parseFloat(document.getElementById('a1').value) || 0;
    var b1 = parseFloat(document.getElementById('b1').value) || 0;
    var c1 = parseFloat(document.getElementById('c1').value) || 0;
    var d1 = parseFloat(document.getElementById('d1').value) || 0;
    var a2 = parseFloat(document.getElementById('a2').value) || 0;
    var b2 = parseFloat(document.getElementById('b2').value) || 0;
    var c2 = parseFloat(document.getElementById('c2').value) || 0;
    var d2 = parseFloat(document.getElementById('d2').value) || 0;
    var a3 = parseFloat(document.getElementById('a3').value) || 0;
    var b3 = parseFloat(document.getElementById('b3').value) || 0;
    var c3 = parseFloat(document.getElementById('c3').value) || 0;
    var d3 = parseFloat(document.getElementById('d3').value) || 0;

    // Calculation logic
    var det=a1*(b2*c3-b3*c2)-b1*(a2*c3-a3*c2)+c1*(a2*b3-a3*b2);if(Math.abs(det)<1e-10){document.getElementById('x').textContent='No unique solution';document.getElementById('y').textContent='Determinant = 0';document.getElementById('z').textContent='—';}else{var dx=d1*(b2*c3-b3*c2)-b1*(d2*c3-d3*c2)+c1*(d2*b3-d3*b2);var dy=a1*(d2*c3-d3*c2)-d1*(a2*c3-a3*c2)+c1*(a2*d3-a3*d2);var dz=a1*(b2*d3-b3*d2)-b1*(a2*d3-a3*d2)+d1*(a2*b3-a3*b2);document.getElementById('x').textContent=fmt(dx/det, 2);document.getElementById('y').textContent=fmt(dy/det, 2);document.getElementById('z').textContent=fmt(dz/det, 2);}

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['a1', 'b1', 'c1', 'd1', 'a2', 'b2', 'c2', 'd2', 'a3', 'b3', 'c3', 'd3'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
