(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var findWhat = document.getElementById('findWhat').value;
    var opposite = parseFloat(document.getElementById('opposite').value) || 0;
    var adjacent = parseFloat(document.getElementById('adjacent').value) || 0;
    var hypotenuse = parseFloat(document.getElementById('hypotenuse').value) || 0;

    // Calculation logic
    var fn=document.getElementById('findWhat').value; var opp=parseFloat(document.getElementById('opposite').value)||0; var adj=parseFloat(document.getElementById('adjacent').value)||0; var hyp=parseFloat(document.getElementById('hypotenuse').value)||0; var ratio,angle,exp; if(fn==='sin'){if(opp<=0||hyp<=0){document.getElementById('ratio').textContent='Enter opposite and hypotenuse';return;} ratio=opp/hyp; angle=Math.asin(Math.min(1,ratio))*180/Math.PI; exp='sin(\u03B8) = opposite/hypotenuse = '+opp+'/'+hyp+' = '+fmt(ratio, 2);} else if(fn==='cos'){if(adj<=0||hyp<=0){document.getElementById('ratio').textContent='Enter adjacent and hypotenuse';return;} ratio=adj/hyp; angle=Math.acos(Math.min(1,ratio))*180/Math.PI; exp='cos(\u03B8) = adjacent/hypotenuse = '+adj+'/'+hyp+' = '+fmt(ratio, 2);} else {if(opp<=0||adj<=0){document.getElementById('ratio').textContent='Enter opposite and adjacent';return;} ratio=opp/adj; angle=Math.atan(ratio)*180/Math.PI; exp='tan(\u03B8) = opposite/adjacent = '+opp+'/'+adj+' = '+fmt(ratio, 2);} document.getElementById('ratio').textContent=fmt(ratio, 2); document.getElementById('angle').textContent=fmt(angle, 2)+'\u00B0'; document.getElementById('explanation').textContent=exp;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['findWhat', 'opposite', 'adjacent', 'hypotenuse'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
