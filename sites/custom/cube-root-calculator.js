(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var number = parseFloat(document.getElementById('number').value) || 0;

    // Calculation logic
    var n=number;var cr=Math.cbrt(n);var rounded=Math.round(cr);var perfect=Math.abs(rounded*rounded*rounded-n)<1e-9;document.getElementById('cubeRoot').textContent=fmt(cr, 2);document.getElementById('isPerfect').textContent=perfect?'Yes — '+rounded+'³ = '+n:'No';if(perfect){document.getElementById('simplified').textContent=String(rounded);}else{var absN=Math.abs(Math.floor(n));var coeff=1;var inside=absN;for(var i=Math.floor(Math.cbrt(absN));i>=2;i--){var i3=i*i*i;if(inside%i3===0){coeff*=i;inside=inside/i3;i=Math.floor(Math.cbrt(inside))+1;}}var sign=n<0?'-':'';if(inside===1){document.getElementById('simplified').textContent=sign+coeff;}else if(coeff===1){document.getElementById('simplified').textContent=sign+'∛'+inside;}else{document.getElementById('simplified').textContent=sign+coeff+'∛'+inside;}}

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['number'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
