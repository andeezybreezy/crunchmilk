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
    var a=parseFloat(document.getElementById('sideA').value); var b=parseFloat(document.getElementById('sideB').value); var c=parseFloat(document.getElementById('sideC').value); if(isNaN(a)||a<=0||isNaN(b)||b<=0||isNaN(c)||c<=0){document.getElementById('area').textContent='Enter positive values';return;} if(a+b<=c||a+c<=b||b+c<=a){document.getElementById('area').textContent='Invalid triangle'; document.getElementById('semiPerimeter').textContent='N/A'; document.getElementById('isValid').textContent='No \u2014 fails triangle inequality';return;} var s=(a+b+c)/2; var area=Math.sqrt(s*(s-a)*(s-b)*(s-c)); document.getElementById('semiPerimeter').textContent=fmt(s, 2); document.getElementById('area').textContent=fmt(area, 2); document.getElementById('isValid').textContent='Yes \u2014 valid triangle (perimeter = '+fmt(a+b+c, 2)+')';

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
