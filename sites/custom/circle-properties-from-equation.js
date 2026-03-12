(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var d = parseFloat(document.getElementById('d').value) || 0;
    var e = parseFloat(document.getElementById('e').value) || 0;
    var f = parseFloat(document.getElementById('f').value) || 0;

    // Calculation logic
    var D=parseFloat(document.getElementById('d').value); var E=parseFloat(document.getElementById('e').value); var F=parseFloat(document.getElementById('f').value); if(isNaN(D)||isNaN(E)||isNaN(F)){document.getElementById('centerX').textContent='Enter valid numbers';return;} var h=-D/2; var k=-E/2; var r2=h*h+k*k-F; if(r2<=0){document.getElementById('centerX').textContent='No valid circle (r\u00B2 \u2264 0)'; document.getElementById('centerY').textContent='Check your coefficients'; document.getElementById('radius').textContent='N/A'; document.getElementById('area').textContent='N/A';return;} var r=Math.sqrt(r2); document.getElementById('centerX').textContent=fmt(h, 2); document.getElementById('centerY').textContent=fmt(k, 2); document.getElementById('radius').textContent=fmt(r, 2); document.getElementById('area').textContent=fmt(Math.PI*r2, 2)+' (circumference: '+fmt(2*Math.PI*r, 2)+')';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['d', 'e', 'f'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
