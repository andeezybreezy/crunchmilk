(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var sideA = parseFloat(document.getElementById('sideA').value) || 0;
    var sideB = parseFloat(document.getElementById('sideB').value) || 0;
    var sideC = parseFloat(document.getElementById('sideC').value) || 0;

    // Calculation logic
    var a=parseFloat(document.getElementById('sideA').value); var b=parseFloat(document.getElementById('sideB').value); var c=parseFloat(document.getElementById('sideC').value); if(isNaN(a)||a<=0||isNaN(b)||b<=0||isNaN(c)||c<=0){document.getElementById('isValid').textContent='Enter positive values';return;} var check1=a+b>c; var check2=a+c>b; var check3=b+c>a; var valid=check1&&check2&&check3; document.getElementById('isValid').textContent=valid?'Yes \u2014 Valid Triangle':'No \u2014 Not a Valid Triangle'; document.getElementById('explanation').textContent=a+'+'+b+'='+fmt(a+b,2)+(check1?' > ':' \u2264 ')+c+(check1?' \u2713':' \u2717')+' | '+a+'+'+c+'='+fmt(a+c,2)+(check2?' > ':' \u2264 ')+b+(check2?' \u2713':' \u2717')+' | '+b+'+'+c+'='+fmt(b+c,2)+(check3?' > ':' \u2264 ')+a+(check3?' \u2713':' \u2717'); if(!valid){document.getElementById('triangleType').textContent='N/A';return;} var sides=[a,b,c].sort(function(x,y){return x-y;}); var type=''; if(sides[0]===sides[1]&&sides[1]===sides[2]) type='Equilateral'; else if(sides[0]===sides[1]||sides[1]===sides[2]) type='Isosceles'; else type='Scalene'; var angCheck=sides[0]*sides[0]+sides[1]*sides[1]; if(Math.abs(angCheck-sides[2]*sides[2])<0.0001) type+=' (Right)'; else if(angCheck>sides[2]*sides[2]) type+=' (Acute)'; else type+=' (Obtuse)'; document.getElementById('triangleType').textContent=type;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['sideA', 'sideB', 'sideC'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
