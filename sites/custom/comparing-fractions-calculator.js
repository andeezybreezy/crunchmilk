(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var num1 = parseFloat(document.getElementById('num1').value) || 0;
    var den1 = parseFloat(document.getElementById('den1').value) || 0;
    var num2 = parseFloat(document.getElementById('num2').value) || 0;
    var den2 = parseFloat(document.getElementById('den2').value) || 0;

    // Calculation logic
    var n1=parseInt(num1),d1=parseInt(den1),n2=parseInt(num2),d2=parseInt(den2);if(d1===0||d2===0){document.getElementById('comparison').textContent='Error: denominator cannot be zero';return;}var dec1=n1/d1,dec2=n2/d2;document.getElementById('decimal1').textContent=fmt(dec1,6);document.getElementById('decimal2').textContent=fmt(dec2,6);var cross1=n1*d2,cross2=n2*d1;if(cross1>cross2){document.getElementById('comparison').textContent=n1+'/'+d1+' > '+n2+'/'+d2+' (first fraction is greater)';}else if(cross1<cross2){document.getElementById('comparison').textContent=n1+'/'+d1+' < '+n2+'/'+d2+' (second fraction is greater)';}else{document.getElementById('comparison').textContent=n1+'/'+d1+' = '+n2+'/'+d2+' (the fractions are equal)';}

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['num1', 'den1', 'num2', 'den2'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
