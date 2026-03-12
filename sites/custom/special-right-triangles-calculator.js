(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var triangleType = document.getElementById('triangleType').value;
    var knownSide = parseFloat(document.getElementById('knownSide').value) || 0;
    var whichSide = document.getElementById('whichSide').value;

    // Calculation logic
    var type=document.getElementById('triangleType').value; var val=parseFloat(document.getElementById('knownSide').value); var which=document.getElementById('whichSide').value; if(isNaN(val)||val<=0){document.getElementById('allSides').textContent='Enter a positive value';return;} var s1,s2,hyp,exp; if(type==='45-45-90'){if(which==='short-leg'||which==='long-leg'){s1=val;s2=val;hyp=val*Math.sqrt(2);exp='Leg = '+fmt(val,4)+'; other leg = '+fmt(val,4)+' (equal); hyp = leg\u00D7\u221A2 = '+fmt(hyp,4);} else {hyp=val;s1=val/Math.sqrt(2);s2=s1;exp='Hyp = '+fmt(val,4)+'; each leg = hyp/\u221A2 = '+fmt(s1,4);} document.getElementById('allSides').textContent='Legs: '+fmt(s1,4)+', '+fmt(s2,4)+' | Hypotenuse: '+fmt(hyp,4);} else {if(which==='short-leg'){s1=val;s2=val*Math.sqrt(3);hyp=2*val;exp='Short leg = '+fmt(val,4)+'; long leg = short\u00D7\u221A3 = '+fmt(s2,4)+'; hyp = 2\u00D7short = '+fmt(hyp,4);} else if(which==='long-leg'){s2=val;s1=val/Math.sqrt(3);hyp=2*s1;exp='Long leg = '+fmt(val,4)+'; short leg = long/\u221A3 = '+fmt(s1,4)+'; hyp = 2\u00D7short = '+fmt(hyp,4);} else {hyp=val;s1=val/2;s2=s1*Math.sqrt(3);exp='Hyp = '+fmt(val,4)+'; short leg = hyp/2 = '+fmt(s1,4)+'; long leg = short\u00D7\u221A3 = '+fmt(s2,4);} document.getElementById('allSides').textContent='Short leg: '+fmt(s1,4)+' | Long leg: '+fmt(s2,4)+' | Hypotenuse: '+fmt(hyp,4);} document.getElementById('explanation').textContent=exp;

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
