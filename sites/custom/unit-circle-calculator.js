(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var angle = parseFloat(document.getElementById('angle').value) || 0;
    var unit = document.getElementById('unit').value;

    // Calculation logic
    var angle=parseFloat(document.getElementById('angle').value); var unit=document.getElementById('unit').value; if(isNaN(angle)){document.getElementById('sinValue').textContent='Enter a number';return;} var deg=unit==='degrees'?angle:angle*180/Math.PI; var rad=unit==='degrees'?angle*Math.PI/180:angle; var normDeg=((deg%360)+360)%360; var quad; if(normDeg>=0&&normDeg<90) quad='I'; else if(normDeg>=90&&normDeg<180) quad='II'; else if(normDeg>=180&&normDeg<270) quad='III'; else quad='IV'; if(normDeg===0||normDeg===180||normDeg===90||normDeg===270) quad+=' (axis)'; var sinV=Math.sin(rad); var cosV=Math.cos(rad); var tanV; if(Math.abs(cosV)<1e-10) tanV='Undefined'; else tanV=sinV/cosV; document.getElementById('sinValue').textContent=fmt(sinV, 2); document.getElementById('cosValue').textContent=fmt(cosV, 2); document.getElementById('tanValue').textContent=(typeof tanV==='string')?tanV:fmt(tanV, 2); document.getElementById('quadrant').textContent='Quadrant '+quad; document.getElementById('coordinates').textContent='('+fmt(cosV, 2)+', '+fmt(sinV, 2)+')';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['angle', 'unit'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
