(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var number = parseFloat(document.getElementById('number').value) || 0;

    // Calculation logic
    var n=parseFloat(number);if(n<0){document.getElementById('squareRoot').textContent='Error: cannot take square root of a negative number (in real numbers)';return;}var sr=Math.sqrt(n);document.getElementById('squareRoot').textContent=fmt(sr,8);var isP=Number.isInteger(sr);document.getElementById('isPerfect').textContent=isP?'Yes — '+n+' = '+sr+'²':'No — '+n+' is not a perfect square';if(Number.isInteger(n)&&n>0&&!isP){var nInt=Math.round(n);var outside=1;var inside=nInt;for(var i=Math.floor(Math.sqrt(nInt));i>=2;i--){if(inside%(i*i)===0){outside*=i;inside/=(i*i);}}if(outside>1){document.getElementById('simplified').textContent='√'+nInt+' = '+outside+'√'+inside;}else{document.getElementById('simplified').textContent='√'+nInt+' (cannot be simplified further)';}}else if(isP){document.getElementById('simplified').textContent='√'+n+' = '+sr;}else{document.getElementById('simplified').textContent='√'+n+' ≈ '+fmt(sr,6);}

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
