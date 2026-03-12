(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var knownSide1 = parseFloat(document.getElementById('knownSide1').value) || 0;
    var knownSide2 = parseFloat(document.getElementById('knownSide2').value) || 0;
    var knownAngle = parseFloat(document.getElementById('knownAngle').value) || 0;

    // Calculation logic
    var s1=parseFloat(document.getElementById('knownSide1').value)||0; var s2=parseFloat(document.getElementById('knownSide2').value)||0; var ang=parseFloat(document.getElementById('knownAngle').value)||0; var toDeg=180/Math.PI; var toRad=Math.PI/180; var a,b,c,A,B; if(s1>0&&s2>0&&ang===0){if(s2>s1){a=s1;b=0;c=s2;b=Math.sqrt(c*c-a*a);if(isNaN(b)||b<=0){a=s1;b=s2;c=Math.sqrt(a*a+b*b);}} else {a=s1;b=s2;c=Math.sqrt(a*a+b*b);} A=Math.atan(a/b)*toDeg; B=Math.atan(b/a)*toDeg;} else if(s1>0&&ang>0&&ang<90){a=s1; A=ang; B=90-ang; b=a/Math.tan(A*toRad); c=a/Math.sin(A*toRad);} else if(s1>0&&s2===0&&ang>0&&ang<90){a=s1;A=ang;B=90-ang;b=a/Math.tan(A*toRad);c=a/Math.sin(A*toRad);} else {document.getElementById('allSides').textContent='Enter two sides, or one side + one acute angle';return;} if(isNaN(a)||isNaN(b)||isNaN(c)||a<=0||b<=0||c<=0){document.getElementById('allSides').textContent='Invalid inputs';return;} var area=0.5*a*b; document.getElementById('allSides').textContent='a = '+fmt(a, 2)+' | b = '+fmt(b, 2)+' | c (hyp) = '+fmt(c, 2); document.getElementById('allAngles').textContent='A = '+fmt(A, 2)+'\u00B0 | B = '+fmt(B, 2)+'\u00B0 | C = 90\u00B0'; document.getElementById('area').textContent=fmt(area, 2);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['knownSide1', 'knownSide2', 'knownAngle'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
