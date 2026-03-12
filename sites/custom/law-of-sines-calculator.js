(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var angleA = parseFloat(document.getElementById('angleA').value) || 0;
    var sideA = parseFloat(document.getElementById('sideA').value) || 0;
    var angleB = parseFloat(document.getElementById('angleB').value) || 0;

    // Calculation logic
    var A=parseFloat(document.getElementById('angleA').value); var a=parseFloat(document.getElementById('sideA').value); var B=parseFloat(document.getElementById('angleB').value); if(isNaN(A)||A<=0||A>=180||isNaN(a)||a<=0||isNaN(B)||B<=0||B>=180){document.getElementById('sideB').textContent='Enter valid values';return;} var C=180-A-B; if(C<=0){document.getElementById('sideB').textContent='Angles must sum to less than 180\u00B0';return;} var toRad=Math.PI/180; var b=a*Math.sin(B*toRad)/Math.sin(A*toRad); var c=a*Math.sin(C*toRad)/Math.sin(A*toRad); var area=0.5*b*c*Math.sin(A*toRad); document.getElementById('sideB').textContent=fmt(b,4); document.getElementById('angleC').textContent=fmt(C,4)+'\u00B0'; document.getElementById('sideC').textContent=fmt(c,4); document.getElementById('area').textContent=fmt(area,4);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['angleA', 'sideA', 'angleB'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
