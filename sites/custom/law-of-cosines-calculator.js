(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var sideA = parseFloat(document.getElementById('sideA').value) || 0;
    var sideB = parseFloat(document.getElementById('sideB').value) || 0;
    var angleC = parseFloat(document.getElementById('angleC').value) || 0;

    // Calculation logic
    var a=parseFloat(document.getElementById('sideA').value); var b=parseFloat(document.getElementById('sideB').value); var C=parseFloat(document.getElementById('angleC').value); if(isNaN(a)||a<=0||isNaN(b)||b<=0||isNaN(C)||C<=0||C>=180){document.getElementById('sideC').textContent='Enter valid values (positive sides, angle 0-180)';return;} var toRad=Math.PI/180; var toDeg=180/Math.PI; var c2=a*a+b*b-2*a*b*Math.cos(C*toRad); if(c2<=0){document.getElementById('sideC').textContent='Invalid triangle';return;} var c=Math.sqrt(c2); var cosA=(b*b+c*c-a*a)/(2*b*c); var cosB=(a*a+c*c-b*b)/(2*a*c); var A=Math.acos(Math.min(1,Math.max(-1,cosA)))*toDeg; var B=Math.acos(Math.min(1,Math.max(-1,cosB)))*toDeg; var area=0.5*a*b*Math.sin(C*toRad); document.getElementById('sideC').textContent=fmt(c,4); document.getElementById('angleA').textContent=fmt(A,4)+'\u00B0'; document.getElementById('angleB').textContent=fmt(B,4)+'\u00B0'; document.getElementById('area').textContent=fmt(area,4);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['sideA', 'sideB', 'angleC'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
