(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var sideA = parseFloat(document.getElementById('sideA').value) || 0;
    var sideB = parseFloat(document.getElementById('sideB').value) || 0;
    var solveFor = document.getElementById('solveFor').value;

    // Calculation logic
    var a = parseFloat(document.getElementById('sideA').value); var b = parseFloat(document.getElementById('sideB').value); var mode = document.getElementById('solveFor').value; if(isNaN(a)||a<=0||isNaN(b)||b<=0){document.getElementById('answer').textContent='Enter positive values';return;} var result; if(mode==='hypotenuse'){result=Math.sqrt(a*a+b*b);document.getElementById('formula').textContent=a+'\u00B2 + '+b+'\u00B2 = '+fmt(a*a,2)+' + '+fmt(b*b,2)+' = '+fmt(a*a+b*b,2)+'; c = \u221A'+fmt(a*a+b*b,2)+' = '+fmt(result,4);} else {if(b>=a){document.getElementById('answer').textContent='Side b (hypotenuse) must be entered as Side a, and the known leg as Side b when solving for a missing leg. Ensure a > b for valid result, or switch: a=hypotenuse, b=known leg.'; return;} result=Math.sqrt(a*a-b*b);document.getElementById('formula').textContent=a+'\u00B2 - '+b+'\u00B2 = '+fmt(a*a,2)+' - '+fmt(b*b,2)+' = '+fmt(a*a-b*b,2)+'; leg = \u221A'+fmt(a*a-b*b,2)+' = '+fmt(result,4);} document.getElementById('answer').textContent=fmt(result,4); var r=Math.round(result*10000)/10000; var isTriple=(r===Math.floor(r)&&a===Math.floor(a)&&b===Math.floor(b)); document.getElementById('isRightTriangle').textContent=isTriple?'Yes \u2014 '+Math.min(a,b,r)+', '+[a,b,r].sort(function(x,y){return x-y;})[1]+', '+Math.max(a,b,r)+' is a Pythagorean triple':'No \u2014 not an integer triple';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['sideA', 'sideB', 'solveFor'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
