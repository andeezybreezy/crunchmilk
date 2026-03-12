(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var valueA = parseFloat(document.getElementById('valueA').value) || 0;
    var valueB = parseFloat(document.getElementById('valueB').value) || 0;

    // Calculation logic
    var a=parseInt(valueA),b=parseInt(valueB);if(a===0&&b===0){document.getElementById('simplified').textContent='0 : 0 (undefined ratio)';document.getElementById('factor').textContent='N/A';return;}function gcd(x,y){x=Math.abs(x);y=Math.abs(y);while(y){var t=y;y=x%y;x=t;}return x;}var g=gcd(Math.abs(a),Math.abs(b));document.getElementById('simplified').textContent=(a/g)+' : '+(b/g);document.getElementById('factor').textContent=g;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['valueA', 'valueB'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
