(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var method = document.getElementById('method').value;
    var side1 = parseFloat(document.getElementById('side1').value) || 0;
    var side2 = parseFloat(document.getElementById('side2').value) || 0;
    var side3 = parseFloat(document.getElementById('side3').value) || 0;
    var angle1 = parseFloat(document.getElementById('angle1').value) || 0;
    var angle2 = parseFloat(document.getElementById('angle2').value) || 0;

    // Calculation logic
    var method=document.getElementById('method').value; var a=parseFloat(document.getElementById('side1').value)||0; var b=parseFloat(document.getElementById('side2').value)||0; var c=parseFloat(document.getElementById('side3').value)||0; var A=parseFloat(document.getElementById('angle1').value)||0; var B=parseFloat(document.getElementById('angle2').value)||0; var toRad=Math.PI/180; var toDeg=180/Math.PI; var area=0; if(method==='SSS'){if(a<=0||b<=0||c<=0){document.getElementById('missingSide').textContent='Enter all 3 sides';return;} var cosA=(b*b+c*c-a*a)/(2*b*c); var cosB=(a*a+c*c-b*b)/(2*a*c); if(Math.abs(cosA)>1||Math.abs(cosB)>1){document.getElementById('missingSide').textContent='Invalid triangle';return;} A=Math.acos(cosA)*toDeg; B=Math.acos(cosB)*toDeg; var C=180-A-B; var s=(a+b+c)/2; area=Math.sqrt(s*(s-a)*(s-b)*(s-c)); document.getElementById('missingSide').textContent='a='+fmt(a, 2)+', b='+fmt(b, 2)+', c='+fmt(c, 2); document.getElementById('missingAngle1').textContent=fmt(A, 2)+'\u00B0'; document.getElementById('missingAngle2').textContent='B='+fmt(B, 2)+'\u00B0, C='+fmt(C, 2)+'\u00B0';} else if(method==='SAS'){if(a<=0||b<=0||A<=0||A>=180){document.getElementById('missingSide').textContent='Enter sides a, b and angle A (included)';return;} c=Math.sqrt(a*a+b*b-2*a*b*Math.cos(A*toRad)); var cosB2=(a*a+c*c-b*b)/(2*a*c); B=Math.acos(Math.min(1,Math.max(-1,cosB2)))*toDeg; var C=180-A-B; area=0.5*a*b*Math.sin(A*toRad); document.getElementById('missingSide').textContent='c = '+fmt(c, 2); document.getElementById('missingAngle1').textContent=fmt(A, 2)+'\u00B0 (given)'; document.getElementById('missingAngle2').textContent='B='+fmt(B, 2)+'\u00B0, C='+fmt(C, 2)+'\u00B0';} else if(method==='ASA'){if(A<=0||B<=0||a<=0){document.getElementById('missingSide').textContent='Enter angles A, B and side a (between them)';return;} var C=180-A-B; if(C<=0){document.getElementById('missingSide').textContent='Angles must sum to less than 180\u00B0';return;} var sideA=a*Math.sin(A*toRad)/Math.sin(C*toRad); var sideB=a*Math.sin(B*toRad)/Math.sin(C*toRad); area=0.5*sideA*sideB*Math.sin(C*toRad); document.getElementById('missingSide').textContent='a='+fmt(sideA, 2)+', b='+fmt(sideB, 2)+', c='+fmt(a, 2); document.getElementById('missingAngle1').textContent=fmt(A, 2)+'\u00B0'; document.getElementById('missingAngle2').textContent='B='+fmt(B, 2)+'\u00B0, C='+fmt(C, 2)+'\u00B0';} else {if(A<=0||B<=0||a<=0){document.getElementById('missingSide').textContent='Enter angles A, B and side a (opposite A)';return;} var C=180-A-B; if(C<=0){document.getElementById('missingSide').textContent='Angles must sum to less than 180\u00B0';return;} b=a*Math.sin(B*toRad)/Math.sin(A*toRad); c=a*Math.sin(C*toRad)/Math.sin(A*toRad); area=0.5*b*c*Math.sin(A*toRad); document.getElementById('missingSide').textContent='a='+fmt(a, 2)+', b='+fmt(b, 2)+', c='+fmt(c, 2); document.getElementById('missingAngle1').textContent=fmt(A, 2)+'\u00B0'; document.getElementById('missingAngle2').textContent='B='+fmt(B, 2)+'\u00B0, C='+fmt(C, 2)+'\u00B0';} document.getElementById('area').textContent=fmt(area, 2);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['method', 'side1', 'side2', 'side3', 'angle1', 'angle2'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
