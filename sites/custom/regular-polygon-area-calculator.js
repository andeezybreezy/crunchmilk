(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var sides = parseFloat(document.getElementById('sides').value) || 0;
    var sideLength = parseFloat(document.getElementById('sideLength').value) || 0;

    // Calculation logic
    var n=parseInt(document.getElementById('sides').value); var s=parseFloat(document.getElementById('sideLength').value); if(isNaN(n)||n<3||n>12||isNaN(s)||s<=0){document.getElementById('area').textContent='Enter valid values (3-12 sides, positive length)';return;} var peri=n*s; var apothem=s/(2*Math.tan(Math.PI/n)); var area=(peri*apothem)/2; var intAngle=((n-2)*180)/n; document.getElementById('area').textContent=fmt(area,4); document.getElementById('perimeter').textContent=fmt(peri,4); document.getElementById('interiorAngle').textContent=fmt(intAngle,2)+'\u00B0'; document.getElementById('apothem').textContent=fmt(apothem,4);

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
