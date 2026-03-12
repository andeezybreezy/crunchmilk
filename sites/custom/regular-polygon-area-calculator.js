(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var sides = parseFloat(document.getElementById('sides').value) || 0;
    var sideLength = parseFloat(document.getElementById('sideLength').value) || 0;

    // Calculation logic
    var n=parseInt(document.getElementById('sides').value); var s=parseFloat(document.getElementById('sideLength').value); if(isNaN(n)||n<3||n>12||isNaN(s)||s<=0){document.getElementById('area').textContent='Enter valid values (3-12 sides, positive length)';return;} var peri=n*s; var apothem=s/(2*Math.tan(Math.PI/n)); var area=(peri*apothem)/2; var intAngle=((n-2)*180)/n; document.getElementById('area').textContent=fmt(area, 2); document.getElementById('perimeter').textContent=fmt(peri, 2); document.getElementById('interiorAngle').textContent=fmt(intAngle,2)+'\u00B0'; document.getElementById('apothem').textContent=fmt(apothem, 2);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['sides', 'sideLength'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
