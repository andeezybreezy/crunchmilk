(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var radius = parseFloat(document.getElementById('radius').value) || 0;
    var angle = parseFloat(document.getElementById('angle').value) || 0;
    var angleUnit = document.getElementById('angleUnit').value;

    // Calculation logic
    var r=parseFloat(document.getElementById('radius').value); var angle=parseFloat(document.getElementById('angle').value); var unit=document.getElementById('angleUnit').value; if(isNaN(r)||r<=0||isNaN(angle)||angle<=0){document.getElementById('sectorArea').textContent='Enter positive values';return;} var rad=unit==='degrees'?angle*Math.PI/180:angle; var sectorA=0.5*r*r*rad; var arcLen=r*rad; var fraction=unit==='degrees'?angle/360:angle/(2*Math.PI); document.getElementById('sectorArea').textContent=fmt(sectorA,4); document.getElementById('arcLength').textContent=fmt(arcLen,4); document.getElementById('fractionOfCircle').textContent=fmt(fraction*100,4)+'% ('+fmt(fraction,6)+' of full circle)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['radius', 'angle', 'angleUnit'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
