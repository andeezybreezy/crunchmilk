(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var value = parseFloat(document.getElementById('value').value) || 0;
    var convertFrom = document.getElementById('convertFrom').value;

    // Calculation logic
    var val=parseFloat(document.getElementById('value').value); var from=document.getElementById('convertFrom').value; if(isNaN(val)){document.getElementById('converted').textContent='Enter a number';return;} if(from==='degrees'){var rad=val*Math.PI/180; document.getElementById('converted').textContent=fmt(rad,8)+' radians'; document.getElementById('formula').textContent=val+'\u00B0 \u00D7 (\u03C0/180) = '+fmt(rad,8); var frac=val/180; var num=Math.round(frac*1000); var den=1000; var gcdVal=function(a,b){a=Math.abs(a);b=Math.abs(b);while(b){var t=b;b=a%b;a=t;}return a;}; var g=gcdVal(num,den); num=num/g; den=den/g; if(den===1){document.getElementById('piForm').textContent=(num===1?'':num===(-1)?'-':num)+'\u03C0';} else {document.getElementById('piForm').textContent=(num===1?'':num===(-1)?'-':num)+'\u03C0/'+den;}} else {var deg=val*180/Math.PI; document.getElementById('converted').textContent=fmt(deg,8)+'\u00B0'; document.getElementById('formula').textContent=fmt(val,8)+' rad \u00D7 (180/\u03C0) = '+fmt(deg,8)+'\u00B0'; var piMultiple=val/Math.PI; document.getElementById('piForm').textContent='Input \u2248 '+fmt(piMultiple,6)+'\u03C0';}

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['value', 'convertFrom'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
