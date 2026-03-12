(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var method = document.getElementById('method').value;
    var dim1 = parseFloat(document.getElementById('dim1').value) || 0;
    var dim2 = parseFloat(document.getElementById('dim2').value) || 0;
    var dim3 = parseFloat(document.getElementById('dim3').value) || 0;

    // Calculation logic
    var method=document.getElementById('method').value; var d1=parseFloat(document.getElementById('dim1').value); var d2=parseFloat(document.getElementById('dim2').value); var d3=parseFloat(document.getElementById('dim3').value); if(isNaN(d1)||d1<=0||isNaN(d2)||d2<=0){document.getElementById('area').textContent='Enter positive values';return;} var area,peri; if(method==='base-height'){area=0.5*d1*d2;document.getElementById('formula').textContent='A = \u00BD \u00D7 base \u00D7 height = \u00BD \u00D7 '+d1+' \u00D7 '+d2;document.getElementById('perimeter').textContent='N/A (need all sides)';} else if(method==='three-sides'){if(isNaN(d3)||d3<=0){document.getElementById('area').textContent='Enter all three sides';return;} var s=(d1+d2+d3)/2; var val=s*(s-d1)*(s-d2)*(s-d3); if(val<=0){document.getElementById('area').textContent='Invalid triangle sides';return;} area=Math.sqrt(val);peri=d1+d2+d3;document.getElementById('formula').textContent='Heron\'s: s='+fmt(s,2)+', A=\u221A[s(s-a)(s-b)(s-c)]';document.getElementById('perimeter').textContent=fmt(peri,2);} else {if(isNaN(d3)||d3<=0||d3>=180){document.getElementById('area').textContent='Enter valid angle (0-180)';return;} var rad=d3*Math.PI/180; area=0.5*d1*d2*Math.sin(rad); var c2=d1*d1+d2*d2-2*d1*d2*Math.cos(rad); var sideC=Math.sqrt(c2); peri=d1+d2+sideC; document.getElementById('formula').textContent='A = \u00BD \u00D7 a \u00D7 b \u00D7 sin(C) = \u00BD \u00D7 '+d1+' \u00D7 '+d2+' \u00D7 sin('+d3+'\u00B0)'; document.getElementById('perimeter').textContent=fmt(peri,2);} document.getElementById('area').textContent=fmt(area, 2);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['method', 'dim1', 'dim2', 'dim3'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
