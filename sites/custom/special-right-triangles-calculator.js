(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var triangleType = document.getElementById('triangleType').value;
    var knownSide = parseFloat(document.getElementById('knownSide').value) || 0;
    var whichSide = document.getElementById('whichSide').value;

    // Calculation logic
    var type=document.getElementById('triangleType').value; var val=parseFloat(document.getElementById('knownSide').value); var which=document.getElementById('whichSide').value; if(isNaN(val)||val<=0){document.getElementById('allSides').textContent='Enter a positive value';return;} var s1,s2,hyp,exp; if(type==='45-45-90'){if(which==='short-leg'||which==='long-leg'){s1=val;s2=val;hyp=val*Math.sqrt(2);exp='Leg = '+fmt(val, 2)+'; other leg = '+fmt(val, 2)+' (equal); hyp = leg\u00D7\u221A2 = '+fmt(hyp, 2);} else {hyp=val;s1=val/Math.sqrt(2);s2=s1;exp='Hyp = '+fmt(val, 2)+'; each leg = hyp/\u221A2 = '+fmt(s1, 2);} document.getElementById('allSides').textContent='Legs: '+fmt(s1, 2)+', '+fmt(s2, 2)+' | Hypotenuse: '+fmt(hyp, 2);} else {if(which==='short-leg'){s1=val;s2=val*Math.sqrt(3);hyp=2*val;exp='Short leg = '+fmt(val, 2)+'; long leg = short\u00D7\u221A3 = '+fmt(s2, 2)+'; hyp = 2\u00D7short = '+fmt(hyp, 2);} else if(which==='long-leg'){s2=val;s1=val/Math.sqrt(3);hyp=2*s1;exp='Long leg = '+fmt(val, 2)+'; short leg = long/\u221A3 = '+fmt(s1, 2)+'; hyp = 2\u00D7short = '+fmt(hyp, 2);} else {hyp=val;s1=val/2;s2=s1*Math.sqrt(3);exp='Hyp = '+fmt(val, 2)+'; short leg = hyp/2 = '+fmt(s1, 2)+'; long leg = short\u00D7\u221A3 = '+fmt(s2, 2);} document.getElementById('allSides').textContent='Short leg: '+fmt(s1, 2)+' | Long leg: '+fmt(s2, 2)+' | Hypotenuse: '+fmt(hyp, 2);} document.getElementById('explanation').textContent=exp;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['triangleType', 'knownSide', 'whichSide'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
